import React from 'react'

/* View for search box */
export default function SearchBox({ changeInputSearch, finishSearch, search, searchInput }) {

    return (
        <div className="ui action input">
            <div className="ui icon input">
                <input type="text" placeholder="Pesquisar..." value={searchInput} onChange={changeInputSearch} />
                {searchInput ?
                    <div className="label" onClick={finishSearch}><i id="collectoresSearchBoxIcon" aria-hidden="true" className="center delete icon"></i></div>
                    : <i aria-hidden="true" className="search icon"></i>}
            </div>
            <button type="button" className="ui button" onClick={search}>Pesquisar</button>
        </div>
    )
}