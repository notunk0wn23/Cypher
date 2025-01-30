import React from 'react'

// just temp till I can get an account system
const user: string = "user"

function Greeting() {
    return (
        <div className="greeting-container">
            <span className='greeting-text'>Hello, </span>
            <span className='greeting-text greeting-text-user'>{user}</span>
            <span className='greeting-text'>.</span>
        </div>
    )
}


function MessageInputBox() {
    return (
        <div className='message-input-container'>
            <textarea name="" id="" cols="30" rows="10" className='message-input'></textarea>
        </div>
    )
}

function Tool({ name, description }) {
    return (
        <div title={description} className='tool-select-chip-container'>
            <span className="tool-select-chip-text">{name}</span>
        </div>
    )
}

function ToolSelectBox() {
    return (
        <div className='tool-select-container'>
            <span className='tool-select-title'>What tools can I use here?</span>
            <div className='tool-select-list'>
                <Tool name="Co-writer" description="Co-writer description" />
                <Tool name="Translate" description="Translate description" />
                <Tool name="Document Parser" description="Document Parser description" />
                <Tool name="Calculate" description="Calculate description" />
                <Tool name="Web Access" description="Web Access description" />
                <Tool name="WebContainers" description="WebContainers description" />
            </div>

        </div>
    )
}

function ChatBox() {
    return (
        <div className='chat-box'>
            <MessageInputBox />
            <ToolSelectBox />
        </div>
    )
}

function App() {
    return (
        <div className="container">
            <Greeting />
            <ChatBox />
        </div>
    )
}

export default App