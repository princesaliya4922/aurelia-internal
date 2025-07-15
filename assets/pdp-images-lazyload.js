document.addEventListener('DOMContentLoaded', () => {
  // This function finds the data attributes and swaps them to load the image.
  const lazyLoadSlide = (slide) => {
    const picture = slide.querySelector('picture');
    // Exit if there's no picture or if it has already been loaded.
    if (!picture || picture.dataset.loaded === 'true') {
      return;
    }

    console.log('IntersectionObserver: Slide is visible, loading image for:', slide.dataset.mediaId);

    const sources = picture.querySelectorAll('source[data-srcset]');
    const img = picture.querySelector('img[data-src]');

    sources.forEach(source => {
      if (source.dataset.srcset) {
        source.srcset = source.dataset.srcset;
        source.removeAttribute('data-srcset');
      }
    });

    if (img && img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    // Mark as loaded to prevent this from running again on the same slide.
    picture.dataset.loaded = 'true';
  };

  // Check if IntersectionObserver is supported by the browser.
  if ('IntersectionObserver' in window) {
    // Options for the observer.
    const observerOptions = {
      // The root is the scrolling container. For a carousel, this is often the slider itself.
      // If null, it defaults to the browser's viewport.
      root: document.querySelector('.product__media-list'),
      // The image will load when 50% of the slide is visible.
      threshold: 0.5
    };

    const slideObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // When a slide entry is intersecting (visible)...
        if (entry.isIntersecting) {
          // Call our function to load the image.
          lazyLoadSlide(entry.target);
          // Stop observing this slide now that it's loaded.
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Find all slides except the first one (which is already loaded) and tell the observer to watch them.
    const slidesToObserve = document.querySelectorAll('.product__media-item:not(:first-child)');
    slidesToObserve.forEach(slide => {
      slideObserver.observe(slide);
    });

  } else {
    // Fallback for very old browsers that don't support IntersectionObserver.
    console.warn('IntersectionObserver not supported. Loading all images as a fallback.');
    document.querySelectorAll('.product__media-item:not(:first-child)').forEach(slide => {
      lazyLoadSlide(slide);
    });
  }
});