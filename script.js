// script.js
// Menu inicial, seleção de personagem, tutorial, progresso salvo e
// controle mobile (joystick virtual).

document.addEventListener("DOMContentLoaded", () => {
  configurarControleMobile();

  const btnJogar = document.getElementById("btn-jogar");
  const btnSair = document.getElementById("btn-sair");
  const botoesGrupo = document.querySelector(".botoes-grupo");

  configurarBotaoContinuar(botoesGrupo);

  btnJogar.addEventListener("click", () => {
    apagarProgresso();
    window.senhaColetada = undefined;
    window.senhaFase2 = undefined;
    window.senhaFase3 = undefined;
    abrirTelaSelecaoPersonagem();
  });

  btnSair.addEventListener("click", () => {
    // window.close() é bloqueado pela maioria dos navegadores em abas que
    // não foram abertas via script, então confirmamos e reiniciamos o jogo.
    const confirmarSaida = window.confirm("Deseja realmente sair e reiniciar o jogo?");
    if (confirmarSaida) location.reload();
  });
});

// ============================================================================
// PROGRESSO SALVO
// ============================================================================
function configurarBotaoContinuar(botoesGrupo) {
  const progresso = carregarProgresso();
  if (!progresso || !progresso.fase) return;

  const btnContinuar = document.createElement("button");
  btnContinuar.className = "btn-vintage btn-continuar";
  btnContinuar.id = "btn-continuar";
  btnContinuar.innerText = `CONTINUAR (FASE ${progresso.fase})`;
  botoesGrupo.insertBefore(btnContinuar, botoesGrupo.firstChild);

  btnContinuar.addEventListener("click", () => {
    window.personagemSelecionado = progresso.personagemSelecionado;
    window.senhaColetada = progresso.senhaColetada;
    window.senhaFase2 = progresso.senhaFase2;
    window.senhaFase3 = progresso.senhaFase3;

    const funcaoFase = { 1: iniciarFase1, 2: iniciarFase2, 3: iniciarFase3 }[progresso.fase];
    if (funcaoFase) funcaoFase();
  });
}

// ============================================================================
// TELA DE TUTORIAL
// ============================================================================
function mostrarTutorial(aoFechar) {
  const cenario = document.querySelector(".cenario-cidade");

  // Esconde a tela de seleção de personagem: o tutorial deve aparecer só
  // sobre o cenário da cidade, sem o texto/cartas da tela anterior por trás.
  const menuContainer = document.querySelector(".menu-container");
  if (menuContainer) menuContainer.style.display = "none";

  const painel = document.createElement("div");
  painel.className = "painel-tutorial";
  painel.innerHTML = `
        <h3>COMO JOGAR</h3>

        <div class="painel-tutorial__linha">
            <div class="tutorial-keypad" aria-hidden="true">
                <span class="tutorial-tecla-mini tutorial-tecla-mini--up">W<br>▲</span>
                <span class="tutorial-tecla-mini tutorial-tecla-mini--left">A<br>◀</span>
                <span class="tutorial-tecla-mini tutorial-tecla-mini--down">S<br>▼</span>
                <span class="tutorial-tecla-mini tutorial-tecla-mini--right">D<br>▶</span>
            </div>
            <span>Use <strong>WASD</strong> ou as <strong>setas</strong> do teclado para mover o personagem pelo cenário.</span>
        </div>

        <div class="painel-tutorial__linha">
            <span class="painel-tutorial__tecla painel-tutorial__tecla--icone">👆</span>
            <span>Clique ou toque nos objetos e pessoas marcados no cenário para interagir com eles.</span>
        </div>

        <div class="painel-tutorial__linha">
            <span class="painel-tutorial__tecla painel-tutorial__tecla--icone">💡</span>
            <span>Travou em um enigma? Toque no ícone de lâmpada no canto do quadro para ver uma dica.</span>
        </div>

        <button class="btn-acao" id="btn-fechar-tutorial">ENTENDIDO!</button>
    `;
  cenario.appendChild(painel);

  document.getElementById("btn-fechar-tutorial").onclick = () => {
    painel.remove();
    if (aoFechar) aoFechar();
  };
}

// ============================================================================
// SELEÇÃO DE PERSONAGEM
// ============================================================================
function abrirTelaSelecaoPersonagem() {
  const menuContainer = document.querySelector(".menu-container");
  if (menuContainer) menuContainer.remove();

  const telaSelecao = document.createElement("div");
  telaSelecao.className = "menu-container";

  telaSelecao.innerHTML = `
        <div class="narrativa-box">
            <p>Há muitos anos, um tesouro desapareceu junto com a cidade.</p>
            <p>Dizem que apenas aqueles capazes de decifrar os enigmas matemáticos conseguirão encontrá-lo.</p>
            <p class="narrativa-box__destaque">A busca começa agora.</p>
        </div>

        <h2 class="selecao-titulo">ESCOLHA SEU PERSONAGEM</h2>

        <div class="personagens-container">
            <div class="card-personagem" id="char-cinza">
                <div class="placeholder-img" style="background-image: url('personagens/cinzacompleto.gif');"></div>
                <span class="label-genero">MASCULINO</span>
            </div>
            <div class="card-personagem" id="char-laranja">
                <div class="placeholder-img" style="background-image: url('personagens/laranjacompleto.gif');"></div>
                <span class="label-genero">FEMININO</span>
            </div>
        </div>

        <button class="btn-vintage" id="btn-iniciar">INICIAR</button>

        <div id="aviso-personagem" class="aviso-flutuante">
            <p>Por favor, escolha um personagem antes de iniciar a busca!</p>
            <button class="btn-vintage btn-vintage--compacto" id="btn-fechar-aviso">OK</button>
        </div>
    `;

  document.querySelector(".cenario-cidade").appendChild(telaSelecao);
  configurarCardsPersonagem(telaSelecao);
}

function configurarCardsPersonagem(telaSelecao) {
  const cardCinza = document.getElementById("char-cinza");
  const cardLaranja = document.getElementById("char-laranja");
  const btnIniciar = document.getElementById("btn-iniciar");
  const avisoPop = document.getElementById("aviso-personagem");
  const btnFecharAviso = document.getElementById("btn-fechar-aviso");

  function selecionar(cardEscolhido, cardRestante, caminhoGif) {
    window.personagemSelecionado = caminhoGif;
    cardEscolhido.classList.add("card-personagem--selecionado");
    cardEscolhido.classList.remove("card-personagem--esmaecido");
    cardRestante.classList.add("card-personagem--esmaecido");
    cardRestante.classList.remove("card-personagem--selecionado");
  }

  cardCinza.addEventListener("click", () => {
    selecionar(cardCinza, cardLaranja, "personagens/cinzacompleto.gif");
  });

  cardLaranja.addEventListener("click", () => {
    selecionar(cardLaranja, cardCinza, "personagens/laranjacompleto.gif");
  });

  btnFecharAviso.addEventListener("click", () => {
    avisoPop.classList.remove("aviso-flutuante--visivel");
  });

  btnIniciar.addEventListener("click", () => {
    if (!window.personagemSelecionado) {
      avisoPop.classList.add("aviso-flutuante--visivel");
      return;
    }
    mostrarTutorial(() => { iniciarFase1(); });
  });
}

// ============================================================================
// CONTROLE MOBILE (joystick virtual + botão de ação)
// ============================================================================
function configurarControleMobile() {
  window.mobileInput = window.mobileInput || { x: 0, y: 0, action: false };

  const mobileControls = document.getElementById("mobile-controls");
  const mobileJoystick = document.getElementById("mobile-joystick");
  const mobileStick = document.getElementById("mobile-joystick-stick");
  const mobileAction = document.getElementById("mobile-action");
  const isTouchDevice =
    window.matchMedia("(hover: none) and (pointer: coarse)").matches || navigator.maxTouchPoints > 0;

  if (!mobileControls || !mobileJoystick || !mobileStick || !mobileAction || !isTouchDevice) return;

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
      " ": { code: "Space", keyCode: 32, which: 32 },
    }[key] || { code: key, keyCode: 0, which: 0 };

    return new KeyboardEvent(type, {
      key, code: keyData.code, keyCode: keyData.keyCode, which: keyData.which,
      bubbles: true, cancelable: true,
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
    movementTimer = setInterval(updateKeys, 45);
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
      .map((id) => document.getElementById(id))
      .find((el) => el && el.offsetParent !== null && getComputedStyle(el).display !== "none");
  }

  function getVisibleActionTargets() {
    return Array.from(document.querySelectorAll("[id^='click-']")).filter(isVisible);
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
    return { x: left / window.innerWidth, y: top / window.innerHeight };
  }

  function clickActionTarget(target) {
    if (!target) return false;
    target.click();
    return true;
  }

  function getReachableActionTarget() {
    const pos = getPlayerPosition();
    if (!pos) return null;

    const rules = window.getTodasZonas ? window.getTodasZonas() : [];
    for (const rule of rules) {
      const target = document.getElementById(rule.id);
      if (isVisible(target) && rule.test(pos)) return target;
    }
    return null;
  }

  function getVisiblePrimaryButton() {
    const panelSelectors = [
      "#pop-feedback", "#pop-feedback-fase2", "#pop-feedback-fase3",
      "#lousa-enigma", "#lousa-enigma-fase2", "#lousa-enigma-fase3",
      "#aviso-personagem", ".painel-vitoria", ".painel-tutorial",
    ];

    for (const selector of panelSelectors) {
      const panel = document.querySelector(selector);
      if (!panel || !isVisible(panel)) continue;

      const botoesVisiveis = Array.from(panel.querySelectorAll("button")).filter(isVisible);
      if (botoesVisiveis.length === 1) return botoesVisiveis[0];
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
        const nearestDist = Math.hypot(
          nearestRect.left + nearestRect.width / 2 - playerX,
          nearestRect.top + nearestRect.height / 2 - playerY
        );
        const currentDist = Math.hypot(
          currentRect.left + currentRect.width / 2 - playerX,
          currentRect.top + currentRect.height / 2 - playerY
        );
        return currentDist < nearestDist ? current : nearest;
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
