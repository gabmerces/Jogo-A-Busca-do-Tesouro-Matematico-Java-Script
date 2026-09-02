// fase3.js

function iniciarFase3() {
  const menuContainer = document.querySelector(".menu-container");
  if (menuContainer) menuContainer.remove();

  if (!window.senhaColetada) window.senhaColetada = ["4", "3"];
  if (!window.senhaFase2) window.senhaFase2 = ["2", "5"];
  if (!window.senhaFase3) window.senhaFase3 = ["_", "_"];
  salvarProgresso(3);

  const cenarioGeral = document.querySelector(".cenario-cidade");
  cenarioGeral.style.backgroundImage = "url('fase3.png')";
  cenarioGeral.style.backgroundSize = "100% 100%";

  const containerFase3 = document.createElement("div");
  containerFase3.id = "container-fase3";
  containerFase3.style.width = "100vw";
  containerFase3.style.height = "100vh";
  containerFase3.style.position = "relative";

  containerFase3.innerHTML = `
        <div id="hud-lateral-fase3" class="hud-lateral">
            <div class="hud-caixa">
                <h4>CRÔNICA DA BUSCA:</h4>
                <p id="texto-missao-fase3">CARREGANDO DADOS...</p>
            </div>
            <div class="hud-caixa hud-caixa-chaves">
                <div class="hud-caixa-chaves__titulo">ARQUIVO DE CHAVES</div>
                <div>CHAVE FASE 1: <span class="hud-chave-valor" style="color: var(--crimson);">${window.senhaColetada.join(" ")}</span></div>
                <div>CHAVE FASE 2: <span class="hud-chave-valor" style="color: var(--amber);">${window.senhaFase2.join(" ")}</span></div>
                <div>CHAVE FASE 3: <span id="digitos-fase3" class="hud-chave-valor">${window.senhaFase3.join(" ")}</span></div>
            </div>
        </div>

        <div id="click-escada" class="zona-interativa" style="top: 44%; left: 34%; width: 28%; height: 42%;"></div>
        <div id="click-computador-templo" class="zona-interativa" style="display: none; top: 35%; left: 40%; width: 200px; height: 130px;"></div>
        <div id="click-porta-final" class="zona-interativa" style="display: none; top: 20%; left: 80%; width: 110px; height: 160px;"></div>

        <div id="jogador-fase3" class="sprite-jogador" style="width: 110px !important; height: 140px !important;"></div>

        <div id="lousa-enigma-fase3" class="lousa-enigma"></div>
        <div id="pop-feedback-fase3" class="painel-flutuante">
            <p id="msg-feedback-fase3" class="painel-flutuante__mensagem"></p>
            <button class="btn-acao" id="btn-ok-feedback-fase3">AVANÇAR</button>
        </div>

        <div id="toast-fase3" class="toast-jogo"></div>
    `;

  cenarioGeral.appendChild(containerFase3);

  const jogador = document.getElementById("jogador-fase3");
  if (window.personagemSelecionado) {
    jogador.style.backgroundImage = "url('" + window.personagemSelecionado + "')";
  }

  tornarAcessivel(document.getElementById("click-escada"), "Túnel subterrâneo");
  tornarAcessivel(document.getElementById("click-computador-templo"), "Computador do templo");
  tornarAcessivel(document.getElementById("click-porta-final"), "Porta secreta final");

  let jogoPausado = true;

  // Fase 3 exige mais erros antes de liberar a segunda dica — os enigmas
  // finais avaliam mais o raciocínio próprio do jogador.
  const ERROS_PARA_SEGUNDA_DICA = 2;

  // --------------------------------------------------------------------
  // Introdução e mensagens narrativas
  // --------------------------------------------------------------------
  function rodarIntroducao() {
    const textoCompleto =
      "CRÔNICA DA CIDADE PERDIDA:\n\nA busca nos levou ao coração das ruínas esquecidas.\n\nRelatos antigos afirmam que o templo sagrado guarda a última parte da Chave do Tesouro.\n\nEncontre a entrada subterrânea oculta no mapa urbano para descer.";
    const pop = document.getElementById("pop-feedback-fase3");
    const msg = document.getElementById("msg-feedback-fase3");
    const btn = document.getElementById("btn-ok-feedback-fase3");

    btn.innerText = "INICIAR";
    abrirPainel(pop);
    btn.style.display = "none";
    digitarTexto(msg, textoCompleto, () => { btn.style.display = "inline-block"; });

    btn.onclick = () => {
      fecharPainel(pop, () => {
        jogoPausado = false;
        document.getElementById("texto-missao-fase3").innerText =
          "MISSÃO ATIVA:\nCaminhe até o túnel subterrâneo no centro da rua para investigar.";
      });
    };
  }
  setTimeout(rodarIntroducao, 300);

  function mostrarMensagem(texto, sucesso, aoFechar, textoBotao = "AVANÇAR") {
    jogoPausado = true;
    mostrarFeedback("-fase3", texto, sucesso, () => {
      jogoPausado = false;
      if (aoFechar) aoFechar();
    }, textoBotao);
  }

  // --------------------------------------------------------------------
  // Movimentação do jogador
  // --------------------------------------------------------------------
  let posX = window.innerWidth * 0.08;
  let posY = window.innerHeight * 0.66;
  const velocidade = window.VELOCIDADE_JOGADOR;
  let teclas = {};

  jogador.style.left = posX + "px";
  jogador.style.top = posY + "px";
  jogador.style.transform = "scaleX(1)";

  function posicaoNormalizada() {
    return { x: posX / window.innerWidth, y: posY / window.innerHeight };
  }

  window.addEventListener("keydown", (e) => {
    if (jogoPausado) return;
    teclas[e.key.toLowerCase()] = true;
    let andou = false;
    if (teclas["a"] || teclas["arrowleft"]) { posX -= velocidade; jogador.style.transform = "scaleX(-1)"; andou = true; }
    if (teclas["d"] || teclas["arrowright"]) { posX += velocidade; jogador.style.transform = "scaleX(1)"; andou = true; }
    if (teclas["w"] || teclas["arrowup"]) { if (posY > window.innerHeight * 0.1) { posY -= velocidade; andou = true; } }
    if (teclas["s"] || teclas["arrowdown"]) { if (posY < window.innerHeight - 140) { posY += velocidade; andou = true; } }
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
  // Etapa 1: porta do templo (logaritmos)
  // --------------------------------------------------------------------
  const zonaEscada = window.ZONAS_JOGO.fase3.escada;
  const zonaComputadorTemplo = window.ZONAS_JOGO.fase3.computadorTemplo;
  const zonaPortaFinal = window.ZONAS_JOGO.fase3.portaFinal;

  document.getElementById("click-escada").onclick = () => {
    if (jogoPausado) return;
    if (zonaEscada.test(posicaoNormalizada())) {
      jogoPausado = true;
      jogador.style.animationPlayState = "paused";
      irParaPortaDoTemplo();
    } else {
      mostrarMensagem("O bueiro de acesso ao túnel está no centro da pista. Aproxime-se dele!", false);
    }
  };

  function irParaPortaDoTemplo() {
    cenarioGeral.style.backgroundImage = "url('porta.png')";
    jogador.style.display = "none";
    document.getElementById("click-escada").style.display = "none";
    document.getElementById("hud-lateral-fase3").style.display = "none";

    mostrarMensagem(
      "O portal milenar barra o seu avanço.\n\nResolva o enigma para abrir a porta e estar mais perto do seu tesouro...",
      null,
      () => { abrirPuzzleLog(); }
    );
  }

  function abrirPuzzleLog() {
    const lousa = document.getElementById("lousa-enigma-fase3");
    lousa.style.left = window.innerWidth / 2 - 220 + "px";
    lousa.style.top = "140px";

    lousa.innerHTML = `
            <h3 class="lousa-enigma__titulo" style="font-size: 13px;">CADERNO DE ENIGMAS</h3>
            <p class="lousa-enigma__texto">Calcule os logaritmos abaixo para decifrar o código da fechadura:</p>
            <div class="lousa-enigma__formula">log₂ (64) = X <br> log₃ (81) = Y</div>
            <div style="margin-bottom: 22px; display: flex; justify-content: center; gap: 15px;">
                <input type="number" id="logX" placeholder="X" class="campo-resposta" style="width: 85px;" aria-label="Valor de X">
                <input type="number" id="logY" placeholder="Y" class="campo-resposta" style="width: 85px;" aria-label="Valor de Y">
            </div>
            <button class="btn-acao" id="btn-abrir-templo" style="width: 220px;">DESBLOQUEAR</button>
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
      "Gravado na pedra da entrada, os mesmos traços inclinados: \"Pergunte-se: 2 elevado a que número dá 64?\"",
      "2⁶ = 64, então X = 6. E 3⁴ = 81, então Y = 4.",
    ], ERROS_PARA_SEGUNDA_DICA);

    document.getElementById("btn-abrir-templo").onclick = () => {
      const vx = document.getElementById("logX").value.trim();
      const vy = document.getElementById("logY").value.trim();

      if (vx === "" || vy === "") {
        mostrarMensagem("Preencha os dois campos (X e Y) antes de continuar.", false);
        return;
      }

      if (Number(vx) === 6 && Number(vy) === 4) {
        lousa.classList.add("painel-flutuante--sucesso");
        window.senhaFase3 = ["6", "4"];
        salvarProgresso(3);

        document.getElementById("hud-lateral-fase3").style.display = "flex";
        const digitos = document.getElementById("digitos-fase3");
        digitos.innerText = window.senhaFase3.join(" ");
        digitos.classList.add("hud-chave-valor--revelada");

        fecharPainel(lousa, () => {
          lousa.classList.remove("painel-flutuante--sucesso");
          mostrarMensagem(
            "✓ Sinal mecânico detectado!\nO selo foi quebrado e os portões do santuário recuaram.",
            true,
            () => { entrarNoTemplo(); }
          );
        });
      } else {
        lousa.classList.add("painel-flutuante--erro");
        sacudirElemento(lousa);
        dicas.registrarErro();
        setTimeout(() => lousa.classList.remove("painel-flutuante--erro"), 400);
        mostrarMensagem("✗ Nenhum efeito gerado. Os cálculos parecem incorretos.", false);
      }
    };
  }

  // --------------------------------------------------------------------
  // Etapa 2: terminal do templo (determinante de matriz)
  // --------------------------------------------------------------------
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
    jogoPausado = false;
  }

  document.getElementById("click-computador-templo").onclick = () => {
    if (jogoPausado || computadorTemploResolvido) return;
    if (zonaComputadorTemplo.test(posicaoNormalizada())) {
      jogoPausado = true;
      jogador.style.animationPlayState = "paused";
      abrirPuzzleMatriz();
    } else {
      mostrarMensagem("O personagem está distante do terminal do templo. Aproxime-se!", false);
    }
  };

  function abrirPuzzleMatriz() {
    const lousa = document.getElementById("lousa-enigma-fase3");
    lousa.style.left = window.innerWidth / 2 - 220 + "px";
    lousa.style.top = "110px";

    lousa.innerHTML = `
            <h3 class="lousa-enigma__titulo">TERMINAL DE SEGURANÇA</h3>
            <p class="lousa-enigma__texto">Calcule o determinante da matriz identidade contida na memória:</p>
            <div class="lousa-enigma__formula" style="display: inline-block;">| 1&nbsp;&nbsp;&nbsp;0 |<br>| 0&nbsp;&nbsp;&nbsp;1 |</div>
            <p class="lousa-enigma__texto" style="font-weight: bold;">Informe o determinante resultante:</p>
            <input type="number" id="detInput" class="campo-resposta" aria-label="Determinante da matriz"><br>
            <button class="btn-acao" id="btn-matriz" style="width: 180px;">TRANSMITIR</button>
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
      "Uma inscrição no terminal: \"O determinante de uma matriz identidade é sempre o mesmo número, não importa o tamanho dela.\"",
      "det = (1×1) − (0×0) = 1.",
    ], ERROS_PARA_SEGUNDA_DICA);

    document.getElementById("btn-matriz").onclick = () => {
      const resposta = validarRespostaNumerica("detInput", 1);

      if (resposta.vazio) {
        mostrarMensagem("Preencha o campo com o determinante antes de continuar.", false);
        return;
      }

      if (resposta.valido) {
        lousa.classList.add("painel-flutuante--sucesso");

        fecharPainel(lousa, () => {
          lousa.classList.remove("painel-flutuante--sucesso");
          computadorTemploResolvido = true;
          document.getElementById("click-computador-templo").style.display = "none";
          document.getElementById("click-porta-final").style.display = "block";

          mostrarMensagem(
            "✓ Sinal aceito pela central!\nMecanismos hidráulicos ativados na ala leste do templo.",
            true,
            () => {
              document.getElementById("texto-missao-fase3").innerText =
                "MISSÃO ATIVA:\nO terminal liberou o acesso final! Siga até a porta secreta no canto superior direito.";
              jogoPausado = false;
            }
          );
        });
      } else {
        const inp = document.getElementById("detInput");
        inp.classList.add("campo-resposta--erro");
        sacudirElemento(lousa);
        dicas.registrarErro();
        setTimeout(() => inp.classList.remove("campo-resposta--erro"), 500);
        mostrarMensagem("✗ Determinante incorreto. Os buffers rejeitaram o sinal enviado.", false);
      }
    };
  }

  // --------------------------------------------------------------------
  // Etapa 3: cofre final (senha combinada)
  // --------------------------------------------------------------------
  document.getElementById("click-porta-final").onclick = () => {
    if (jogoPausado) return;
    if (zonaPortaFinal.test(posicaoNormalizada())) {
      jogoPausado = true;
      jogador.style.animationPlayState = "paused";
      abrirCofreFinal();
    } else {
      mostrarMensagem("Direcione o personagem até a saída secreta localizada no canto para desbloquear o tesouro!", false);
    }
  };

  function abrirCofreFinal() {
    const lousa = document.getElementById("lousa-enigma-fase3");
    lousa.style.left = window.innerWidth / 2 - 220 + "px";
    lousa.style.top = "150px";

    lousa.innerHTML = `
            <h3 class="lousa-enigma__titulo">PAINEL CRIPTOGRÁFICO</h3>
            <p class="lousa-enigma__texto">Digite a sequência histórica de 6 dígitos obtida durante a exploração científica:</p>
            <input type="text" id="senhaFinalInput" maxlength="6" placeholder="******" class="campo-resposta" style="font-size: 16px; width: 180px; letter-spacing: 5px;" aria-label="Senha final de 6 dígitos"><br>
            <button class="btn-acao" id="btn-concluir-tudo" style="width: 220px;">DESBLOQUEAR COFRE</button>
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
      "Confira o Arquivo de Chaves na lateral da tela — junte as 3 chaves na ordem em que você as encontrou.",
    ]);

    document.getElementById("btn-concluir-tudo").onclick = () => {
      const senhaDigitada = document.getElementById("senhaFinalInput").value.trim();
      const senhaEsperada =
        String(window.senhaColetada[0]) + String(window.senhaColetada[1]) +
        String(window.senhaFase2[0]) + String(window.senhaFase2[1]) +
        String(window.senhaFase3[0]) + String(window.senhaFase3[1]);

      if (senhaDigitada === senhaEsperada) {
        lousa.classList.add("painel-flutuante--sucesso");

        fecharPainel(lousa, () => {
          lousa.classList.remove("painel-flutuante--sucesso");
          containerFase3.remove();
          cenarioGeral.style.backgroundImage = "url('fase1.png')";
          apagarProgresso();
          mostrarTelaVitoria(cenarioGeral);
        });
      } else {
        const inp = document.getElementById("senhaFinalInput");
        inp.classList.add("campo-resposta--erro");
        sacudirElemento(lousa);
        dicas.registrarErro();
        setTimeout(() => inp.classList.remove("campo-resposta--erro"), 500);
        mostrarMensagem("✗ Senha inválida. Os trincos permanecem estáticos. Verifique seu arquivo de notas na HUD!", false);
      }
    };
  }

  // --------------------------------------------------------------------
  // Tela final de vitória — estilizada como a capa de um jornal antigo
  // --------------------------------------------------------------------
  function mostrarTelaVitoria(cenario) {
    const painelVitoria = document.createElement("div");
    painelVitoria.className = "painel-vitoria";

    const senhaFinal = [
      window.senhaColetada[0], window.senhaColetada[1],
      window.senhaFase2[0], window.senhaFase2[1],
      window.senhaFase3[0], window.senhaFase3[1],
    ];
    const digitosSenha = senhaFinal.map((d) => `<span>${d}</span>`).join("");

    painelVitoria.innerHTML = `
            <article class="jornal">
                <header class="jornal__topo">
                    <p class="jornal__selo">EDIÇÃO ESPECIAL · CIRCULAÇÃO LIMITADA</p>
                    <h2 class="jornal__masthead">O ARAUTO DA CIDADE</h2>
                    <div class="jornal__linha-dupla"></div>
                    <div class="jornal__datalinha">
                        <span>CIDADE DO TESOURO</span>
                        <span>EDIÇÃO COMEMORATIVA</span>
                        <span>PREÇO: 1 ENIGMA</span>
                    </div>
                </header>

                <h3 class="jornal__manchete">TESOURO LENDÁRIO É FINALMENTE ENCONTRADO</h3>
                <p class="jornal__assinatura">Reportagem especial · por um(a) correspondente que prefere não se identificar</p>

                <div class="jornal__corpo">
                    <figure class="jornal__foto">
                        <span class="jornal__foto-icone">🏆</span>
                        <figcaption>O tesouro, recuperado após gerações de buscas pela cidade.</figcaption>
                    </figure>
                    <p class="jornal__paragrafo">
                        <span class="jornal__capitular">A</span>pós decifrar uma sequência de enigmas
                        matemáticos escondidos pela cidade — da cabine telefônica ao templo
                        subterrâneo — um(a) jovem investigador(a) alcançou a câmara final e encerrou
                        um mistério que durava gerações. Moradores locais descrevem a notícia como
                        "inacreditável" e já falam em erguer uma estátua na praça central.
                    </p>
                </div>

                <div class="jornal__recorte">
                    <p class="jornal__recorte-titulo">✂ — RECORTE E GUARDE — CÓDIGO DE ABERTURA DO TESOURO — ✂</p>
                    <div class="vitoria-senha">${digitosSenha}</div>
                </div>

                <p class="jornal__nota">
                    <strong>Nota da redação:</strong> a identidade do "Informante" que guiou as
                    pistas ao longo de toda a busca permanece desconhecida. A redação continuará
                    investigando.
                </p>

                <footer class="jornal__rodape">
                    <button id="btn-reiniciar-tudo" class="jornal__carimbo">JOGAR<br>NOVAMENTE</button>
                </footer>
            </article>
        `;

    cenario.appendChild(painelVitoria);
    _criarConfetti(cenario);

    document.getElementById("btn-reiniciar-tudo").onclick = () => { location.reload(); };
  }

  function _criarConfetti(cenario) {
    const cores = ["#b71c1c", "#ffb700", "#160e0b", "#5c2489"];
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
