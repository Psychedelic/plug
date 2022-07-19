import { Principal } from '@dfinity/principal';

export const to32bits = (num) => {
  const b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

export const from32bits = (ba) => {
  let value;
  for (let i = 0; i < 4; i += 1) {
    value = (value << 8) | ba[i]; // eslint-disable-line
  }
  return value;
};

export const decodeTokenId = (tokenId) => {
  if (!tokenId) return null;
  const binaryArray = Principal.from(tokenId).toUint8Array();
  const index = from32bits(binaryArray.slice(-4));
  return index;
};

export default {};
