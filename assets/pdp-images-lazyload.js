document.addEventListener('DOMContentLoaded', () => {

  const lazyLoadImage = (img) => {
    if (!img || img.dataset.loaded === 'true') return;

    console.log('Loading image:', img.dataset.src);

    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }

    img.dataset.loaded = 'true';
  };

  const observerOptions = {
    root: null,            // viewport
    threshold: 0.05         // load when 5% visible
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        lazyLoadImage(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Function to start observing one or more images
  const observeImages = (images) => {
    images.forEach(img => {
      if (!img.dataset.loaded) {
        imageObserver.observe(img);
      }
    });
  };

  // Initially observe all existing lazyload-image elements
  observeImages(document.querySelectorAll('img.lazyload-image'));

  // Watch for new elements added to the DOM
  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          if (node.matches && node.matches('img.lazyload-image')) {
            observeImages([node]);
          } else {
            // Check descendants
            const imgs = node.querySelectorAll?.('img.lazyload-image');
            if (imgs?.length) {
              observeImages(imgs);
            }
          }
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

});
