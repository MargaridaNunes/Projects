import React from 'react'

export default function Loading({ loadingText }) {
    return (
        <div className="ui active transition visible inverted dimmer">
            <div className="content">
                <div className="ui massive inverted text loader">
                    {loadingText}
                </div>
            </div>
        </div>
    )
}