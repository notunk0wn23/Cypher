import { Greeting } from "../../components/Greeting/Greeting.tsx"
import styles from "./NewChat.module.css"

export function NewChat() {
    return (
        <div className={styles["new-chat-container"]}>
            <Greeting username="InsertUsername" />
        </div>
    )
}