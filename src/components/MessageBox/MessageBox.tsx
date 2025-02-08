import styles from "./MessageBox.module.css";


interface ToolChipInterface {
    name: string;
}

function Tool({ name } : ToolChipInterface) {
    return (
        <div className={styles["tool-chip"]}>
            {name}
        </div>
    );
}

function Tools({ tools }: { tools: object[] }) {
    return (
        <div className={styles["tools-container"]}>
            <span className={styles["tools-label"]}>What tools can I use here?</span>
            <div className={styles["tools-list"]}>
            {tools.map((tool, index) => (
                <Tool name={tool.name} />
            ))}
            </div>
        </div>
    );
}

function InputBox() {
    return (
        <div className={styles["message-input-container"]}>
            <textarea className={styles["message-input"]} placeholder="Type your message here..." />
            <button className={styles["message-send"]}>Send</button>
        </div>
    );
}

export function MessageBox() {
    const tools = [
        { name: "tool1" },
        { name: "tool2" },
        { name: "tool3" },
        { name: "tool1" },
        { name: "tool2" },
        { name: "tool3" },
        { name: "tool1" },
        { name: "tool2" },
        { name: "tool3" },
        { name: "tool1" },
        { name: "tool2" },
        { name: "tool3" },
        { name: "tool1" },
        { name: "tool2" },
        { name: "tool3" }
    ];

    return (
        <div className={styles["message-box-container"]}>
            <InputBox />
            <Tools tools={tools} />
        </div>
    );
}

