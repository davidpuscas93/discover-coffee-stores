import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getURLForCoffeeStores = (query, latLong, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

export const getCoffeeStores = async (
  latLong = '45.756867441612854,4.834958026053947',
  limit = 6
) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getURLForCoffeeStores('coffee', latLong, limit),
    options
  );
  const data = await response.json();

  const photoURLs = await getCoffeeStoreImageURLs();

  return data.results.map((result, index) => {
    const { fsq_id, name, location } = result;
    const { address, locality } = location;

    return {
      id: fsq_id,
      name: name,
      address: address,
      locality: locality,
      image: photoURLs.length > 0 ? photoURLs[index] : null,
    };
  });
};

const getCoffeeStoreImageURLs = async () => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shops',
    page: 1,
    perPage: 40,
  });

  const unsplashResults = photos.response.results.map(
    (result) => result.urls['regular']
  );

  return unsplashResults;
};
