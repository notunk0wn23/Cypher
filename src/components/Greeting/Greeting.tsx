import "./Greeting.module.css"

interface GreetingProps {
    username: string;
}

export function Greeting({ username } : GreetingProps) {
    return <div>
        <span className="greeting-text">Hello, </span>
        <span className="greeting-text">{username}</span>
        <span className="greeting-text">.</span>
    </div>
}