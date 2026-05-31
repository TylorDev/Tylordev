## RawProject translation patch in Markdown

locale: pt-br

translation:

- subtitle: Elevate é um app desktop em Electron e React para música local, com reprodução fluida, fila persistente, visualizador Butterchurn, navegação por playlists e diretórios, telemetria de escuta, histórico por música e cache LRU de capas para otimizar memória, CPU e desempenho em bibliotecas grandes sem bloquear a reprodução.
  sections:

- summary: Elevate: reprodutor local focado em desempenho.
- modalContent: Elevate é um reprodutor de música local criado para uma reprodução rápida e confiável. Ele se concentra em bibliotecas locais, filas persistentes, ações rápidas e navegação fluida entre a fila atual, playlists, diretórios, músicas favoritas e toda a biblioteca. O produto prioriza permitir que o usuário comece a ouvir a partir de qualquer fonte e continue controlando a música atual sem perder contexto.

- summary: Motor gráfico com visualizador reativo ao áudio.
- modalContent: Elevate inclui uma tela imersiva com um visualizador Butterchurn reativo ao áudio. O visualizador é otimizado para evitar trabalho desnecessário: ativa requestAnimationFrame apenas quando a música está sendo reproduzida, interrompe a renderização quando o áudio está pausado e usa ResizeObserver para atualizar o tamanho do canvas sem destruir a instância do visualizador. Também permite transições suaves entre presets e pode ser exibido no modo Picture-in-Picture.

- summary: Navegação rápida para grandes bibliotecas locais.
- modalContent: Elevate organiza a biblioteca musical por meio de um painel de fila navegável com abas para a fila atual, playlists, diretórios, músicas favoritas e biblioteca completa. Cada aba carrega dados apenas quando está ativa, reduzindo trabalho desnecessário e mantendo a interface leve. Listas grandes usam virtualização para que o usuário possa explorar coleções extensas sem travamentos ou carregamentos pesados.

- summary: Playlists e diretórios como fontes flexíveis.
- modalContent: Elevate trata playlists e diretórios como fontes principais de reprodução. O usuário pode importar playlists, explorar diretórios agrupados, selecionar uma coleção, preservar a ordem original ou iniciar uma playlist ou diretório aleatório. Antes de reproduzir, as fontes são validadas para confirmar que existem e contêm músicas, evitando que coleções vazias ou inválidas interrompam a experiência.

- summary: Telemetria e insights sobre a escuta.
- modalContent: Elevate inclui telas de estatísticas e feed que transformam a atividade de escuta em informações úteis. O app registra visualizações curtas, visualizações longas, duração acumulada, repetições, pulos, atividade recente e rankings de coleções. Esses dados ajudam o usuário a entender quais músicas e coleções ele mais escuta. Os rankings são paginados para manter o desempenho, mas as ações de reprodução podem carregar o ranking completo, não apenas a página visível.

- summary: Histórico, capas otimizadas e reprodução resiliente.
- modalContent: Elevate mantém um histórico detalhado por música, incluindo registros de escuta, data de adição, última reprodução, dia de maior atividade e eventos em uma linha do tempo. Também usa um sistema otimizado de capas com carregamento sob demanda, limites de cache LRU, deduplicação de requests, imagem fallback e limpeza de object URLs para controlar o uso de memória. O princípio principal do produto é a resiliência: erros secundários como falhas em capas, rankings ou visualizador não devem bloquear a música nem a navegação.
