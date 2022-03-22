export const getFilteredCollections = (collection, collections, nft) => {
  const filterNFT = (token) => token.id !== nft?.id;
  const collectionIndex = collections.indexOf(collection);
  let filteredCollections = [...collections];

  if (collection.tokens.length > 1) {
    // If collection has tokens we filter them
    const filteredCollection = JSON.parse(JSON.stringify(collection));
    const tokens = collection.tokens.filter(filterNFT);

    filteredCollections = [...collections];

    filteredCollections[collectionIndex] = {
      ...filteredCollection,
      tokens,
    };
  } else {
    // If tokens is empty remove collection
    filteredCollections.splice(collectionIndex, 1);
  }

  return filteredCollections;
};

// Method that corrects icpunks image url. TODO: check if this is still needed
export const fallbackPunksUrl = (url) => (url?.includes?.('https') ? url : `https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app${url}`);
