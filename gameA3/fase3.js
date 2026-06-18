// fase3.js

function iniciarFase3() {
  console.log("Fase 3: O Templo Subterrâneo Iniciada!");

  // ==========================================================================
  // 1. CONFIGURAÇÕES INICIAIS E ESTRUTURA DO AMBIENTE
  // ==========================================================================
  if (!window.senhaColetada) window.senhaColetada = ["4", "3"];
  if (!window.senhaFase2) window.senhaFase2 = ["2", "5"];
  if (!window.senhaFase3) window.senhaFase3 = ["_", "_"];

  const cenarioGeral = document.querySelector(".cenario-cidade");
  cenarioGeral.style.backgroundImage = "url('fase3.png')";
  cenarioGeral.style.backgroundSize = "100% 100%";

  const containerFase3 = document.createElement("div");
  containerFase3.id = "container-fase3";
  containerFase3.style.width = "100vw";
  containerFase3.style.height = "100vh";
  containerFase3.style.position = "relative";

  containerFase3.innerHTML = `
        <div id="hud-lateral-fase3" style="
            position: absolute; top: 25px; left: 25px; z-index: 110; 
            display: flex; flex-direction: column; gap: 12px; width: 280px; 
            font-family: 'Press Start 2P', monospace;
            animation: slideInLeft 400ms cubic-bezier(.22,.61,.36,1) both;
        ">
            <div style="background: #f4eedb; border: 3px solid #160e0b; padding: 15px; box-shadow: 4px 4px 0px #160e0b;">
                <h4 style="color: #160e0b; font-size: 9px; margin-bottom: 8px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 4px;">RELEVANTE:</h4>
                <p id="texto-missao-fase3" style="color: #2b201c; font-size: 7px; line-height: 1.6; margin: 0;">
                    CARREGANDO DADOS...
                </p>
            </div>
            <div style="background: #f4eedb; border: 3px solid #160e0b; box-shadow: 4px 4px 0px #160e0b; padding: 12px; font-size: 8px; color: #160e0b; display: flex; flex-direction: column; gap: 10px;">
                <div style="font-weight: bold; border-bottom: 1px solid #160e0b; padding-bottom: 4px; text-align: center;">ARQUIVO DE CHAVES</div>
                <div>CHAVE FASE 1: <span style="color: #b71c1c; font-weight: bold;">4 3</span></div>
                <div>CHAVE FASE 2: <span style="color: #e65100; font-weight: bold;">2 5</span></div>
                <div>CHAVE FASE 3: <span id="digitos-fase3" style="color: #ffb700; font-weight: bold; text-shadow: 1px 1px #000;">_ _</span></div>
            </div>
        </div>

        <div id="click-escada" style="position: absolute; top: 72%; left: 43%; width: 130px; height: 110px; z-index: 95; cursor: pointer;"></div>
        <div id="click-computador-templo" style="display: none; position: absolute; top: 35%; left: 40%; width: 200px; height: 130px; z-index: 95; cursor: pointer; background: rgba(0,0,0,0);"></div>
        <div id="click-porta-final" style="display: none; position: absolute; top: 20%; left: 80%; width: 110px; height: 160px; z-index: 95; cursor: pointer;"></div>

        <div id="jogador-fase3" style="
            display: block; width: 110px !important; height: 140px !important; position: absolute; z-index: 90;
            image-rendering: pixelated; background-size: contain !important; background-repeat: no-repeat !important; 
            background-position: center bottom !important; animation-play-state: paused; 
        "></div>

        <div id="lousa-enigma-fase3" style="display: none; position: absolute; z-index: 120; background-color: #f4eedb; border: 5px double #160e0b; padding: 35px; text-align: center; box-shadow: 0px 10px 0px #160e0b; font-family: 'Press Start 2P'; color: #160e0b; width: 440px; max-width: 85vw;"></div>
        <div id="pop-feedback-fase3" style="
            display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #f4eedb; border: 5px solid #160e0b; box-shadow: 0px 8px 0px #160e0b;
            padding: 30px; width: 520px; max-width: 90vw; z-index: 150; text-align: center; font-family: 'Press Start 2P', monospace;
        ">
            <p id="msg-feedback-fase3" style="font-size: 10px; line-height: 2; margin-bottom: 25px; white-space: pre-line; text-align: center; color: #160e0b;"></p>
            <button class="btn-vintage" id="btn-ok-feedback-fase3" style="width: 140px; height: 40px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; cursor: pointer; box-shadow: 4px 4px 0px #b71c1c;">AVANÇAR</button>
        </div>
    `;

  cenarioGeral.appendChild(containerFase3);

  const jogador = document.getElementById("jogador-fase3");
  if (window.personagemSelecionado) {
    jogador.style.backgroundImage =
      "url('" + window.personagemSelecionado + "')";
  }

  let juegoPausado = true;

  // ==========================================================================
  // 2. SISTEMAS DE TEXTO E NOTIFICAÇÕES
  // ==========================================================================
  function rodarIntroducaoUnificada() {
    const textoCompleto =
      "CRÔNICA DA CIDADE PERDIDA:\n\nA busca nos levou ao coração das ruínas esquecidas.\n\nRelatos antigos afirmam que o templo sagrado guarda a última parte da Chave do Tesouro.\n\nEncontre a entrada subterrânea oculta no mapa urbano para descer.";
    const pop = document.getElementById("pop-feedback-fase3");
    const msg = document.getElementById("msg-feedback-fase3");
    const btn = document.getElementById("btn-ok-feedback-fase3");

    msg.style.color = "#160e0b";
    btn.innerText = "INICIAR";
    _mostrarPopComAnimacao(pop);

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
      _fecharPopComAnimacao(pop, () => {
        juegoPausado = false;
        document.getElementById("texto-missao-fase3").innerText =
          "MISSÃO ATIVA:\nCaminhe até o túnel subterrâneo no centro da rua para investigar.";
      });
    };
  }
  setTimeout(rodarIntroducaoUnificada, 300);

  // Helpers de animação para pop
  function _mostrarPopComAnimacao(pop) {
    pop.style.animation = "none";
    pop.style.display = "block";
    requestAnimationFrame(() => {
      pop.style.animation =
        "popIn var(--t-med, 280ms) var(--ease-spring, cubic-bezier(.34,1.56,.64,1)) both";
    });
  }

  function _fecharPopComAnimacao(pop, callback) {
    pop.style.transition = "opacity 180ms ease, transform 180ms ease";
    pop.style.opacity = "0";
    pop.style.transform = "translate(-50%, -50%) scale(0.94)";
    setTimeout(() => {
      pop.style.display = "none";
      pop.style.opacity = "";
      pop.style.transform = "";
      pop.style.transition = "";
      if (callback) callback();
    }, 190);
  }

  function _mostrarLousaComAnimacao(lousa) {
    lousa.style.animation = "none";
    lousa.style.display = "block";
    requestAnimationFrame(() => {
      lousa.style.animation =
        "modalIn var(--t-med, 280ms) var(--ease-spring, cubic-bezier(.34,1.56,.64,1)) both";
    });
  }

  function _fecharLousaComAnimacao(lousa, callback) {
    lousa.style.transition = "opacity 160ms ease, transform 160ms ease";
    lousa.style.opacity = "0";
    lousa.style.transform = "translateY(-10px) scale(0.96)";
    setTimeout(() => {
      lousa.style.display = "none";
      lousa.style.opacity = "";
      lousa.style.transform = "";
      lousa.style.transition = "";
      if (callback) callback();
    }, 170);
  }

  function mostrarFeedbackFase3(
    texto,
    sucesso,
    aoFechar,
    textoBotao = "AVANÇAR",
  ) {
    const pop = document.getElementById("pop-feedback-fase3");
    const msg = document.getElementById("msg-feedback-fase3");
    const btn = document.getElementById("btn-ok-feedback-fase3");

    // Feedback visual: borda colorida por resultado
    if (sucesso) {
      pop.style.borderColor = "#2e7d32";
      pop.style.boxShadow = "0px 8px 0px #2e7d32";
      btn.style.boxShadow = "4px 4px 0px #2e7d32";
    } else if (sucesso === false) {
      pop.style.borderColor = "#b71c1c";
      pop.style.boxShadow = "0px 8px 0px #b71c1c";
      btn.style.boxShadow = "4px 4px 0px #b71c1c";
    } else {
      pop.style.borderColor = "#160e0b";
      pop.style.boxShadow = "0px 8px 0px #160e0b";
      btn.style.boxShadow = "4px 4px 0px #b71c1c";
    }

    msg.style.color = "#160e0b";
    msg.innerText = texto;
    btn.innerText = textoBotao;

    _mostrarPopComAnimacao(pop);

    btn.onclick = () => {
      // Reset estilo após fechar
      _fecharPopComAnimacao(pop, () => {
        pop.style.borderColor = "#160e0b";
        pop.style.boxShadow = "0px 8px 0px #160e0b";
        btn.style.boxShadow = "4px 4px 0px #b71c1c";
        if (aoFechar) aoFechar();
      });
    };
  }

  // ==========================================================================
  // 3. CONTROLE DE MOVIMENTAÇÃO DO JOGADOR
  // ==========================================================================
  let posX = window.innerWidth * 0.08;
  let posY = window.innerHeight * 0.66;
  const velocidad = 15;
  let teclas = {};

  jogador.style.left = posX + "px";
  jogador.style.top = posY + "px";
  jogador.style.transform = "scaleX(1)";

  window.addEventListener("keydown", (e) => {
    if (juegoPausado) return;
    teclas[e.key.toLowerCase()] = true;
    let andou = false;
    if (teclas["a"] || teclas["arrowleft"]) {
      posX -= velocidad;
      jogador.style.transform = "scaleX(-1)";
      andou = true;
    }
    if (teclas["d"] || teclas["arrowright"]) {
      posX += velocidad;
      jogador.style.transform = "scaleX(1)";
      andou = true;
    }
    if (teclas["w"] || teclas["arrowup"]) {
      if (posY > window.innerHeight * 0.1) {
        posY -= velocidad;
        andou = true;
      }
    }
    if (teclas["s"] || teclas["arrowdown"]) {
      if (posY < window.innerHeight - 140) {
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
  // 4. EVENTOS DA PARTE DA PORTA
  // ==========================================================================
  document.getElementById("click-escada").onclick = () => {
    if (juegoPausado) return;
    if (
      posX > window.innerWidth * 0.32 &&
      posX < window.innerWidth * 0.58 &&
      posY > window.innerHeight * 0.5
    ) {
      juegoPausado = true;
      jogador.style.animationPlayState = "paused";
      irParaPortaDoTemplo();
    } else {
      mostrarFeedbackFase3(
        "O bueiro de acesso ao túnel está no centro da pista. Aproxime-se dele!",
        false,
      );
    }
  };

  function irParaPortaDoTemplo() {
    cenarioGeral.style.backgroundImage = "url('porta.png')";
    jogador.style.display = "none";
    document.getElementById("click-escada").style.display = "none";
    document.getElementById("hud-lateral-fase3").style.display = "none";

    mostrarFeedbackFase3(
      "O portal milenar barra o seu avanço.\n\nResolva o enigma para abrir a porta e estar mais perto do seu tesouro...",
      null,
      () => {
        abrirPuzzleLog();
      },
    );
  }

  function abrirPuzzleLog() {
    const lousa = document.getElementById("lousa-enigma-fase3");
    lousa.style.left = window.innerWidth / 2 - 220 + "px";
    lousa.style.top = "140px";

    lousa.innerHTML = `
            <h3 style="color: #b71c1c; font-size: 13px; margin-bottom: 12px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 6px;">CADERNO DE ENIGMAS</h3>
            <p style="color: #2b201c; font-size: 8px; line-height: 1.6; margin-bottom: 20px;">Calcule os logaritmos abaixo para decifrar o código da fechadura:</p>
            <div style="color: #160e0b; font-size: 16px; background: #e2dac2; border: 2px solid #160e0b; padding: 20px; margin-bottom: 25px; line-height: 2; font-weight: bold; box-shadow: inset 0px 0px 8px rgba(0,0,0,0.1);">
                log₂ (64) = X <br> log₃ (81) = Y
            </div>
            <div style="margin-bottom: 25px; display: flex; justify-content: center; gap: 15px;">
                <input type="number" id="logX" placeholder="X" style="font-family: 'Press Start 2P'; font-size: 14px; width: 85px; height: 40px; text-align: center; background: #fff; border: 3px solid #160e0b; color: #160e0b; box-shadow: 2px 2px 0px #160e0b;">
                <input type="number" id="logY" placeholder="Y" style="font-family: 'Press Start 2P'; font-size: 14px; width: 85px; height: 40px; text-align: center; background: #fff; border: 3px solid #160e0b; color: #160e0b; box-shadow: 2px 2px 0px #160e0b;">
            </div>
            <button class="btn-vintage" id="btn-abrir-templo" style="width: 220px; height: 45px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; font-weight: bold; cursor: pointer; box-shadow: 4px 4px 0px #b71c1c;">DESBLOQUEAR</button>
        `;

    _mostrarLousaComAnimacao(lousa);

    document.getElementById("btn-abrir-templo").onclick = () => {
      if (
        document.getElementById("logX").value == 6 &&
        document.getElementById("logY").value == 4
      ) {
        // Feedback visual de acerto antes de fechar
        lousa.style.borderColor = "#2e7d32";
        lousa.style.boxShadow = "0px 10px 0px #2e7d32";

        window.senhaFase3 = [6, 4];

        document.getElementById("hud-lateral-fase3").style.display = "flex";
        document.getElementById("digitos-fase3").innerText = "6 4";
        // Destaque animado no dígito revelado
        const digitos = document.getElementById("digitos-fase3");
        digitos.style.transition = "color 300ms ease, text-shadow 300ms ease";
        digitos.style.color = "#ffb700";
        digitos.style.textShadow = "0 0 8px rgba(255,183,0,0.8), 1px 1px #000";

        _fecharLousaComAnimacao(lousa, () => {
          lousa.style.borderColor = "";
          lousa.style.boxShadow = "";
          mostrarFeedbackFase3(
            "✓ Sinal mecânico detectado!\nO selo foi quebrado e os portões do santuário recuaram.",
            true,
            () => {
              entrarNoTemplo();
            },
          );
        });
      } else {
        // Feedback visual de erro: tremor na lousa
        lousa.style.animation = "none";
        lousa.style.borderColor = "#b71c1c";
        lousa.style.boxShadow = "0px 10px 0px #b71c1c";
        lousa.style.transition = "transform 80ms ease";
        const sacudidas = ["-6px", "6px", "-5px", "5px", "-3px", "0px"];
        let idx = 0;
        function sacudir() {
          if (idx < sacudidas.length) {
            lousa.style.transform = `translateX(${sacudidas[idx]})`;
            idx++;
            setTimeout(sacudir, 70);
          } else {
            lousa.style.transform = "";
            lousa.style.transition = "";
            setTimeout(() => {
              lousa.style.borderColor = "#160e0b";
              lousa.style.boxShadow = "0px 10px 0px #160e0b";
            }, 400);
          }
        }
        sacudir();
        mostrarFeedbackFase3(
          "✗ Nenhum efeito gerado. Os cálculos parecem incorretos.",
          false,
        );
      }
    };
  }

  // ==========================================================================
  // 5. EVENTOS DA PARTE INTERNA DO TEMPLO (COMPUTADOR E MATRIZES)
  // ==========================================================================
  let computadorTemploResolvido = false;

  function entrarNoTemplo() {
    cenarioGeral.style.backgroundImage = "url('templo.png')";
    jogador.style.display = "block";

    posX = window.innerWidth * 0.2;
    posY = window.innerHeight * 0.55;
    jogador.style.left = posX + "px";
    jogador.style.top = posY + "px";
    jogador.style.transform = "scaleX(1)";

    document.getElementById("click-computador-templo").style.display = "block";
    document.getElementById("texto-missao-fase3").innerText =
      "MISSÃO ATIVA:\nLeve o personagem até o painel do computador central do templo e clique nele.";
    juegoPausado = false;
  }

  document.getElementById("click-computador-templo").onclick = () => {
    if (juegoPausado || computadorTemploResolvido) return;

    if (
      posX > window.innerWidth * 0.3 &&
      posX < window.innerWidth * 0.65 &&
      posY < window.innerHeight * 0.7
    ) {
      juegoPausado = true;
      jogador.style.animationPlayState = "paused";
      abrirPuzzleMatriz();
    } else {
      mostrarFeedbackFase3(
        "O personagem está distante do terminal do templo. Aproxime-se!",
        false,
      );
    }
  };

  function abrirPuzzleMatriz() {
    const lousa = document.getElementById("lousa-enigma-fase3");
    lousa.style.left = window.innerWidth / 2 - 220 + "px";
    lousa.style.top = "110px";

    lousa.innerHTML = `
            <h3 style="color: #b71c1c; font-size: 12px; margin-bottom: 12px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 6px;">TERMINAL DE SEGURANÇA</h3>
            <p style="color: #2b201c; font-size: 8px; line-height: 1.5; margin-bottom: 18px;">Calcule o determinante da matriz identidade contida na memória:</p>
            <div style="color: #160e0b; font-size: 16px; background: #e2dac2; border: 2px solid #160e0b; padding: 15px; margin-bottom: 20px; display: inline-block; font-weight: bold; box-shadow: inset 0px 0px 6px rgba(0,0,0,0.1);">
                | 1   0 |<br>
                | 0   1 |
            </div>
            <p style="color: #2b201c; font-size: 8px; margin-bottom: 12px; font-weight: bold;">Informe o determinante resultante:</p>
            <input type="number" id="detInput" style="font-family: 'Press Start 2P'; font-size: 14px; width: 110px; height: 40px; text-align: center; margin-bottom: 20px; background: #fff; border: 3px solid #160e0b; color: #160e0b; box-shadow: 2px 2px 0px #160e0b;"><br>
            <button class="btn-vintage" id="btn-matriz" style="width: 180px; height: 45px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; font-weight: bold; cursor: pointer; box-shadow: 4px 4px 0px #b71c1c;">TRANSMITIR</button>
        `;

    _mostrarLousaComAnimacao(lousa);

    document.getElementById("btn-matriz").onclick = () => {
      if (document.getElementById("detInput").value == 1) {
        lousa.style.borderColor = "#2e7d32";
        lousa.style.boxShadow = "0px 10px 0px #2e7d32";

        _fecharLousaComAnimacao(lousa, () => {
          lousa.style.borderColor = "";
          lousa.style.boxShadow = "";
          computadorTemploResolvido = true;
          document.getElementById("click-computador-templo").style.display =
            "none";
          document.getElementById("click-porta-final").style.display = "block";

          mostrarFeedbackFase3(
            "✓ Sinal aceito pela central!\nMecanismos hidráulicos ativados na ala leste do templo.",
            true,
            () => {
              document.getElementById("texto-missao-fase3").innerText =
                "MISSÃO ATIVA:\nO terminal liberou o acesso final! Siga até a porta secreta no canto superior direito.";
              juegoPausado = false;
            },
          );
        });
      } else {
        // Tremor no input errado
        const inp = document.getElementById("detInput");
        inp.style.borderColor = "#b71c1c";
        inp.style.boxShadow = "0 0 0 3px rgba(183,28,28,.3), 2px 2px 0 #b71c1c";

        lousa.style.transition = "transform 80ms ease";
        const sacudidas = ["-5px", "5px", "-4px", "4px", "-2px", "0px"];
        let idx = 0;
        function sacudir() {
          if (idx < sacudidas.length) {
            lousa.style.transform = `translateX(${sacudidas[idx]})`;
            idx++;
            setTimeout(sacudir, 70);
          } else {
            lousa.style.transform = "";
            lousa.style.transition = "";
            setTimeout(() => {
              inp.style.borderColor = "#160e0b";
              inp.style.boxShadow = "2px 2px 0px #160e0b";
            }, 500);
          }
        }
        sacudir();
        mostrarFeedbackFase3(
          "✗ Determinante incorreto. Os buffers rejeitaram o sinal enviado.",
          false,
        );
      }
    };
  }

  // ==========================================================================
  // 6. VALIDAÇÃO CRIPTOGRÁFICA DO JOGO
  // ==========================================================================
  document.getElementById("click-porta-final").onclick = () => {
    if (juegoPausado) return;
    if (posX > window.innerWidth * 0.7 && posY < window.innerHeight * 0.6) {
      juegoPausado = true;
      jogador.style.animationPlayState = "paused";
      abrirCofreFinal();
    } else {
      mostrarFeedbackFase3(
        "Direcione o personagem até a saída secreta localizada no canto para desbloquear o tesouro!",
        false,
      );
    }
  };

  function abrirCofreFinal() {
    const lousa = document.getElementById("lousa-enigma-fase3");
    lousa.style.left = window.innerWidth / 2 - 220 + "px";
    lousa.style.top = "150px";

    lousa.innerHTML = `
            <h3 style="color: #b71c1c; font-size: 12px; margin-bottom: 12px; font-weight: bold; border-bottom: 2px dashed #160e0b; padding-bottom: 6px;">PAINEL CRIPTOGRÁFICO</h3>
            <p style="color: #2b201c; font-size: 8px; line-height: 1.6; margin-bottom: 15px;">Digite a sequência histórica de 6 dígitos obtida durante a exploração científica:</p>
            <input type="text" id="senhaFinalInput" maxlength="6" placeholder="******" style="font-family: 'Press Start 2P'; font-size: 16px; width: 180px; text-align: center; letter-spacing: 5px; margin-bottom: 20px; padding: 5px; background: #fff; border: 3px solid #160e0b; color: #160e0b; box-shadow: 2px 2px 0px #160e0b;"><br>
            <button class="btn-vintage" id="btn-concluir-tudo" style="width: 220px; height: 45px; font-size: 10px; background: #160e0b; color: #f4eedb; border: none; font-weight: bold; cursor: pointer; box-shadow: 4px 4px 0px #b71c1c;">DESBLOQUEAR COFRE</button>
        `;

    _mostrarLousaComAnimacao(lousa);

    document.getElementById("btn-concluir-tudo").onclick = () => {
      if (document.getElementById("senhaFinalInput").value === "432564") {
        // Feedback visual de acerto final antes de transitar
        lousa.style.borderColor = "#ffb700";
        lousa.style.boxShadow = "0px 10px 0px #c98a00";

        _fecharLousaComAnimacao(lousa, () => {
          lousa.style.borderColor = "";
          lousa.style.boxShadow = "";
          containerFase3.remove();
          cenarioGeral.style.backgroundImage = "url('fase1.png')";
          mostrarTelaVitoria(cenarioGeral);
        });
      } else {
        const inp = document.getElementById("senhaFinalInput");
        inp.style.borderColor = "#b71c1c";
        inp.style.boxShadow = "0 0 0 3px rgba(183,28,28,.3), 2px 2px 0 #b71c1c";

        lousa.style.transition = "transform 80ms ease";
        const sacudidas = ["-6px", "6px", "-5px", "5px", "-3px", "0px"];
        let idx = 0;
        function sacudir() {
          if (idx < sacudidas.length) {
            lousa.style.transform = `translateX(${sacudidas[idx]})`;
            idx++;
            setTimeout(sacudir, 70);
          } else {
            lousa.style.transform = "";
            lousa.style.transition = "";
            setTimeout(() => {
              inp.style.borderColor = "#160e0b";
              inp.style.boxShadow = "2px 2px 0px #160e0b";
            }, 500);
          }
        }
        sacudir();
        mostrarFeedbackFase3(
          "✗ Senha inválida. Os trincos permanecem estáticos. Verifique seu arquivo de notas na HUD!",
          false,
        );
      }
    };
  }

  // ==========================================================================
  // 7. TELA FINAL DE VITÓRIA
  // ==========================================================================
  function mostrarTelaVitoria(cenario) {
    // Confetti
    _criarConfetti(cenario);

    const painelVitoria = document.createElement("div");
    painelVitoria.className = "painel-vitoria";
    painelVitoria.style.cssText = `
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #f4eedb;
            border: 6px double #ffb700;
            box-shadow: 0px 14px 0px #c98a00, 0 0 60px rgba(255,183,0,0.25);
            padding: 50px 44px;
            width: 560px; max-width: 92vw;
            z-index: 200; text-align: center;
            font-family: 'Press Start 2P', monospace;
            color: #160e0b;
        `;

    painelVitoria.innerHTML = `
            <div class="vitoria-trofeu" style="font-size: 52px; margin-bottom: 18px; display: block;">🏆</div>
            <h2 style="
                color: #b71c1c;
                font-size: 14px;
                margin-bottom: 10px;
                font-weight: bold;
                letter-spacing: 1px;
                line-height: 1.6;
            ">🎉 PARABÉNS! 🎉</h2>
            <div style="
                border-top: 2px dashed #c98a00;
                border-bottom: 2px dashed #c98a00;
                margin: 18px 0 22px;
                padding: 18px 0;
            ">
                <p style="
                    font-size: 8px;
                    line-height: 2.2;
                    color: #2b201c;
                    margin: 0;
                ">Você encontrou o tesouro e concluiu<br>a aventura com sucesso.</p>
            </div>
            <p style="
                font-size: 7px;
                color: #c98a00;
                margin-bottom: 32px;
                letter-spacing: 1px;
            ">Obrigado por jogar.</p>
            <button id="btn-reiniciar-tudo" style="
                font-family: 'Press Start 2P', monospace;
                font-size: 9px;
                font-weight: bold;
                background: #160e0b;
                color: #f4eedb;
                border: none;
                width: 220px;
                height: 48px;
                cursor: pointer;
                box-shadow: 4px 4px 0px #c98a00;
                letter-spacing: 1px;
                transition: transform 150ms ease, box-shadow 150ms ease, background 150ms ease;
            ">JOGAR NOVAMENTE</button>
        `;

    cenario.appendChild(painelVitoria);

    // Microinterações no botão final
    const btnReiniciar = document.getElementById("btn-reiniciar-tudo");

    btnReiniciar.addEventListener("mouseenter", () => {
      btnReiniciar.style.background = "#2b201c";
      btnReiniciar.style.transform = "translateY(-2px)";
      btnReiniciar.style.boxShadow = "4px 6px 0px #c98a00";
    });
    btnReiniciar.addEventListener("mouseleave", () => {
      btnReiniciar.style.background = "#160e0b";
      btnReiniciar.style.transform = "";
      btnReiniciar.style.boxShadow = "4px 4px 0px #c98a00";
    });
    btnReiniciar.addEventListener("mousedown", () => {
      btnReiniciar.style.transform = "translateY(2px)";
      btnReiniciar.style.boxShadow = "2px 2px 0px #c98a00";
    });
    btnReiniciar.addEventListener("mouseup", () => {
      btnReiniciar.style.transform = "translateY(-2px)";
      btnReiniciar.style.boxShadow = "4px 6px 0px #c98a00";
    });

    btnReiniciar.onclick = () => {
      location.reload();
    };
  }

  function _criarConfetti(cenario) {
    const cores = [
      "#ffb700",
      "#b71c1c",
      "#2e7d32",
      "#1565c0",
      "#f4eedb",
      "#ff8800",
    ];
    for (let i = 0; i < 38; i++) {
      const p = document.createElement("div");
      const cor = cores[Math.floor(Math.random() * cores.length)];
      const tamanho = 7 + Math.random() * 9;
      const x = Math.random() * 100;
      const atraso = Math.random() * 2.2;
      const duracao = 2.4 + Math.random() * 2;
      p.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: -20px;
                width: ${tamanho}px;
                height: ${tamanho}px;
                background: ${cor};
                opacity: 0.88;
                z-index: 199;
                pointer-events: none;
                border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
                animation: confettiDrop ${duracao}s ease-in ${atraso}s both;
            `;
      cenario.appendChild(p);
    }
  }
}
