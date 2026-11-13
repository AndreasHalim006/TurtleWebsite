const storageKey = 'aristurtle-analytics-consent-v1';
const consentLifetime = 180 * 24 * 60 * 60 * 1000;
type Choice = 'accepted' | 'rejected';
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function initAnalyticsConsent() {
  const root = document.querySelector<HTMLElement>('#analytics-consent');
  const id = root?.dataset.measurementId || '';
  if (!root || !/^G-[A-Z0-9]+$/.test(id) || !['aristurtle.gr', 'www.aristurtle.gr'].includes(location.hostname)) return;

  const banner = root.querySelector<HTMLElement>('[data-consent-banner]')!;
  const settings = root.querySelector<HTMLButtonElement>('[data-consent-settings]')!;
  const status = root.querySelector<HTMLElement>('[data-consent-status]')!;
  const analyticsWindow = window as AnalyticsWindow;
  const disableKey = `ga-disable-${id}`;
  let loaded = false;
  let choice: Choice | null = null;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && (saved.choice === 'accepted' || saved.choice === 'rejected') &&
      typeof saved.timestamp === 'number' && saved.timestamp <= Date.now() &&
      Date.now() - saved.timestamp < consentLifetime) choice = saved.choice;
  } catch { /* Consent remains undecided when storage is unavailable or invalid. */ }

  const showBanner = (show: boolean) => {
    banner.hidden = !show;
    settings.setAttribute('aria-expanded', String(show));
  };

  const loadAnalytics = () => {
    if (loaded) return;
    loaded = true;
    Reflect.set(window, disableKey, false);
    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    // gtag expects an Arguments object, not an array.
    analyticsWindow.gtag = function () { analyticsWindow.dataLayer!.push(arguments); };
    const gtag = analyticsWindow.gtag;
    gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: consentLifetime / 1000,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
  };

  const disableAnalytics = () => {
    Reflect.set(window, disableKey, true);
    if (loaded) analyticsWindow.gtag?.('consent', 'update', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    // Our GA cookies use the default root path and the current/parent domain.
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (name !== '_ga' && !name.startsWith('_ga_')) continue;
      const domains = ['', location.hostname, 'aristurtle.gr'];
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
      }
    }
  };

  const choose = (next: Choice) => {
    choice = next;
    try { localStorage.setItem(storageKey, JSON.stringify({ choice, timestamp: Date.now() })); }
    catch { /* The selection still applies to this page when storage is blocked. */ }
    if (choice === 'accepted') loadAnalytics();
    else disableAnalytics();
    showBanner(false);
    status.textContent = choice === 'accepted' ? 'Analytics accepted.' : 'Analytics rejected.';
    settings.focus({ preventScroll: true });
    // A fresh page unloads Google's listeners as well as disabling collection.
    if (choice === 'rejected' && loaded) location.reload();
  };

  root.querySelector('[data-consent-accept]')!.addEventListener('click', () => choose('accepted'));
  root.querySelector('[data-consent-reject]')!.addEventListener('click', () => choose('rejected'));
  settings.addEventListener('click', () => {
    showBanner(true);
    root.querySelector<HTMLElement>('#analytics-heading')!.focus({ preventScroll: true });
  });
  // Reflect withdrawal made in another open tab without waiting for navigation.
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey || event.key === null) {
      disableAnalytics();
      location.reload();
    }
  });

  root.hidden = false;
  showBanner(choice === null);
  if (choice === 'accepted') loadAnalytics();
  else disableAnalytics();
}
