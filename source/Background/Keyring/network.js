import { HANDLER_TYPES, sendMessage } from './index';

export const getNetworks = () => new Promise((resolve) => {
  sendMessage({
    type: HANDLER_TYPES.GET_NETWORKS,
  }, resolve);
});

export const getCurrentNetwork = () => new Promise((resolve) => {
  sendMessage({
    type: HANDLER_TYPES.GET_CURRENT_NETWORK,
  }, resolve);
});

export const addNetwork = (network) => new Promise((resolve) => {
  sendMessage({
    type: HANDLER_TYPES.ADD_NETWORK,
    params: network,
  }, resolve);
});

export const deleteNetwork = (networkId) => new Promise((resolve) => {
  sendMessage({
    type: HANDLER_TYPES.REMOVE_NETWORK,
    params: networkId,
  }, resolve);
});

export const setCurrentNetwork = (networkId) => new Promise((resolve) => {
  sendMessage({
    type: HANDLER_TYPES.SET_CURRENT_NETWORK,
    params: networkId,
  }, resolve);
});
