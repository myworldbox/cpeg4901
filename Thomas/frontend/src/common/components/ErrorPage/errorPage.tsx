import styles from './errorPage.module.css'; // Stylesheet

interface IErrorProps {
    status_code?: number;
    reason?: string;
}

const defaultProps: IErrorProps = {
    reason: "Caught Unstate Error",
};

const ErrorPage = (props: IErrorProps) => {
    return (
        <nav className={styles.page}>
            <div className={styles.fof}>
                <h1>Error{(props.status_code) ? (` ${props.status_code}`) : ``}:</h1> <br />
                <h3>{props.reason}</h3>
            </div>
        </nav>
    );
}

ErrorPage.defaultProps = defaultProps;
export default ErrorPage;