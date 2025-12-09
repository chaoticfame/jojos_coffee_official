// JoJo's Bizarre Café Script
(function() {
  function init() {
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const header = document.querySelector('.site-header');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }

    // Sticky header scroll effect
    if (header) {
      // Check initial scroll position
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      }

      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }

    // Scroll Animation Observer
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Select elements to animate
    // First, add class to common elements that should be animated
    const commonElements = document.querySelectorAll('.card, .section-title, .about-text, .character-card, .life-card, .stand-layer, .stat-card, .slide-content');
    commonElements.forEach(el => {
      el.classList.add('reveal-on-scroll');
    });

    // Now observe all elements with the reveal class (including those manually added in HTML)
    const scrollElements = document.querySelectorAll('.reveal-on-scroll');
    scrollElements.forEach(el => {
      observer.observe(el);
    });

    // User nav dropdowns
    const userDropdowns = document.querySelectorAll('.nav-user');
    if (userDropdowns.length > 0) {
      userDropdowns.forEach(drop => {
        const trigger = drop.querySelector('.nav-user-trigger');
        if (trigger) {
          trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            drop.classList.toggle('open');
          });
        }
      });

      // Close on click outside
      document.addEventListener('click', () => {
        document.querySelectorAll('.nav-user.open').forEach(d => d.classList.remove('open'));
      });
    }

    // Joestar Slider Logic
    const slides = document.querySelectorAll('.joestar-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
      // Wrap around
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      currentSlide = index;

      // Update slides
      slides.forEach((slide, i) => {
        if (i === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update indicators
      indicators.forEach((ind, i) => {
        if (i === currentSlide) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
    }

    if (slides.length > 0) {
      // Init first slide
      showSlide(0);

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          showSlide(currentSlide - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          showSlide(currentSlide + 1);
        });
      }

      indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => {
          showSlide(i);
        });
      });
    }

    // Simple cart quantity + totals logic on user dashboard cart view
    const orderContainer = document.querySelector('.order-layout');
    if (orderContainer) {
      function updateOrderTotals() {
        let subtotal = 0;
        document.querySelectorAll('.order-item').forEach(item => {
          const price = parseFloat(item.getAttribute('data-price') || '0');
          const qtyEl = item.querySelector('.qty-value');
          const qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 0 : 0;
          subtotal += price * qty;
        });

        // Total is now just the subtotal (no estimated taxes shown)
        const total = subtotal;

        const totalEl = document.querySelector('[data-order-total]');

        if (totalEl) totalEl.textContent = total.toFixed(2);
      }

      orderContainer.addEventListener('click', (e) => {
        const minusBtn = e.target.closest('.qty-minus');
        const plusBtn = e.target.closest('.qty-plus');
        const removeBtn = e.target.closest('.order-item-remove');

        if (minusBtn || plusBtn) {
          const item = e.target.closest('.order-item');
          if (!item) return;
          const qtyEl = item.querySelector('.qty-value');
          const qtyInput = item.querySelector('.qty-input-hidden');
          if (!qtyEl || !qtyInput) return;
          let qty = parseInt(qtyEl.textContent, 10) || 1;

          if (minusBtn) {
            qty = Math.max(1, qty - 1);
          } else if (plusBtn) {
            qty += 1;
          }

          qtyEl.textContent = qty;
          qtyInput.value = qty;
          updateOrderTotals();
        }

        // Note: removeBtn submits its own form, so no client-side removal needed here
      });

      // Initial calculation
      updateOrderTotals();
    }

    // Helper to update cart badge in nav
    function updateCartBadge(count) {
      const badge = document.querySelector('[data-cart-count]');
      if (!badge) return;
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove('is-empty');
      } else {
        badge.classList.add('is-empty');
      }
    }

    // Simple toast for cart feedback
    function showCartToast(itemName, count) {
      let container = document.querySelector('.cart-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'cart-toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = 'cart-toast-message';
      toast.textContent = `${itemName} added to your cart. Items in cart: ${count}.`;
      container.appendChild(toast);

      // Auto-remove after animation
      setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 2500);
    }

    // AJAX add-to-cart (used on both dashboard Order Menu and public menu.php)
    function setupAddToCart(rootSelector) {
      const root = document.querySelector(rootSelector);
      if (!root) return;

      root.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;

        const itemId = btn.getAttribute('data-item-id');
        const itemName = btn.getAttribute('data-item-name') || 'Item';

        // Optional size selector (used for Joestar Blends / Mixed Hamon drinks)
        let size = '';
        const card = btn.closest('.menu-item-card');
        if (card) {
          const sizeSelect = card.querySelector('[data-size-select]');
          if (sizeSelect) {
            size = sizeSelect.value || '';
          }
        }

        // Determine login state. On protected pages like dashboard we default to "true".
        const isLoggedIn = (typeof window.isLoggedIn !== 'undefined') ? !!window.isLoggedIn : true;

        // If guest tries to order from public menu, redirect to Sign In
        if (!isLoggedIn) {
          window.location.href = 'login.php';
          return;
        }

        const body = new URLSearchParams();
        body.append('action', 'add');
        body.append('item_id', itemId);
        if (size) {
          body.append('size', size);
        }

        fetch('cart_api.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body.toString()
        })
          .then(res => res.json())
          .then(data => {
            if (data && data.success) {
              updateCartBadge(data.cart_count);
              showCartToast(itemName, data.cart_count);
            }
          })
          .catch(() => {
            // Silent fail – you can add an error toast here if desired
          });
      });
    }

    // Attach add-to-cart behavior to dashboard Order Menu and public menu grid
    setupAddToCart('.order-menu-layer');
    setupAddToCart('.menu-grid-container');
  }

  // Expose togglePassword to global scope
  window.togglePassword = function(inputId, toggleBtn) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
      input.type = "text";
      toggleBtn.textContent = "Hide";
    } else {
      input.type = "password";
      toggleBtn.textContent = "Show";
    }
  };

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();