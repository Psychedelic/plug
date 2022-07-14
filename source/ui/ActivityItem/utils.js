import extensionizer from 'extensionizer';

import { getDashboardTransactionURL } from '@shared/constants/urls';
import shortAddress from '@shared/utils/short-address';

export const getSubtitle = (type, to, from, t) => (({
  SEND: ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`,
  BURN: ` · ${t('activity.subtitle.to')}: ${shortAddress(to)}`,
  RECEIVE: ` · ${t('activity.subtitle.from')}: ${shortAddress(from)}`,
})[type]);

export const getAddress = (type, to, from, canisterId) => (
  {
    SEND: to,
    BURN: to,
    RECEIVE: from,
  }
)[type] || canisterId || '';

export const openICNetworkTx = (hash) => {
  extensionizer.tabs.create({ url: getDashboardTransactionURL(hash) });
};
