// progresso.js
// Persistência simples do progresso do jogador via localStorage.
// O progresso é salvo por fase (checkpoint), não por sub-etapa dentro da
// fase: ao continuar, o jogador retoma do início da última fase alcançada.

const CHAVE_PROGRESSO = "tesouroMatematico.progresso";

/**
 * Salva o checkpoint atual (fase + senhas já coletadas + personagem).
 * @param {number} fase - 1, 2 ou 3
 */
function salvarProgresso(fase) {
  try {
    const dados = {
      fase,
      personagemSelecionado: window.personagemSelecionado || null,
      senhaColetada: window.senhaColetada || null,
      senhaFase2: window.senhaFase2 || null,
      senhaFase3: window.senhaFase3 || null,
    };
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(dados));
  } catch (erro) {
    // localStorage pode estar indisponível (modo privado, quota excedida etc.)
    console.warn("Não foi possível salvar o progresso:", erro);
  }
}

/**
 * Lê o progresso salvo, se existir.
 * @returns {object|null}
 */
function carregarProgresso() {
  try {
    const bruto = localStorage.getItem(CHAVE_PROGRESSO);
    return bruto ? JSON.parse(bruto) : null;
  } catch (erro) {
    return null;
  }
}

/** Remove o progresso salvo (chamado ao concluir o jogo ou iniciar um novo). */
function apagarProgresso() {
  try {
    localStorage.removeItem(CHAVE_PROGRESSO);
  } catch (erro) {
    // Ignora silenciosamente — sem consequência prática para o jogador.
  }
}
