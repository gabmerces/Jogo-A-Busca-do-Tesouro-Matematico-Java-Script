# Changelog — "Cidade do Tesouro"

## v7 — Revisão final: bugs, consistência de texto e ajustes de layout

### Tela final (jornal) reorganizada
Painel alargado (560px → 640px) e espaçamentos internos reduzidos para
eliminar a barra de rolagem que cortava o botão final. Tamanhos de
fonte do corpo do texto, da nota de rodapé e do recorte com o código
aumentados para melhor legibilidade. Os dígitos do código final
passaram de caixas quase quadradas (26×30px) para caixas mais
retangulares e maiores (32×42px).

### Correções de código
- Variável `juegoPausado` (espanhol) renomeada para `jogoPausado`
  (português) nas 3 fases — erro de digitação recorrente desde a
  primeira versão.
- `senhaFase2` e `senhaFase3` eram armazenadas como números
  (`[2, 5]`), enquanto `senhaColetada` usa strings (`["4", "3"]`).
  Padronizado para strings nas 3 variáveis.
- `criarSistemaDicas()` declarava funções internas `abrirPainel()` e
  `fecharPainel()` que sombreavam as funções globais de mesmo nome
  definidas em `utils.js`. Renomeadas para `abrirPainelDica()` e
  `fecharPainelDica()`.
- Removido estilo inline redundante (`background: rgba(0,0,0,0)`) em
  uma zona clicável — todas as zonas já são transparentes por padrão.
- Comentários revisados em todo o projeto: removidas notas de
  histórico/desenvolvimento, mantendo apenas documentação técnica
  direta.

### Verificação de consistência narrativa
Conferido o texto de todas as fases contra o fluxo pretendido: telefone
→ escola → mesa da professora → laboratório (computador liga a luz →
cadeado do cofre) → rua → escada → templo (enigma da entrada → terminal
central → porta secreta) → painel final com a senha combinada. Nenhuma
divergência encontrada nesta revisão.

## v6 — Correção de bugs críticos

### Botão "Continuar (Fase X)" travando o jogo
Causa raiz: `iniciarFase2()` e `iniciarFase3()` não removiam a tela de
menu principal (`.menu-container`) do DOM ao serem chamadas — só
`iniciarFase1()` fazia isso. Isso nunca dava problema durante o fluxo
normal (jogar do zero), porque a Fase 1 já tinha removido o menu antes
de chegar às fases seguintes. Mas ao clicar em "CONTINUAR (FASE 2)" ou
"CONTINUAR (FASE 3)" direto do menu, a fase correspondente carregava
por baixo enquanto o menu principal (título e botões) continuava
sobreposto na tela, bloqueando todos os cliques. Corrigido adicionando
a mesma remoção do menu no início de `iniciarFase2()` e `iniciarFase3()`.

### Zona de clique da escada (Fase 3) corrigida de vez
A posição da área clicável ainda não coincidia com a escada visível no
cenário — a área ficava numa faixa mais estreita e mais baixa do que a
imagem real da escadaria. Reposicionada com base nas coordenadas
exatas marcadas em captura de tela pelo usuário, e alargada (usando
unidades percentuais em vez de pixels fixos, para escalar melhor com
o tamanho da tela) para cobrir toda a área da escadaria com folga.

## v5 — Correções de precisão e tela final em estilo jornal

### Zonas de clique corrigidas
Duas áreas clicáveis estavam posicionadas de forma imprecisa em relação
ao cenário de fundo (confirmado sobrepondo as coordenadas na imagem
para conferência visual):
- **Mesa da professora** (Fase 1): a área ficava à esquerda do livro
  sobre a mesa. Recentralizada para cobrir exatamente o livro.
- **Escada do templo** (Fase 3): a área não cobria o bueiro/entrada do
  túnel na rua. Recentralizada sobre a entrada correta.

### Texto corrigido
A introdução da Fase 2 dizia que o desafio havia sido resolvido "na
lousa da sala de aula" — mas ele é resolvido na mesa da professora.
Texto ajustado para refletir corretamente a Fase 1.

### Botão "Continuar (Fase X)"
O texto quebrava em duas linhas de forma desalinhada com os demais
botões do menu. Fonte reduzida e texto fixado em uma única linha
(`white-space: nowrap`), mantendo a mesma altura dos outros botões.

### Tela final redesenhada como capa de jornal antigo
A tela de vitória genérica foi substituída por uma capa de jornal
rústica: nome de jornal fictício ("O Arauto da Cidade") em tipografia
serifada, linha dupla de cabeçalho, data e preço fictício, manchete,
uma "foto" enquadrada do troféu com legenda, texto corrido com letra
capitular, um recorte tracejado ("recorte e guarde") com o código
final, nota de rodapé sobre o Informante misterioso, e um botão final
estilizado como carimbo de tinta. A borda do painel continua roxa,
mantendo essa tela visualmente distinta das demais. Fontes adicionadas
para o efeito: `Playfair Display` (manchete) e `Special Elite`
(máquina de escrever, usada no corpo do texto).

## v4 — Remoção do áudio e padronização visual

### Áudio removido
Todo o sistema de som foi retirado do jogo: `audio.js` foi excluído,
junto com o botão de mudo, o toque de telefone da Fase 1 e todas as
chamadas de `tocarSom()` nos arquivos de cada fase. O jogo agora é
inteiramente silencioso, sem qualquer dependência de áudio.

### Tela de tutorial sem poluição visual
O tutorial ("COMO JOGAR") aparecia sobreposto à tela de seleção de
personagem, deixando caixa de narrativa, cartas e botões visíveis por
trás do próprio painel. A tela de seleção agora é ocultada antes do
tutorial ser exibido, deixando apenas o cenário da cidade como fundo.

### Sistema de dicas redesenhado
O botão de dica deixou de ser uma aba lateral com texto rotacionado.
Agora é um ícone de lâmpada (💡) fixado no canto do quadro de enigma.
Ao clicar, abre uma caixa menor ao lado — visualmente uma "cópia" do
quadro principal, na mesma paleta — já revelando a primeira dica. Dicas
seguintes exigem um número mínimo de respostas erradas, como antes. Em
telas estreitas, essa caixa lateral vira um pop-up central (não há
espaço lateral em telas pequenas).

### Bordas padronizadas
Diversos painéis (mensagens de sucesso, quadros de enigma, tutorial,
avisos, dicas) tinham bordas inconsistentes — algumas pretas, outras em
tons de dourado/laranja. Todas foram padronizadas para a borda preta
(`var(--ink)`), com exceção da tela final de vitória, que passou a usar
uma borda roxa para se destacar como um momento especial e distinto do
restante do jogo.

## v3 — Narrativa e polimento visual

### Narrativa revisada
Textos de introdução e de missão ajustados para reforçar a linha da
história: telefone toca → escola → mesa da professora → laboratório nos
porões da escola → cofre trancado por cadeado → templo subterrâneo.

### Correções visuais
- O painel de sucesso (`.painel-flutuante--sucesso`) usava uma borda verde
  destoante do restante da paleta; voltou ao dourado/tinta do jogo.
- Botão de dica reposicionado: em telas largas, vira uma aba fixada na
  lateral do quadro de enigma, em vez de aparecer pequeno abaixo do
  formulário. Em telas estreitas, permanece em bloco.
- Tela de vitória reconstruída com camada de estrelas cintilantes, faixa
  "TESOURO ENCONTRADO", resumo visual do código final e moldura ornamental,
  com o CSS movido para classes reutilizáveis em vez de estilos inline.
- Tela de tutorial ganhou um mini teclado visual (WASD) e ícones para
  clique/toque e dica, no lugar de blocos de texto simples.

### Correção de desempenho (telas de menu e seleção de personagem)
Duas causas identificadas de engasgos ("travamentos"):
- O título do menu animava `text-shadow` diretamente, uma propriedade cara
  de repintar a cada quadro. Substituído por um brilho em pseudo-elemento
  que anima apenas `opacity`.
- A caixa de narrativa da seleção de personagem combinava `backdrop-filter:
  blur()` com uma animação de entrada (`transform` + `opacity`), forçando o
  navegador a recompor o blur em todo quadro da animação. O blur foi
  removido, mantendo a legibilidade via fundo escuro semi-opaco.
- A seleção de personagem também misturava classes `:hover` do CSS com
  estilos inline aplicados via `mouseenter`/`mouseleave` em JavaScript,
  que competiam entre si. Toda a lógica de seleção/hover foi migrada para
  classes CSS (`.card-personagem--selecionado`, `--esmaecido`).

### Limpeza de CSS
Removido um bloco duplicado de `.btn-dica` e uma seção morta de estilos
(`.caixa-dica`/`.dica-texto`) que não era referenciada por nenhum script.
Estados de `:hover`/`:active` do botão "JOGAR NOVAMENTE" (antes definidos
via JS a cada evento de mouse) migrados para `.btn-acao`/`.btn-acao--vitoria`
no CSS. Numeração das seções do `style.css` corrigida (havia números
repetidos por edições anteriores).

## v2 — Melhorias de experiência

### Sistema de dicas
Cada enigma tem um botão "PRECISA DE UMA DICA?" dentro do próprio painel.
As dicas têm um fio narrativo comum: um "Informante" misterioso (o mesmo
personagem da ligação telefônica da Fase 1) deixa pistas em cada fase —
um post-it, uma inscrição na pedra, uma anotação no caderno — sempre com
"a mesma letra inclinada". A tela de vitória fecha esse gancho sem revelar
quem ele era.

Cada enigma tem 1 ou 2 dicas (a última já entrega o caminho da resposta).
A segunda dica só libera depois de errar algumas vezes:
- Fases 1 e 2: libera após 1 resposta errada.
- Fase 3: libera após 2 respostas erradas (enigmas finais, mais desafiadores).

### Progresso salvo (localStorage)
Ao entrar em uma fase, o progresso é salvo automaticamente. Se o jogador
fechar a aba, ao voltar ao menu aparece um botão "CONTINUAR (FASE X)".
Resume do início da última fase alcançada (não de um ponto exato dentro
dela) e é apagado automaticamente ao concluir o jogo.

### Sons
Efeitos sonoros curtos (acerto, erro, clique, vitória) sintetizados via
Web Audio API — sem precisar de arquivos de áudio externos.

### Tela de tutorial
Antes da Fase 1 (apenas em jogo novo, não ao continuar), uma tela explica
o WASD/setas, o clique/toque para interagir e o botão de dica.

## v1 — Refatoração e correção de bugs
Ver histórico do repositório / conversa para os detalhes da primeira
rodada: criação de `config.js`/`utils.js`, remoção de `menu.js` (código
morto), correção da animação `shakeX` que não existia, correção da senha
fixa no HUD, cálculo dinâmico da senha final, correção do botão SAIR, e
padronização de estilos/validações entre as 3 fases.

## Arquivos do projeto
- `index.html` — estrutura da página
- `style.css` — todo o visual do jogo
- `config.js` — zonas clicáveis de cada fase (fonte única)
- `progresso.js` — salvar/carregar progresso (localStorage)
- `utils.js` — funções de interface compartilhadas (painéis, toasts, dicas)
- `script.js` — menu, seleção de personagem, tutorial, controle mobile
- `fase1.js`, `fase2.js`, `fase3.js` — lógica de cada fase

## Como validei
Testes automatizados (Node + jsdom):
1. Fluxo completo do jogador, do menu até a vitória, com a senha final
   calculada dinamicamente.
2. Sistema de dicas: liberação da 1ª dica imediata, bloqueio/liberação da
   2ª dica conforme o número de erros.
3. Progresso salvo: salvar, carregar e apagar via localStorage.

Todos os testes passam sem erros.
