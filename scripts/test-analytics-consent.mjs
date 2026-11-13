import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const key = 'aristurtle-analytics-consent-v1';
const source = readFileSync(new URL('../src/scripts/analytics-consent.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

function setup({ saved = null, host = 'aristurtle.gr', id = 'G-TEST123', blocked = false } = {}) {
  const nodes = new Map();
  const scripts = [];
  const deletedCookies = [];
  const storage = new Map(saved ? [[key, saved]] : []);
  const events = new Map();
  let reloads = 0;
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, {
      hidden: true, textContent: '', attributes: {}, listeners: {},
      dataset: { measurementId: id },
      querySelector: node,
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(event, fn) { this.listeners[event] = fn; },
      focus() { this.focused = true; },
    });
    return nodes.get(selector);
  };
  const window = { addEventListener: (event, fn) => events.set(event, fn) };
  const context = {
    exports: {}, window,
    location: { hostname: host, reload: () => reloads++ },
    localStorage: {
      getItem(k) { if (blocked) throw Error('Storage blocked'); return storage.get(k) ?? null; },
      setItem(k, v) { if (blocked) throw Error('Storage blocked'); storage.set(k, v); },
    },
    document: {
      querySelector: node,
      createElement: () => ({}),
      head: { appendChild: script => scripts.push(script) },
      get cookie() { return '_ga=123; _ga_TEST123=456; other=keep'; },
      set cookie(value) { deletedCookies.push(value); },
    },
  };
  vm.runInNewContext(code, context);
  context.exports.initAnalyticsConsent();
  return {
    node, window, scripts, storage, deletedCookies, events,
    click: selector => node(selector).listeners.click(),
    get reloads() { return reloads; },
  };
}

test('undecided and rejected visits never load a Google script', () => {
  const page = setup();
  assert.equal(page.scripts.length, 0);
  assert.equal(page.node('[data-consent-banner]').hidden, false);
  page.click('[data-consent-reject]');
  assert.equal(page.scripts.length, 0);
  assert.equal(JSON.parse(page.storage.get(key)).choice, 'rejected');
  assert.equal(page.reloads, 0);
});

test('accept configures one page view with advertising denied, even on repeated acceptance', () => {
  const page = setup();
  page.click('[data-consent-accept]');
  page.click('[data-consent-accept]');
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST123');
  const queue = page.window.dataLayer.map(args => Array.from(args));
  assert.equal(queue[0][0], 'consent');
  assert.equal(queue[0][2].analytics_storage, 'denied');
  assert.equal(queue[0][2].ad_storage, 'denied');
  assert.equal(queue[0][2].ad_user_data, 'denied');
  assert.equal(queue[0][2].ad_personalization, 'denied');
  assert.equal(queue[1][2].analytics_storage, 'granted');
  assert.equal(queue.filter(command => command[0] === 'config').length, 1);
  assert.equal(queue[3][2].allow_google_signals, false);
});

test('saved acceptance loads, withdrawal disables and clears GA cookies then reloads', () => {
  const page = setup({ saved: JSON.stringify({ choice: 'accepted', timestamp: Date.now() }) });
  assert.equal(page.scripts.length, 1);
  page.click('[data-consent-settings]');
  assert.equal(page.node('[data-consent-banner]').hidden, false);
  assert.equal(page.node('#analytics-heading').focused, true);
  page.click('[data-consent-reject]');
  assert.equal(page.window['ga-disable-G-TEST123'], true);
  assert.equal(page.reloads, 1);
  assert.equal(JSON.parse(page.storage.get(key)).choice, 'rejected');
  assert.ok(page.deletedCookies.some(cookie => cookie.startsWith('_ga=;')));
  assert.ok(page.deletedCookies.some(cookie => cookie.startsWith('_ga_TEST123=;')));
  assert.ok(page.deletedCookies.every(cookie => !cookie.startsWith('other=')));
});

test('expired, malformed and future consent fail closed', () => {
  for (const saved of [
    '{broken',
    JSON.stringify({ choice: 'accepted', timestamp: 0 }),
    JSON.stringify({ choice: 'accepted', timestamp: Date.now() + 100000 }),
  ]) {
    const page = setup({ saved });
    assert.equal(page.scripts.length, 0);
    assert.equal(page.node('[data-consent-banner]').hidden, false);
  }
});

test('saved rejection persists and storage failures still allow a choice', () => {
  const rejected = setup({ saved: JSON.stringify({ choice: 'rejected', timestamp: Date.now() }) });
  assert.equal(rejected.scripts.length, 0);
  assert.equal(rejected.node('[data-consent-banner]').hidden, true);
  const blocked = setup({ blocked: true });
  assert.equal(blocked.scripts.length, 0);
  blocked.click('[data-consent-accept]');
  assert.equal(blocked.scripts.length, 1);
});

test('invalid configuration and non-production hosts stay inactive', () => {
  for (const options of [{ id: '' }, { id: 'invalid' }, { host: 'localhost' }, { host: 'preview.example.com' }]) {
    const page = setup(options);
    assert.equal(page.scripts.length, 0);
    assert.equal(page.node('#analytics-consent').hidden, true);
  }
});

test('cross-tab consent changes disable the current tracker and reload', () => {
  const page = setup({ saved: JSON.stringify({ choice: 'accepted', timestamp: Date.now() }) });
  page.events.get('storage')({ key });
  assert.equal(page.window['ga-disable-G-TEST123'], true);
  assert.equal(page.reloads, 1);
});
