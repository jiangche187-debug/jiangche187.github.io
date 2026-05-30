/* ===== 导航栏滚动效果 ===== */
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

// 滚动时添加毛玻璃效果
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

/* ===== 移动端菜单切换 ===== */
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// 点击链接关闭菜单
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// 点击外部关闭菜单
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ===== 当前导航高亮 ===== */
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollY = window.pageYOffset + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

/* ===== 滚动渐入动画 (Intersection Observer) ===== */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// 观察 Hero 区动画元素
document.querySelectorAll('.animate').forEach(el => observer.observe(el));

// 观察博客卡片
document.querySelectorAll('.blog-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${index * 0.1}s`;
  observer.observe(card);
});

// 卡片进入视口
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.blog-card').forEach(card => cardObserver.observe(card));

// 观察关于部分
const aboutSection = document.querySelector('.about__grid');
if (aboutSection) {
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  aboutSection.style.opacity = '0';
  aboutSection.style.transform = 'translateY(30px)';
  aboutSection.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
  aboutObserver.observe(aboutSection);
}

// 观察联系表单
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  contactForm.style.opacity = '0';
  contactForm.style.transform = 'translateY(30px)';
  contactForm.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
  contactObserver.observe(contactForm);
}

/* ===== 表单提交 ===== */
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = form.querySelector('button');
  const originalText = btn.textContent;
  btn.textContent = '发送中...';
  btn.disabled = true;

  // 模拟发送请求
  setTimeout(() => {
    showToast('消息发送成功！感谢你的留言。');
    form.reset();
    btn.textContent = originalText;
    btn.disabled = false;
  }, 1200);
});

/* ===== Toast 通知 ===== */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3200);
}

/* ===== 统计数字计数动画 ===== */
const stats = document.querySelectorAll('.stat__number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.textContent.replace(/[^0-9]/g, ''));
      const suffix = el.textContent.replace(/[0-9]/g, '');
      const duration = 1500;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));
