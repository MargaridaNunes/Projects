import React, { useState } from 'react'
import Messages from '../../utils/Messages'
import Collectors from './Collectors'
import SearchBox from '../../utils/SearchBox'
import Loading from '../../utils/Loading'

export default function AssignCollectionRoutes({ routesService, collectorsService, collections,
    assignCollections, filterCollections, updateCollectionAfterAssign }) {

    /*number of persons available to performe collections indicated by the user */
    const [numberOfPersons, setNumberOfPersons] = useState(undefined)
    /*routes for the selected collections*/
    const [collectionsToAssign, setCollectionsToAssign] = useState([])
    /*selected route with collection to assign to a collector*/
    const [selectedRoute, setSelectedRoute] = useState(undefined)
    /*Collectors available to assign collections*/
    const [collectors, setCollectors] = useState([])
    /*Searched date*/
    const [searchDate, setSearchDate] = useState(undefined)
    /*search collectors box input - collector name or email*/
    const [searchInput, setSearchInput] = useState(undefined)
    /*Flag to change view - if true shows routes cards otherwise shows collectors list */
    const [hideRouteCards, setHideRouteCards] = useState(false)
    /*constain the message to be display (info, warning or error) */
    const [message, setMessage] = useState(undefined)
    /*error flag */
    const [error, setError] = useState(undefined)

    function getCheckedCollection(){
        const colls = collections.filter(c => c.isChecked === true)
        return colls.map(c => c.collectionInfo)
    }

    /*Affects collectionsToAssign with the routes generated */
    async function onGenerateRoutesForCollections() {
        const collectionsInfo = getCheckedCollection()
        if (collectionsInfo.length === 0) {
            setMessage({ messageTitle: "Não existem recolhas selecionadas para atribuir!", messageBody: "Selecione uma ou mais recolhas para gerar o percurso a atribuir.", messageType: "info" })
            return
        }
        if(numberOfPersons <= 0){
            setMessage({ messageTitle: "O número de pessoas tem de ser maior que 0", messageBody: "", messageType: "negative" })
            return
        }
        setMessage(undefined)
        setCollectionsToAssign([])
        try {
            const routes = await routesService.collectionsRoutes(collectionsInfo, numberOfPersons)
            console.log(JSON.stringify(routes))
            const removeEmptyRoutes = routes.filter(r => r.lectures.length !== 0)
            setCollectionsToAssign(removeEmptyRoutes)
        } catch (e) {
            console.log(e)
            if (e.title === "Couldn't solve algorithm" || e.title === "Invalid classroom format" || e.title === "Invalid Algorithm Parameters") {
                
                setMessage({ messageTitle: e.message, messageBody: "", messageType: "negative" })
                return
            }
            setError(e)
        }
    }

    /*sets the input value in number of persons field to numberOfPersons */
    function onChangeInput(event) {
        setMessage(undefined)
        setNumberOfPersons(event.target.value)
    }

    /*Affects seletedRoute with the respective route and get the collectors availables to performe the route collections */
    function onSelectRouteCard(route) {
        return async () => {
            setSelectedRoute(route)
            try {
                const collectorsInfo = await collectorsService.getCollectors()
                setCollectors(collectorsInfo)
                setHideRouteCards(true)
            } catch (e) {
                setError(e)
            }
        }
    }

    /*Routes cards view */
    const routes =
        <div className="ui cards" id="routeCards">
            {collectionsToAssign.map(c =>
                <div className="ui card" key={c.routeId}>
                    <div className="content">
                        <div className="header">Rota de recolha {c.routeId + 1}</div>
                        {c.lectures.map(collection =>
                            <div key={collection.lectureId}>
                                <div className="meta">{collection.classroom}</div>
                                <div className="description">{collection.startDate}/{collection.endDate}</div>
                            </div>
                        )}
                    </div>
                    <button type="button" className="ui floated right basic blue button" onClick={onSelectRouteCard(c)}>Atribuir</button>
                </div>
            )}
        </div>

    /* get the current date used as minimum in the date input */
    function getCurrentDate() {
        const date = new Date()
        const [day, month, year] = date.toLocaleDateString().split("/")
        return `${year}-${month}-${day}`
    }

    /*filter the collcetions by date and sets searchDate with the chosen value*/
    function onFilterCollectionsByDate(event) {
        filterCollections(event.target.value)
        setSearchDate(event.target.value)
        setMessage(undefined)
    }

    /*card view with the input fields */
    const numberOfPersonsCard =
        <div className="ui cards">
            <div className="ui blue fluid card">
                <div className="content">
                    <div className="ui input"><input required type="date" defaultValue={searchDate} min={getCurrentDate()} onChange={onFilterCollectionsByDate} /></div>
                    <div id="numberOfPersonsInput" className="ui input"><input type="number" min="1" value={numberOfPersons} placeholder="Número de pessoas" onChange={onChangeInput} /></div>
                    {searchDate && numberOfPersons ?
                        <button type="button" className="ui right floated basic blue button" onClick={onGenerateRoutesForCollections}>Gerar</button>
                        : <button type="button" className="ui right floated basic blue button" disabled>Gerar</button>
                    }
                </div>
            </div>
        </div>

    /*Assign route collections to a collector */
    function onAssignCollections(collectorId) {
        return async () => {
            try {
                await assignCollections(collectorId, selectedRoute.lectures)
                const idx = collectionsToAssign.findIndex(r => r.routeId === selectedRoute.routeId)
                if (idx !== -1) {
                    collectionsToAssign.splice(idx, 1)
                    setCollectionsToAssign(collectionsToAssign)
                }
                setSelectedRoute(undefined)
                setCollectors([])
                setHideRouteCards(false)
                if (collectionsToAssign.length === 0) {
                    updateCollectionAfterAssign()
                    setSearchDate("")
                    setNumberOfPersons("")
                }
            } catch (e) {
                setError(e)
            }
        }
    }

    /*put the search box changed input in search input */
    function onChangeInputSearch(event) {
        setSearchInput(event.target.value)
    }

    /*get collectors base on the input in the serach box*/
    async function onSearchCollector() {
        try {
            const collectorsInfo = await collectorsService.getCollectors(searchInput)
            setCollectors(collectorsInfo)
        } catch (e) {
            setError(e)
        }
    }

    /*clear search box input and set collectors list with all collectors available*/
    async function onFinishSearch() {
        try {
            const collectorsInfo = await collectorsService.getCollectors()
            setCollectors(collectorsInfo)
            setSearchInput("")
        } catch (e) {
            setError(e)
        }
    }

    /*search box view */
    const searchCollectors =
        <SearchBox changeInputSearch={onChangeInputSearch} finishSearch={onFinishSearch} search={onSearchCollector} searchInput={searchInput} />

    return (
        !error ?
            <div>
                {message ?
                    <div id="numberOfPersonsCard"><Messages messageTitle={message.messageTitle} messageBody={message.messageBody} messageType={message.messageType} /></div>
                    : ""
                }
                {message ? <div id="numberOfPersonsCardWithMessage">{numberOfPersonsCard}</div> : <div id="numberOfPersonsCard">{numberOfPersonsCard}</div>}
                {!hideRouteCards && collectionsToAssign.length !== 0 ? routes : ""}
                {collectors.length !== 0 ?
                    <div id="collectorsRouteDiv">
                        <div id="collectorsHeaderDiv">
                            <div id="collectorsSearchDiv" className="content">{searchCollectors}</div>
                            <h2 className="ui blue header">Responsáveis pela recolha disponíveis</h2>
                        </div>
                        <Collectors collectors={collectors} assignCollections={onAssignCollections} />
                    </div>
                    : ""
                }
            </div>
            : <Loading loadingText={error.message}></Loading>
    )

}