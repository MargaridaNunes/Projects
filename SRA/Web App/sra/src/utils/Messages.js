import React from 'react'

/* View for messages */
export default function Message({ messageTitle, messageBody, messageType }) {
    const type = `ui ${messageType} message`
    return (
        <div className={type}>
            <div className="header">{messageTitle}</div>
            <p>{messageBody}</p>
        </div>
    )
}
