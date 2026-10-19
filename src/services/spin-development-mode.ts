// Local-only preference shared between localhost ports, never production subdomains.
const cookieName = 'regen-spin-local-development';
const eventName = 'regen-spin-mode-change';
export function isLocalDevelopmentHost(): boolean {
  return typeof window !== 'undefined' && ['localhost', '127.0.0.1', '[::1]', '::1'].includes(window.location.hostname);
}
export function readDevelopmentMode(): boolean {
  return isLocalDevelopmentHost() && document.cookie.split(';').some(cookie => cookie.trim() === cookieName + '=1');
}
export function writeDevelopmentMode(enabled: boolean): void {
  if (!isLocalDevelopmentHost()) return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = cookieName + '=' + (enabled ? '1' : '0') + '; Path=/; Max-Age=31536000; SameSite=Lax' + secure;
  if (readDevelopmentMode() !== enabled) throw new Error('Browser tidak dapat menyimpan mode development. Izinkan cookie dan coba lagi.');
  window.dispatchEvent(new Event(eventName));
}
export function subscribeDevelopmentMode(listener: () => void): () => void {
  if (!isLocalDevelopmentHost()) return () => {};
  // Cookies are shared between local ports; poll to observe changes in other tabs.
  const timer = window.setInterval(listener, 1000);
  window.addEventListener(eventName, listener);
  window.addEventListener('focus', listener);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener(eventName, listener);
    window.removeEventListener('focus', listener);
  };
}
export const serverDevelopmentMode = (): null => null;
