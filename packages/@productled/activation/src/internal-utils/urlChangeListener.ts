class URLChangeListener {
    private listnerResonse : URLListenerResponse;
    private callback: (listenerResponse : URLListenerResponse) => void;
    private interval: number;
    private observer: MutationObserver | null = null;
    private intervalId: number | null = null;

    constructor(callback: (listenerResponse : URLListenerResponse) => void, interval: number = 1000) {
        this.callback = callback;
        this.interval = interval;
        this.listnerResonse = {
            previousUrl : window.location.href,
            previousPath : window.location.pathname,
            currentUrl : window.location.href,
            currentPath : window.location.pathname
        };
    }

    // Initialize the listener
    public init(): void {
        // Listen to history events (back/forward navigation)
        window.addEventListener('popstate', this.checkUrlChange.bind(this));

        // Observe mutations to the DOM (like in single-page apps)
        this.observer = new MutationObserver(this.checkUrlChange.bind(this));
        this.observer.observe(document, { childList: true, subtree: true });

        // Poll for other changes (like programmatic navigation)
        this.intervalId = window.setInterval(this.checkUrlChange.bind(this), this.interval);
    }

    // Function to check URL changes
    private checkUrlChange(): void {
        if (window.location.href !== this.listnerResonse.currentUrl) {
            const response = {
                previousUrl : this.listnerResonse.currentUrl,
                previousPath : this.listnerResonse.currentPath,
                currentUrl : window.location.href,
                currentPath : window.location.pathname
            } as URLListenerResponse
            this.callback(response);
            this.listnerResonse = response;
        }
    }

    // Stop the listener
    public stop(): void {
        // Clean up event listeners and observers
        window.removeEventListener('popstate', this.checkUrlChange.bind(this));
        if (this.observer) this.observer.disconnect();
        if (this.intervalId !== null) window.clearInterval(this.intervalId);
    }
}

export interface URLListenerResponse
{
    previousUrl : string,
    currentUrl : string,
    previousPath : string,
    currentPath : string
}

export default URLChangeListener;
