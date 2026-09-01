import './styles.css';
import {
  bottomCrossClusterSvg,
  brgeSvg,
  buttonPixelClusterSvg,
  topCrossClusterSvg,
  topPixelClusterSvg,
} from './decorative-vectors';

type GalleryAsset = {
  name: string;
  src: string;
};

const galleryModules = import.meta.glob(
  '/gallary/**/*.{png,jpg,jpeg,webp,gif,avif}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const preferredOrder = ['result', 'thumb', 'gyogan', 'rokou', 'ポーズ', 'pose'];

const rawGalleryAssets: GalleryAsset[] = Object.entries(galleryModules)
  .map(([path, src]) => ({
    name: path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'work',
    src,
  }))
  .filter((asset) => !asset.name.toLowerCase().includes('support_me_on_kofi'));

const galleryAssets: GalleryAsset[] = rawGalleryAssets
  .filter((asset, _, collection) => {
    const duplicateBaseName = asset.name.replace(/\.[^.]+$/, '');
    return !collection.some((other) => other !== asset && other.name === duplicateBaseName);
  })
  .sort((a, b) => {
    const aIndex = preferredOrder.findIndex((key) => a.name.toLowerCase().includes(key.toLowerCase()));
    const bIndex = preferredOrder.findIndex((key) => b.name.toLowerCase().includes(key.toLowerCase()));
    if (aIndex !== -1 || bIndex !== -1) return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    return a.name.localeCompare(b.name, 'ja');
  });

const fallbackGallery: GalleryAsset[] = [
  { name: 'result', src: '/gallary/result.png' },
  { name: 'thumb', src: '/gallary/thumb.png' },
  { name: 'gyogan with HUD3', src: '/gallary/gyogan_with_HUD3.png' },
  { name: 'rokou', src: '/gallary/rokou.png' },
  { name: 'ポーズ１改善', src: '/gallary/ポーズ１改善.png' },
];

const assets = galleryAssets.length ? galleryAssets : fallbackGallery;

const iconGithub = `
  <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.68.08-.68 1.14.08 1.74 1.17 1.74 1.17 1.02 1.74 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.17-3.02-.12-.29-.51-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.62 1.55.23 2.69.11 2.98.73.79 1.17 1.79 1.17 3.02 0 4.32-2.63 5.28-5.14 5.56.41.35.77 1.04.77 2.1v3.11c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z"/>
  </svg>`;

const iconX = `
  <svg class="social-icon social-icon--x" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 3.875H5.117l11.966 15.895Z"/>
  </svg>`;

const iconDiscord = `
  <svg class="social-icon social-icon--discord" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M19.54 4.71A16.9 16.9 0 0 0 15.4 3.4l-.5 1.03a15.1 15.1 0 0 0-5.8 0L8.6 3.4a16.9 16.9 0 0 0-4.14 1.31C1.84 8.67 1.13 12.2 1.49 15.68a16.7 16.7 0 0 0 5.1 2.6l1.23-1.68a10.5 10.5 0 0 1-1.93-.93l.47-.37c3.72 1.72 7.76 1.72 11.44 0l.48.37c-.62.37-1.27.68-1.94.93l1.23 1.68a16.7 16.7 0 0 0 5.1-2.6c.42-4.04-.72-7.54-3.13-10.97ZM8.97 14.6c-1.1 0-2-.99-2-2.2s.88-2.2 2-2.2c1.12 0 2.01.99 2 2.2 0 1.21-.88 2.2-2 2.2Zm6.06 0c-1.1 0-2-.99-2-2.2s.88-2.2 2-2.2c1.12 0 2.01.99 2 2.2 0 1.21-.88 2.2-2 2.2Z"/>
  </svg>`;

const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const galleryMarkup = assets
  .slice(0, 5)
  .map(
    (asset, index) => `
      <a class="gallery-tile gallery-tile--${index + 1}" data-index="${index}" href="/works.html" aria-label="Open ${escapeHtml(asset.name)} in works">
        <img src="${asset.src}" alt="${escapeHtml(asset.name)} project preview" loading="eager" />
      </a>`,
  )
  .join('');

const extraGalleryMarkup = assets
  .slice(5)
  .map(
    (asset, index) => `
      <a class="gallery-extra" data-index="${index + 5}" href="/works.html" aria-label="Open ${escapeHtml(asset.name)} in works">
        <img src="${asset.src}" alt="${escapeHtml(asset.name)} project preview" loading="lazy" />
      </a>`,
  )
  .join('');

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="portfolio-stage" aria-label="ばたー / butter portfolio">
    <div class="blue-field">
      <aside class="left-mark" aria-label="Butter">
        <span class="left-mark__word">Butter</span>
      </aside>

      <div class="counter counter--top">59</div>
      <div class="pixel pixel--top">${topPixelClusterSvg}</div>
      <div class="edge-copy edge-copy--top" aria-hidden="true"><span>INDEX / ${String(Math.min(assets.length, 5)).padStart(2, '0')} WORKS</span></div>

      <div class="content-shell">
        <header class="hero-lockup">
          <div class="hero-lockup__panel">
            <div class="hero-lockup__brand"><span class="hero-lockup__brand-ja">ばたー</span><span class="hero-lockup__brand-en">/butter</span></div>
          </div>
          <div class="hero-lockup__status"><i class="hero-status-dot" data-hero-status-dot aria-hidden="true"></i><span data-hero-status>status:offline</span></div>
          <div class="hero-lockup__underline" aria-hidden="true"></div>
        </header>

        <div class="social-row" aria-label="social links">
          <a href="https://github.com/bata-san" target="_blank" rel="noopener noreferrer" class="social-link social-link--github" aria-label="GitHub: bata-san" title="GitHub: bata-san">
            ${iconGithub}<span class="social-link__divider" aria-hidden="true"></span><span>bata-san</span>
          </a>
          <a href="https://x.com/butter91138" target="_blank" rel="noopener noreferrer" class="social-link social-link--twitter" aria-label="X / Twitter: @butter91138" title="X / Twitter: @butter91138">
            ${iconX}<span class="social-link__divider" aria-hidden="true"></span><span>@butter91138</span>
          </a>
          <a href="https://discord.gg/CSkbMB5TG" target="_blank" rel="noopener noreferrer" class="social-link social-link--discord" aria-label="Discord server" title="Discord server">
            ${iconDiscord}<span class="social-link__divider" aria-hidden="true"></span><span>Discord</span>
          </a>
          <a class="support-pill" href="https://ko-fi.com/butter_san" target="_blank" rel="noopener noreferrer" aria-label="Support me on Ko-fi" title="Support me on Ko-fi">
            <img src="/ui/support_me_on_kofi_dark.png" alt="Support me on Ko-fi" />
          </a>
        </div>

        <section class="gallery-section" id="gallery" aria-labelledby="gallery-label">
          <div class="section-label" id="gallery-label">Gallery</div>
          <div class="gallery-grid">${galleryMarkup}</div>
          <div class="gallery-extra-grid">${extraGalleryMarkup}</div>
        </section>

        <div class="gallery-footer">
          <a class="view-all" href="/works.html" aria-label="View all works">
            <span>VIEW ALL WORKS</span><b class="pixel pixel--button">${buttonPixelClusterSvg}</b>
          </a>
        </div>

        <section class="contact-block" aria-label="contact information">
          <div class="contact-block__label">Contact:</div>
          <a class="contact-block__email" href="mailto:butter@unitze.net">butter@unitze.net</a>
          <div class="coordinates"><span>X:013</span><span>Y:123</span></div>
        </section>
      </div>

      <div class="crosshair crosshair--top">${topCrossClusterSvg}</div>
      <div class="crosshair crosshair--bottom">${bottomCrossClusterSvg}</div>
      <div class="brge-mark">${brgeSvg}</div>
    </div>

    <aside class="right-rail" aria-label="Unitze developer designer">
      <div class="crosshair crosshair--rail" aria-hidden="true"><span></span></div>
      <div class="rail-copy">UNITZE DEVELOPER/DESIGNER</div>
    </aside>

    <button type="button" class="theme-toggle" data-theme-toggle aria-label="Toggle color theme" title="Toggle color theme"><svg class="theme-toggle__icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="4.25"></circle><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.64 3.64l1.42 1.42M14.94 14.94l1.42 1.42M16.36 3.64l-1.42 1.42M5.06 14.94l-1.42 1.42"></path></svg><span data-theme-label>BLUE</span></button>

  </main>
`;

const qs = <T extends HTMLElement>(selector: string): T | null => document.querySelector<T>(selector);

const themeKey = 'hmpg-neo-theme';
const applyTheme = (theme: 'blue' | 'ink') => {
  document.documentElement.dataset.theme = theme;
  const label = qs<HTMLElement>('[data-theme-label]');
  if (label) label.textContent = theme.toUpperCase();
  try { localStorage.setItem(themeKey, theme); } catch { /* storage can be unavailable in a private context */ }
};
let initialTheme: 'blue' | 'ink' = 'blue';
try { initialTheme = localStorage.getItem(themeKey) === 'ink' ? 'ink' : 'blue'; } catch { /* keep the blue default */ }
applyTheme(initialTheme);
qs<HTMLButtonElement>('[data-theme-toggle]')?.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'ink' ? 'blue' : 'ink'));

const heroStatus = qs<HTMLElement>('[data-hero-status]');
const heroStatusDot = qs<HTMLElement>('[data-hero-status-dot]');
const updateDiscordStatus = (status: string, message: string) => {
  const normalizedStatus = ['online', 'idle', 'dnd', 'offline'].includes(status) ? status : 'offline';
  if (heroStatus) {
    heroStatus.textContent = `status:${normalizedStatus}`;
    heroStatus.title = message;
  }
  if (heroStatusDot) heroStatusDot.dataset.status = normalizedStatus;
};

const connectDiscord = () => {
  try {
    const socket = new WebSocket('wss://api.lanyard.rest/socket');
    socket.addEventListener('open', () => socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: '1069090920856821760' } })));
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data as string) as { t?: string; d?: { discord_status?: string; activities?: { name?: string; details?: string; type?: number; state?: string }[] } };
        if (data.t !== 'INIT_STATE' && data.t !== 'PRESENCE_UPDATE') return;
        const vscode = data.d?.activities?.find((activity) => activity.name === 'Visual Studio Code');
        const custom = data.d?.activities?.find((activity) => activity.type === 4);
        const details = vscode?.details ?? custom?.state;
        const status = data.d?.discord_status ?? 'offline';
        updateDiscordStatus(status, details ?? status.toUpperCase());
      } catch { /* ignore malformed presence packets */ }
    });
    socket.addEventListener('close', () => window.setTimeout(connectDiscord, 5_000));
    socket.addEventListener('error', () => socket.close());
  } catch {
    updateDiscordStatus('offline', 'OFFLINE');
    window.setTimeout(connectDiscord, 5_000);
  }
};
connectDiscord();

const stage = qs<HTMLElement>('.portfolio-stage');
const coordinates = qs<HTMLElement>('.coordinates');

const setCoordinates = (clientX: number, clientY: number) => {
  if (!stage || !coordinates) return;
  const bounds = stage.getBoundingClientRect();
  const x = Math.round(clientX - bounds.left);
  const y = Math.round(clientY - bounds.top);
  const xValue = String(Math.min(Math.round(bounds.width), Math.max(0, x))).padStart(3, '0');
  const yValue = String(Math.min(Math.round(bounds.height), Math.max(0, y))).padStart(3, '0');
  coordinates.innerHTML = `<span>X:${xValue}</span><span>Y:${yValue}</span>`;
};
stage?.addEventListener('pointermove', (event) => setCoordinates(event.clientX, event.clientY));

const fpsCounter = qs<HTMLElement>('.counter--top');
let frames = 0;
let sampleStart = performance.now();
const measureFps = (now: number) => {
  frames += 1;
  const elapsed = now - sampleStart;
  if (elapsed >= 500) {
    const fps = Math.round((frames * 1000) / elapsed);
    const fpsValue = String(Math.min(99, Math.max(0, fps))).padStart(2, '0');
    if (fpsCounter) fpsCounter.textContent = fpsValue;
    frames = 0;
    sampleStart = now;
  }
  requestAnimationFrame(measureFps);
};
requestAnimationFrame(measureFps);
