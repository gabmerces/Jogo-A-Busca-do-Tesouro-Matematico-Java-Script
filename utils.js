// utils.js
// Funções de interface compartilhadas pelas 3 fases (painéis, toasts,
// digitação de texto e o sistema de dicas).

/**
 * Mostra uma notificação rápida (toast) no rodapé da tela.
 * @param {string} toastId - id do elemento toast (ex: "toast-fase1")
 * @param {string} texto
 * @param {boolean} sucesso
 */
function mostrarToast(toastId, texto, sucesso) {
  const toast = document.getElementById(toastId);
  if (!toast) return;

  toast.innerText = sucesso ? "✔ " + texto : "✘ " + texto;
  toast.style.background = sucesso ? "var(--parchment, #f4eedb)" : "#fff0f0";
  toast.style.color = sucesso ? "var(--ink, #160e0b)" : "var(--crimson, #b71c1c)";
  toast.style.borderColor = sucesso ? "var(--ink, #160e0b)" : "var(--crimson, #b71c1c)";
  toast.style.boxShadow = sucesso
    ? "4px 4px 0px var(--ink, #160e0b)"
    : "4px 4px 0px var(--crimson, #b71c1c)";
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

/**
 * Abre um painel (pop-up ou lousa) com animação de fade-in.
 * @param {HTMLElement} el
 */
function abrirPainel(el) {
  if (!el) return;
  const isPop = el.id && el.id.includes("pop");
  el.style.opacity = "0";
  el.style.display = "block";
  el.style.transition =
    "opacity var(--t-med, 280ms) ease, transform var(--t-med, 280ms) cubic-bezier(.34,1.56,.64,1)";
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

/**
 * Fecha um painel (pop-up ou lousa) com animação de fade-out.
 * @param {HTMLElement} el
 * @param {Function} [cb] - executado após a animação terminar
 */
function fecharPainel(el, cb) {
  if (!el) return;
  const isPop = el.id && el.id.includes("pop");
  el.style.transition = "opacity var(--t-fast, 150ms) ease, transform var(--t-fast, 150ms) ease";
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

/**
 * Efeito de "máquina de escrever": digita o texto letra por letra.
 * @param {HTMLElement} elemento
 * @param {string} texto
 * @param {Function} [aoTerminar]
 * @param {number} [velocidade] - ms entre cada letra
 */
function digitarTexto(elemento, texto, aoTerminar, velocidade = 25) {
  let i = 0;
  elemento.innerHTML = "";
  function passo() {
    if (i < texto.length) {
      elemento.innerHTML += texto.charAt(i) === "\n" ? "<br>" : texto.charAt(i);
      i++;
      setTimeout(passo, velocidade);
    } else if (aoTerminar) {
      aoTerminar();
    }
  }
  passo();
}

/**
 * Efeito de "tremor" (shake), usado para indicar resposta errada.
 * @param {HTMLElement} el
 */
function sacudirElemento(el) {
  if (!el) return;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "shakeX 0.4s ease";
}

/**
 * Mostra um painel de feedback (pop-up com texto, cor de sucesso/erro e
 * botão de avançar). Usado nas 3 fases para as mensagens narrativas.
 *
 * @param {string} prefixo - sufixo dos ids (ex: "" na fase 1, "-fase2" na fase 2)
 * @param {string} texto
 * @param {boolean|null} sucesso - true = verde, false = vermelho, null = neutro
 * @param {Function} [aoFechar]
 * @param {string} [textoBotao]
 */
function mostrarFeedback(prefixo, texto, sucesso, aoFechar, textoBotao = "AVANÇAR") {
  const pop = document.getElementById(`pop-feedback${prefixo}`);
  const msg = document.getElementById(`msg-feedback${prefixo}`);
  const btn = document.getElementById(`btn-ok-feedback${prefixo}`);
  if (!pop || !msg || !btn) return;

  pop.classList.remove("painel-flutuante--sucesso", "painel-flutuante--erro");
  if (sucesso === true) pop.classList.add("painel-flutuante--sucesso");
  if (sucesso === false) pop.classList.add("painel-flutuante--erro");

  msg.innerText = texto;
  btn.innerText = textoBotao;
  abrirPainel(pop);

  btn.onclick = () => {
    fecharPainel(pop, () => {
      pop.classList.remove("painel-flutuante--sucesso", "painel-flutuante--erro");
      if (aoFechar) aoFechar();
    });
  };
}

/**
 * Deixa uma área clicável do cenário acessível via teclado/leitor de tela:
 * adiciona role="button", tabindex e permite ativação com Enter/Espaço.
 * @param {HTMLElement} el
 * @param {string} [rotulo] - texto descritivo para leitores de tela
 */
function tornarAcessivel(el, rotulo) {
  if (!el) return;
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  if (rotulo) el.setAttribute("aria-label", rotulo);
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
}

/**
 * Lê e valida um input de resposta numérica.
 * @param {string} inputId
 * @param {number} respostaCorreta
 * @returns {{valido: boolean, vazio: boolean}}
 */
function validarRespostaNumerica(inputId, respostaCorreta) {
  const input = document.getElementById(inputId);
  const bruto = input ? input.value.trim() : "";
  if (bruto === "") return { valido: false, vazio: true };
  return { valido: Number(bruto) === respostaCorreta, vazio: false };
}

/**
 * Instancia um sistema de dicas progressivas dentro de um painel de enigma.
 * A lousa deve conter um ícone `.btn-dica-icone`, um painel lateral
 * `.painel-dica-lateral` (com botão de fechar `.painel-dica-lateral__fechar`)
 * e, dentro dele, o botão `.btn-dica` e o contêiner `.area-dica`.
 *
 * Clicar no ícone abre o painel lateral e já revela a primeira dica. As
 * dicas seguintes só liberam depois de um número mínimo de respostas
 * erradas (`errosParaProximaDica`).
 *
 * @param {HTMLElement} lousa
 * @param {string[]} dicas - textos das dicas, em ordem crescente de clareza
 * @param {number} [errosParaProximaDica] - erros necessários entre uma dica e a próxima
 * @returns {{registrarErro: Function}}
 */
function criarSistemaDicas(lousa, dicas, errosParaProximaDica = 1) {
  const icone = lousa.querySelector(".btn-dica-icone");
  const painelLateral = lousa.querySelector(".painel-dica-lateral");
  const botaoFechar = lousa.querySelector(".painel-dica-lateral__fechar");
  const botao = lousa.querySelector(".btn-dica");
  const area = lousa.querySelector(".area-dica");
  if (!icone || !painelLateral || !botao || !area || !dicas || !dicas.length) {
    return { registrarErro() {} };
  }

  let erros = 0;
  let nivel = 0; // quantas dicas já foram reveladas

  function atualizarBotao() {
    if (nivel >= dicas.length) {
      botao.style.display = "none";
      return;
    }
    const bloqueado = nivel >= 1 && erros < errosParaProximaDica * nivel;
    botao.disabled = bloqueado;
    botao.innerText = bloqueado
      ? `ERRE MAIS ${errosParaProximaDica * nivel - erros}x PARA OUTRA DICA`
      : "PEDIR OUTRA DICA";
  }

  function revelarProximaDica() {
    if (nivel >= dicas.length || botao.disabled) return;
    area.style.display = "block";
    area.innerHTML += (area.innerHTML ? "<br><br>" : "") + dicas[nivel];
    nivel++;
    atualizarBotao();
  }

  function abrirPainelDica() {
    painelLateral.classList.add("painel-dica-lateral--aberta");
    icone.setAttribute("aria-expanded", "true");
    if (nivel === 0) revelarProximaDica();
  }

  function fecharPainelDica() {
    painelLateral.classList.remove("painel-dica-lateral--aberta");
    icone.setAttribute("aria-expanded", "false");
  }

  icone.onclick = () => {
    const aberto = painelLateral.classList.contains("painel-dica-lateral--aberta");
    if (aberto) fecharPainelDica(); else abrirPainelDica();
  };

  botaoFechar.onclick = fecharPainelDica;
  botao.onclick = revelarProximaDica;

  atualizarBotao();

  return {
    registrarErro() {
      erros++;
      atualizarBotao();
    },
  };
}
