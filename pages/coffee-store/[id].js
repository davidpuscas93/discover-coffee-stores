import { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';

import useSWR from 'swr';

import cls from 'classnames';

import { StoreContext } from '../../store/store.context';

import { isEmpty } from '../../utils';

import { getCoffeeStores } from '../../lib/coffee-stores';

import styles from '../../styles/coffee-store.module.css';

export async function getStaticProps({ params }) {
  const coffeeStores = await getCoffeeStores();
  const foundCoffeeStoreById = coffeeStores.find((element) => {
    return element.id === params.id;
  });

  return {
    props: {
      coffeeStore: foundCoffeeStoreById ? foundCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await getCoffeeStores();
  const paths = coffeeStores.map((store) => {
    return {
      params: {
        id: store.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const id = router.query.id;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  const {
    name = '',
    address = '',
    locality = '',
    image = '',
    rating = 0,
  } = coffeeStore;

  const [ratingCount, setRatingCount] = useState(rating);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleCreateCoffeeStore = async (store) => {
    try {
      const { id, name, image, address, locality, rating } = store;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: `${id}`,
          name,
          image,
          address: address || '',
          locality: locality || '',
          rating: rating || 0,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error(`Ooups, could not create coffee store: ${error}`);
    }
  };

  useEffect(() => {
    if (router.isReady && isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          (store) => store.id === id
        );
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.asPath, id, initialProps]);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setRatingCount(data[0].rating);
    }
  }, [data]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvoteButton = async () => {
    let rating = parseInt(ratingCount) + 1;
    setIsUpvoting(true);
    try {
      const response = await fetch(`/api/updateCoffeeStoreById?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
        }),
      });
      const data = await response.json();
      if (data && data.length > 0) {
        setRatingCount(rating);
        setIsUpvoting(false);
      }
    } catch (error) {
      console.error(`Ooups, could not update rating: ${error}`);
      setIsUpvoting(false);
    }
  };

  if (error) {
    return (
      <div>Something went wrong retrieving coffee store page with id: {id}</div>
    );
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name='description' content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.homeLink}>
            <Link href='/'>← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <div className={styles.storeImageWrapper}>
            <Image
              src={
                image ||
                'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
              }
              width={600}
              height={360}
              alt={`coffee-store-image-${name}`}
              className={styles.storeImage}
              priority
            />
          </div>
        </div>
        <div className={cls('glass', styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/places.svg'
                width='24'
                height='24'
                alt={`coffee-store-icon1-${address}`}
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {locality && (
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/near-me.svg'
                width='24'
                height='24'
                alt={`coffee-store-icon2-${locality}`}
              />
              <p className={styles.text}>{locality}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/star.svg'
              width='24'
              height='24'
              alt={`coffee-store-icon3-${ratingCount}`}
            />
            <p className={styles.text}>{ratingCount}</p>
          </div>
          <button
            className={styles.upvoteButton}
            onClick={handleUpvoteButton}
            disabled={isUpvoting}
          >
            {isUpvoting ? 'Voting...' : 'Up vote!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
