// script.js

document.addEventListener("DOMContentLoaded", () => {
    window.mobileInput = window.mobileInput || {
        x: 0,
        y: 0,
        action: false
    };

    const mobileControls = document.getElementById("mobile-controls");
    const mobileJoystick = document.getElementById("mobile-joystick");
    const mobileStick = document.getElementById("mobile-joystick-stick");
    const mobileAction = document.getElementById("mobile-action");
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches || navigator.maxTouchPoints > 0;

    if (mobileControls && mobileJoystick && mobileStick && mobileAction && isTouchDevice) {
        const deadzone = 0.18;
        let joystickPointerId = null;
        let pressedKeys = {};
        let movementTimer = null;

        function createKeyboardEvent(type, key) {
            const keyData = {
                ArrowLeft: { code: "ArrowLeft", keyCode: 37, which: 37 },
                ArrowUp: { code: "ArrowUp", keyCode: 38, which: 38 },
                ArrowRight: { code: "ArrowRight", keyCode: 39, which: 39 },
                ArrowDown: { code: "ArrowDown", keyCode: 40, which: 40 },
                Enter: { code: "Enter", keyCode: 13, which: 13 },
                " ": { code: "Space", keyCode: 32, which: 32 }
            }[key] || { code: key, keyCode: 0, which: 0 };

            return new KeyboardEvent(type, {
                key: key,
                code: keyData.code,
                keyCode: keyData.keyCode,
                which: keyData.which,
                bubbles: true,
                cancelable: true
            });
        }

        function dispatchKey(key, type) {
            window.dispatchEvent(createKeyboardEvent(type, key));
        }

        function setKey(key, active) {
            if (active) {
                pressedKeys[key] = true;
                dispatchKey(key, "keydown");
                return;
            }

            if (!pressedKeys[key]) return;
            pressedKeys[key] = active;
            dispatchKey(key, "keyup");
        }

        function updateKeys() {
            const input = window.mobileInput;
            setKey("ArrowLeft", input.x < -deadzone);
            setKey("ArrowRight", input.x > deadzone);
            setKey("ArrowUp", input.y < -deadzone);
            setKey("ArrowDown", input.y > deadzone);
        }

        function releaseKeys() {
            setKey("ArrowLeft", false);
            setKey("ArrowRight", false);
            setKey("ArrowUp", false);
            setKey("ArrowDown", false);
        }

        function startMovementLoop() {
            if (movementTimer) return;
            movementTimer = setInterval(() => {
                updateKeys();
            }, 45);
        }

        function stopMovementLoop() {
            clearInterval(movementTimer);
            movementTimer = null;
            releaseKeys();
        }

        function updateJoystick(clientX, clientY) {
            const rect = mobileJoystick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const maxRadius = Math.max(24, Math.min(rect.width, rect.height) * 0.36);
            let dx = clientX - centerX;
            let dy = clientY - centerY;
            const distance = Math.hypot(dx, dy);

            if (distance > maxRadius) {
                dx = (dx / distance) * maxRadius;
                dy = (dy / distance) * maxRadius;
            }

            const normalizedX = dx / maxRadius;
            const normalizedY = dy / maxRadius;
            window.mobileInput.x = Math.abs(normalizedX) < deadzone ? 0 : normalizedX;
            window.mobileInput.y = Math.abs(normalizedY) < deadzone ? 0 : normalizedY;
            mobileStick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
            updateKeys();
        }

        function resetJoystick() {
            joystickPointerId = null;
            window.mobileInput.x = 0;
            window.mobileInput.y = 0;
            mobileStick.style.transform = "translate(-50%, -50%)";
            stopMovementLoop();
        }

        function getActivePlayer() {
            return ["jogador", "jogador-fase2", "jogador-fase3"]
                .map(id => document.getElementById(id))
                .find(el => el && el.offsetParent !== null && getComputedStyle(el).display !== "none");
        }

        function getVisibleActionTargets() {
            return Array.from(document.querySelectorAll("[id^='click-']"))
                .filter(el => {
                    const style = getComputedStyle(el);
                    const rect = el.getBoundingClientRect();
                    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
                });
        }

        function isVisible(el) {
            if (!el) return false;
            const style = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        }

        function getPlayerPosition() {
            const player = getActivePlayer();
            if (!player) return null;

            const left = parseFloat(player.style.left);
            const top = parseFloat(player.style.top);

            if (!Number.isFinite(left) || !Number.isFinite(top)) return null;

            return {
                x: left / window.innerWidth,
                y: top / window.innerHeight
            };
        }

        function clickActionTarget(target) {
            if (!target) return false;
            target.click();
            return true;
        }

        function getReachableActionTarget() {
            const pos = getPlayerPosition();
            if (!pos) return null;

            const rules = [
                {
                    id: "click-telefone-cabine",
                    test: ({ x, y }) => x > 0.68 && y > 0.55
                },
                {
                    id: "click-escola-fachada",
                    test: ({ x, y }) => x > 0.45 && x < 0.75 && y < 0.55
                },
                {
                    id: "click-mesa-professora",
                    test: ({ x, y }) => x > 0.35 && x < 0.60 && y < 0.55
                },
                {
                    id: "click-computador",
                    test: ({ x, y }) => x > 0.36 && x < 0.52 && y < 0.32
                },
                {
                    id: "click-armario",
                    test: ({ x, y }) => x > 0.63 && x < 0.77 && y < 0.32
                },
                {
                    id: "click-escada",
                    test: ({ x, y }) => x > 0.32 && x < 0.58 && y > 0.5
                },
                {
                    id: "click-computador-templo",
                    test: ({ x, y }) => x > 0.3 && x < 0.65 && y < 0.7
                },
                {
                    id: "click-porta-final",
                    test: ({ x, y }) => x > 0.7 && y < 0.6
                }
            ];

            for (const rule of rules) {
                const target = document.getElementById(rule.id);
                if (isVisible(target) && rule.test(pos)) return target;
            }

            return null;
        }

        function getVisiblePrimaryButton() {
            const panelSelectors = [
                "#pop-feedback",
                "#pop-feedback-fase2",
                "#pop-feedback-fase3",
                "#lousa-enigma",
                "#lousa-enigma-fase2",
                "#lousa-enigma-fase3",
                "#aviso-personagem",
                ".painel-vitoria"
            ];

            for (const selector of panelSelectors) {
                const panel = document.querySelector(selector);
                if (!panel) continue;

                const panelStyle = getComputedStyle(panel);
                const panelRect = panel.getBoundingClientRect();
                if (panelStyle.display === "none" || panelStyle.visibility === "hidden" || panelRect.width <= 0 || panelRect.height <= 0) continue;

                const buttons = Array.from(panel.querySelectorAll("button"))
                    .filter(button => {
                        const style = getComputedStyle(button);
                        const rect = button.getBoundingClientRect();
                        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
                    });

                if (buttons.length === 1) return buttons[0];
            }

            return null;
        }

        function triggerNearestAction() {
            dispatchKey("Enter", "keydown");
            dispatchKey(" ", "keydown");

            const primaryButton = getVisiblePrimaryButton();
            if (primaryButton) {
                primaryButton.click();
                return;
            }

            const reachableTarget = getReachableActionTarget();
            if (clickActionTarget(reachableTarget)) return;

            const targets = getVisibleActionTargets();
            if (!targets.length) return;

            const player = getActivePlayer();
            let target = targets[0];

            if (player) {
                const playerRect = player.getBoundingClientRect();
                const playerX = playerRect.left + playerRect.width / 2;
                const playerY = playerRect.top + playerRect.height / 2;

                target = targets.reduce((nearest, current) => {
                    const nearestRect = nearest.getBoundingClientRect();
                    const currentRect = current.getBoundingClientRect();
                    const nearestX = nearestRect.left + nearestRect.width / 2;
                    const nearestY = nearestRect.top + nearestRect.height / 2;
                    const currentX = currentRect.left + currentRect.width / 2;
                    const currentY = currentRect.top + currentRect.height / 2;
                    const nearestDistance = Math.hypot(nearestX - playerX, nearestY - playerY);
                    const currentDistance = Math.hypot(currentX - playerX, currentY - playerY);
                    return currentDistance < nearestDistance ? current : nearest;
                });
            }

            clickActionTarget(target);
        }

        mobileJoystick.addEventListener("pointerdown", (e) => {
            joystickPointerId = e.pointerId;
            mobileJoystick.setPointerCapture(e.pointerId);
            updateJoystick(e.clientX, e.clientY);
            startMovementLoop();
        });

        mobileJoystick.addEventListener("pointermove", (e) => {
            if (e.pointerId !== joystickPointerId) return;
            updateJoystick(e.clientX, e.clientY);
        });

        mobileJoystick.addEventListener("pointerup", (e) => {
            if (e.pointerId !== joystickPointerId) return;
            resetJoystick();
        });

        mobileJoystick.addEventListener("pointercancel", (e) => {
            if (e.pointerId !== joystickPointerId) return;
            resetJoystick();
        });

        mobileAction.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            window.mobileInput.action = true;
            mobileAction.classList.add("is-active");
            triggerNearestAction();
        });

        function releaseAction() {
            window.mobileInput.action = false;
            mobileAction.classList.remove("is-active");
            dispatchKey("Enter", "keyup");
            dispatchKey(" ", "keyup");
        }

        mobileAction.addEventListener("pointerup", releaseAction);
        mobileAction.addEventListener("pointercancel", releaseAction);
        mobileAction.addEventListener("pointerleave", releaseAction);
    }

    const btnJogar = document.getElementById("btn-jogar");
    const btnSair = document.getElementById("btn-sair");

    // ==========================================================================
    // 1. CRIAÇÃO DA INTERFACE DE SELEÇÃO (COM POLIMENTO VISUAL NATIVO)
    // ==========================================================================
    btnJogar.addEventListener("click", () => {
        console.log("Iniciando a Caça ao Tesouro...");
        
        const menuContainer = document.querySelector(".menu-container");
        if (menuContainer) menuContainer.remove();

        const telaSelecao = document.createElement("div");
        telaSelecao.className = "menu-container"; 
        // Adicionando opacidade inicial e transição para fade-in suave
        telaSelecao.style.opacity = "0";
        telaSelecao.style.transition = "opacity 0.4s ease-in-out";
        
        telaSelecao.innerHTML = `
            <div class="narrativa-box" style="background: rgba(20, 13, 11, 0.9); border: 5px solid #ff7777; padding: 25px; max-width: 800px; text-align: center; margin-bottom: 40px; box-shadow: 0px 8px 0px #000;">
                <p style="color: #ddccbb; font-size: 11px; line-height: 1.8; margin-bottom: 15px;">Há muitos anos, um tesouro desapareceu junto com a cidade.</p>
                <p style="color: #ddccbb; font-size: 11px; line-height: 1.8; margin-bottom: 15px;">Dizem que apenas aqueles capazes de decifrar os enigmas matemáticos conseguirão encontrá-lo.</p>
                <p style="color: #ffb700; font-size: 12px; text-shadow: 2px 2px #000;">A busca começa agora.</p>
            </div>

            <h2 class="selecao-titulo">ESCOLHA SEU PERSONAGEM</h2>

            <div class="personagens-container" style="display: flex; gap: 30px; justify-content: center;">
                <div class="card-personagem" id="char-cinza" style="transition: all 0.2s ease-in-out; cursor: pointer;">
                    <div class="placeholder-img" style="background-image: url('personagens/cinzacompleto.gif'); image-rendering: pixelated;"></div>
                    <span class="label-genero">MASCULINO</span>
                </div>
                
                <div class="card-personagem" id="char-laranja" style="transition: all 0.2s ease-in-out; cursor: pointer;">
                    <div class="placeholder-img" style="background-image: url('personagens/laranjacompleto.gif'); image-rendering: pixelated;"></div>
                    <span class="label-genero">FEMININO</span>
                </div>
            </div>

            <button class="btn-vintage" id="btn-iniciar" style="margin-top: 40px; width: 280px; transition: transform 0.1s ease;">INICIAR</button>

            <div id="aviso-personagem" style="
                display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(20, 13, 11, 0.98); border: 5px solid #4a2711; box-shadow: 0px 8px 0px #000;
                padding: 25px; width: 420px; max-width: 90vw; z-index: 200; text-align: center;
                font-family: 'Press Start 2P', monospace;
            ">
                <p style="color: #ff3355; font-size: 10px; line-height: 1.8; margin-bottom: 20px;">
                    Por favor, escolha um personagem antes de iniciar a busca!
                </p>
                <button class="btn-vintage" id="btn-fechar-aviso" style="width: 100px; height: 35px; font-size: 10px;">OK</button>
            </div>
        `;
        
        document.querySelector(".cenario-cidade").appendChild(telaSelecao);
        
        // Ativa o Fade-in da interface após inserção no DOM
        setTimeout(() => { telaSelecao.style.opacity = "1"; }, 10);

        // ==========================================================================
        // 2. CONTROLE MECÂNICO E VISUAL DE SELEÇÃO DOS CARDS
        // ==========================================================================
        const cardCinza = document.getElementById("char-cinza");
        const cardLaranja = document.getElementById("char-laranja");
        const btnIniciar = document.getElementById("btn-iniciar");
        const avisoPop = document.getElementById("aviso-personagem");
        const btnFecharAviso = document.getElementById("btn-fechar-aviso");

        // Funções auxiliares para manipulação visual focadas em UX/Feedback
        const atualizarCardsVisuais = (selecionado, naoSelecionado) => {
            selecionado.style.borderColor = "#ffb700";
            selecionado.style.transform = "scale(1.05)";
            selecionado.style.opacity = "1";
            selecionado.style.filter = "none";

            naoSelecionado.style.borderColor = "#4a2711";
            naoSelecionado.style.transform = "scale(0.95)";
            naoSelecionado.style.opacity = "0.5";
            naoSelecionado.style.filter = "grayscale(60%)";
        };

        // Eventos de Hover para microinterações dinâmicas
        [cardCinza, cardLaranja].forEach(card => {
            card.addEventListener("mouseenter", () => {
                if (window.personagemSelecionado) {
                    // Se já houver escolha, aumenta levemente apenas se passar o mouse sobre o atual ou selecionando outro
                    if ((card.id === "char-cinza" && window.personagemSelecionado.includes("cinza")) ||
                        (card.id === "char-laranja" && window.personagemSelecionado.includes("laranja"))) {
                        card.style.transform = "scale(1.08)";
                    } else {
                        card.style.transform = "scale(1.02)";
                    }
                } else {
                    card.style.transform = "scale(1.05)";
                    card.style.borderColor = "#ff9900";
                }
            });

            card.addEventListener("mouseleave", () => {
                if (window.personagemSelecionado) {
                    if ((card.id === "char-cinza" && window.personagemSelecionado.includes("cinza")) ||
                        (card.id === "char-laranja" && window.personagemSelecionado.includes("laranja"))) {
                        card.style.transform = "scale(1.05)";
                    } else {
                        card.style.transform = "scale(0.95)";
                    }
                } else {
                    card.style.transform = "scale(1)";
                    card.style.borderColor = "#4a2711";
                }
            });
        });

        cardCinza.addEventListener("click", () => {
            window.personagemSelecionado = "personagens/cinzacompleto.gif"; 
            atualizarCardsVisuais(cardCinza, cardLaranja);
        });

        cardLaranja.addEventListener("click", () => {
            window.personagemSelecionado = "personagens/laranjacompleto.gif"; 
            atualizarCardsVisuais(cardLaranja, cardCinza);
        });

        btnFecharAviso.addEventListener("click", () => {
            avisoPop.style.display = "none";
        });

        // Microinteração do botão de iniciar ao clicar
        btnIniciar.addEventListener("mousedown", () => { btnIniciar.style.transform = "scale(0.98)"; });
        btnIniciar.addEventListener("mouseup", () => { btnIniciar.style.transform = "scale(1)"; });

        btnIniciar.addEventListener("click", () => {
            if (!window.personagemSelecionado) {
                avisoPop.style.display = "block";
            } else {
                console.log("Personagem escolhido com sucesso. Chamando a Fase 1...");
                iniciarFase1(); 
            }
        });
    });

    // ==========================================================================
    // 3. LOGICA MECÂNICA DO BOTÃO SAIR
    // ==========================================================================
    btnSair.addEventListener("click", () => {
        console.log("Fechando o jogo...");
        window.close();
        setTimeout(() => {
            window.location.href = "https://www.google.com";
        }, 100); 
    });
});
