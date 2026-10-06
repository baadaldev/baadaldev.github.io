/**
 * Portfolio JavaScript — Md. Rakibul Islam (Baadal)
 * Lightweight, 60fps, Zero-dependency Executive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= 1. MOBILE NAVIGATION TOGGLE =================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.innerHTML = isOpen 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // ================= 2. ACTIVE NAVIGATION SPY =================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ================= 3. PROJECT FILTER TABS =================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ================= 4. COPY EMAIL TO CLIPBOARD =================
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');
  const copyTooltip = document.getElementById('copy-tooltip');

  if (copyBtn && emailText && copyTooltip) {
    copyBtn.addEventListener('click', async () => {
      const email = emailText.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        copyTooltip.textContent = 'Copied!';
        copyBtn.style.background = 'var(--accent-emerald)';
        copyBtn.style.color = 'var(--text-dark)';

        setTimeout(() => {
          copyTooltip.textContent = 'Copy';
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyTooltip.textContent = 'Copied!';
        setTimeout(() => {
          copyTooltip.textContent = 'Copy';
        }, 2000);
      }
    });
  }

  // ================= 5. HEADER SCROLL ELEVATION =================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      header.style.background = 'rgba(7, 10, 18, 0.9)';
    } else {
      header.style.boxShadow = '';
      header.style.background = 'rgba(7, 10, 18, 0.75)';
    }
  }, { passive: true });
});

// ================= 6. RESUME MODAL HANDLERS (GLOBAL) =================
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeResumeModal(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeResumeModal();
  }
});