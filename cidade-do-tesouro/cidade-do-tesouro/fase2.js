// fase2.js

function iniciarFase2() {
  const menuContainer = document.querySelector(".menu-container");
  if (menuContainer) menuContainer.remove();

  if (!window.senhaColetada) window.senhaColetada = ["4", "3"];
  salvarProgresso(2);

  const containerAntigo = document.getElementById("container-fase1");
  if (containerAntigo) containerAntigo.remove();

  const cenarioGeral = document.querySelector(".cenario-cidade");
  cenarioGeral.style.backgroundImage = "url('laboratorioapagado.png')";
  cenarioGeral.style.backgroundSize = "100% 100%";
  cenarioGeral.style.overflow = "hidden";

  if (!window.senhaFase2) window.senhaFase2 = ["_", "_"];

  const containerFase2 = document.createElement("div");
  containerFase2.id = "container-fase2";
  containerFase2.style.width = "100vw";
  containerFase2.style.height = "100vh";
  containerFase2.style.position = "relative";

  containerFase2.innerHTML = `
        <div id="hud-lateral-fase2" class="hud-lateral">
            <div class="hud-caixa">
                <h4>DADOS COLETADOS:</h4>
                <p id="texto-missao-fase2">CARREGANDO DADOS...</p>
            </div>
            <div class="hud-caixa hud-caixa-chaves">
                <div class="hud-caixa-chaves__titulo">ARQUIVO DE CHAVES</div>
                <div>CHAVE FASE 1: <span class="hud-chave-valor" style="color: var(--crimson);">${window.senhaColetada.join(" ")}</span></div>
                <div>CHAVE FASE 2: <span id="digitos-fase2" class="hud-chave-valor">${window.senhaFase2.join(" ")}</span></div>
            </div>
        </div>

        <div id="click-computador" class="zona-interativa" style="top: 12%; left: 43%; width: 150px; height: 110px;"></div>
        <div id="click-armario" class="zona-interativa" style="top: 10%; left: 68%; width: 140px; height: 150px;"></div>

        <div id="jogador-fase2" class="sprite-jogador" style="width: 110px !important; height: 140px !important;"></div>

        <div id="lousa-enigma-fase2" class="lousa-enigma" style="width: 460px;"></div>

        <div id="pop-feedback-fase2" class="painel-flutuante">
            <p id="msg-feedback-fase2" class="painel-flutuante__mensagem"></p>
            <button class="btn-acao" id="btn-ok-feedback-fase2">AVANÇAR</button>
        </div>

        <div id="toast-fase2" class="toast-jogo"></div>
    `;

  cenarioGeral.appendChild(containerFase2);

  const jogador = document.getElementById("jogador-fase2");
  if (window.personagemSelecionado) {
    jogador.style.backgroundImage = "url('" + window.personagemSelecionado + "')";
  }

  tornarAcessivel(document.getElementById("click-computador"), "Computador do laboratório");
  tornarAcessivel(document.getElementById("click-armario"), "Cofre trancado com cadeado");

  let jogoPausado = true;

  // --------------------------------------------------------------------
  // Introdução e mensagens narrativas
  // --------------------------------------------------------------------
  function rodarIntroducao() {
    const textoCompleto =
      "REGISTRO DE EXPERIMENTO SUBTERRÂNEO:\n\nAo solucionar o problema na mesa da professora, uma passagem secreta se abriu sob os tablados do piso.\n\nOs degraus levam a um antigo laboratório escondido nos porões da escola. Está tudo escuro e sem energia.\n\nLocalize o computador ao fundo da sala para restabelecer os geradores de luz.";

    const pop = document.getElementById("pop-feedback-fase2");
    const msg = document.getElementById("msg-feedback-fase2");
    const btn = document.getElementById("btn-ok-feedback-fase2");

    btn.innerText = "INVESTIGAR";
    abrirPainel(pop);
    btn.style.display = "none";
    digitarTexto(msg, textoCompleto, () => { btn.style.display = "inline-block"; });

    btn.onclick = () => {
      fecharPainel(pop, () => {
        jogoPausado = false;
        document.getElementById("texto-missao-fase2").innerText =
          "MISSÃO ATIVA:\nEnergia do laboratório desligada. Aproxime-se do computador central no fundo da sala para religar a luz.";
      });
    };
  }
  setTimeout(rodarIntroducao, 100);

  function mostrarMensagem(texto, sucesso, aoFechar, textoBotao = "AVANÇAR") {
    jogoPausado = true;
    mostrarFeedback("-fase2", texto, sucesso, () => {
      jogoPausado = false;
      if (aoFechar) aoFechar();
    }, textoBotao);
  }

  // --------------------------------------------------------------------
  // Movimentação do jogador
  // --------------------------------------------------------------------
  let posX = window.innerWidth * 0.81;
  let posY = window.innerHeight * 0.36;
  const velocidade = window.VELOCIDADE_JOGADOR;
  let teclas = {};

  jogador.style.left = posX + "px";
  jogador.style.top = posY + "px";
  jogador.style.transform = "scaleX(-1)";

  let computadorResolvido = false;
  let armarioResolvido = false;

  function posicaoNormalizada() {
    return { x: posX / window.innerWidth, y: posY / window.innerHeight };
  }

  window.addEventListener("keydown", (e) => {
    if (jogoPausado) return;
    teclas[e.key.toLowerCase()] = true;
    let andou = false;

    if (teclas["a"] || teclas["arrowleft"]) {
      if (posX > window.innerWidth * 0.12) { posX -= velocidade; jogador.style.transform = "scaleX(-1)"; andou = true; }
    }
    if (teclas["d"] || teclas["arrowright"]) {
      if (posX < window.innerWidth * 0.85) { posX += velocidade; jogador.style.transform = "scaleX(1)"; andou = true; }
    }
    if (teclas["w"] || teclas["arrowup"]) {
      if (posY > window.innerHeight * 0.22) { posY -= velocidade; andou = true; }
    }
    if (teclas["s"] || teclas["arrowdown"]) {
      if (posY < window.innerHeight - 180) { posY += velocidade; andou = true; }
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

  // --------------------------------------------------------------------
  // Etapa 1: computador (lógica proposicional)
  // --------------------------------------------------------------------
  const zonaComputador = window.ZONAS_JOGO.fase2.computador;
  const zonaArmario = window.ZONAS_JOGO.fase2.armario;

  document.getElementById("click-computador").onclick = () => {
    if (jogoPausado || computadorResolvido) return;
    if (zonaComputador.test(posicaoNormalizada())) {
      jogoPausado = true;
      jogador.style.animationPlayState = "paused";
      mostrarMensagem(
        "CONEXÃO ESTABELECIDA:\n\nOs coolers antigos do laboratório começaram a girar... Analise as diretrizes do monitor.",
        true,
        () => { abrirDesafioComputador(); },
        "CONECTAR"
      );
    } else {
      mostrarMensagem("Você está distante do computador do laboratório. Caminhe até ele.", false, null, "VOLTAR");
    }
  };

  function abrirDesafioComputador() {
    const lousa = document.getElementById("lousa-enigma-fase2");
    lousa.style.left = window.innerWidth / 2 - 230 + "px";
    lousa.style.top = "90px";

    lousa.innerHTML = `
            <h3 class="lousa-enigma__titulo" style="font-size: 11px;">TABELA VERDADE CENTRAL</h3>
            <p class="lousa-enigma__texto" style="font-size: 7px;">Descubra o resultado lógico para a instrução: P ∧ ¬Q</p>

            <table class="tabela-logica">
                <thead>
                    <tr>
                        <th>P</th>
                        <th>Q</th>
                        <th>¬Q</th>
                        <th class="tabela-logica__coluna-alvo">P ∧ ¬Q</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>V</td><td>V</td><td>F</td><td class="tabela-logica__resultado">F</td></tr>
                    <tr class="tabela-logica__linha-alvo"><td>V</td><td>F</td><td>V</td><td class="tabela-logica__incognita">?</td></tr>
                    <tr><td>F</td><td>V</td><td>F</td><td class="tabela-logica__resultado">F</td></tr>
                    <tr><td>F</td><td>F</td><td>V</td><td class="tabela-logica__resultado">F</td></tr>
                </tbody>
            </table>

            <p class="lousa-enigma__pergunta">Se P é V e Q é F, qual o valor na linha marcada?</p>
            <div class="lousa-enigma__opcoes">
                <button class="btn-acao" id="btn-v">(V) VERDADE</button>
                <button class="btn-acao" id="btn-f">(F) FALSO</button>
            </div>
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
      "Um post-it colado no monitor, com a mesma letra de antes: \"Lembre-se: ¬Q inverte o valor de Q.\"",
      "Se Q é Falso, ¬Q é Verdadeiro. E \"Verdadeiro ∧ Verdadeiro\" é sempre Verdadeiro.",
    ]);

    document.getElementById("btn-v").onclick = () => {
      fecharPainel(lousa, () => {
        computadorResolvido = true;
        cenarioGeral.style.transition = "opacity 0.5s ease";
        cenarioGeral.style.opacity = "0";
        setTimeout(() => {
          cenarioGeral.style.backgroundImage = "url('laboratorioluz.png')";
          cenarioGeral.style.opacity = "1";
        }, 500);

        mostrarToast("toast-fase2", "Lógica correta! Geradores ativados.", true);
        setTimeout(() => {
          mostrarMensagem(
            "PULSO ELÉTRICO ENVIADO:\n\nGeradores operando a 100%! As luzes do laboratório acenderam!",
            true,
            () => {
              document.getElementById("texto-missao-fase2").innerText =
                "MISSÃO ATIVA:\nEnergia do laboratório restaurada! Dirija-se até o cofre trancado à direita e destrave o cadeado para recolher os arquivos.";
            }
          );
        }, 700);
      });
    };

    document.getElementById("btn-f").onclick = () => {
      sacudirElemento(lousa);
      dicas.registrarErro();
      mostrarToast("toast-fase2", "Sinal lógico rejeitado. Verifique a tabela.", false);
    };
  }

  // --------------------------------------------------------------------
  // Etapa 2: armário (teoria dos conjuntos)
  // --------------------------------------------------------------------
  document.getElementById("click-armario").onclick = () => {
    if (jogoPausado || armarioResolvido) return;
    if (!computadorResolvido) {
      mostrarMensagem("O cadeado do cofre é eletrônico e depende da energia do laboratório. Ative a luz primeiro!", false, null, "VOLTAR");
      return;
    }
    if (zonaArmario.test(posicaoNormalizada())) {
      jogoPausado = true;
      jogador.style.animationPlayState = "paused";
      mostrarMensagem(
        "CADEADO NUMÉRICO:\n\nO cofre de ferro está trancado por um pesado cadeado. Resolva os agrupamentos indicados na ficha para destravá-lo.",
        true,
        () => { abrirDesafioArmario(); },
        "ACESSAR"
      );
    } else {
      mostrarMensagem("O personagem está distante do cofre. Aproxime-se.", false, null, "VOLTAR");
    }
  };

  function abrirDesafioArmario() {
    const lousa = document.getElementById("lousa-enigma-fase2");
    lousa.style.left = window.innerWidth / 2 - 220 + "px";
    lousa.style.top = "120px";

    lousa.innerHTML = `
            <h3 class="lousa-enigma__titulo">ANÁLISE DE CONJUNTOS</h3>
            <p class="lousa-enigma__texto">Decifre a intersecção contida na ficha cadastral para destravar o cadeado:</p>
            <div class="lousa-enigma__formula" style="font-size: 11px; text-align: left;">
                Conjunto A = {1, 2, 5, 8}<br>
                Conjunto B = {2, 5, 6, 9}<br><br>
                A chave de abertura são os elementos de (A ∩ B) digitados em ordem crescente.
            </div>
            <div style="margin-bottom: 20px; display: flex; justify-content: center; gap: 15px;">
                <input type="number" id="num1" placeholder="1º" class="campo-resposta" style="width: 80px;" aria-label="Primeiro elemento da intersecção">
                <input type="number" id="num2" placeholder="2º" class="campo-resposta" style="width: 80px;" aria-label="Segundo elemento da intersecção">
            </div>
            <button class="btn-acao" id="btn-abrir-armario" style="width: 200px;">REGISTRAR</button>
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
      "No verso do arquivo: \"A intersecção contém só os elementos que aparecem nos DOIS conjuntos ao mesmo tempo.\"",
      "Compare um por um: o 2 está nos dois conjuntos? E o 5?",
    ]);

    document.getElementById("btn-abrir-armario").onclick = () => {
      const v1 = document.getElementById("num1").value.trim();
      const v2 = document.getElementById("num2").value.trim();

      if (v1 === "" || v2 === "") {
        mostrarToast("toast-fase2", "Preencha os dois campos antes de continuar.", false);
        return;
      }

      if (Number(v1) === 2 && Number(v2) === 5) {
        fecharPainel(lousa, () => {
          armarioResolvido = true;
          window.senhaFase2 = ["2", "5"];
          salvarProgresso(2);

          const digestoEl = document.getElementById("digitos-fase2");
          digestoEl.innerText = window.senhaFase2.join(" ");
          digestoEl.classList.add("hud-chave-valor--revelada");
          setTimeout(() => digestoEl.classList.remove("hud-chave-valor--revelada"), 900);

          mostrarToast("toast-fase2", "Intersecção correta! Cadeado destravado.", true);
          setTimeout(() => {
            mostrarMensagem(
              "DOCUMENTO COLETADO:\n\nO cadeado cede com um estalo metálico e o cofre se abre! Lá dentro, você encontra um documento com mais duas senhas: 2 e 5. Pronto para avançar rumo à FASE 3!",
              true,
              () => {
                cenarioGeral.style.transition = "opacity 0.5s ease";
                cenarioGeral.style.opacity = "0";
                setTimeout(() => {
                  document.getElementById("container-fase2").remove();
                  cenarioGeral.style.opacity = "1";
                  if (typeof iniciarFase3 === "function") iniciarFase3();
                }, 500);
              }
            );
          }, 600);
        });
      } else {
        sacudirElemento(lousa);
        dicas.registrarErro();
        mostrarToast("toast-fase2", "Código inválido. Verifique a intersecção.", false);
      }
    };
  }
}
