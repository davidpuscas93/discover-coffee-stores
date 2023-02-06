import Image from 'next/image';
import Link from 'next/link';

import cls from 'classnames';

import styles from './card.module.css';

const Card = (props) => {
  return (
    <Link href={props.href} className={styles.link}>
      <div className={cls('glass', styles.container)}>
        <div className={styles.headerWrapper}>
          <h2 className={styles.header}>{props.name}</h2>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src={props.image}
            alt={`card-image-${props.name}`}
            width={260}
            height={160}
            className={styles.image}
          />
        </div>
      </div>
    </Link>
  );
};

export default Card;
