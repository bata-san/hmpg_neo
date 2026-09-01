import './styles.css';
import { workRecords } from './work-data';

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const themeKey = 'hmpg-neo-theme';
const app = document.querySelector<HTMLDivElement>('#works-app');

if (app) {
  app.innerHTML = `
    <main class="works-page">
      <header class="works-page__header">
        <a class="works-page__back" href="/">← HOME</a>
        <div class="works-page__counter">WORKS / ${String(workRecords.length).padStart(2, '0')}</div>
        <div class="works-page__gallery-meta" aria-hidden="true"><span>Gallery</span><span>01—${String(workRecords.length).padStart(2, '0')}</span></div>
        <h1><span>ばたー</span><em>/butter</em></h1>
      </header>
      <div class="works-page__toolbar">
        <div class="works-page__filters" role="group" aria-label="Filter works">
          <button type="button" data-filter="All" class="is-active">ALL</button>
          <button type="button" data-filter="3D">3D</button>
          <button type="button" data-filter="Design">DESIGN</button>
          <button type="button" data-filter="Web">WEB</button>
        </div>
        <label>SORT <select id="works-sort"><option value="latest">LATEST</option><option value="oldest">OLDEST</option><option value="name">NAME</option></select></label>
      </div>
      <section class="works-page__list" id="works-list" aria-live="polite"></section>
    </main>
    <button type="button" class="theme-toggle" data-theme-toggle aria-label="Toggle color theme" title="Toggle color theme"><svg class="theme-toggle__icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.25"></circle><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.64 3.64l1.42 1.42M14.94 14.94l1.42 1.42M16.36 3.64l-1.42 1.42M5.06 14.94l-1.42 1.42"></path></svg><span data-theme-label>BLUE</span></button>
  `;
}

const list = document.querySelector<HTMLElement>('#works-list');
const sort = document.querySelector<HTMLSelectElement>('#works-sort');
const state = { filter: 'All', sort: 'latest' };

const render = () => {
  if (!list) return;
  const records = [...workRecords]
    .filter((work) => state.filter === 'All' || work.category === state.filter)
    .sort((a, b) => state.sort === 'name'
      ? a.name.localeCompare(b.name, 'ja')
      : state.sort === 'oldest' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  list.innerHTML = records.map((work) => `
    <article class="works-page__card">
      <button type="button" class="works-page__summary" aria-expanded="false">
        <span class="works-page__index">${String(workRecords.indexOf(work) + 1).padStart(2, '0')}</span>
        <span class="works-page__thumb" aria-hidden="true"><img src="${work.src}" alt="" loading="lazy" /></span>
        <strong>${escapeHtml(work.name)}</strong>
        <span>${work.category} / ${work.date}</span>
        <b>+</b>
      </button>
      <div class="works-page__details">
        <button type="button" class="works-page__close" aria-label="Close details">×</button>
        <img src="${work.src}" alt="${escapeHtml(work.name)} preview" loading="lazy" />
        <div><span>${work.status}</span><p>${escapeHtml(work.summary)}</p><small>${work.tools.map(escapeHtml).join(' / ')}</small></div>
      </div>
    </article>`).join('');
};

document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    state.filter = button.dataset.filter ?? 'All';
    document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
    render();
  });
});
sort?.addEventListener('change', () => { state.sort = sort.value; render(); });
list?.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const close = target.closest<HTMLButtonElement>('.works-page__close');
  const card = target.closest<HTMLElement>('.works-page__card');
  if (close && card) {
    card.classList.remove('is-open');
    card.querySelector('.works-page__summary')?.setAttribute('aria-expanded', 'false');
    return;
  }
  const button = target.closest<HTMLButtonElement>('.works-page__summary');
  if (!button) return;
  const summaryCard = button.closest<HTMLElement>('.works-page__card');
  summaryCard?.classList.toggle('is-open');
  button.setAttribute('aria-expanded', String(summaryCard?.classList.contains('is-open')));
});

const applyTheme = (theme: 'blue' | 'ink') => {
  document.documentElement.dataset.theme = theme;
  const label = document.querySelector<HTMLElement>('[data-theme-label]');
  if (label) label.textContent = theme.toUpperCase();
  try { localStorage.setItem(themeKey, theme); } catch { /* ignore unavailable storage */ }
};
let initialTheme: 'blue' | 'ink' = 'blue';
try { initialTheme = localStorage.getItem(themeKey) === 'ink' ? 'ink' : 'blue'; } catch { /* keep blue */ }
applyTheme(initialTheme);
document.querySelector<HTMLButtonElement>('[data-theme-toggle]')?.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'ink' ? 'blue' : 'ink'));
render();
