// fase1.js

function iniciarFase1() {
  const menuContainer = document.querySelector(".menu-container");
  if (menuContainer) menuContainer.remove();

  const cenarioGeral = document.querySelector(".cenario-cidade");
  cenarioGeral.style.backgroundImage = "url('fase1.png')";
  cenarioGeral.style.backgroundSize = "100% 100%";
  cenarioGeral.style.overflow = "hidden";
  cenarioGeral.style.display = "block";

  if (!window.senhaColetada) window.senhaColetada = ["_", "_"];
  salvarProgresso(1);

  const containerFase1 = document.createElement("div");
  containerFase1.id = "container-fase1";
  containerFase1.style.width = "100vw";
  containerFase1.style.height = "100vh";
  containerFase1.style.position = "relative";

  containerFase1.innerHTML = `
        <div id="hud-lateral-fase1" class="hud-lateral">
            <div class="hud-caixa">
                <h4>CASO EM ABERTO:</h4>
                <p id="texto-missao"></p>
            </div>
            <div class="hud-caixa hud-caixa-chaves">
                <div class="hud-caixa-chaves__titulo">ARQUIVO DE CHAVES</div>
                <div>CHAVE COLETADA: <span id="digitos-senha" class="hud-chave-valor">${window.senhaColetada.join(" ")}</span></div>
            </div>
        </div>

        <div id="click-escola-fachada" class="zona-interativa" style="top: 15%; left: 55%; width: 230px; height: 180px;"></div>
        <div id="click-telefone-cabine" class="zona-interativa" style="top: 70%; left: 75%; width: 90px; height: 150px;"></div>
        <div id="click-mesa-professora" class="zona-interativa" style="display: none; top: 33%; left: 40%; width: 200px; height: 130px;"></div>

        <div id="jogador" class="sprite-jogador" style="width: 80px !important; height: 100px !important;"></div>

        <div id="lousa-enigma" class="lousa-enigma"></div>

        <div id="pop-feedback" class="painel-flutuante">
            <p id="msg-feedback" class="painel-flutuante__mensagem"></p>
            <button class="btn-acao" id="btn-ok-feedback">AVANÇAR</button>
        </div>

        <div id="toast-fase1" class="toast-jogo"></div>
    `;

  cenarioGeral.appendChild(containerFase1);

  const jogador = document.getElementById("jogador");
  if (window.personagemSelecionado) {
    jogador.style.backgroundImage = "url('" + window.personagemSelecionado + "')";
  }

  tornarAcessivel(document.getElementById("click-telefone-cabine"), "Cabine telefônica");
  tornarAcessivel(document.getElementById("click-escola-fachada"), "Fachada da escola");
  tornarAcessivel(document.getElementById("click-mesa-professora"), "Mesa da professora");

  let jogoPausado = true;

  // --------------------------------------------------------------------
  // Introdução e mensagens narrativas
  // --------------------------------------------------------------------
  function rodarIntroducao() {
    const textoCompleto =
      "RELATÓRIO DE ARQUIVO URBANO:\n\nA cidade está completamente deserta, mas um som mecânico corta o silêncio das calçadas.\n\nUm antigo telefone público, esquecido na esquina, insiste em tocar.\n\nAproxime-se da cabine telefônica e atenda a ligação para coletar a primeira pista.";

    const pop = document.getElementById("pop-feedback");
    const msg = document.getElementById("msg-feedback");
    const btn = document.getElementById("btn-ok-feedback");

    btn.innerText = "INICIAR";
    abrirPainel(pop);
    btn.style.display = "none";
    digitarTexto(msg, textoCompleto, () => { btn.style.display = "inline-block"; });

    btn.onclick = () => {
      fecharPainel(pop, () => {
        jogoPausado = false;
        document.getElementById("texto-missao").innerText =
          "MISSÃO ATIVA:\nCaminhe até o orelhão azul na calçada e clique na cabine para atender.";
      });
    };
  }
  setTimeout(rodarIntroducao, 300);

  function mostrarMensagem(texto, ehSucesso, aoFechar, textoBotao = "AVANÇAR") {
    jogoPausado = true;
    mostrarFeedback("", texto, ehSucesso, () => {
      jogoPausado = false;
      if (aoFechar) aoFechar();
    }, textoBotao);
  }

  // --------------------------------------------------------------------
  // Movimentação do jogador
  // --------------------------------------------------------------------
  let posX = 40;
  let posY = window.innerHeight * 0.65;
  const velocidade = window.VELOCIDADE_JOGADOR;
  let teclas = {};

  jogador.style.left = posX + "px";
  jogador.style.top = posY + "px";

  function posicaoNormalizada() {
    return { x: posX / window.innerWidth, y: posY / window.innerHeight };
  }

  window.addEventListener("keydown", (e) => {
    if (jogoPausado) return;
    teclas[e.key.toLowerCase()] = true;
    let andou = false;

    if (teclas["a"] || teclas["arrowleft"]) { posX -= velocidade; jogador.style.transform = "scaleX(-1)"; andou = true; }
    if (teclas["d"] || teclas["arrowright"]) { posX += velocidade; jogador.style.transform = "scaleX(1)"; andou = true; }
    if (teclas["w"] || teclas["arrowup"]) { if (posY > window.innerHeight * 0.10) { posY -= velocidade; andou = true; } }
    if (teclas["s"] || teclas["arrowdown"]) { if (posY < window.innerHeight - 130) { posY += velocidade; andou = true; } }

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

  // --------------------------------------------------------------------
  // Etapa 1: telefone (equação do 2º grau)
  // --------------------------------------------------------------------
  const zonaTelefone = window.ZONAS_JOGO.fase1.telefoneCabine;
  const zonaEscola = window.ZONAS_JOGO.fase1.escolaFachada;
  const zonaMesa = window.ZONAS_JOGO.fase1.mesaProfessora;

  let missaoTelefoneConcluida = false;
  let naEscola = false;

  document.getElementById("click-telefone-cabine").onclick = () => {
    if (jogoPausado || missaoTelefoneConcluida) return;
    if (zonaTelefone.test(posicaoNormalizada())) {
      jogoPausado = true;
      jogador.style.animationPlayState = "paused";
      mostrarMensagem(
        "A linha está cheia de interferências de estática.\n\nUma voz sussurra no alto-falante:\n\"A resposta abrirá os portões da escola.\"",
        true,
        () => { abrirLousaTelefone(); },
        "AVANÇAR"
      );
    } else {
      mostrarMensagem("Você escuta os toques distantes do orelhão azul na calçada. Aproxime-se!", false);
    }
  };

  function abrirLousaTelefone() {
    const lousa = document.getElementById("lousa-enigma");
    lousa.style.left = (window.innerWidth / 2 - 220) + "px";
    lousa.style.top = "140px";

    lousa.innerHTML = `
            <h3 class="lousa-enigma__titulo">ARQUIVO DA INTERCEPTAÇÃO</h3>
            <p class="lousa-enigma__texto">Descubra a MAIOR raiz real (x) da equação interceptada por áudio:</p>
            <div class="lousa-enigma__formula">x² - 5x + 6 = 0</div>
            <p class="lousa-enigma__texto" style="font-weight: bold;">Informe a maior raiz:</p>
            <input type="number" id="resp-telefone" class="campo-resposta" aria-label="Resposta da maior raiz da equação"><br>
            <button class="btn-acao" id="btn-responder-telefone">AUTENTICAR</button>
            <button class="btn-dica-icone" type="button" aria-label="Pedir uma dica" aria-expanded="false">💡</button>
            <div class="painel-dica-lateral">
                <div class="painel-dica-lateral__cabecalho">
                    <span>DICAS</span>
                    <button class="painel-dica-lateral__fechar" type="button" aria-label="Fechar dicas">✕</button>
                </div>
                <button class="btn-dica" type="button"></button>
                <div class="area-dica"></div>
            </div>
        `;

    abrirPainel(lousa);

    const dicas = criarSistemaDicas(lousa, [
      "O Informante sussurra: \"Fatore a expressão. Procure dois números que, somados, dão 5, e multiplicados, dão 6.\"",
      "(x − 2)(x − 3) = 0. As raízes são 2 e 3. Qual delas é a maior?",
    ]);

    document.getElementById("btn-responder-telefone").onclick = () => {
      const resposta = validarRespostaNumerica("resp-telefone", 3);

      if (resposta.vazio) {
        mostrarToast("toast-fase1", "Digite uma resposta antes de continuar.", false);
        return;
      }

      if (resposta.valido) {
        fecharPainel(lousa, () => {
          window.senhaColetada[1] = "3";
          salvarProgresso(1);

          const digestoEl = document.getElementById("digitos-senha");
          digestoEl.innerText = window.senhaColetada.join(" ");
          digestoEl.classList.add("hud-chave-valor--revelada");
          setTimeout(() => digestoEl.classList.remove("hud-chave-valor--revelada"), 900);

          mostrarToast("toast-fase1", "Raiz correta! Linha descriptografada.", true);
          setTimeout(() => {
            mostrarMensagem("Linha descriptografada! O sinal remoto destrancou o portão principal da antiga escola.", true, () => {
              missaoTelefoneConcluida = true;
              document.getElementById("texto-missao").innerText =
                "MISSÃO ATIVA:\nO acesso à escola foi liberado. Caminhe até a entrada principal e clique na porta.";
            });
          }, 600);
        });
      } else {
        sacudirElemento(lousa);
        dicas.registrarErro();
        mostrarToast("toast-fase1", "Raiz incorreta. Verifique os cálculos.", false);
      }
    };
  }

  // --------------------------------------------------------------------
  // Etapa 2: escola (equação do 1º grau)
  // --------------------------------------------------------------------
  document.getElementById("click-escola-fachada").onclick = () => {
    if (jogoPausado || naEscola || !missaoTelefoneConcluida) {
      if (!missaoTelefoneConcluida) {
        document.getElementById("texto-missao").innerText =
          "BLOQUEADO:\nAs portas estão trancadas eletronicamente. Resolva o enigma do telefone primeiro.";
      }
      return;
    }
    if (zonaEscola.test(posicaoNormalizada())) {
      jogoPausado = true;
      jogador.style.animationPlayState = "paused";
      abrirEscola();
    } else {
      document.getElementById("texto-missao").innerText = "ERRO:\nVocê está muito distante da escola para inspecionar os portões.";
    }
  };

  function abrirEscola() {
    naEscola = true;
    cenarioGeral.style.transition = "opacity 0.4s ease";
    cenarioGeral.style.opacity = "0";
    setTimeout(() => {
      cenarioGeral.style.backgroundImage = "url('escola.png')";
      cenarioGeral.style.opacity = "1";
    }, 400);

    document.getElementById("click-mesa-professora").style.display = "block";
    document.getElementById("click-escola-fachada").style.display = "none";
    document.getElementById("click-telefone-cabine").style.display = "none";

    jogador.style.width = "120px";
    jogador.style.height = "150px";

    posX = window.innerWidth * 0.78;
    posY = window.innerHeight * 0.68;
    jogador.style.left = posX + "px";
    jogador.style.top = posY + "px";

    document.getElementById("texto-missao").innerText =
      "MISSÃO ATIVA:\nA sala de aula parece abandonada. Vá até a mesa da professora e resolva o desafio.";

    setTimeout(() => { jogoPausado = false; }, 600);
  }

  document.getElementById("click-mesa-professora").onclick = () => {
    if (jogoPausado || !naEscola) return;
    if (zonaMesa.test(posicaoNormalizada())) {
      jogoPausado = true;
      jogador.style.animationPlayState = "paused";
      abrirLousaEscola();
    } else {
      mostrarMensagem("O personagem está longe da mesa da professora! Aproxime-se.", false);
    }
  };

  function abrirLousaEscola() {
    const lousa = document.getElementById("lousa-enigma");
    lousa.style.left = (window.innerWidth / 2 - 220) + "px";
    lousa.style.top = "140px";

    lousa.innerHTML = `
            <h3 class="lousa-enigma__titulo">EXAME DE ADMISSÃO</h3>
            <p class="lousa-enigma__texto">Encontre o valor de X contido na lousa negra:</p>
            <div class="lousa-enigma__formula" style="font-size: 16px;">2x - 8 = 0</div>
            <p class="lousa-enigma__texto" style="font-weight: bold;">Informe a resposta:</p>
            <input type="number" id="resp-escola" class="campo-resposta" aria-label="Valor de X"><br>
            <button class="btn-acao" id="btn-responder-escola">REGISTRAR</button>
            <button class="btn-dica-icone" type="button" aria-label="Pedir uma dica" aria-expanded="false">💡</button>
            <div class="painel-dica-lateral">
                <div class="painel-dica-lateral__cabecalho">
                    <span>DICAS</span>
                    <button class="painel-dica-lateral__fechar" type="button" aria-label="Fechar dicas">✕</button>
                </div>
                <button class="btn-dica" type="button"></button>
                <div class="area-dica"></div>
            </div>
        `;

    abrirPainel(lousa);

    const dicas = criarSistemaDicas(lousa, [
      "Uma letra inclinada, a mesma do telefone, está riscada na margem do caderno: \"Isole o x — some 8 aos dois lados da equação.\"",
      "2x = 8 → x = 8 ÷ 2. Qual é o resultado?",
    ]);

    document.getElementById("btn-responder-escola").onclick = () => {
      const resposta = validarRespostaNumerica("resp-escola", 4);

      if (resposta.vazio) {
        mostrarToast("toast-fase1", "Digite uma resposta antes de continuar.", false);
        return;
      }

      if (resposta.valido) {
        fecharPainel(lousa, () => {
          window.senhaColetada[0] = "4";
          salvarProgresso(1);

          const digestoEl = document.getElementById("digitos-senha");
          digestoEl.innerText = window.senhaColetada.join(" ");
          digestoEl.classList.add("hud-chave-valor--revelada");
          setTimeout(() => digestoEl.classList.remove("hud-chave-valor--revelada"), 900);

          mostrarToast("toast-fase1", "Resposta correta! Fragmento coletado.", true);
          setTimeout(() => {
            mostrarMensagem("Dados processados com sucesso! Você obteve o fragmento final de acesso.\n\nPreparando transição rumo à FASE 2!", true, () => {
              naEscola = false;
              cenarioGeral.style.transition = "opacity 0.5s ease";
              cenarioGeral.style.opacity = "0";
              setTimeout(() => {
                document.getElementById("container-fase1").remove();
                cenarioGeral.style.opacity = "1";
                if (typeof iniciarFase2 === "function") iniciarFase2();
              }, 500);
            });
          }, 600);
        });
      } else {
        sacudirElemento(lousa);
        dicas.registrarErro();
        mostrarToast("toast-fase1", "Cálculo incorreto. Revise os passos algébricos.", false);
      }
    };
  }
}
