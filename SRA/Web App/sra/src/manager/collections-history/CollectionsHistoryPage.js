import React, { useState, useRef, useEffect } from 'react'
import Loading from '../../utils/Loading'
import LoadingList from '../../utils/LoadingList'

const notStartedState = `NOT STARTED`
const inProgressState = `IN PROGRESS`
const finishedState = `FINISHED`

export default function CollectionsHistoryPage({ collectionsService }) {

    /*scroll reference */
    const scrollObserver = useRef()

    /*Collections list */
    const [collections, setCollections] = useState([])
    /*Selected collection details */
    const [specificCollection, setSpecificCollection] = useState(undefined)
    /*collections state */
    const [state, setState] = useState(undefined)
    /*error flag */
    const [error, setError] = useState(undefined)
    /*observer radio */
    const [scrollObserverRatio, setScrollObserverRatio] = useState(undefined)
    /*page number */
    const [page, setPage] = useState(1)
    /*get more collections */
    const [moreCollections, setMoreCollections] = useState(true)
    /*is loading users */
    const [isLoading, setIsLoading] = useState(false)

    const scrollOptions = {
        root: document.querySelector('#collectionsTable'),
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
        if (scrollObserverRatio >= 0  && collections && state && moreCollections && !isLoading) {
            setIsLoading(true)
            const newPage = page + 1
            setPage(newPage)
            collectionsService.getCollections(state, newPage).then(collectionsInfo => {
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

    /*get the collections in the specific state*/
    const getCollections = (state, pageValue = 1) => async () => {
        setState(state)
        setPage(pageValue)
        setSpecificCollection(undefined)
        try {
            const collectionsInfo = await collectionsService.getCollections(state, pageValue)
            setCollections(collectionsInfo)
            setMoreCollections(true)
            setIsLoading(false)
        } catch (e) {
            setError(e)
        }
    }

    /*put the selected collection in specificCollection*/
    const getSpecificCollection = (collection) => () => {
        setSpecificCollection(collection)
    }

    /*state buttons view*/
    const collectionsButtons =
        <div className="ui buttons">
            <button type="button" className="ui blue inverted button" onClick={getCollections(notStartedState)}>Agendadas</button>
            <button type="button" className="ui green inverted button" onClick={getCollections(inProgressState)}>A decorrer</button>
            <button type="button" className="ui red inverted button" onClick={getCollections(finishedState)}>Terminadas</button>
        </div>



    /*collections table view*/
    const collectionsTable = collections.length !== 0 ?
        <div>
            <table id="collectionsTable" className="ui single line selectable table">
                <thead className="">
                    <tr className="">
                        <th className="">Disciplina</th>
                        <th className="">Professor</th>
                        <th className="">Turma</th>
                        <th className="">Sala</th>
                    </tr>
                </thead>
                <tbody className="">
                    {collections.map(c =>
                        <tr className="" key={c.lectureId} onClick={getSpecificCollection(c)}>
                            <td className="">{c.courseName}</td>
                            <td className="">{c.teacherName}</td>
                            <td className="">{c.classId}</td>
                            <td className="">{c.classroom}</td>
                        </tr>
                    )}
                </tbody>
                {isLoading ? <LoadingList/> : ""}
            </table>
        </div> : ""
        

    /*collection details card view*/
    const collectionDetails = specificCollection ?
        <div className="ui card">
            <div className="ui content">
                <i aria-hidden="true" className="delete icon" onClick={() => setSpecificCollection(undefined)}></i>
                <div className="center aligned">
                    <h3>{specificCollection.courseName}</h3>
                </div>
            </div>
            <div className="ui center aligned content">
                <div className="description">Professor: {specificCollection.teacherName}</div>
                <div className="description">Semestre: {specificCollection.semesterRepresent}</div>
                <div className="description">Turma: {specificCollection.classId}</div>
                <div className="description">Sala: {specificCollection.classroom}</div>
                <div className="description">Início da aula: {specificCollection.classStartDate}</div>
                <div className="description">Fim da aula: {specificCollection.classEndDate}</div>
                <div className="description">{specificCollection.collectionStartDate ? `Início da recolha: ${specificCollection.collectionStartDate}` : ""}</div>
                <div className="description">{specificCollection.collectionEndDate ? `Fim da recolha: ${specificCollection.collectionEndDate}` : ""}</div>
                <div className="description">{specificCollection.notes ? `Notas: ${specificCollection.notes}` : ""}</div>
            </div>
        </div>
        : ""

    return (
        <div>
            {!error ?
                <div>
                    <div className="ui center aligned container">{collectionsButtons} </div>
                    <br></br>
                    <div id={collectionDetails ? "collectionsDiv" : "collectionsDivCenter"}
                        className={collectionDetails ? "" : "ui center aligned container"}>
                        {collectionsTable}
                        <div ref={scrollObserver}></div>
                    </div>
                    <div id="collectionDetailDiv"> {collectionDetails}</div>
                </div>
                : <Loading loadingText={error.message}></Loading>}
        </div>
    )
}