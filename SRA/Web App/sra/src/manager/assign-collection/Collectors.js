import React from 'react'

/*View for collectors list */

export default function Collectors({ collectors, assignCollections }) {

    return (
        collectors.length !== 0 ?
            <div role="list" className="ui divided middle aligned list">
                {collectors.map(c =>
                    <div role="listitem" className="item" key={c.collectorId}>
                        <div className="right floated content">
                            <button type="button" className="ui blue basic button" onClick={assignCollections(c.collectorId)}>Atribuir</button>
                        </div>
                        <i className="ui big user icon" />
                        <div className="content">
                            <h3 className="ui header">{c.name}</h3>
                            <h5 className="ui grey header">{c.email}</h5>
                        </div>
                    </div>
                )}
            </div>
            : ""
    )
}