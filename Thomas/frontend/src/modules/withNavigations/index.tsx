import CustomSidebar from "./components/CustomSidebar";
import React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/modules/withNavigations.module.css'


const withNavigations = (Component: any, title: string) => ({ ...props }) => (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Image
          src="/assets/images/dark-grid.svg"
          height={2000}
          width={3000}
          alt="background"
          className={styles.background}
          data-hide-on-theme="light"
        />
        <Image
          src="/assets/images/light-grid.svg"
          height={2000}
          width={3000}
          alt="background"
          className={styles.background}
          data-hide-on-theme="dark"
        />
        <div className={styles.sideWrap}>
          <CustomSidebar csrfToken={props.data.csrfToken} />
          <div className={styles.content}>
              <Component {...props} />
          </div>
        </div>
      </main>
    </>
);

export default withNavigations;