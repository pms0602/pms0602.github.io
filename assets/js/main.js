(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.querySelector('.main-nav');

  const setTheme = (theme, animate = true) => {
    if (animate) {
      root.classList.add('theme-transition');
      window.setTimeout(() => root.classList.remove('theme-transition'), 900);
    }
    root.dataset.theme = theme;
    localStorage.setItem('minseung-theme', theme);
    if (themeButton) {
      const next = theme === 'dark' ? '밝은 모드로 전환' : '다크 모드로 전환';
      themeButton.setAttribute('aria-label', next);
      themeButton.setAttribute('title', next);
    }
  };

  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? '메뉴 열기' : '메뉴 닫기');
      nav.classList.toggle('is-open', !expanded);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  // Homepage category filtering and live search
  const cards = [...document.querySelectorAll('.post-card')];
  const categoryButtons = [...document.querySelectorAll('[data-filter]')];
  const searchInput = document.getElementById('post-search');
  const note = document.getElementById('filter-note');
  const noResults = document.getElementById('no-results');
  let activeFilter = 'all';

  const updatePosts = () => {
    const query = (searchInput?.value || '').trim().toLocaleLowerCase('ko');
    let visible = 0;
    cards.forEach(card => {
      const category = card.dataset.category || '';
      const search = (card.dataset.search || '') + ' ' + card.textContent;
      const matchesCategory = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = search.toLocaleLowerCase('ko').includes(query);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (noResults) noResults.hidden = visible > 0 || cards.length === 0;
    if (note) {
      note.textContent = activeFilter === 'all'
        ? `전체 기록 · ${visible}개`
        : `${activeFilter} · ${visible}개`;
    }
  };

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.classList.contains('category-card')) {
        activeFilter = button.dataset.filter;
        document.querySelectorAll('.filter-reset').forEach(b => b.classList.remove('is-active'));
        document.querySelectorAll('.category-card').forEach(b => b.classList.toggle('is-selected', b === button));
      } else {
        activeFilter = button.dataset.filter;
        document.querySelectorAll('.filter-reset').forEach(b => b.classList.toggle('is-active', b === button));
        document.querySelectorAll('.category-card').forEach(b => b.classList.remove('is-selected'));
      }
      updatePosts();
      document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  searchInput?.addEventListener('input', updatePosts);
  updatePosts();

  // Build a table of contents for article headings.
  const articleContent = document.getElementById('article-content');
  const toc = document.getElementById('toc');
  if (articleContent && toc) {
    const headings = [...articleContent.querySelectorAll('h2, h3')];
    if (headings.length) {
      const list = document.createElement('ul');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = 'section-' + (index + 1);
        }
        const item = document.createElement('li');
        if (heading.tagName === 'H3') item.classList.add('toc-subitem');
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        item.appendChild(link);
        list.appendChild(item);
      });
      toc.replaceChildren(list);
    } else {
      toc.innerHTML = '<p class="muted">이 글에는 목차가 없습니다.</p>';
    }
  }

  document.getElementById('copy-link')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(window.location.href);
      button.textContent = '복사 완료 ✓';
      window.setTimeout(() => button.textContent = '링크 복사 ↗', 1600);
    } catch {
      button.textContent = '주소를 복사할 수 없어요';
    }
  });
})();
