# 🏴‍☠️ Cidade do Tesouro — Caça ao Tesouro Matemático

Jogo web narrativo em estilo **retro pixel art**, onde o jogador explora uma cidade e resolve desafios matemáticos progressivos para desvendar um mistério e encontrar o tesouro final.

Construído inteiramente com **HTML, CSS e JavaScript puro** (sem frameworks ou bibliotecas externas), com foco em lógica de programação, manipulação de DOM e experiência de usuário.

---

## 🕹️ Como jogar

Uma ligação telefônica misteriosa dá início à jornada. O jogador segue pistas por diferentes cenários — escola, laboratório, templo — resolvendo enigmas matemáticos para avançar. Ao longo do caminho, um "Informante" anônimo deixa dicas escondidas, até a revelação final na tela de vitória.

- **Movimentação:** WASD ou setas do teclado (ou joystick virtual no mobile)
- **Interação:** clique/toque nas zonas destacadas do cenário
- **Dicas:** disponíveis a qualquer momento em cada enigma, com liberação progressiva conforme o número de tentativas erradas
- **Progresso:** salvo automaticamente — feche e volte de onde parou

---

## 📚 As 3 fases

| Fase | Tema | Cenário |
|------|------|---------|
| **1 — Álgebra Fundamental** | Equações e funções de 1º e 2º grau | Escola |
| **2 — Lógica e Estruturas** | Tabela verdade e teoria dos conjuntos | Laboratório |
| **3 — Matemática Avançada** | Logaritmos e matrizes | Templo subterrâneo |

Cada fase é independente em lógica, mas conectada por uma narrativa contínua que culmina em uma senha final calculada dinamicamente a partir das respostas corretas de todo o jogo.

---

## ✨ Funcionalidades

- 🧩 Enigmas matemáticos com validação de respostas em tempo real
- 💡 Sistema de dicas contextual, com liberação progressiva por fase
- 💾 Progresso salvo automaticamente via `localStorage`
- 📱 Controles adaptados para desktop (teclado) e mobile (joystick virtual)
- 🎓 Tela de tutorial na primeira jogada, explicando os controles
- 📰 Tela de vitória estilizada como capa de jornal antigo
- 🎨 Identidade visual retro pixel art consistente em todas as telas

---

## 🛠️ Tecnologias

- **HTML5** — estrutura semântica das telas e modais
- **CSS3** — estilização completa: fontes pixeladas, responsividade, efeitos de luz/glow
- **JavaScript (ES6+)** — motor do jogo, lógica das fases, validação de respostas, manipulação de DOM

Sem frameworks, bibliotecas ou dependências externas de build.

---

## 📂 Estrutura do projeto

```
cidade-do-tesouro/
├── index.html          # Estrutura da página e menu principal
├── style.css            # Todo o visual do jogo
├── config.js             # Zonas clicáveis de cada fase (fonte única)
├── progresso.js          # Salvar/carregar progresso (localStorage)
├── utils.js               # Funções de interface compartilhadas (painéis, toasts, dicas)
├── script.js               # Menu, seleção de personagem, tutorial, controle mobile
├── fase1.js, fase2.js, fase3.js   # Lógica de cada fase
├── personagens/                    # Sprites animados dos personagens
└── *.png                            # Cenários de fundo de cada tela
```

---

## 🚀 Como executar localmente

Não é necessário instalar nada — o jogo roda inteiramente no navegador.

1. Clone o repositório:
   ```bash
   git clone https://github.com/gabmerces/Jogo-A-Busca-do-Tesouro-Matematico-Java-Script.git
   ```
2. Entre na pasta do jogo:
   ```bash
   cd Jogo-A-Busca-do-Tesouro-Matematico-Java-Script/cidade-do-tesouro
   ```
3. Abra o arquivo `index.html` diretamente no navegador, ou sirva a pasta com um servidor local (recomendado, para evitar restrições de `file://`):
   ```bash
   npx serve .
   ```

---

Projeto desenvolvido como exercício de front-end e lógica de programação, aplicando conceitos de manipulação de DOM, gerenciamento de estado com `localStorage` e estruturação de um jogo interativo em JavaScript puro.
