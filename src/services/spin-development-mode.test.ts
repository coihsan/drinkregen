import test from 'node:test';
import assert from 'node:assert/strict';
import { readDevelopmentMode, writeDevelopmentMode, subscribeDevelopmentMode, serverDevelopmentMode } from './spin-development-mode';

test('local mode switches without fetch and production ignores all development cookies', context => {
  context.mock.method(globalThis, 'fetch', () => { throw new Error('Mode must not request the API'); });
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let cookie = '', written = '';
  const documentStub = {
    get cookie() { return cookie; },
    set cookie(value: string) { written = value; cookie = value.split(';')[0]; },
  };
  const events = new EventTarget();
  let polling: (() => void) | undefined;
  const location = { hostname: 'localhost', protocol: 'https:' };
  Object.defineProperty(globalThis, 'document', { configurable: true, value: documentStub });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    location,
    dispatchEvent: events.dispatchEvent.bind(events),
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    setInterval: (callback: () => void) => { polling = callback; return 1; },
    clearInterval: () => { polling = undefined; },
  } });
  try {
    assert.equal(serverDevelopmentMode(), null);
    assert.equal(readDevelopmentMode(), false);
    let observed = false;
    const unsubscribe = subscribeDevelopmentMode(() => { observed = readDevelopmentMode(); });
    writeDevelopmentMode(true);
    assert.equal(observed, true);
    assert.doesNotMatch(written, /Domain=/);
    assert.match(written, /; Secure/);
    // Another tab changes the shared cookie; the polling subscription observes it.
    cookie = 'regen-spin-local-development=0';
    polling!();
    assert.equal(observed, false);
    location.hostname = 'localhost'; location.protocol = 'http:';
    writeDevelopmentMode(true);
    assert.doesNotMatch(written, /Domain=|Secure/);
    writeDevelopmentMode(false);
    assert.equal(readDevelopmentMode(), false);
    unsubscribe();
    for (const hostname of ['drinkregen.com', 'spin.drinkregen.com', 'preview.drinkregen.com']) {
      location.hostname = hostname;
      cookie = 'regen-spin-development=1; regen-spin-local-development=1';
      written = '';
      assert.equal(readDevelopmentMode(), false);
      writeDevelopmentMode(true);
      assert.equal(written, '');
      subscribeDevelopmentMode(() => { throw new Error('Production must not subscribe'); })();
      assert.equal(polling, undefined);
    }
    for (const hostname of ['127.0.0.1', '[::1]']) {
      location.hostname = hostname;
      writeDevelopmentMode(true);
      assert.equal(readDevelopmentMode(), true);
      assert.doesNotMatch(written, /Domain=/);
    }
    assert.equal(polling, undefined);
  } finally {
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
    else Reflect.deleteProperty(globalThis, 'document');
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});


