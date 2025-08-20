# YouTube Lazy Load

A lightweight, high-performance, dependency-free TypeScript library to lazy-load YouTube videos. It replaces heavy YouTube iframes with a lightweight thumbnail, loading the video player only when the user clicks or when the video enters the viewport, dramatically improving your page's Core Web Vitals and load time.

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [API & Configuration](#api--configuration)
- [License](#license)

## Installation

Initially, you can download the files located in the `dist` folder after running the build command (`npm run build`). You will need `youtube-lazy-load.umd.js` and `style.css`.

Import them into your page like this:

```html
<!-- 1. Add the stylesheet to your <head> -->
<link rel="stylesheet" href="/path/to/dist/style.css">

<!-- 2. Add the script before your closing </body> tag -->
<script src="/path/to/dist/youtube-lazy-load.umd.js"></script>

<!-- The library will initialize automatically when loaded this way. -->
```

Alternatively, you can copy the contents of the JS file and place them inside a `<script>` tag in your HTML. The library will be available in the global window context as `YouTubeLazyLoad`.

## Usage

To embed a video, add a `<div>` element with the class `youtube-lazy-load` and a `data-video-id` attribute containing the ID of the YouTube video.

### Basic Example

This will render a video thumbnail that, when clicked, loads the YouTube player.

```html
<div class="youtube-lazy-load" data-video-id="56v174Lx-dQ"></div>
```

## Options

You can control the player's behavior by adding `data-*` attributes to the `<div>` element.

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data-video-id` | String | (Required) | The unique ID of the YouTube video. |
| `data-autoplay` | Boolean | `false` | If `true`, the video will play automatically when it becomes visible. Requires `data-muted="true"`. |
| `data-loop` | Boolean | `false` | If `true`, the video will loop continuously. |
| `data-muted` | Boolean | `false` | If `true`, the video will start without sound. This is required for autoplay to work in most browsers. |

### Example: Autoplay & Loop

This video will start playing automatically on mute as soon as it enters the viewport and will loop when it finishes.

```html
<div
  class="youtube-lazy-load"
  data-video-id="56v174Lx-dQ"
  data-autoplay="true"
  data-loop="true"
  data-muted="true">
</div>
```

## API & Configuration

For more advanced use cases, you can initialize the library manually and pass a configuration object. This is useful if you want to use a different CSS selector or change the default thumbnail quality.

```js
// This is only necessary if you want to override default options.
// The library initializes automatically when included via <script> tag.
document.addEventListener('DOMContentLoaded', () => {
  window.YouTubeLazyLoad.init({
    // Use a custom selector for your video elements
    selector: '.my-youtube-video',

    // Change the default thumbnail quality
    thumbnailQuality: 'hqdefault', // 'maxresdefault', 'sddefault', 'hqdefault'
  });
});

```

## License

This project is open-source software licensed under the [MIT license](LICENSE).
