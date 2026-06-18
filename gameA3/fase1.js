// fase1.js

function iniciarFase1() {
    console.log("Fase 1 Iniciada com o personagem: " + window.personagemSelecionado);
    
    // ==========================================================================
    // 1. CONFIGURAÇÕES INICIAIS E ESTRUTURA DO AMBIENTE
    // ==========================================================================
    const menuContainer = document.querySelector(".menu-container");
    if (menuContainer) menuContainer.remove();

    const cenarioGeral = document.querySelector(".cenario-cidade");
    cenarioGeral.style.backgroundImage = "url('fase1.png')";
    cenarioGeral.style.backgroundSize = "100% 100%"; 
    cenarioGeral.style.overflow = "hidden";
    cenarioGeral.style.display = "block"; 
    
    if (!window.senhaColetada) {
        window.senhaColetada = ["_", "_"]; 
    }

    const containerFase1 = document.createElement("div");
    containerFase1.id = "container-fase1";
    containerFase1.style.width = "100vw";
    containerFase1.style.height = "100vh";
    containerFase1.style.position = "relative";

    containerFase1.innerHTML = `
        <div id="hud-lateral-fase1" style="
            position: absolute; top: 25px; left: 25px; z-index: 110; 
            display: flex; flex-direction: column; gap: 12px; width: 280px; 
            font-family: 'Press Start 2P', monospace;
            animation: slideInLeft var(--t-slow, 450ms) var(--ease-out, cubic-bezier(.22,.61,.36,1)) both;
        ">
            <div style="background: #f4eedb; border: 3px solid #160e0b; padding: 15px; box-shadow: 4px 4px 0px #160e0b;">
                <h4 style="color: #160e0b; font-size: 9px; margin-bottom: 8px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 4px;">CASO EM ABERTO:</h4>
                <p id="texto-missao" style="color: #2b201c; font-size: 7px; line-height: 1.6; margin: 0;"></p>
            </div>

            <div style="background: #f4eedb; border: 3px solid #160e0b; box-shadow: 4px 4px 0px #160e0b; padding: 12px; font-size: 8px; color: #160e0b; display: flex; flex-direction: column; gap: 10px;">
                <div style="font-weight: bold; border-bottom: 1px solid #160e0b; padding-bottom: 4px; text-align: center;">ARQUIVO DE CHAVES</div>
                <div>CHAVE COLETADA: <span id="digitos-senha" style="color: #ffb700; font-weight: bold; text-shadow: 1px 1px #000;">${window.senhaColetada.join(" ")}</span></div>
            </div>
        </div>

        <div id="click-escola-fachada" style="position: absolute; top: 15%; left: 55%; width: 230px; height: 180px; z-index: 95; cursor: pointer;"></div>
        <div id="click-telefone-cabine" style="position: absolute; top: 70%; left: 75%; width: 90px; height: 150px; z-index: 95; cursor: pointer;"></div>

        <div id="click-mesa-professora" style="display: none; position: absolute; top: 38%; left: 40%; width: 220px; height: 120px; z-index: 95; cursor: pointer;"></div>

        <div id="jogador" style="
            display: block; 
            width: 80px !important;  
            height: 100px !important; 
            position: absolute; 
            z-index: 90;
            background-size: contain !important; 
            background-repeat: no-repeat !important; 
            background-position: center bottom !important;
            image-rendering: pixelated;
            animation-play-state: paused; 
        "></div>

        <div id="lousa-enigma" style="display: none; position: absolute; z-index: 120; background-color: #f4eedb; border: 5px double #160e0b; padding: 35px; text-align: center; box-shadow: 0px 10px 0px #160e0b; font-family: 'Press Start 2P'; color: #160e0b; width: 440px; max-width: 85vw;"></div>

        <div id="pop-feedback" style="
            display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #f4eedb; border: 5px solid #160e0b; box-shadow: 0px 8px 0px #160e0b;
            padding: 30px; width: 520px; max-width: 90vw; z-index: 150; text-align: center; font-family: 'Press Start 2P', monospace;
        ">
            <p id="msg-feedback" style="font-size: 10px; line-height: 2; margin-bottom: 25px; white-space: pre-line; text-align: center; color: #160e0b;"></p>
            <button class="btn-vintage" id="btn-ok-feedback" style="width: 140px; height: 40px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; cursor: pointer; box-shadow: 4px 4px 0px #b71c1c;">AVANÇAR</button>
        </div>

        <div id="toast-fase1" style="
            display: none; position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
            z-index: 160; font-family: 'Press Start 2P', monospace; font-size: 8px;
            padding: 12px 22px; border: 3px solid #160e0b; white-space: nowrap;
            pointer-events: none;
        "></div>
    `;

    cenarioGeral.appendChild(containerFase1);

    const jogador = document.getElementById("jogador");
    if (window.personagemSelecionado) {
        jogador.style.backgroundImage = "url('" + window.personagemSelecionado + "')";
    }

    let juegoPausado = true; 

    // ==========================================================================
    // UTILITÁRIO: TOAST DE FEEDBACK RÁPIDO
    // ==========================================================================
    function mostrarToast(texto, sucesso) {
        const toast = document.getElementById("toast-fase1");
        toast.innerText = sucesso ? "✔ " + texto : "✘ " + texto;
        toast.style.background = sucesso ? "#f4eedb" : "#fff0f0";
        toast.style.color = sucesso ? "#160e0b" : "#b71c1c";
        toast.style.borderColor = sucesso ? "#160e0b" : "#b71c1c";
        toast.style.boxShadow = sucesso ? "4px 4px 0px #160e0b" : "4px 4px 0px #b71c1c";
        toast.style.display = "block";
        toast.style.animation = "none";
        void toast.offsetWidth;
        toast.style.animation = "popIn 0.25s cubic-bezier(.34,1.56,.64,1) both";
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transition = "opacity 0.4s ease";
            setTimeout(() => {
                toast.style.display = "none";
                toast.style.opacity = "1";
                toast.style.transition = "";
            }, 400);
        }, 2200);
    }

    // ==========================================================================
    // UTILITÁRIO: ABRIR PAINEL COM FADE-IN / FECHAR COM FADE-OUT
    // ==========================================================================
    function abrirPainel(el) {
        el.style.opacity = "0";
        el.style.display = "block";
        el.style.transition = "opacity var(--t-med, 280ms) ease, transform var(--t-med, 280ms) cubic-bezier(.34,1.56,.64,1)";
        el.style.transform = el.id && el.id.includes("pop") 
            ? "translate(-50%, -50%) scale(0.92)" 
            : "translateY(-10px) scale(0.96)";
        requestAnimationFrame(() => {
            el.style.opacity = "1";
            el.style.transform = el.id && el.id.includes("pop")
                ? "translate(-50%, -50%) scale(1)"
                : "translateY(0) scale(1)";
        });
    }

    function fecharPainel(el, cb) {
        el.style.transition = "opacity var(--t-fast, 150ms) ease, transform var(--t-fast, 150ms) ease";
        el.style.opacity = "0";
        el.style.transform = el.id && el.id.includes("pop")
            ? "translate(-50%, -50%) scale(0.94)"
            : "translateY(-8px) scale(0.96)";
        setTimeout(() => {
            el.style.display = "none";
            el.style.transition = "";
            if (cb) cb();
        }, 160);
    }

    // ==========================================================================
    // 2. SISTEMAS DE TEXTO E NOTIFICAÇÕES 
    // ==========================================================================
    function rodarIntroducaoUnificadaFase1() {
        const textoCompleto = "RELATÓRIO DE ARQUIVO URBANO:\n\nA cidade está completamente vazia, mas um som mecânico corta o silêncio das calçadas.\n\nO telefone público antigo perto da esquina está chamando insistentemente.\n\nVá até a cabine telefônica para atender a ligação e coletar a primeira pista.";
        
        const pop = document.getElementById("pop-feedback");
        const msg = document.getElementById("msg-feedback");
        const btn = document.getElementById("btn-ok-feedback");
        
        msg.style.color = "#160e0b";
        btn.innerText = "INICIAR";
        abrirPainel(pop);
        
        let i = 0;
        msg.innerHTML = "";
        function digitar() {
            if (i < textoCompleto.length) {
                msg.innerHTML += textoCompleto.charAt(i) === "\n" ? "<br>" : textoCompleto.charAt(i);
                i++; setTimeout(digitar, 25);
            }
        }
        btn.style.display = "none";
        digitar();
        setTimeout(() => { btn.style.display = "inline-block"; }, textoCompleto.length * 25);

        btn.onclick = () => {
            fecharPainel(pop, () => {
                juegoPausado = false;
                document.getElementById("texto-missao").innerText = "MISSÃO ATIVA:\nCaminhe até o orelhão azul na calçada e clique na cabine para atender.";
            });
        };
    }
    setTimeout(rodarIntroducaoUnificadaFase1, 300);

    function mostrarMensagemCustom(texto, ehSucesso, aoFechar, textoBotao = "AVANÇAR") {
        const pop = document.getElementById("pop-feedback");
        const msg = document.getElementById("msg-feedback");
        const btn = document.getElementById("btn-ok-feedback");

        // Cor da borda muda para indicar sucesso/erro
        pop.style.borderColor = ehSucesso ? "#160e0b" : "#b71c1c";
        pop.style.boxShadow = ehSucesso ? "0px 8px 0px #160e0b" : "0px 8px 0px #b71c1c";
        msg.style.color = ehSucesso ? "#160e0b" : "#b71c1c";
        msg.innerText = texto;
        btn.innerText = textoBotao;
        abrirPainel(pop);
        juegoPausado = true;
        btn.onclick = () => {
            fecharPainel(pop, () => {
                // Restaura visual padrão
                pop.style.borderColor = "#160e0b";
                pop.style.boxShadow = "0px 8px 0px #160e0b";
                msg.style.color = "#160e0b";
                juegoPausado = false;
                if (aoFechar) aoFechar();
            });
        };
    }

    // ==========================================================================
    // 3. CONTROLE DE MOVIMENTAÇÃO DO JOGADOR
    // ==========================================================================
    let posX = 40; 
    let posY = window.innerHeight * 0.65; 
    const velocidade = 15; 
    let teclas = {}; 

    jogador.style.left = posX + "px";
    jogador.style.top = posY + "px";

    let missaoTelefoneConcluida = false;
    let naEscola = false; 

    window.addEventListener("keydown", (e) => {
        if (juegoPausado) return; 
        teclas[e.key.toLowerCase()] = true;
        let andou = false;

        if (teclas["a"] || teclas["arrowleft"]) { posX -= velocidade; jogador.style.transform = "scaleX(-1)"; andou = true; }
        if (teclas["d"] || teclas["arrowright"]) { posX += velocidade; jogador.style.transform = "scaleX(1)"; andou = true; }
        if (teclas["w"] || teclas["arrowup"]) { if (posY > window.innerHeight * 0.10) { posY -= velocidade; andou = true; } }
        if (teclas["s"] || teclas["arrowdown"]) { if (posY < window.innerHeight - 130) { posY += velocidade; andou = true; } }

        if (andou) {
            jogador.style.animationPlayState = "running";
            jogador.style.left = posX + "px"; jogador.style.top = posY + "px";
        }
    });

    window.addEventListener("keyup", (e) => { 
        teclas[e.key.toLowerCase()] = false;
        jogador.style.animationPlayState = "paused"; 
    });

    // ==========================================================================
    // 4. ETAPA DO TELEFONE (PRIMEIRA PARTE DA MISSÃO)
    // ==========================================================================
    document.getElementById("click-telefone-cabine").onclick = () => {
        if (juegoPausado || missaoTelefoneConcluida) return;
        if (posX > window.innerWidth * 0.68 && posY > window.innerHeight * 0.55) {
            juegoPausado = true;
            jogador.style.animationPlayState = "paused";
            
            mostrarMensagemCustom(
                "A linha está cheia de interferências de estática.\n\nUma voz sussurra no alto-falante:\n\"A resposta abrirá os portões da escola.\"",
                true, 
                () => { abrirLousaTelefone(); }, 
                "AVANÇAR"
            );
        } else {
            mostrarMensagemCustom("Você escuta os toques distantes do orelhão azul na calçada. Aproxime-se!", false);
        }
    };

    function abrirLousaTelefone() {
        const lousa = document.getElementById("lousa-enigma");
        lousa.style.left = (window.innerWidth / 2 - 220) + "px"; lousa.style.top = "140px";

        lousa.innerHTML = `
            <h3 style="color: #b71c1c; font-size: 12px; margin-bottom: 12px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 6px;">ARQUIVO DA INTERCEPTAÇÃO</h3>
            <p style="color: #2b201c; font-size: 8px; line-height: 1.6; margin-bottom: 20px;">Descubra a MAIOR raiz real (x) da equação interceptada por áudio:</p>
            <div style="color: #160e0b; font-size: 14px; background: #e2dac2; border: 2px solid #160e0b; padding: 20px; margin-bottom: 25px; line-height: 2; font-weight: bold; box-shadow: inset 0px 0px 8px rgba(0,0,0,0.1);">
                x² - 5x + 6 = 0
            </div>
            <p style="color: #2b201c; font-size: 8px; margin-bottom: 12px; font-weight: bold;">Informe a maior raiz:</p>
            <input type="number" id="resp-telefone" style="font-family: 'Press Start 2P'; font-size: 14px; width: 110px; height: 40px; text-align: center; margin-bottom: 20px; background: #fff; border: 3px solid #160e0b; color: #160e0b; box-shadow: 2px 2px 0px #160e0b;"><br>
            <button class="btn-vintage" id="btn-responder-telefone" style="width: 220px; height: 45px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; font-weight: bold; cursor: pointer; box-shadow: 4px 4px 0px #b71c1c;">AUTENTICAR</button>
        `;

        abrirPainel(lousa);

        document.getElementById("btn-responder-telefone").onclick = () => {
            if (document.getElementById("resp-telefone").value == 3) {
                fecharPainel(lousa, () => {
                    window.senhaColetada[1] = "3";
                    const digestoEl = document.getElementById("digitos-senha");
                    digestoEl.innerText = window.senhaColetada.join(" ");
                    // Flash dourado no HUD ao coletar chave
                    digestoEl.style.transition = "text-shadow 0.3s ease";
                    digestoEl.style.textShadow = "0 0 12px #ffb700, 0 0 24px #ffb700";
                    setTimeout(() => { digestoEl.style.textShadow = "1px 1px #000"; }, 900);

                    mostrarToast("Raiz correta! Linha descriptografada.", true);
                    setTimeout(() => {
                        mostrarMensagemCustom("Linha descriptografada! O sinal remoto destrancou o portão principal da antiga escola.", true, () => {
                            missaoTelefoneConcluida = true;
                            document.getElementById("texto-missao").innerText = "MISSÃO ATIVA:\nO acesso à escola foi liberado. Caminhe até a entrada principal e clique na porta.";
                        });
                    }, 600);
                });
            } else {
                // Shake na lousa ao errar
                lousa.style.animation = "none";
                void lousa.offsetWidth;
                lousa.style.animation = "shakeX 0.4s ease";
                mostrarToast("Raiz incorreta. Verifique os cálculos.", false);
            }
        };
    }

    // ==========================================================================
    // 5. ETAPA DA ESCOLA (SEGUNDA PARTE DA MISSÃO)
    // ==========================================================================
    document.getElementById("click-escola-fachada").onclick = () => {
        if (juegoPausado || naEscola || !missaoTelefoneConcluida) {
            if (!missaoTelefoneConcluida) {
                document.getElementById("texto-missao").innerText = "BLOQUEADO:\nAs portas estão trancadas eletronicamente. Resolva o enigma do telefone primeiro.";
            }
            return;
        }
        if (posX > window.innerWidth * 0.45 && posX < window.innerWidth * 0.75 && posY < window.innerHeight * 0.55) {
            juegoPausado = true;
            jogador.style.animationPlayState = "paused";
            abrirEscola();
        } else {
            document.getElementById("texto-missao").innerText = "ERRO:\nVocê está muito distante da escola para inspecionar os portões.";
        }
    };

    function abrirEscola() {
        naEscola = true;
        // Transição suave ao trocar cenário
        const cenario = document.querySelector(".cenario-cidade");
        cenario.style.transition = "opacity 0.4s ease";
        cenario.style.opacity = "0";
        setTimeout(() => {
            cenario.style.backgroundImage = "url('escola.png')";
            cenario.style.opacity = "1";
        }, 400);
        
        document.getElementById("click-mesa-professora").style.display = "block";
        document.getElementById("click-escola-fachada").style.display = "none";
        document.getElementById("click-telefone-cabine").style.display = "none";

        jogador.style.width = "120px"; jogador.style.height = "150px";

        posX = window.innerWidth * 0.78; posY = window.innerHeight * 0.68;
        jogador.style.left = posX + "px"; jogador.style.top = posY + "px";

        document.getElementById("texto-missao").innerText = "MISSÃO ATIVA:\nA sala de aula parece abandonada. Vá até a mesa do professor e resolva o desafio.";
        
        setTimeout(() => { juegoPausado = false; }, 600);
    }

    document.getElementById("click-mesa-professora").onclick = () => {
        if (juegoPausado || !naEscola) return;
        if (posX > window.innerWidth * 0.35 && posX < window.innerWidth * 0.60 && posY < window.innerHeight * 0.55) {
            juegoPausado = true;
            jogador.style.animationPlayState = "paused";
            abrirLousaEscola();
        } else {
            mostrarMensagemCustom("O personagem está longe da mesa do professor! Aproxime-se.", false);
        }
    };

    function abrirLousaEscola() {
        const lousa = document.getElementById("lousa-enigma");
        lousa.style.left = (window.innerWidth / 2 - 220) + "px"; lousa.style.top = "140px";

        lousa.innerHTML = `
            <h3 style="color: #b71c1c; font-size: 12px; margin-bottom: 12px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 6px;">EXAME DE ADMISSÃO</h3>
            <p style="color: #2b201c; font-size: 8px; line-height: 1.6; margin-bottom: 20px;">Encontre o valor de X contido na lousa negra:</p>
            <div style="color: #160e0b; font-size: 16px; background: #e2dac2; border: 2px solid #160e0b; padding: 20px; margin-bottom: 25px; line-height: 2; font-weight: bold; box-shadow: inset 0px 0px 8px rgba(0,0,0,0.1);">
                2x - 8 = 0
            </div>
            <p style="color: #2b201c; font-size: 8px; margin-bottom: 12px; font-weight: bold;">Informe a resposta:</p>
            <input type="number" id="resp-escola" style="font-family: 'Press Start 2P'; font-size: 14px; width: 110px; height: 40px; text-align: center; margin-bottom: 20px; background: #fff; border: 3px solid #160e0b; color: #160e0b; box-shadow: 2px 2px 0px #160e0b;"><br>
            <button class="btn-vintage" id="btn-responder-escola" style="width: 220px; height: 45px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; font-weight: bold; cursor: pointer; box-shadow: 4px 4px 0px #b71c1c;">REGISTRAR</button>
        `;

        abrirPainel(lousa);

        document.getElementById("btn-responder-escola").onclick = () => {
            if (document.getElementById("resp-escola").value == 4) {
                fecharPainel(lousa, () => {
                    window.senhaColetada[0] = "4";
                    const digestoEl = document.getElementById("digitos-senha");
                    digestoEl.innerText = window.senhaColetada.join(" ");
                    digestoEl.style.transition = "text-shadow 0.3s ease";
                    digestoEl.style.textShadow = "0 0 12px #ffb700, 0 0 24px #ffb700";
                    setTimeout(() => { digestoEl.style.textShadow = "1px 1px #000"; }, 900);

                    mostrarToast("Resposta correta! Fragmento coletado.", true);
                    setTimeout(() => {
                        mostrarMensagemCustom("Dados processados com sucesso! Você obteu o fragmento final de acesso.\n\nPreparando transição rumo à FASE 2!", true, () => {
                            naEscola = false;
                            // Fade out antes de trocar de fase
                            const cenario = document.querySelector(".cenario-cidade");
                            cenario.style.transition = "opacity 0.5s ease";
                            cenario.style.opacity = "0";
                            setTimeout(() => {
                                document.getElementById("container-fase1").remove();
                                cenario.style.opacity = "1";
                                if (typeof iniciarFase2 === "function") iniciarFase2();
                            }, 500);
                        });
                    }, 600);
                });
            } else {
                lousa.style.animation = "none";
                void lousa.offsetWidth;
                lousa.style.animation = "shakeX 0.4s ease";
                mostrarToast("Cálculo incorreto. Revise os passos algébricos.", false);
            }
        };
    }
}