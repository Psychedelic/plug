export function clearClipboard() {
  window.navigator.clipboard.writeText('');
}

export const parseMnemonic = (mnemonic) => (mnemonic || '').trim().toLowerCase().match(/\w+/gu)?.join(' ') || '';
