import styles from "./Greeting.module.css";

interface GreetingProps {
    username: string;
}

export function Greeting({ username }: GreetingProps) {
    return (
        <div className={styles.greeting}>
            <span className={styles["greeting-text"]}>Hello, </span>
            <span className={`${styles["greeting-text"]} ${styles["greeting-user"]}`}>{username}</span>
            <span className={styles["greeting-text"]}>.</span>
        </div>
    );
}