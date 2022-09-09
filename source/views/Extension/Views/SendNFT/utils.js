// Method that corrects icpunks image url. TODO: check if this is still needed
export const fallbackPunksUrl = (url) => (url?.includes?.('https') ? url : `https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app${url}`);
