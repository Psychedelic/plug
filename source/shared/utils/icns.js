const ICNS_SUFFIX = '.icp';

const isICNSAddress = (address) => address.substr(address.length - 4) === ICNS_SUFFIX;

export default isICNSAddress;
