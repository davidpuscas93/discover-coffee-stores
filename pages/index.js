import { useEffect, useState, useContext } from 'react';

import Head from 'next/head';
import Image from 'next/image';

import { ACTION_TYPES, StoreContext } from '../store/store.context';

import Banner from '../components/banner';
import Card from '../components/card';

import useTrackLocation from '../hooks/use-track-location';

import { getCoffeeStores } from '../lib/coffee-stores';

import styles from '../styles/Home.module.css';

export async function getStaticProps(context) {
  const coffeeStores = await getCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home({ coffeeStores }) {
  const { handleTrackLocation, isFindingLocation, locationErrorMessage } =
    useTrackLocation();

  const { state, dispatch } = useContext(StoreContext);

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const handleOnBannerClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    const setCoffeeStoresByLocation = async () => {
      if (state.latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${state.latLong}&limit=30`
          );
          const coffeeStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          });
          setCoffeeStoresError(null);
        } catch (error) {
          setCoffeeStoresError(error.messsage);
        }
      }
    };

    setCoffeeStoresByLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.latLong]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby!'}
          handleOnClick={handleOnBannerClick}
        />
        {locationErrorMessage && (
          <p>Something went wrong : {locationErrorMessage}</p>
        )}
        {coffeeStoresError && <p>Something went wrong : {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            alt='hero-image'
            src='/static/hero-image.png'
            width={700}
            height={400}
            priority
          />
        </div>
        {state.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.cardHeading}>Coffee shops near me</h2>
            <div className={styles.cardLayout}>
              {state.coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  image={
                    coffeeStore.image ||
                    'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.cardHeading}>Lyon coffee shops</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  image={
                    coffeeStore.image ||
                    'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      <footer></footer>
    </div>
  );
}
