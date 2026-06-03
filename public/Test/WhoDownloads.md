## RawProject shape in Markdown

shared:

- coverImageSrc: <img width="1000" height="auto" alt="WhoDownloads cover placeholder" src="https://placehold.co/1920x1080?text=WhoDownloads+Home" />
- backgroundImage: <img width="1000" height="auto" alt="WhoDownloads background placeholder" src="https://placehold.co/1920x1080?text=WhoDownloads+Desktop" />
- status: Live
- type: Desktop

sections:

- flexDirection: row
- coverImage: <img width="1920" height="auto" alt="WhoDownloads metadata preview placeholder" src="https://placehold.co/1920x1080?text=Video+Preview" />
- translations:
- locale: en-us
- summary: Video downloads with metadata preview.
- modalContent: WhoDownloads lets users paste, type, or drag a YouTube video URL into the desktop app and review metadata before saving anything. The preview flow resolves title, thumbnail, duration, and available options through the main process, then lets the user choose MP4 or MP3, quality, and destination folder before creating a download task. This keeps the first download path deliberate, visible, and connected to the same settings used elsewhere in the app.

- flexDirection: row-reverse
- coverImage: <img width="1920" height="auto" alt="WhoDownloads quick download placeholder" src="https://placehold.co/1920x1080?text=Quick+Download" />
- translations:
- locale: en-us
- summary: Quick Download for instant saves.
- modalContent: Quick Download is designed for users who already confirmed their folder, format, and quality preferences. Once those settings are confirmed, the Home view can skip the metadata preview and start a download as soon as a valid video URL is pasted or entered. If the user changes the destination, format, or quality, the quick download configuration is invalidated so instant saves only happen with an intentionally confirmed setup.

- flexDirection: row
- coverImage: <img width="1920" height="auto" alt="WhoDownloads playlist placeholder" src="https://placehold.co/1920x1080?text=Playlist+Downloads" />
- translations:
- locale: en-us
- summary: Playlist support with batch downloads.
- modalContent: The Playlist view accepts YouTube playlist URLs from direct input, paste, or drag-and-drop routing. It validates the URL, asks the main process for playlist entries, shows the playlist title and videos, and lets the user remove entries before downloading one item or the full list. For long playlists, the app can offer a bounded first load or a full load, then creates download tasks in controlled batches so large queues remain manageable.

- flexDirection: row-reverse
- coverImage: <img width="1920" height="auto" alt="WhoDownloads embedded YouTube placeholder" src="https://placehold.co/1920x1080?text=Embedded+YouTube" />
- translations:
- locale: en-us
- summary: Embedded YouTube browser with video queue.
- modalContent: WhoDownloads includes an embedded YouTube view for users who prefer to browse visually instead of copying links elsewhere. The webview reports navigation and click events through a dedicated preload path, normalizes detected video URLs, and deduplicates them into a queue. From there, a captured video can be sent to Home, downloaded quickly, or saved together with the rest of the queue as a batch.

- flexDirection: row
- coverImage: <img width="1920" height="auto" alt="WhoDownloads download manager placeholder" src="https://placehold.co/1920x1080?text=Download+Manager" />
- translations:
- locale: en-us
- summary: Download manager with real-time progress.
- modalContent: The Downloads view keeps active, completed, and failed tasks visible while the main process emits progress updates. Tasks move through states such as starting, downloading, processing, completed, and failed, with active work sorted above older results. Completed downloads can be revealed in the file system, while errors from yt-dlp, playlist loading, settings, or file operations are surfaced through controlled UI state.

- flexDirection: row-reverse
- coverImage: <img width="1920" height="auto" alt="WhoDownloads secure architecture placeholder" src="https://placehold.co/1920x1080?text=Secure+Electron" />
- translations:
- locale: en-us
- summary: Secure Electron architecture.
- modalContent: The app keeps native capabilities behind a constrained Electron bridge. contextIsolation stays enabled, sandbox stays enabled, nodeIntegration stays disabled, and the renderer only calls approved APIs exposed through preload. IPC channels handle metadata previews, downloads, playlist fetches, settings, directory selection, shell integration, webview preload lookup, window controls, and progress events, with inputs validated before native work runs.
