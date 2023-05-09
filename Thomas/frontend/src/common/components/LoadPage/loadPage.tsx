import styles from './loadPage.module.css'; // Stylesheet

interface ILoadProps {
    reason?: string;
}

const defaultProps: ILoadProps = {
    reason: "Loading . . .",
};

const LoadPage = (props: ILoadProps) => {
    return (
        <nav className={styles.page}>
            <div className={styles.loader}></div>
            <span className={styles.text}>{props.reason}</span>
        </nav>
    );
}

LoadPage.defaultProps = defaultProps;

export default LoadPage;