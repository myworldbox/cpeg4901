import useIsClient from '@/common/hooks/useIsClient'
import {setSessionStorage} from '@/common/hooks/useSessionStorage'
import LoadPage from '@/common/components/LoadPage/loadPage'
import styles from '@/styles/auth/Login.module.css'
import {useRouter} from 'next/router'
import axios from 'axios';
import Head from 'next/head'
import { redirect } from 'next/navigation';

function Home() {

  const router = useRouter();
  const isClient = useIsClient();
  if (!isClient) return (<LoadPage />)

  function handleSubmit(e: any) {
    e.preventDefault();

    if (!e.target.email.value) {
      alert("Email is required");
    } else if (!e.target.email.value) {
      alert("Valid email is required");
    } else if (!e.target.password.value) {
      alert("Password is required");
    } else {
      axios({
        method: 'post',
        url: 'http://localhost:4040/auth/session/login',
        data: {
          username: e.target.email.value,
          password: e.target.password.value,
        },
        timeout: 5000,
        withCredentials: true, 
      }).then(res => {
        console.log(res.data.csrfToken);
        if (res.status === 200){
          router.push({ pathname: '/', query: { csrfToken: res.data.csrfToken } }, '/');
        } else {
          alert(res.data);
        }
      });

    }
  };

  function handleClick(e: any) {
    e.preventDefault();

    router.push({ pathname: '/register'}, '/register');
  };

  return (
    <>
    <Head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.Wrap}>
      <div className={styles.App}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor={styles.email}>Email</label>
            <input type="email" name="email" placeholder="nome@email.com.br" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
          </div>
          <button className={styles.primary}>Login</button>
        </form>
          <button className={styles.primary} onClick={handleClick}>Register</button>
      </div>
    </div>
    </>
  );
  
}

export default Home;