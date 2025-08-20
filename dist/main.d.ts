interface YouTubeEmbedOptions {
    selector?: string;
    thumbnailQuality?: 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault';
    observerThreshold?: number;
    observerRootMargin?: string;
    defaultParams?: URLSearchParams;
}
export declare class YouTubeLazyLoad {
    private static embedCache;
    private element;
    private videoId;
    private autoplay;
    private loop;
    private muted;
    private isLoaded;
    private isLoading;
    private playColor?;
    private static config;
    private constructor();
    /**
     * Inicializa todas as instâncias da biblioteca no DOM.
     * @param options - Configurações opcionais para personalizar o comportamento.
     */
    static init(options?: YouTubeEmbedOptions): void;
    private init;
    private createDOMStructure;
    private loadThumbnail;
    private setupEventListeners;
    private setupAutoplay;
    private preconnect;
    private loadVideo;
    private createIframe;
    private addIndicators;
    private static observeDOM;
}
export {};
