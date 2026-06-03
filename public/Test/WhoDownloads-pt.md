## RawProject translation patch in Markdown

locale: pt-br

translation:

- subtitle: WhoDownloads e um aplicativo desktop em Electron para baixar videos e playlists do YouTube em MP4 ou MP3, com captura por URL, playlist ou navegador YouTube embutido. O app usa yt-dlp e ffmpeg como binarios locais para resolver metadados, baixar, converter e salvar arquivos, enquanto mantem configuracao persistente de pasta, formato e qualidade. Sua arquitetura separa renderer, preload e main process para preservar contextIsolation, sandbox, IPC controlado e nenhum acesso direto ao Node pela interface.

sections:

- summary: Downloads de videos com preview de metadados.
- modalContent: WhoDownloads permite colar, digitar ou arrastar uma URL de video do YouTube para o app desktop e revisar metadados antes de salvar qualquer arquivo. O fluxo de preview resolve titulo, thumbnail, duracao e opcoes disponiveis pelo processo principal, depois permite escolher MP4 ou MP3, qualidade e pasta de destino antes de criar a tarefa de download. Assim, o caminho de download individual continua visivel, controlado e conectado as mesmas configuracoes usadas no resto do app.

- summary: Quick Download para salvamentos instantaneos.
- modalContent: Quick Download foi pensado para usuarios que ja confirmaram pasta, formato e qualidade. Depois que essa configuracao esta confirmada, a tela Home pode pular o preview de metadados e iniciar o download assim que uma URL valida de video for colada ou digitada. Se o usuario muda a pasta, o formato ou a qualidade, a configuracao de download rapido e invalidada para que salvamentos instantaneos so acontecam com uma escolha confirmada.

- summary: Suporte a playlists com downloads em lote.
- modalContent: A tela Playlist aceita URLs de playlists do YouTube por entrada direta, colagem ou arrastar e soltar global. Ela valida a URL, solicita as entradas ao processo principal, mostra o titulo e os videos da playlist, e permite remover itens antes de baixar um video ou a lista completa. Para playlists longas, o app pode oferecer carregar os primeiros 100 videos ou carregar tudo, depois cria tarefas de download em lotes controlados para manter a fila gerenciavel.

- summary: Navegador YouTube embutido com fila de videos.
- modalContent: WhoDownloads inclui uma tela de YouTube embutida para usuarios que preferem navegar visualmente em vez de copiar links de fora. O webview informa navegacao e cliques por um preload dedicado, normaliza URLs de video detectadas e remove duplicados dentro de uma fila. A partir dela, cada video capturado pode ser enviado para Home, baixado rapidamente ou salvo junto com o restante da fila como lote.

- summary: Gerenciador de downloads com progresso em tempo real.
- modalContent: A tela Downloads mantem tarefas ativas, concluidas e com falha visiveis enquanto o processo principal emite atualizacoes de progresso. As tarefas passam por estados como starting, downloading, processing, completed e failed, com o trabalho ativo ordenado acima de resultados anteriores. Downloads concluidos podem ser revelados no sistema de arquivos, e erros de yt-dlp, playlists, settings ou operacoes de arquivo sao exibidos por estado controlado na UI.

- summary: Arquitetura Electron segura.
- modalContent: O app mantem capacidades nativas atras de uma ponte Electron limitada. contextIsolation permanece ativo, sandbox permanece ativo, nodeIntegration permanece desativado e o renderer chama apenas APIs aprovadas expostas pelo preload. Os canais IPC cobrem previews de metadados, downloads, playlists, settings, selecao de pasta, integracao com shell, preload do webview, controles de janela e eventos de progresso, com validacao de entradas antes da execucao de trabalho nativo.
