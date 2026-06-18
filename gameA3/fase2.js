function iniciarFase2() {
  console.log("Fase 2 Iniciada no Laboratório!");

  // ==========================================================================
  // 1. CONFIGURAÇÕES INICIAIS E ESTRUTURA DO AMBIENTE
  // ==========================================================================
  if (!window.senhaColetada) {
    window.senhaColetada = ["4", "3"];
  }

  const containerAntigo = document.getElementById("container-fase1");
  if (containerAntigo) containerAntigo.remove();

  const cenarioGeral = document.querySelector(".cenario-cidade");
  cenarioGeral.style.backgroundImage = "url('laboratorioapagado.png')";
  cenarioGeral.style.backgroundSize = "100% 100%";
  cenarioGeral.style.overflow = "hidden";

  if (!window.senhaFase2) {
    window.senhaFase2 = ["_", "_"];
  }

  const containerFase2 = document.createElement("div");
  containerFase2.id = "container-fase2";
  containerFase2.style.width = "100vw";
  containerFase2.style.height = "100vh";
  containerFase2.style.position = "relative";

  containerFase2.innerHTML = `
        <div id="hud-lateral-fase2" style="
            position: absolute; top: 25px; left: 25px; z-index: 110; 
            display: flex; flex-direction: column; gap: 12px; width: 280px; 
            font-family: 'Press Start 2P', monospace;
            animation: slideInLeft var(--t-slow, 450ms) var(--ease-out, cubic-bezier(.22,.61,.36,1)) both;
        ">
            <div style="background: #f4eedb; border: 3px solid #160e0b; padding: 15px; box-shadow: 4px 4px 0px #160e0b;">
                <h4 style="color: #160e0b; font-size: 9px; margin-bottom: 8px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 4px;">DADOS COLETADOS:</h4>
                <p id="texto-missao-fase2" style="color: #2b201c; font-size: 7px; line-height: 1.6; margin: 0;">
                    CARREGANDO DADOS...
                </p>
            </div>
            <div style="background: #f4eedb; border: 3px solid #160e0b; box-shadow: 4px 4px 0px #160e0b; padding: 12px; font-size: 8px; color: #160e0b; display: flex; flex-direction: column; gap: 10px;">
                <div style="font-weight: bold; border-bottom: 1px solid #160e0b; padding-bottom: 4px; text-align: center;">ARQUIVO DE CHAVES</div>
                <div>CHAVE FASE 1: <span style="color: #b71c1c; font-weight: bold;">4 3</span></div>
                <div>CHAVE FASE 2: <span id="digitos-fase2" style="color: #ffb700; font-weight: bold; text-shadow: 1px 1px #000;">_ _</span></div>
            </div>
        </div>

        <div id="click-computador" style="position: absolute; top: 12%; left: 43%; width: 150px; height: 110px; z-index: 95; cursor: pointer;"></div>
        <div id="click-armario" style="position: absolute; top: 10%; left: 68%; width: 140px; height: 150px; z-index: 95; cursor: pointer;"></div>

        <div id="jogador-fase2" style="
            display: block; width: 110px !important; height: 140px !important; position: absolute; z-index: 90;
            background-size: contain !important; background-repeat: no-repeat !important; background-position: center bottom !important;
            image-rendering: pixelated; animation-play-state: paused; 
        "></div>

        <div id="lousa-enigma-fase2" style="display: none; position: absolute; z-index: 120; background-color: #f4eedb; border: 5px double #160e0b; padding: 25px; text-align: center; box-shadow: 0px 10px 0px #160e0b; font-family: 'Press Start 2P'; color: #160e0b; width: 460px; max-width: 85vw;"></div>
        
        <div id="pop-feedback-fase2" style="
            display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #f4eedb; border: 5px solid #160e0b; box-shadow: 0px 8px 0px #160e0b;
            padding: 30px; width: 520px; max-width: 90vw; z-index: 150; text-align: center; font-family: 'Press Start 2P', monospace;
        ">
            <p id="msg-feedback-fase2" style="font-size: 10px; line-height: 2; margin-bottom: 25px; white-space: pre-line; text-align: center; color: #160e0b;"></p>
            <button class="btn-vintage" id="btn-ok-feedback-fase2" style="width: 140px; height: 40px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; cursor: pointer; box-shadow: 4px 4px 0px #b71c1c;">AVANÇAR</button>
        </div>

        <div id="toast-fase2" style="
            display: none; position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
            z-index: 160; font-family: 'Press Start 2P', monospace; font-size: 8px;
            padding: 12px 22px; border: 3px solid #160e0b; white-space: nowrap;
            pointer-events: none;
        "></div>
    `;

  cenarioGeral.appendChild(containerFase2);

  const jogador = document.getElementById("jogador-fase2");
  if (window.personagemSelecionado) {
    jogador.style.backgroundImage =
      "url('" + window.personagemSelecionado + "')";
  }

  let juegoPausado = true;

  // ==========================================================================
  // UTILITÁRIO: TOAST DE FEEDBACK RÁPIDO
  // ==========================================================================
  function mostrarToast(texto, sucesso) {
    const toast = document.getElementById("toast-fase2");
    toast.innerText = sucesso ? "✔ " + texto : "✘ " + texto;
    toast.style.background = sucesso ? "#f4eedb" : "#fff0f0";
    toast.style.color = sucesso ? "#160e0b" : "#b71c1c";
    toast.style.borderColor = sucesso ? "#160e0b" : "#b71c1c";
    toast.style.boxShadow = sucesso
      ? "4px 4px 0px #160e0b"
      : "4px 4px 0px #b71c1c";
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
  // UTILITÁRIO: ABRIR/FECHAR PAINÉIS COM TRANSIÇÃO
  // ==========================================================================
  function abrirPainel(el) {
    const isPop = el.id && el.id.includes("pop");
    el.style.opacity = "0";
    el.style.display = "block";
    el.style.transition =
      "opacity 280ms ease, transform 280ms cubic-bezier(.34,1.56,.64,1)";
    el.style.transform = isPop
      ? "translate(-50%, -50%) scale(0.92)"
      : "translateY(-10px) scale(0.96)";
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = isPop
        ? "translate(-50%, -50%) scale(1)"
        : "translateY(0) scale(1)";
    });
  }

  function fecharPainel(el, cb) {
    const isPop = el.id && el.id.includes("pop");
    el.style.transition = "opacity 150ms ease, transform 150ms ease";
    el.style.opacity = "0";
    el.style.transform = isPop
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
  function rodarIntroducaoFase2() {
    const textoCompleto =
      "REGISTRO DE EXPERIMENTO SUBTERRÂNEO:\n\nAo solucionar a conta na lousa da escola, uma passagem mecânica secreta se abriu sob os tablados da sala de aula.\n\nOs degraus levaram a um antigo laboratório subterrâneo esquecido. Está tudo completamente escuro e sem energia.\n\nLocalize o computador do painel para restabelecer os geradores de luz.";

    const pop = document.getElementById("pop-feedback-fase2");
    const msg = document.getElementById("msg-feedback-fase2");
    const btn = document.getElementById("btn-ok-feedback-fase2");

    msg.style.color = "#160e0b";
    btn.innerText = "INVESTIGAR";
    abrirPainel(pop);

    let i = 0;
    msg.innerHTML = "";
    function digitar() {
      if (i < textoCompleto.length) {
        msg.innerHTML +=
          textoCompleto.charAt(i) === "\n" ? "<br>" : textoCompleto.charAt(i);
        i++;
        setTimeout(digitar, 25);
      }
    }
    btn.style.display = "none";
    digitar();
    setTimeout(() => {
      btn.style.display = "inline-block";
    }, textoCompleto.length * 25);

    btn.onclick = () => {
      fecharPainel(pop, () => {
        juegoPausado = false;
        document.getElementById("texto-missao-fase2").innerText =
          "MISSÃO ATIVA:\nEnergia do laboratório desligada. Aproxime-se do computador central no fundo da sala para religar a luz.";
      });
    };
  }
  setTimeout(rodarIntroducaoFase2, 100);

  function mostrarFeedbackFase2(
    texto,
    sucesso,
    aoFechar,
    textoBotao = "AVANÇAR",
  ) {
    const pop = document.getElementById("pop-feedback-fase2");
    const msg = document.getElementById("msg-feedback-fase2");
    const btn = document.getElementById("btn-ok-feedback-fase2");
    pop.style.borderColor = sucesso ? "#160e0b" : "#b71c1c";
    pop.style.boxShadow = sucesso
      ? "0px 8px 0px #160e0b"
      : "0px 8px 0px #b71c1c";
    msg.style.color = sucesso ? "#160e0b" : "#b71c1c";
    msg.innerText = texto;
    btn.innerText = textoBotao;
    abrirPainel(pop);
    juegoPausado = true;
    btn.onclick = () => {
      fecharPainel(pop, () => {
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
  let posX = window.innerWidth * 0.81;
  let posY = window.innerHeight * 0.36;
  const velocidad = 15;
  let teclas = {};

  jogador.style.left = posX + "px";
  jogador.style.top = posY + "px";
  jogador.style.transform = "scaleX(-1)";

  let computadorResolvido = false;
  let armarioResolvido = false;

  window.addEventListener("keydown", (e) => {
    if (juegoPausado) return;
    teclas[e.key.toLowerCase()] = true;
    let andou = false;

    if (teclas["a"] || teclas["arrowleft"]) {
      if (posX > window.innerWidth * 0.12) {
        posX -= velocidad;
        jogador.style.transform = "scaleX(-1)";
        andou = true;
      }
    }
    if (teclas["d"] || teclas["arrowright"]) {
      if (posX < window.innerWidth * 0.85) {
        posX += velocidad;
        jogador.style.transform = "scaleX(1)";
        andou = true;
      }
    }
    if (teclas["w"] || teclas["arrowup"]) {
      if (posY > window.innerHeight * 0.22) {
        posY -= velocidad;
        andou = true;
      }
    }
    if (teclas["s"] || teclas["arrowdown"]) {
      if (posY < window.innerHeight - 180) {
        posY += velocidad;
        andou = true;
      }
    }

    if (andou) {
      jogador.style.animationPlayState = "running";
      jogador.style.left = posX + "px";
      jogador.style.top = posY + "px";
    }
  });

  window.addEventListener("keyup", (e) => {
    teclas[e.key.toLowerCase()] = false;
    jogador.style.animationPlayState = "paused";
  });

  // ==========================================================================
  // 4. EVENTOS DA PARTE DO COMPUTADOR (GERADORES DE ENERGIA)
  // ==========================================================================
  document.getElementById("click-computador").onclick = () => {
    if (juegoPausado || computadorResolvido) return;
    if (
      posX > window.innerWidth * 0.36 &&
      posX < window.innerWidth * 0.52 &&
      posY < window.innerHeight * 0.32
    ) {
      juegoPausado = true;
      jogador.style.animationPlayState = "paused";

      mostrarFeedbackFase2(
        "CONEXÃO ESTABELECIDA:\n\nOs coolers antigos do laboratório começaram a girar... Analise as diretrizes do monitor.",
        true,
        () => {
          abrirDesafioComputador();
        },
        "CONECTAR",
      );
    } else {
      mostrarFeedbackFase2(
        "Você está distante do computador do laboratório. Caminhe até ele.",
        false,
        null,
        "VOLTAR",
      );
    }
  };

  function abrirDesafioComputador() {
    const lousa = document.getElementById("lousa-enigma-fase2");
    lousa.style.left = window.innerWidth / 2 - 230 + "px";
    lousa.style.top = "90px";

    lousa.innerHTML = `
            <h3 style="color: #b71c1c; font-size: 11px; margin-bottom: 8px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 4px;">TABELA VERDADE CENTRAL</h3>
            <p style="color: #2b201c; font-size: 7px; line-height: 1.4; margin-bottom: 12px;">Descubra o resultado lógico para a instrução: P ∧ ¬Q</p>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 7px; font-family: 'Press Start 2P'; margin-bottom: 15px; background: #e2dac2; border: 2px solid #160e0b; text-align: center;">
                <thead>
                    <tr style="background: #160e0b; color: #f4eedb;">
                        <th style="padding: 6px; border: 1px solid #160e0b;">P</th>
                        <th style="padding: 6px; border: 1px solid #160e0b;">Q</th>
                        <th style="padding: 6px; border: 1px solid #160e0b;">¬Q</th>
                        <th style="padding: 6px; border: 1px solid #160e0b; color: #ffb700;">P ∧ ¬Q</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style="padding: 5px; border: 1px solid #160e0b;">V</td><td style="border: 1px solid #160e0b;">V</td><td style="border: 1px solid #160e0b;">F</td><td style="border: 1px solid #160e0b; font-weight: bold;">F</td></tr>
                    <tr style="background: rgba(22, 14, 11, 0.05);"><td style="padding: 5px; border: 1px solid #160e0b; color: #b71c1c; font-weight: bold;">V</td><td style="border: 1px solid #160e0b; color: #b71c1c; font-weight: bold;">F</td><td style="border: 1px solid #160e0b; color: #b71c1c; font-weight: bold;">V</td><td style="border: 1px solid #160e0b; background: rgba(255,183,0,0.2); font-weight: bold;">?</td></tr>
                    <tr><td style="padding: 5px; border: 1px solid #160e0b;">F</td><td style="border: 1px solid #160e0b;">V</td><td style="border: 1px solid #160e0b;">F</td><td style="border: 1px solid #160e0b; font-weight: bold;">F</td></tr>
                    <tr style="background: rgba(22, 14, 11, 0.05);"><td style="padding: 5px; border: 1px solid #160e0b;">F</td><td style="border: 1px solid #160e0b;">F</td><td style="border: 1px solid #160e0b;">V</td><td style="border: 1px solid #160e0b; font-weight: bold;">F</td></tr>
                </tbody>
            </table>

            <p style="color: #160e0b; font-size: 7px; margin-bottom: 12px; font-weight: bold;">Se P é V e Q é F, qual o valor na linha marcada?</p>
            <div style="display: flex; justify-content: center; gap: 15px;">
                <button class="btn-vintage" id="btn-v" style="width: 140px; height: 45px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; font-weight: bold; box-shadow: 4px 4px 0px #b71c1c;">(V) VERDADE</button>
                <button class="btn-vintage" id="btn-f" style="width: 140px; height: 45px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; font-weight: bold; box-shadow: 4px 4px 0px #333;">(F) FALSO</button>
            </div>
        `;

    abrirPainel(lousa);

    document.getElementById("btn-v").onclick = () => {
      fecharPainel(lousa, () => {
        computadorResolvido = true;
        // Transição suave ao acender as luzes
        cenarioGeral.style.transition = "opacity 0.5s ease";
        cenarioGeral.style.opacity = "0";
        setTimeout(() => {
          cenarioGeral.style.backgroundImage = "url('laboratorioluz.png')";
          cenarioGeral.style.opacity = "1";
        }, 500);

        mostrarToast("Lógica correta! Geradores ativados.", true);
        setTimeout(() => {
          mostrarFeedbackFase2(
            "PULSO ELÉTRICO ENVIADO:\n\nGeradores operando a 100%! As luzes do laboratório acenderam!",
            true,
            () => {
              document.getElementById("texto-missao-fase2").innerText =
                "MISSÃO ATIVA:\nEnergia do bunker restaurada! Dirija-se até o armário de ferro à direita para coletar arquivos.";
            },
          );
        }, 700);
      });
    };

    document.getElementById("btn-f").onclick = () => {
      lousa.style.animation = "none";
      void lousa.offsetWidth;
      lousa.style.animation = "shakeX 0.4s ease";
      mostrarToast("Sinal lógico rejeitado. Verifique a tabela.", false);
    };
  }

  // ==========================================================================
  // 5. EVENTOS DA PARTE DO ARMÁRIO / COFRE (TEORIA DOS CONJUNTOS)
  // ==========================================================================
  document.getElementById("click-armario").onclick = () => {
    if (juegoPausado || armarioResolvido) return;
    if (!computadorResolvido) {
      mostrarFeedbackFase2(
        "As travas do armário dependem dos sistemas elétricos. Ative a luz do laboratório primeiro!",
        false,
        null,
        "VOLTAR",
      );
      return;
    }
    if (
      posX > window.innerWidth * 0.63 &&
      posX < window.innerWidth * 0.77 &&
      posY < window.innerHeight * 0.32
    ) {
      juegoPausado = true;
      jogador.style.animationPlayState = "paused";

      mostrarFeedbackFase2(
        "SISTEMA DE SEGURANÇA:\n\nO painel numérico exige a resolução de agrupamentos contidos na ficha.",
        true,
        () => {
          abrirDesafioArmario();
        },
        "ACESSAR",
      );
    } else {
      mostrarFeedbackFase2(
        "O personagem está distante do armário. Aproxime-se.",
        false,
        null,
        "VOLTAR",
      );
    }
  };

  function abrirDesafioArmario() {
    const lousa = document.getElementById("lousa-enigma-fase2");
    lousa.style.left = window.innerWidth / 2 - 220 + "px";
    lousa.style.top = "120px";

    lousa.innerHTML = `
            <h3 style="color: #b71c1c; font-size: 12px; margin-bottom: 12px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 6px;">ANÁLISE DE CONJUNTOS</h3>
            <p style="color: #2b201c; font-size: 8px; line-height: 1.6; margin-bottom: 15px;">Decifre a intersecção contida na ficha cadastral para abrir o cofre:</p>
            <div style="color: #160e0b; font-size: 11px; text-align: left; background: #e2dac2; border: 2px solid #160e0b; padding: 15px; margin-bottom: 20px; line-height: 1.8; font-weight: bold; box-shadow: inset 0px 0px 6px rgba(0,0,0,0.1);">
                Conjunto A = {1, 2, 5, 8}<br>
                Conjunto B = {2, 5, 6, 9}<br><br>
                A chave de abertura são os elementos de (A ∩ B) digitados em ordem crescente.
            </div>
            <div style="margin-bottom: 20px; display: flex; justify-content: center; gap: 15px;">
                <input type="number" id="num1" placeholder="1º" style="font-family: 'Press Start 2P'; font-size: 14px; width: 80px; height: 40px; text-align: center; background: #fff; border: 3px solid #160e0b; color: #160e0b; box-shadow: 2px 2px 0px #160e0b;">
                <input type="number" id="num2" placeholder="2º" style="font-family: 'Press Start 2P'; font-size: 14px; width: 80px; height: 40px; text-align: center; background: #fff; border: 3px solid #160e0b; color: #160e0b; box-shadow: 2px 2px 0px #160e0b;">
            </div>
            <button class="btn-vintage" id="btn-abrir-armario" style="width: 200px; height: 45px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; font-weight: bold; box-shadow: 4px 4px 0px #b71c1c;">REGISTRAR</button>
        `;

    abrirPainel(lousa);

    document.getElementById("btn-abrir-armario").onclick = () => {
      if (
        document.getElementById("num1").value == 2 &&
        document.getElementById("num2").value == 5
      ) {
        fecharPainel(lousa, () => {
          armarioResolvido = true;
          window.senhaFase2 = [2, 5];
          const digestoEl = document.getElementById("digitos-fase2");
          digestoEl.innerText = "2 5";
          digestoEl.style.transition = "text-shadow 0.3s ease";
          digestoEl.style.textShadow = "0 0 12px #ffb700, 0 0 24px #ffb700";
          setTimeout(() => {
            digestoEl.style.textShadow = "1px 1px #000";
          }, 900);

          mostrarToast("Intersecção correta! Cofre aberto.", true);
          setTimeout(() => {
            mostrarFeedbackFase2(
              "DOCUMENTO COLETADO:\n\nO compartimento mecânico abriu! Você coletou dados secretos contendo mais duas senhas: 2 e 5. Pronto para avançar para a FASE 3!",
              true,
              () => {
                // Fade out antes de trocar de fase
                cenarioGeral.style.transition = "opacity 0.5s ease";
                cenarioGeral.style.opacity = "0";
                setTimeout(() => {
                  document.getElementById("container-fase2").remove();
                  cenarioGeral.style.opacity = "1";
                  if (typeof iniciarFase3 === "function") {
                    iniciarFase3();
                  }
                }, 500);
              },
            );
          }, 600);
        });
      } else {
        lousa.style.animation = "none";
        void lousa.offsetWidth;
        lousa.style.animation = "shakeX 0.4s ease";
        mostrarToast("Código inválido. Verifique a intersecção.", false);
      }
    };
  }
}
