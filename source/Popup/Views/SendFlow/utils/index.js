export const truncateFloatForDisplay = (value, MAX_DECIMALS, DISPLAY_DECIMALS) => Number(
  value.toFixed(MAX_DECIMALS).slice(0, -(MAX_DECIMALS - DISPLAY_DECIMALS)),
);
