import styles from './dashboardButton.module.css'
import Link from 'next/link'

interface IDashboardButtonProps {
    path: string;
    csrfToken?: string;
    locale: string;
    icon: any;
    description: string;
}

const DashboardButton = (props: IDashboardButtonProps) => {
    let query = (props.csrfToken) ? { csrfToken: props.csrfToken } : {};
    return (
        <div className={styles.pageSelector}>
            <Link 
            className={styles.linkWrapper}
            href={{pathname: props.path, query: query}} 
            as={props.path}
            locale={props.locale}>
                <button className={styles.rotateButton}>{props.icon}</button>
                <div className={styles.background} />
            </Link>
            <div className={styles.description}>{props.description}</div>
        </div>
    )
}

export default DashboardButton;