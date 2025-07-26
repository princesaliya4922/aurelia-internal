window.lazyAssets = window.lazyAssets || {
    loaded: false,
    queue: [],

    add: function (type, url) {
        this.queue.push({ type: type, url: url });
    },

    loadAll: function () {
        if (this.loaded) return;
        this.loaded = true;

        this.queue.forEach(function (asset) {
            if (asset.type === 'css') {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = asset.url;
                document.head.appendChild(link);
            } else if (asset.type === 'js') {
                const script = document.createElement('script');
                script.src = asset.url;
                script.defer = true;
                document.head.appendChild(script);
            }
        }.bind(this));
    },

    init: function () {
        const self = this;

        document.addEventListener('click', function () {
            self.loadAll();
        }, { once: true });

        document.addEventListener('scroll', function () {
            self.loadAll();
        }, { once: true });

        document.addEventListener('mousemove', function () {
            self.loadAll();
        }, { once: true });

        document.addEventListener('touchstart', function () {
            self.loadAll();
        }, { once: true });
    }
};

window.lazyAssets.init();