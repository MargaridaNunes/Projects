import React, { useState, useEffect, useRef } from 'react'
import AssignCollectionRoutes from './AssignCollectionRoutes'
import Collectors from './Collectors'
import SearchBox from '../../utils/SearchBox'
import Messages from '../../utils/Messages'
import Loading from '../../utils/Loading'
import ListLoading from '../../utils/LoadingList'

export default function AssignCollectionPage({ collectionsService, collectorsService, routesService }) {

    /*scroll reference */
    const scrollObserver = useRef()

    /* Collections not assign information*/
    const [collections, setCollections] = useState([])
    /*CollectionS with the checkBock selected*/
    //const [selectedCollections, setSelectedCollections] = useState([])
    /*Collectors available to assign collections*/
    const [collectors, setCollectors] = useState([])
    /*flag to warning when there isn't any collection select but the assign button was selected */
    const [noSelectedCollections, setNoSelectedCollections] = useState(false)
    /*search collectors box input - collector name or email*/
    const [searchInput, setSearchInput] = useState(undefined)
    /*search date for routes*/
    const [searchDate, setSearchDate] = useState(undefined)
    /*flag to change view for show fields to automatic assign*/
    const [routesCollections, setRoutesCollections] = useState(false)
    /* flag to signal that all collections are selected */
    const [selectAllCollections, setSelectAllCollections] = useState(false)
    /*error flag */
    const [error, setError] = useState(undefined)
    /*observer radio */
    const [scrollObserverRatio, setScrollObserverRatio] = useState(undefined)
    /*page number */
    const [page, setPage] = useState(0)
    /*get more collections */
    const [moreCollections, setMoreCollections] = useState(true)
    /*is loading users */
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        collectorsService.getCollectors().then(info => setCollectors(info)).catch(e => setError(e))
    }, [collectionsService, collectorsService]);

    const scrollOptions = {
        root: document.querySelector('#collectionsNotAssignDiv'),
        rootMargin: '5px',
        threshold: 1.0
    }

    /* scroll observer */
    const observer = new IntersectionObserver(entries => {
        const ratio = entries[0].intersectionRatio;
        setScrollObserverRatio(ratio)
    }, scrollOptions)

    useEffect(() => {
        observer.observe(scrollObserver.current)
        return () => {
            observer.disconnect()
        }
    }, [])

    useEffect(() => {
        if (scrollObserverRatio >= 0 && moreCollections && !isLoading) {
            setIsLoading(true)
            const newPage = page + 1
            setPage(newPage)
            collectionsService.getCollectionsNotAssign(newPage, searchDate).then(collectionsInfo => {
                if (collectionsInfo.length === 0) {
                    setMoreCollections(false)
                    setIsLoading(false)
                    return
                }
                const colls = [...collections, ...collectionsInfo]
                setCollections(colls)
                setIsLoading(false)
            }).catch(e => setError(e))
        }
    }, [scrollObserverRatio])

    /*when the collection check box is checked put the collection in selectedcollections, 
    otherwise remove the collection from selectedCollections */
    function onSelectCollection(collection) {
        return async (event) => {
            const isCheck = event.target.checked
            if (isCheck) {
                collections.forEach(c => {
                    if(c.collectionInfo.lectureId === collection.collectionInfo.lectureId){
                        c.isChecked = true
                    }    
                })
                setCollections([...collections])
                setNoSelectedCollections(false);
            } else {
                collections.forEach(c => {
                    if(c.collectionInfo.lectureId === collection.collectionInfo.lectureId)
                        c.isChecked = false
                })
                setCollections([...collections])
            }
        }
    }

    /*collections no assign card view*/
    const collectionsNotAssign =
        <div id="collectionsNotAssignDiv">      
            <div id="notAssignCollections" className="ui card">
                <div className="ui center aligned content"><h3 className="ui center aligned grey header">Recolhas não atribuídas</h3></div>
                {collections.length === 0 ? 
                    <div className="ui center aligned content">
                    <h3>Não existem recolhas não atribuidas</h3>
                    <i className="ui big tasks icon"></i>
                </div> :
                collections.map(c =>
                    <div className="content" key={c.collectionInfo.lectureId}>
                        <h2 className="ui aligned header">
                            <div className="ui checkbox">
                                <input type="checkbox" tabIndex="0" onChange={onSelectCollection(c)} checked={c.isChecked}/>
                                <label>
                                    {c.collectionInfo.courseName}
                                    <div className="sub header">{c.collectionInfo.classStartDate}</div>
                                </label>
                            </div>
                        </h2>
                    </div>
                )}
                {isLoading ? <div className="ui center aligned content"><ListLoading/></div> : ""}  
            </div>
            <div ref={scrollObserver}></div>
        </div>

    /*assign the checked collections to a collector and updates the collections not assign list */
    function onAssignCollections(collectorId) {
        return async () => {
            const selectedCollections = collections.filter(c => c.isChecked)
            console.log(JSON.stringify(selectedCollections))
            if (selectedCollections.length === 0) return setNoSelectedCollections(true)
            const colls = selectedCollections.map(collection => 
                ({ "collectionId" : collection.collectionInfo.lectureId, "collectionDate" : collection.collectionInfo.classStartDate })
            )
            await collectionsService.updateCollectorInCollection(collectorId, colls)
            try {
                const newPage = 1
                setPage(newPage)
                const collectionsInfo = await collectionsService.getCollectionsNotAssign(newPage)
                setCollections(collectionsInfo)
                setMoreCollections(true)
                setIsLoading(false)
            } catch (e) {
                setError(e)
            }
        }
    }

    /*assign the collections in a route to a collector */
    async function onAssignRouteCollections(collectorId, routeCollections) {
        const colls = routeCollections.map(collection => 
            ({"collectionId" : collection.lectureId, "collectionDate" : collection.collectionTime}))
        try {
            await collectionsService.updateCollectorInCollection(collectorId, colls)
        } catch (e) {
            setError(e)
        }
    }

    /*updates the collections not assign list after assign with routes*/
    async function onUpdateCollectionAfterAssign() {
        setSearchDate(undefined)
        try {
            const newPage = 1
            setPage(newPage)
            const collectionsInfo = await collectionsService.getCollectionsNotAssign(newPage)
            setCollections(collectionsInfo)
            setMoreCollections(true)
            setIsLoading(false)
        } catch (e) {
            setError(e)
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

    /* Set flag routesCollections when button for assign collections mode is press */
    async function onChangeViewToRoutes() {
        setRoutesCollections(!routesCollections)
        setSearchDate(undefined)
        setSelectAllCollections(false)
        try {
            const newPage = 1
            setPage(newPage)
            const collectionsInfo = await collectionsService.getCollectionsNotAssign(newPage)
            setCollections(collectionsInfo)
            setMoreCollections(true)
            setIsLoading(false)
        } catch (e) {
            setError(e)
        }
    }

    /*Filter not assign collections by date */
    async function onFilterCollectionsByDate(date) {
        setSearchDate(date)
        try {
            const newPage = 1
            setPage(newPage)
            const collectionsInfo = await collectionsService.getCollectionsNotAssign(newPage, date)
            setCollections(collectionsInfo)
            setMoreCollections(true)
            setIsLoading(false)
        } catch (e) {
            setError(e)
        }
    }

    /*collectors list view */
    const collectorsAvailable = <Collectors collectors={collectors} assignCollections={onAssignCollections} />

    /*info message view when is selected assign button with no selected collections */
    const noSelectedCollectionsMessage = noSelectedCollections ?
        <Messages messageTitle="Não existem recolhas selecionadas para atribuir" messageBody="Selecione uma ou mais recolhas para atribuir a um responsável." messageType="info" />
        : ""

    /* Based on flag routesCollections shows or a collectores list or routes view*/
    const routesOrManualAssign = routesCollections ?
        <AssignCollectionRoutes routesService={routesService} collectorsService={collectorsService} collections={collections}
            assignCollections={onAssignRouteCollections} filterCollections={onFilterCollectionsByDate} updateCollectionAfterAssign={onUpdateCollectionAfterAssign} />
        : <div id="collectorsDiv">
            <div id="collectorsHeaderDiv">
                <div id="collectorsSearchDiv" className="content">{searchCollectors}</div>
                <h2 className="ui blue header">Responsáveis pela recolha disponíveis</h2>
            </div>
            {noSelectedCollectionsMessage}
            {collectorsAvailable}
        </div>

    /*select or unselect all collections */
    function onSelectAllCollections() {
        if(selectAllCollections){
            setSelectAllCollections(false)
            collections.forEach(c => c.isChecked = false )
        }else{
            setSelectAllCollections(true)
            collections.forEach(c => c.isChecked = true )
        }
        setCollections([...collections])
    }

    return (
        !error ?
            <div>
                <div id="automaticButtonDiv">
                    <button type="button" className="ui blue button" onClick={onChangeViewToRoutes}>{routesCollections ? "Atribuir sem percurso" : "Atribuir com percurso"}</button>
                    <button type="button" className="ui basic blue button" onClick={onSelectAllCollections}>{selectAllCollections ? "Desmarcar todas" : "Selecionar todas"}</button>
                </div>
                <div>
                    {collectionsNotAssign}
                </div>
                <div>{routesOrManualAssign}</div>
            </div>
            : <Loading loadingText={error.message}></Loading>
    )
}