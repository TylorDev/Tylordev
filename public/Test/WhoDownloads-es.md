## RawProject translation patch in Markdown

locale: es-mx

translation:

- subtitle: WhoDownloads es una aplicacion desktop Electron para descargar videos y playlists de YouTube en MP4 o MP3, con captura por URL, playlist o navegador YouTube embebido. La app usa yt-dlp y ffmpeg como binarios locales para resolver metadata, descargar, convertir y guardar archivos, mientras mantiene configuracion persistente de carpeta, formato y calidad. Su arquitectura separa renderer, preload y main process para conservar contextIsolation, sandbox, IPC controlado y cero acceso directo a Node desde la interfaz.

sections:

- summary: Descarga de videos con preview de metadata.
- modalContent: WhoDownloads permite pegar, escribir o arrastrar una URL de video de YouTube dentro de la app desktop y revisar metadata antes de guardar nada. El flujo de preview resuelve titulo, thumbnail, duracion y opciones disponibles desde el proceso principal, y despues permite elegir MP4 o MP3, calidad y carpeta destino antes de crear la tarea de descarga. Asi, la descarga individual se mantiene visible, controlada y conectada con la misma configuracion usada en el resto de la app.

- summary: Quick Download para guardados instantaneos.
- modalContent: Quick Download esta pensado para usuarios que ya confirmaron carpeta, formato y calidad. Cuando esa configuracion esta confirmada, Home puede saltarse el preview de metadata e iniciar la descarga apenas se pega o escribe una URL valida de video. Si el usuario cambia la carpeta, el formato o la calidad, la configuracion de descarga rapida se invalida para que los guardados instantaneos solo ocurran con una decision confirmada.

- summary: Soporte de playlists con descargas por lote.
- modalContent: La vista Playlist acepta URLs de playlists de YouTube desde input directo, pegado o arrastre global. Valida la URL, solicita las entradas al proceso principal, muestra el titulo y los videos de la playlist, y permite quitar entradas antes de descargar un video o la lista completa. Para playlists largas, la app puede ofrecer cargar los primeros 100 videos o cargar todo, y despues crea tareas de descarga en lotes controlados para mantener la cola manejable.

- summary: Navegador YouTube embebido con cola de videos.
- modalContent: WhoDownloads incluye una vista de YouTube embebida para usuarios que prefieren navegar visualmente en vez de copiar enlaces desde fuera. El webview reporta navegacion y clicks mediante un preload dedicado, normaliza URLs de video detectadas y las deduplica dentro de una cola. Desde ahi, cada video capturado puede enviarse a Home, descargarse rapido o guardarse junto con el resto de la cola como lote.

- summary: Gestor de descargas con progreso en tiempo real.
- modalContent: La vista Downloads mantiene visibles las tareas activas, completadas y fallidas mientras el proceso principal emite actualizaciones de progreso. Las tareas pasan por estados como starting, downloading, processing, completed y failed, con el trabajo activo ordenado sobre resultados anteriores. Las descargas completadas pueden revelarse en el sistema de archivos, y los errores de yt-dlp, playlists, settings u operaciones de archivos se muestran mediante estado controlado en la UI.

- summary: Arquitectura Electron segura.
- modalContent: La app mantiene las capacidades nativas detras de un puente Electron limitado. contextIsolation permanece activo, sandbox permanece activo, nodeIntegration permanece desactivado y el renderer solo llama APIs aprobadas expuestas por preload. Los canales IPC cubren previews de metadata, descargas, playlists, settings, seleccion de carpeta, integracion con shell, preload del webview, controles de ventana y eventos de progreso, con validacion de entradas antes de ejecutar trabajo nativo.
