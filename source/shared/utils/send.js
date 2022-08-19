export const truncateFloatForDisplay = (value, maxDecimals, displayDecimals) => Number(
  value.toFixed(maxDecimals).slice(0, -(maxDecimals - displayDecimals)),
);

export default { truncateFloatForDisplay };
