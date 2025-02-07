import { Greeting } from "../../components/Greeting/Greeting.tsx"
import styles from "./NewChat.module.css"
import { MessageBox } from "../../components/MessageBox/MessageBox.tsx"

export function NewChat() {
    return (
        <div className={styles["new-chat-container"]}>
            <Greeting username="InsertUsername" />
            <MessageBox />
        </div>
    )
}