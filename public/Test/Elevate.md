## RawProject shape in Markdown

shared:

- coverImageSrc: <img width="1000" height="auto" alt="Elevate cover" src="https://github.com/user-attachments/assets/6f81d2f0-f672-4b55-90f7-416800156e5f" />
- backgroundImage: <img width="1000" height="auto" alt="Elevate background" src="https://github.com/user-attachments/assets/d3d1d92c-a596-402f-9acd-896e7cd6d691" />
- status: Live
- type: Desktop

sections:

- flexDirection: row
- coverImage: Screenshot of the local music player showing the persistent queue, current track artwork, playback controls, and navigation tabs.
- translations:
- locale: en-us
- summary: Elevate: A local music player focused on performance.
- modalContent: Elevate is a local music player designed for fast and reliable playback. It focuses on local music libraries, persistent queues, quick actions, and smooth navigation across the current queue, playlists, directories, liked songs, and the full library. The product prioritizes fluid playback so the user can start listening from any source and keep controlling the current track without losing context.

- flexDirection: row-reverse
- coverImage: Screenshot of the immersive music screen with the Butterchurn visualizer reacting to audio while preset controls remain visible.
- translations:
- locale: en-us
- summary: Graphics engine with audio-reactive visualizer.
- modalContent: Elevate includes an immersive graphics engine powered by an audio-reactive Butterchurn visualizer. The visualizer is optimized to avoid unnecessary work: it starts requestAnimationFrame only when audio is playing, stops rendering when audio is paused, and uses ResizeObserver to update canvas dimensions without destroying the visualizer instance. It also supports smooth preset changes and can display the visualizer in Picture-in-Picture mode.

- flexDirection: row
- coverImage: Screenshot of the queue panel showing tabs for current queue, playlists, directories, likes, and all songs.
- translations:
- locale: en-us
- summary: Fast navigation for large local libraries.
- modalContent: Elevate organizes the music library through a navigable queue panel with tabs for the current queue, playlists, directories, liked songs, and the complete library. Each tab loads only when it becomes active, which helps reduce unnecessary work and keeps the interface responsive. Large lists are handled with virtualization, allowing the user to browse extensive music collections without freezes or heavy loading moments.

- flexDirection: row-reverse
- coverImage: Screenshot of the playlists and directories views showing imported playlists, grouped folders, and random playback actions.
- translations:
- locale: en-us
- summary: Playlists and directories as flexible playback sources.
- modalContent: Elevate treats playlists and directories as first-class playback sources. Users can import playlists, browse grouped directories, select a collection, preserve the original order, or start a random playlist or directory. Before playback, sources are validated to make sure they exist and contain tracks, so empty or invalid collections show controlled feedback instead of interrupting the listening experience.

- flexDirection: row
- coverImage: Screenshot of the statistics and feed pages showing rankings for listening time, views, repeats, skips, and recent activity.
- translations:
- locale: en-us
- summary: Listening telemetry and collection insights.
- modalContent: Elevate includes statistics and feed views that transform listening activity into useful insights. The app tracks short views, long views, accumulated listening duration, repeats, skips, recent activity, and collection rankings. These metrics help users understand which songs and collections they listen to the most. Rankings are paginated for performance, but playback actions can still load the complete ranking instead of only the visible page.

- flexDirection: row-reverse
- coverImage: Screenshot of a song history detail page with cover artwork, listening stats, a timeline, and a daily activity chart.
- translations:
- locale: en-us
- summary: Song history, optimized covers, and resilient playback.
- modalContent: Elevate keeps a detailed history for each song, including listening records, added date, latest playback, peak activity, and timeline events. It also uses an optimized cover system with lazy loading, LRU cache limits, request deduplication, fallback images, and object URL cleanup to control memory usage. The main principle behind the product is resilience: secondary errors such as failed covers, rankings, or visualizer setup should never block playback or navigation.
