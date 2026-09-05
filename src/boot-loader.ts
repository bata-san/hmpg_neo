import './boot-loader.css';

type BootStep = {
  label: string;
  detail: () => string;
  delay: number;
};

const SESSION_KEY = 'hmpg-neo-booted';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const alreadyBooted = (() => {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
})();

if (!alreadyBooted && !reducedMotion) {
  document.documentElement.classList.add('is-booting');

  const boot = document.createElement('div');
  boot.className = 'boot-screen';
  boot.setAttribute('role', 'status');
  boot.setAttribute('aria-live', 'polite');
  boot.setAttribute('aria-label', 'Portfolio loading');
  boot.innerHTML = `
    <div class="boot-screen__edge" aria-hidden="true">HMPG_NEO / BOOT</div>
    <div class="boot-terminal">
      <div class="boot-terminal__head">
        <span>BOOT SEQUENCE</span>
        <span>REV.2026.09</span>
      </div>
      <div class="boot-terminal__log" data-boot-log></div>
      <div class="boot-terminal__footer">
        <span data-boot-state>INITIALIZING</span>
        <span class="boot-terminal__progress" data-boot-progress>00</span>
      </div>
    </div>
  `;

  document.body.prepend(boot);

  const log = boot.querySelector<HTMLElement>('[data-boot-log]');
  const state = boot.querySelector<HTMLElement>('[data-boot-state]');
  const progress = boot.querySelector<HTMLElement>('[data-boot-progress]');

  const gpuStatus = () => 'gpu' in navigator ? 'WEBGPU AVAILABLE' : 'WEBGPU FALLBACK';
  const colourMode = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK SIGNAL' : 'LIGHT SIGNAL';

  const steps: BootStep[] = [
    { label: 'SYS', detail: () => 'HMPG_NEO / PORTFOLIO', delay: 90 },
    { label: 'GPU', detail: gpuStatus, delay: 110 },
    { label: 'CLR', detail: colourMode, delay: 95 },
    { label: 'UI', detail: () => 'COMPOSITION READY', delay: 105 },
    { label: 'NET', detail: () => navigator.onLine ? 'LINK ONLINE' : 'LINK OFFLINE', delay: 110 },
    { label: 'RUN', detail: () => 'ENTER PORTFOLIO', delay: 120 },
  ];

  const start = performance.now();
  let closed = false;

  const timestamp = () => {
    const elapsed = Math.max(0, performance.now() - start);
    const seconds = Math.floor(elapsed / 1000).toString().padStart(2, '0');
    const millis = Math.floor(elapsed % 1000).toString().padStart(3, '0');
    return `${seconds}.${millis}`;
  };

  const appendLine = (step: BootStep, index: number) => {
    if (!log || !progress) return;
    const row = document.createElement('div');
    row.className = 'boot-terminal__line';
    row.innerHTML = `<span>${timestamp()}</span><b>${step.label}</b><span>${step.detail()}</span><i>OK</i>`;
    log.append(row);
    requestAnimationFrame(() => row.classList.add('is-visible'));
    progress.textContent = String(Math.round(((index + 1) / steps.length) * 100)).padStart(2, '0');
  };

  const closeBoot = () => {
    if (closed) return;
    closed = true;
    if (state) state.textContent = 'READY';
    if (progress) progress.textContent = '100';
    boot.classList.add('is-complete');
    document.documentElement.classList.remove('is-booting');
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Storage may be unavailable in private contexts.
    }
    window.dispatchEvent(new CustomEvent('hmpg:boot-complete'));
    window.setTimeout(() => boot.remove(), 360);
  };

  let elapsedDelay = 40;
  steps.forEach((step, index) => {
    elapsedDelay += step.delay;
    window.setTimeout(() => {
      appendLine(step, index);
      if (index === steps.length - 1) window.setTimeout(closeBoot, 130);
    }, elapsedDelay);
  });

  // Never let the enhancement block the site if a timer stalls.
  window.setTimeout(closeBoot, 1_450);
} else {
  queueMicrotask(() => window.dispatchEvent(new CustomEvent('hmpg:boot-complete')));
}
