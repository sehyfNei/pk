const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const state = { site: null, blogs: [], testimonialIndex: 0 };

function safeJSON(path, fallback) {
  return fetch(path).then((r) => (r.ok ? r.json() : fallback)).catch(() => fallback);
}

function initTheme() {
  const current = localStorage.getItem('theme');
  if (current) document.documentElement.setAttribute('data-theme', current);
  $('#theme-toggle')?.addEventListener('click', () => {
    const now = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', now === 'dark' ? '' : 'light');
    localStorage.setItem('theme', now);
  });
}

function initMenu() {
  $('#menu-btn')?.addEventListener('click', () => $('#nav')?.classList.toggle('open'));
}

function cardHTML(title, text, extra = '') {
  return `<article class="card glass"><h3>${title}</h3><p class="muted">${text}</p>${extra}</article>`;
}

function renderHome() {
  if (!state.site) return;
  const { stats, products, services, pricing, testimonials, faq } = state.site;

  const statsEl = $('#stats');
  if (statsEl) statsEl.innerHTML = stats.map((s) => `<div class="stat"><b>${s.value}</b><span class="muted">${s.label}</span></div>`).join('');

  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const catSel = $('#category-filter');
  if (catSel) catSel.innerHTML = categories.map((c) => `<option value="${c}">${c === 'all' ? 'All categories' : c}</option>`).join('');

  const renderProducts = () => {
    const q = ($('#search')?.value || '').toLowerCase();
    const cat = $('#category-filter')?.value || 'all';
    const sort = $('#sort-by')?.value || 'name';
    let list = products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    list.sort((a, b) => (sort === 'revenue' ? b.revenue - a.revenue : a.name.localeCompare(b.name)));

    const grid = $('#products-grid');
    if (!grid) return;
    grid.innerHTML = list.map((p) => `<article class="card glass product"><h3>${p.name}</h3><p class="muted">${p.description}</p><span class="pill">${p.category} • Revenue ${p.revenue}/10</span></article>`).join('');
  };

  ['#search', '#category-filter', '#sort-by'].forEach((id) => $(id)?.addEventListener('input', renderProducts));
  $('#category-filter')?.addEventListener('change', renderProducts);
  $('#sort-by')?.addEventListener('change', renderProducts);
  renderProducts();

  $('#services-grid') && ($('#services-grid').innerHTML = services.map((s) => cardHTML(s.title, s.copy)).join(''));
  $('#pricing-grid') && ($('#pricing-grid').innerHTML = pricing.map((p) => cardHTML(`${p.plan} — ${p.price}`, p.items.join(' • '))).join(''));

  const renderTestimonial = () => {
    const t = testimonials[state.testimonialIndex % testimonials.length];
    $('#testimonial-card') && ($('#testimonial-card').innerHTML = `<h3>${t.name}</h3><p class="muted">“${t.text}”</p>`);
  };
  $('#prev-testimonial')?.addEventListener('click', () => { state.testimonialIndex = (state.testimonialIndex - 1 + testimonials.length) % testimonials.length; renderTestimonial(); });
  $('#next-testimonial')?.addEventListener('click', () => { state.testimonialIndex = (state.testimonialIndex + 1) % testimonials.length; renderTestimonial(); });
  renderTestimonial();

  const faqEl = $('#faq-list');
  if (faqEl) {
    faqEl.innerHTML = faq.map((f, i) => `<div class="faq-item" data-i="${i}"><button class="faq-q">${f.q}</button><div class="faq-a">${f.a}</div></div>`).join('');
    $$('.faq-q').forEach((q) => q.addEventListener('click', (e) => e.target.closest('.faq-item').classList.toggle('open')));
  }

  const blogGrid = $('#blog-grid');
  if (blogGrid) {
    blogGrid.innerHTML = state.blogs.slice(0, 3).map((b) => `<article class="card glass"><h3>${b.title}</h3><p class="muted">${b.excerpt}</p><a class="btn btn-glass" href="blog.html?slug=${b.slug}">Read</a></article>`).join('');
  }
}

function renderBlogPage() {
  const listEl = $('#blog-list');
  if (!listEl) return;
  const searchEl = $('#blog-search');
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const renderList = () => {
    const q = (searchEl?.value || '').toLowerCase();
    const list = state.blogs.filter((b) => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q));
    listEl.innerHTML = list.map((b) => `<article class="card glass"><h3>${b.title}</h3><p class="muted">${b.date} • ${b.category}</p><p class="muted">${b.excerpt}</p><a class="btn btn-glass" href="blog.html?slug=${b.slug}">Open Post</a></article>`).join('');
  };
  searchEl?.addEventListener('input', renderList);
  renderList();

  if (slug) {
    const post = state.blogs.find((b) => b.slug === slug);
    if (post) {
      const postEl = $('#blog-post');
      postEl.classList.remove('hidden');
      postEl.innerHTML = `<h2>${post.title}</h2><p class="muted">${post.date} • ${post.category}</p>${post.content}`;
      postEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function initForms() {
  $('#lead-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    $('#form-status').textContent = `Thanks ${data.get('name')}, your request for "${data.get('interest')}" is recorded. Connect this to Formspree/API for production.`;
    e.currentTarget.reset();
  });

  $('#newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#newsletter-status').textContent = 'Subscribed successfully (demo mode). Connect a real mailing service to go live.';
    e.currentTarget.reset();
  });
}

function initCanvas() {
  const canvas = $('#bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: Math.min(100, Math.floor(window.innerWidth / 15)) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.8 + 0.6
    }));
  };
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(125, 150, 255, 0.9)'; ctx.fill();
    });
    requestAnimationFrame(tick);
  };
  resize();
  tick();
  window.addEventListener('resize', resize);
}

async function init() {
  $('#year') && ($('#year').textContent = new Date().getFullYear());
  initTheme();
  initMenu();
  initForms();
  initCanvas();

  [state.site, state.blogs] = await Promise.all([
    safeJSON('data/site.json', null),
    safeJSON('data/blogs.json', [])
  ]);

  renderHome();
  renderBlogPage();
}

init();
