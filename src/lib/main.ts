import './style.css';

interface YouTubeEmbedOptions {
  selector?: string;
  thumbnailQuality?: 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault';
  observerThreshold?: number;
  observerRootMargin?: string;
  defaultParams?: URLSearchParams;
}

export class YouTubeLazyLoad {
  private static embedCache = new Map<HTMLElement, YouTubeLazyLoad>();
  private element: HTMLElement;
  private videoId: string;
  private autoplay: boolean;
  private loop: boolean;
  private muted: boolean;
  private isLoaded = false;
  private isLoading = false;
  private playColor?: string;
  private static config: Required<YouTubeEmbedOptions>;

  private constructor(element: HTMLElement) {
    this.element = element;
    this.videoId = element.dataset.videoId || '';
    this.autoplay = element.dataset.autoplay === 'true';
    this.loop = element.dataset.loop === 'true';
    this.muted = element.dataset.muted === 'true';
    this.playColor = element.dataset.playColor;

    if (!this.videoId) {
      console.error('YouTube Lazy Load: O atributo data-video-id é obrigatório.', this.element);
      return;
    }

    this.init();
  }

  /**
   * Inicializa todas as instâncias da biblioteca no DOM.
   * @param options - Configurações opcionais para personalizar o comportamento.
   */
  public static init(options: YouTubeEmbedOptions = {}): void {
    const defaultConfig: Required<YouTubeEmbedOptions> = {
      selector: '.youtube-lazy-load',
      thumbnailQuality: 'maxresdefault',
      observerThreshold: 0.25,
      observerRootMargin: '50px',
      defaultParams: new URLSearchParams({
        rel: '0',
        showinfo: '0',
        modestbranding: '1',
        iv_load_policy: '3',
      }),
    };

    this.config = { ...defaultConfig, ...options };

    const embeds = document.querySelectorAll<HTMLElement>(this.config.selector);
    embeds.forEach(embed => {
      if (!this.embedCache.has(embed)) {
        this.embedCache.set(embed, new YouTubeLazyLoad(embed));
      }
    });

    // Observa por novos elementos adicionados dinamicamente
    this.observeDOM();
  }

  private init(): void {
    this.element.classList.add('youtube-embed');
    this.createDOMStructure();
    this.loadThumbnail();
    this.setupEventListeners();
    this.setupAutoplay();
    this.addIndicators();
  }

  private createDOMStructure(): void {
    const content = document.createElement('div');
    content.className = 'youtube-embed__content';

    const playButton = document.createElement('div');
    playButton.className = 'youtube-embed__play';
    if(this.playColor) playButton.style.setProperty('--play-color', this.playColor);

    content.appendChild(playButton);
    this.element.innerHTML = ''
    this.element.appendChild(content);
  }

  private loadThumbnail(): void {
    const thumbnailUrl = `https://img.youtube.com/vi/${this.videoId}/${YouTubeLazyLoad.config.thumbnailQuality}.jpg`;
    const img = new Image();

    img.className = 'youtube-embed__thumbnail';
    img.alt = `Thumbnail for YouTube video ${this.videoId}`;
    img.loading = 'lazy';

    img.onerror = () => {
      if (YouTubeLazyLoad.config.thumbnailQuality === 'maxresdefault') {
        img.src = `https://img.youtube.com/vi/${this.videoId}/sddefault.jpg`;
      }
    };
    
    img.src = thumbnailUrl;
    const content = this.element.querySelector('.youtube-embed__content');
    content?.insertBefore(img, content.firstChild);
  }

  private setupEventListeners(): void {
    if (!this.autoplay) {
      this.element.addEventListener('click', this.loadVideo, { once: true });
    }
    this.element.addEventListener('mouseenter', this.preconnect, { once: true });
  }

  private setupAutoplay(): void {
    if (!this.autoplay) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadVideo();
              observer.unobserve(this.element);
            }
          });
        },
        {
          threshold: YouTubeLazyLoad.config.observerThreshold,
          rootMargin: YouTubeLazyLoad.config.observerRootMargin,
        }
      );
      observer.observe(this.element);
    } else {
      // Fallback para navegadores antigos
      setTimeout(() => this.loadVideo(), 300);
    }
  }

  private preconnect = (): void => {
    const urls = [
      'https://www.youtube-nocookie.com',
      'https://www.google.com',
      'https://googleads.g.doubleclick.net',
      'https://static.doubleclick.net',
    ];
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      document.head.appendChild(link);
    });
  };

  private loadVideo = (): void => {
    if (this.isLoaded || this.isLoading) return;

    this.isLoading = true;
    this.element.classList.add('youtube-embed--loading');

    const iframe = this.createIframe();
    const content = this.element.querySelector('.youtube-embed__content');

    iframe.onload = () => {
      this.isLoaded = true;
      this.isLoading = false;
      this.element.classList.remove('youtube-embed--loading');
      this.element.classList.add('youtube-embed--loaded');

      const thumbnail = content?.querySelector('.youtube-embed__thumbnail');
      const playButton = content?.querySelector('.youtube-embed__play') as HTMLElement;

      thumbnail?.remove();
      playButton?.remove();
    };

    content?.appendChild(iframe);
  };

  private createIframe(): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    const params = new URLSearchParams(YouTubeLazyLoad.config.defaultParams);

    params.set('autoplay', '1');
    params.set('mute', this.muted ? '1' : '0');
    if (this.loop) {
      params.set('loop', '1');
      params.set('playlist', this.videoId);
    }

    iframe.src = `https://www.youtube-nocookie.com/embed/${this.videoId}?${params.toString()}`;
    iframe.title = `YouTube video player - ${this.videoId}`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';

    return iframe;
  }

  private addIndicators(): void {
    if (this.autoplay) this.element.classList.add('youtube-embed--autoplay');
    if (this.loop) this.element.classList.add('youtube-embed--loop');
  }

  private static observeDOM(): void {
    if (!('MutationObserver' in window)) return;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && (node as HTMLElement).matches(this.config.selector)) {
              this.init();
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}

if (typeof window !== 'undefined') {
  (window as any).YouTubeLazyLoad = YouTubeLazyLoad;
  document.addEventListener('DOMContentLoaded', () => YouTubeLazyLoad.init());
}
