import { useSyncExternalStore } from 'react';
import { readDevelopmentMode, subscribeDevelopmentMode, serverDevelopmentMode } from '../../services/spin-development-mode';
import SpinDevelopment from './SpinDevelopment';
import SpinGame from './SpinGame';

export default function SpinEntry() {
  const development = useSyncExternalStore(subscribeDevelopmentMode, readDevelopmentMode, serverDevelopmentMode);
  // Do not mount the API-backed game until the browser preference is known.
  if (development === null) return <p role="status" className="p-8 text-center">Menyiapkan roda hadiah…</p>;
  return development ? <SpinDevelopment /> : <SpinGame />;
}
