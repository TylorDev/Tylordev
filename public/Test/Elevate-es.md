## RawProject translation patch in Markdown

locale: es-mx

translation:

- subtitle: Elevate es una app de escritorio en Electron y React para musica local, con reproduccion fluida, cola persistente, visualizador Butterchurn, navegacion por playlists y directorios, telemetria de escucha, historial por cancion y cache LRU de caratulas para optimizar memoria, CPU y rendimiento en bibliotecas grandes sin bloquear la reproduccion local.

sections:

- summary: Elevate: reproductor local enfocado en rendimiento.
- modalContent: Elevate es un reproductor de musica local diseñado para una reproduccion rapida y confiable. Se enfoca en bibliotecas locales, colas persistentes, acciones rapidas y navegacion fluida entre la cola actual, playlists, directorios, canciones favoritas y toda la biblioteca. El producto prioriza que el usuario pueda empezar a escuchar desde cualquier fuente y seguir controlando la cancion actual sin perder contexto.

- summary: Motor grafico con visualizador reactivo al audio.
- modalContent: Elevate incluye una pantalla inmersiva con un visualizador Butterchurn reactivo al audio. El visualizador esta optimizado para evitar trabajo innecesario: activa requestAnimationFrame solo cuando la musica esta reproduciendose, detiene el render cuando el audio esta pausado y usa ResizeObserver para actualizar el tamaño del canvas sin destruir la instancia del visualizador. Tambien permite cambios suaves entre presets y puede mostrarse en modo Picture-in-Picture.

- summary: Navegacion rapida para bibliotecas locales grandes.
- modalContent: Elevate organiza la biblioteca musical mediante un panel de cola navegable con tabs para la cola actual, playlists, directorios, canciones favoritas y biblioteca completa. Cada tab carga datos solo cuando esta activo, reduciendo trabajo innecesario y manteniendo la interfaz ligera. Las listas grandes usan virtualizacion para que el usuario pueda explorar colecciones extensas sin congelamientos ni cargas pesadas.

- summary: Playlists y directorios como fuentes flexibles.
- modalContent: Elevate trata playlists y directorios como fuentes principales de reproduccion. El usuario puede importar playlists, explorar directorios agrupados, seleccionar una coleccion, conservar el orden original o iniciar una playlist o directorio aleatorio. Antes de reproducir, las fuentes se validan para confirmar que existen y tienen canciones, evitando que colecciones vacias o invalidas interrumpan la experiencia.

- summary: Telemetria e insights sobre la escucha.
- modalContent: Elevate incluye vistas de estadisticas y feed que convierten la actividad de escucha en informacion util. La app registra vistas cortas, vistas largas, duracion acumulada, repeticiones, saltos, actividad reciente y rankings de colecciones. Estos datos ayudan al usuario a entender que canciones y colecciones escucha mas. Los rankings se paginan para mantener rendimiento, pero las acciones de reproduccion pueden cargar el ranking completo y no solo la pagina visible.

- summary: Historial, caratulas optimizadas y reproduccion resistente.
- modalContent: Elevate mantiene un historial detallado por cancion, incluyendo registros de escucha, fecha de agregado, ultima reproduccion, dia de mayor actividad y eventos en una linea de tiempo. Tambien usa un sistema optimizado de caratulas con carga diferida, limites de cache LRU, deduplicacion de requests, imagen fallback y limpieza de object URLs para controlar memoria. El principio principal del producto es la resiliencia: errores secundarios como fallos de caratulas, rankings o visualizador no deben bloquear la musica ni la navegacion.
