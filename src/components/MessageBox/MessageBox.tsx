import styles from "./MessageBox.module.css";

interface InputBoxProps {
    username: string;
}

function InputBox() {
    return (
        <div className={styles["message-input-container"]}>
            <textarea className={styles["message-input"]} placeholder="Type your message here..." />
            <button className={styles["message-send"]}>Send</button>
        </div>
    );
}

export function MessageBox({ username }: InputBoxProps) {
    return (
        <div className={styles["message-box-container"]}>
            <InputBox />
        </div>
    );
}