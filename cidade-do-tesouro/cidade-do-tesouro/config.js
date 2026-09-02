// config.js
// Fonte única das zonas clicáveis (hitboxes) do jogo.
// Usado tanto pelo clique de mouse/toque em cada faseN.js quanto pelo
// controle mobile (joystick) em script.js.

window.ZONAS_JOGO = {
  fase1: {
    telefoneCabine: { id: "click-telefone-cabine", test: ({ x, y }) => x > 0.68 && y > 0.55 },
    escolaFachada: { id: "click-escola-fachada", test: ({ x, y }) => x > 0.45 && x < 0.75 && y < 0.55 },
    mesaProfessora: { id: "click-mesa-professora", test: ({ x, y }) => x > 0.40 && x < 0.60 && y > 0.28 && y < 0.46 },
  },
  fase2: {
    computador: { id: "click-computador", test: ({ x, y }) => x > 0.36 && x < 0.52 && y < 0.32 },
    armario: { id: "click-armario", test: ({ x, y }) => x > 0.63 && x < 0.77 && y < 0.32 },
  },
  fase3: {
    escada: { id: "click-escada", test: ({ x, y }) => x > 0.32 && x < 0.64 && y > 0.5 && y < 0.85 },
    computadorTemplo: { id: "click-computador-templo", test: ({ x, y }) => x > 0.3 && x < 0.65 && y < 0.7 },
    portaFinal: { id: "click-porta-final", test: ({ x, y }) => x > 0.7 && y < 0.6 },
  },
};

// Velocidade de deslocamento do jogador, em pixels por tecla pressionada.
window.VELOCIDADE_JOGADOR = 15;

// Retorna todas as regras de zona em uma única lista (usado pelo controle mobile).
window.getTodasZonas = function () {
  return Object.values(window.ZONAS_JOGO).flatMap((fase) => Object.values(fase));
};
