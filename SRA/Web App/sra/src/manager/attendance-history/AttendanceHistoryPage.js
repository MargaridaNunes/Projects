import React, { useState, useEffect, useRef, Children } from 'react'
import Loading from '../../utils/Loading'
import ListLoading from '../../utils/LoadingList'

export default function CollectionsHistoryPage({ lecturesService }) {
    /*scroll reference */
    const scrollObserver = useRef()

    /*lectures list */
    const [lectures, setLectures] = useState([])
    /*lecture attendances */
    const [lectureAttendance, setLectureAttendance] = useState(undefined)
    /*error flag */
    const [error, setError] = useState(undefined)
    /*observer radio */
    const [scrollObserverRatio, setScrollObserverRatio] = useState(undefined)
    /*page number */
    const [page, setPage] = useState(0)
    /*get more collections */
    const [moreLectures, setMoreLectures] = useState(true)
    /*search lectures box input - courseName or date*/
    const [searchCourseInput, setSearchCourseInput] = useState("")
    /*search lectures box input - courseName or date*/
    const [searchDateInput, setSearchDateInput] = useState("")
    /*is loading users */
    const [isLoading, setIsLoading] = useState(false)

    /* scroll observer */
    const observer = new IntersectionObserver(entries => {
        const ratio = entries[0].intersectionRatio;
        setScrollObserverRatio(ratio)
    })

    useEffect(() => {
        observer.observe(scrollObserver.current)
        return () => {
            observer.disconnect()
        }
    }, [])

    useEffect(() => {
        if (scrollObserverRatio >= 0 && moreLectures && !isLoading) {
            setIsLoading(true)
            const newPage = page + 1
            setPage(newPage)
            lecturesService.getLectures(newPage, searchCourseInput, searchDateInput).then(lecturesInfo => {
                if (lecturesInfo.length === 0) {
                    setMoreLectures(false)
                    setIsLoading(false)
                    return
                }
                const lects = [...lectures, ...lecturesInfo]
                setLectures(lects)
                setIsLoading(false)
            }).catch(e => setError(e))
        }
    }, [scrollObserverRatio])

    async function onSearchLectures(course, date) {
        try {
            const lecturesInfo = await lecturesService.getLectures(1, course, date)
            setLectures(lecturesInfo)
            setMoreLectures(true)
            setPage(1)
        } catch (e) {
            setError(e)
        }
    }

    /*put the search box changed input in search input */
    function onChangeInputSearch(event) {
        const course = event.target.value
        setSearchCourseInput(course)
        onSearchLectures(course, searchDateInput)
    }

    function onDateChange(event) {
        const date = event.target.value
        setSearchDateInput(date)
        onSearchLectures(searchCourseInput, date)
    }

    function cancelSearch() {
        setSearchCourseInput("")
        setSearchDateInput("")
        setMoreLectures(true)
        setPage(1)
        lecturesService.getLectures().then(info => setLectures(info)).catch(e => setError(e))
    }

    const searchBox =
        <div>
            <div className="ui action input">
                <div className="ui icon input">
                    <input type="text" placeholder="Pesquisar..." value={searchCourseInput} onChange={onChangeInputSearch} />
                    {searchCourseInput || searchDateInput ?
                        <div className="label" onClick={cancelSearch}>
                            <i id="collectoresSearchBoxIcon" aria-hidden="true" className="center delete icon"></i>
                        </div>
                        : <i aria-hidden="true" className="search icon"></i>
                    }
                </div>
                <div className="ui input"> 
                    {
                        searchDateInput
                            ? <input value={searchDateInput} type="date" onChange={onDateChange} />
                            : <input value="" type="date" onChange={onDateChange} />
                    }
                </div>
            </div>
        </div>

    const lecturesTable = lectures.length !== 0 ?
        <div>
            <table className="ui single line selectable table">
                <thead className="">
                    <tr className="">
                        <th className="">Disciplina</th>
                        <th className="">Professor</th>
                        <th className="">Data de início da aula</th>
                        <th className="">Data de fim da aula</th>
                    </tr>
                </thead>
                <tbody className="">
                    {lectures.map(l =>
                        <tr className="" key={l.lectureId} onClick={lectureDetails(l)}>
                            <td className="">{l.courseName}</td>
                            <td className="">{l.teacherName}</td>
                            <td className="">{l.startDate}</td>
                            <td className="">{l.endDate}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {isLoading ? <div className="ui center aligned content"><ListLoading /></div> : ""}
        </div>
        : ""

    function lectureDetails(lecture) {
        return async () => {
            try {
                const attendance = await lecturesService.getLectureAttendance(lecture.lectureId)
                setLectureAttendance(attendance)
            } catch (e) {
                setError(e)
            }
        }
    }

    const attendancesTable = lectureAttendance && lectureAttendance.attendances.length !== 0 ?
        <table className="ui single line table">
            <thead className="">
                <tr className="">
                    <th className="">Número de aluno</th>
                    <th className="">Data de registo</th>
                </tr>
            </thead>
            <tbody className="">
                {lectureAttendance.attendances.map(a =>
                    <tr className="" key={a.studentNumber}>
                        <td className="">{a.studentNumber}</td>
                        <td className="">{a.registryDate}</td>
                    </tr>
                )}
            </tbody>
        </table> : ""

    if (error) return <Loading loadingText={error.message}></Loading>

    const lecturesDiv = lectureAttendance
        ? <div id="lecturesTable">
            <h2 className="ui blue header center aligned container">Aulas</h2>
            {searchBox}
            <div id="lecturesDiv">
                {lecturesTable}
                <div ref={scrollObserver}></div>
            </div>
        </div>
        : <div className="ui center aligned container">
            <h2 className="ui blue header center aligned container">Aulas</h2>
            {searchBox}
            <div id="lecturesDivCenter">
                {lecturesTable}
                <div ref={scrollObserver}></div>
            </div>
        </div>

    const lectureAttendanceDiv = lectureAttendance
        ? lectureAttendance.attendances.length !== 0 ?
            <div id="attendancesTable">
                <div>
                    <h2 id="attendanceTableHeader" className="ui blue header">Presenças</h2>
                    <button type="button" className="ui right floated basic red button" onClick={() => setLectureAttendance(undefined)}><i className="ui delete icon" /></button>
                </div>
                {attendancesTable}
            </div>
            : <div id="attendancesTable">
                <button type="button" className="ui right floated basic red button" onClick={() => setLectureAttendance(undefined)}><i className="ui delete icon" /></button>
                <h3 className="ui header center aligned container">Não exitem presenças registadas para a aula selecionada</h3>
                <i className="ui massive qrcode icon center aligned container" />
            </div>
        : <div></div>


    return (
        <div>
            {lecturesDiv}
            {lectureAttendanceDiv}
        </div>
    )

}