import Link from 'next/link'; // Next.js
import Image from 'next/image'; // Next.js
import styles from './sidebar.module.css'; // Stylesheet
import control  from './control.png' ; // Image
import { useRouter } from 'next/router'
import { ReactNode } from 'react';
import { FaUser } from 'react-icons/fa'; // React Icons
import { BsTranslate } from 'react-icons/bs';
import { CiLight, CiLogout } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import { useTheme } from 'next-themes';

interface IMenu {
  title: string;
  icon: ReactNode;
  route: string;
}
interface ISideProps {
  menuItems: IMenu[];
  csrfToken: string;
}

const Sidebar  = (props: ISideProps) => {

    const router = useRouter()
    const changeTo = router.locale === 'en' ? 'tc' : router.locale === 'tc' ? 'sc' : 'en'
    const { theme, setTheme } = useTheme()
    const toggleTheme = (theme === "dark") ? "light":"dark";
    return (
      <nav className={styles.navBar}>
          <div className={styles.control} onClick={() => { 
            var navbar = document.querySelector(`.${styles.navBar}`); 
            navbar?.classList.toggle(`${styles.active}`);
          }}>
            <Image src={control} alt="Failed to load control"/>
          </div>
          <div className={styles.wrapper}>
            <ul>
              {props.menuItems.map((item: IMenu, index: number) => (
                <li key={index}>
                  <Link 
                  href={{
                    pathname: item.route,
                    query: { csrfToken: props.csrfToken},
                  }}
                  as={item.route}>
                    <div className={styles.icon}>{item.icon}</div>
                    <span className={styles.title}>{item.title}</span>
                  </Link>
                </li>
              ))}
              <li></li>
            </ul>
            <hr />
              <div className={styles.settingItem}>
                <Link href={{
                    pathname: "",
                    query: { csrfToken: props.csrfToken},
                  }}
                  as="/"
                  locale={changeTo}>
                  <div className={styles.settingIcon}><BsTranslate /></div>
                  <span className={styles.settingTitle}>Translation</span>
                </Link>
              </div>
              <div className={styles.settingItem}>
                <Link href={{
                    pathname: "",
                    query: { csrfToken: props.csrfToken},
                  }}
                  as="/"
                  onClick={e => setTheme(toggleTheme)}>
                  <div className={styles.settingIcon}><CiLight data-hide-on-theme="light"/><MdDarkMode data-hide-on-theme="dark"/></div>
                  <span className={styles.settingTitle}>Theme</span>
                </Link>
              </div>
              <div className={styles.settingItem}>
                <Link href={{
                    pathname: "",
                    query: { csrfToken: props.csrfToken},
                  }}
                  as="">
                  <div className={styles.settingIcon}><CiLogout /></div>
                  <span className={styles.settingTitle}>Logout</span>
                </Link>
              </div>
          </div>
      </nav>
    );
  }

  export default Sidebar;