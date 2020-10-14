import React, { useState, useEffect } from 'react'
import Seasons from './Seasons'
import Programmes from './Programmes'
import Classes from './Classes'
import Courses from './Courses'
import CoursesDetails from './CoursesDetails'
import Loading from '../../utils/Loading'
/*
    Component which describes the the page to create collections from the lectures present in the THOR database
*/

export default function CreateCollectionsPage({ thorService }) {

    const [databaseFileName, setDatabaseFileName] = useState("THOR.mdb") //contains the value for the databaseFileName
    const [databaseFiles, setDatabaseFiles] = useState() // contains all the database files information in the school system
    const [searchDate, setSearchDate] = useState(undefined) // contains the value for the searched date
    const [exportMessage, setExportMessage] = useState(undefined)
    const [noDatabaseFilesErrorMessage, setNoDatabaseFilesErrorMessage] = useState(false)
    const [error, setError] = useState(undefined)

    function displayDatabaseFiles() {
        return (
            <div>
                <div className="ui menu">
                    <div>
                        <div className="ui top attached menu">
                            <div role="listbox" aria-expanded="false" className="ui item simple dropdown" tabIndex="0">
                                <div className="text" role="alert" aria-live="polite" aria-atomic="true">
                                    {databaseFileName}
                                    {
                                        databaseFiles.length > 1 ? <i aria-hidden="true" className="dropdown icon"></i> : ""
                                    }
                                </div>
                                <div className="menu transition align">
                                    {
                                        databaseFiles
                                            .filter(f => f.filename !== databaseFileName)
                                            .map(f => (
                                                <div
                                                    key={f.filename}
                                                    className="ui item"
                                                    onClick={(event) => { setDatabaseFileName(f.filename); clearAllTables() }}>
                                                    {f.filename}
                                                </div>

                                            ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function createSeasonProgrammesKey(seasonSemesterRepresent) {
        return seasonSemesterRepresent
    }

    function createProgrammeClassesKey(seasonSemesterRepresent, programmeAcr) {
        return `${seasonSemesterRepresent}-${programmeAcr}`
    }

    function createClassCoursesKey(seasonSemesterRepresent, programmeAcr, classAcronym) {
        return `${seasonSemesterRepresent}-${programmeAcr}-${classAcronym}`
    }

    function createCourseDetailsKey(seasonSemesterRepresent, programmeAcr, classAcronym, courseAcronym) {
        return `${seasonSemesterRepresent}-${programmeAcr}-${classAcronym}-${courseAcronym}`
    }

    function getCurrentDate() {
        const date = new Date()
        const [day, month, year] = date.toLocaleDateString().split("/")
        return `${year}-${month}-${day}`
    }


    useEffect(() => {
        thorService.getAllDatabaseFilesInformation()
            .then(files => {
                if (files.length === 0) {
                    // no files, set error on page
                    setNoDatabaseFilesErrorMessage(true)
                } else {
                    setDatabaseFileName(files[0].filename)
                    setDatabaseFiles(files)
                }
            }).catch(e => setError(e))
    }, [thorService]) // only execute once, when rendering the page

    /*
       seasonsInformation is an array of objects which contains all the information of a season
       Its initialized when a user hits the search button.
       Example : 
       [{
          seasonNumber: 30,
          semesterRepresent: "2019/20-Verão",
       },
       {
         ...
       }, ...]
    */
    const [seasonsInformation, setSeasonsInformation] = useState(undefined)

    /*
        programmes information is a map, with a key = semesterRepresent and value = information of 
        all the programmes in the season with semester = semesterRepresent
        Example : 

        {
            "2019/20-Verão" : {
                visible : true,
                seasonNumber : 30,
                semesterRepresent : "2019/20-Verão",
                programmes : [
                    {
                        id: 4,
                        acronym: "LEIC",
                        designation : "Licenciatura em Engenharia Informática e de Computadores"
                    },
                    ...
                ]
            }
        }
    
    */
    const [programmesInformation, setProgrammesInformation] = useState(undefined)


    /*
        classes information is a map, with a key = semesterRepresent|programmeAcronym, value = 
        information of all the classes in the programme in the season with semesterRepresent
        Example : 
    
        {
           "2019/20-Verão-LEIC" : {
                visible : true,
                seasonNumber : 30,
                semesterRepresent : "2019/20-Verão",
                programmeAcronym : LEIC,
                programmeId : 4,
                classes : [
                    {
                        acronym: "LI61D"
                    },
                    ...
                ]
           },
           ...
        }
    
    */

    const [classesInformation, setClassesInformation] = useState(undefined)

    /*
      coursesInformation is a map, with a key = semesterRepresent|programmeAcronym|classAcronym . 
      value = information of all the courses for this class in the programme in the specific season
      Example : 

      {
          "2019/20-Verão-LEIC-LI61D" : {
            visible : true,
            seasonNumber : 30,
            semesterRepresent : "2019/20-Verão",
            programmeAcronym : LEIC,
            programmeId : 4,
            classAcronym : LI61D,
            courses : [
                    {
                        acronym: "MPD[I]"
                    },
                    ...
            ]
          },
          ...
      }
    */

    const [coursesInformation, setCoursesInformation] = useState(undefined)


    /*
       courseDetailsInformation is a map, with a key = semesterRepresent|programmeAcronym|classAcronym|courseAcronym , value = 
       the detailed information of the course for this class in the programme in the specific season
       Example : 

        {
          "2019/20-Verão-LEIC-LI61D-EGP[I]" : {
            visible : true,
            seasonNumber : 30,
            semesterRepresent : "2019/20-Verão",
            programmeAcronym : LEIC,
            programmeId : 4,
            classAcronym : LI61D,
            courseAcronym : MPD[I]
            courseDetails : [
                {
                    selected : true,
                    "beginDate": "2020-06-01 15:30:00",
                    "endDate": "2020-06-01 18:30:00",
                    "classroom": "G.0.15/L_S3"
                },
                {
                    selected : false,
                    "beginDate": "2020-06-05 14:00:00",
                    "endDate": "2020-06-05 15:30:00",
                    "classroom": "G.0.15"
                }
            ]
          },    
          ...
      }
    */
    const [courseDetailsInformation, setCourseDetailsInformation] = useState(undefined)


    /*
      Search for all seasons existing on the provided database file.
      It also clears all previous searches
    */
    const onSearchSeasonsForDatabaseFile = async () => {
        clearAllTables()
        try {
            const result = await thorService.getAllSeasons(databaseFileName)
            setSeasonsInformation(result)
        } catch (e) {
            setError(e)
        }
    }

    function clearAllTables() {
        setSeasonsInformation(undefined)
        setProgrammesInformation(undefined)
        setClassesInformation(undefined)
        setCoursesInformation(undefined)
        setCourseDetailsInformation(undefined)
    }

    function hideSeasonDependencies(semesterProgrammesKey) {
        const programmes = { ...programmesInformation }
        const entry = programmes[semesterProgrammesKey]
        entry.visible = false
        setProgrammesInformation(programmes)
        const seasonProgrammes = programmes[semesterProgrammesKey].programmes
        seasonProgrammes.forEach(p => {
            const programmeClassesKey = createProgrammeClassesKey(entry.semesterRepresent, p.acronym) //`${semesterProgrammesKey}-${p.acronym}`
            if (classesInformation && classesInformation[programmeClassesKey])
                hideProgrammeDependencies(programmeClassesKey)
        })
    }

    function hideProgrammeDependencies(programmeClassesKey) {
        const classes = { ...classesInformation }
        const entry = classes[programmeClassesKey]
        entry.visible = false
        setClassesInformation(classes)
        const programmesClasses = classes[programmeClassesKey].classes
        programmesClasses.forEach(c => {
            const classCoursesKey = createClassCoursesKey(entry.semesterRepresent, entry.programmeAcronym, c.acronym) //`${programmeClassesKey}-${c.acronym}`
            if (coursesInformation && coursesInformation[classCoursesKey]) {
                hideClassDependencies(classCoursesKey)
            }
        })
    }

    function hideClassDependencies(classCoursesKey) {
        const courses = { ...coursesInformation }
        const entry = courses[classCoursesKey]
        entry.visible = false
        setCoursesInformation(courses)

        const classCourses = courses[classCoursesKey].courses
        classCourses.forEach(cc => {
            const coursesDetailsKey = createCourseDetailsKey(entry.semesterRepresent, entry.programmeAcronym, entry.classAcronym, cc.acronym)//`${classCoursesKey}-${cc.acronym}`
            if (courseDetailsInformation && courseDetailsInformation[coursesDetailsKey]) {
                hideCourseDependencies(coursesDetailsKey)
            }
        })
    }

    function hideCourseDependencies(courseDetailsKey) {
        const courseDetails = { ...courseDetailsInformation }
        courseDetails[courseDetailsKey].visible = false
        //  set all a course details course details array objects to select = false 
        courseDetails[courseDetailsKey].courseDetails.forEach(detail => {
            detail.selected = false
        })

        setCourseDetailsInformation(courseDetails)
    }

    function onClickSeason(season) {
        return async (event) => {
            const isCheck = event.target.checked
            const seasonNumber = season.seasonNumber
            const seasonProgrammesKey = createSeasonProgrammesKey(season.semesterRepresent)
            const programmes = programmesInformation ? { ...programmesInformation } : {}
            try {
                if (isCheck) {
                    if (!programmes[seasonProgrammesKey]) {
                        const result = await thorService.getProgrammes(databaseFileName, seasonNumber)
                        programmes[seasonProgrammesKey] = {
                            seasonNumber,
                            semesterRepresent: seasonProgrammesKey,
                            programmes: result
                        } 
                    }
                    programmes[seasonProgrammesKey].visible = true
                    setProgrammesInformation(programmes)
                } else {
                    hideSeasonDependencies(seasonProgrammesKey) //set not visible all programmes / classes / courses / course details for this season
                }
            } catch (e) {
                setError(e)
            }
        }
    }

    function onClickProgramme(season, programme) {
        return async (event) => {
            const isCheck = event.target.checked
            const seasonNumber = season.seasonNumber
            const semesterRepresent = season.semesterRepresent
            const programmeAcr = programme.acronym
            const programmeId = programme.id
            const classes = classesInformation ? { ...classesInformation } : {}
            const programmeClassesKey = createProgrammeClassesKey(season.semesterRepresent, programmeAcr)
            try {
                if (isCheck) {
                    if (!classes[programmeClassesKey]) {
                        const response = await thorService.getClasses(databaseFileName, seasonNumber, programmeId)
                        classes[programmeClassesKey] = {
                            seasonNumber,
                            semesterRepresent,
                            programmeAcronym: programmeAcr,
                            programmeId,
                            classes: response
                        }
                    }
                    classes[programmeClassesKey].visible = true
                    setClassesInformation(classes)
                } else {
                    hideProgrammeDependencies(programmeClassesKey) //set not visible all classes / courses / course details for this programme classes
                }
            } catch (e) {
                setError(e)
            }
        }
    }

    function onClickClass(season, programme, classAcronym) {
        return async (event) => {
            const isCheck = event.target.checked
            const seasonNumber = season.seasonNumber
            const semesterRepresent = season.semesterRepresent
            const programmeAcr = programme.programmeAcronym
            const programmeId = programme.programmeId
            const courses = coursesInformation ? { ...coursesInformation } : {}
            const classCoursesKey = createClassCoursesKey(season.semesterRepresent, programmeAcr, classAcronym)
            try {
                if (isCheck) {
                    if (!courses[classCoursesKey]) {
                        const response = await thorService.getCourses(databaseFileName, seasonNumber, programmeId, classAcronym)
                        courses[classCoursesKey] = {
                            seasonNumber,
                            semesterRepresent,
                            programmeAcronym: programmeAcr,
                            programmeId,
                            classAcronym,
                            courses: response
                        }  
                    }
                    courses[classCoursesKey].visible = true
                    setCoursesInformation(courses)
                } else {
                    hideClassDependencies(classCoursesKey) //set not visible all courses / course details for this programme classes
                }
            } catch (e) {
                setError(e)
            }
        }
    }

    function onClickCourse(season, programme, classAcronym, courseAcronym) {
        return async (event) => {
            const isCheck = event.target.checked
            const seasonNumber = season.seasonNumber
            const semesterRepresent = season.semesterRepresent
            const programmeAcr = programme.programmeAcronym
            const programmeId = programme.programmeId
            const courseDetails = courseDetailsInformation ? { ...courseDetailsInformation } : {}
            const courseDetailsKey = createCourseDetailsKey(semesterRepresent, programmeAcr, classAcronym, courseAcronym)
            try {
                if (isCheck) {
                    if (!courseDetails[courseDetailsKey]) {
                        const response = await thorService.getCourseDetails(databaseFileName, seasonNumber, programmeId, classAcronym, courseAcronym, searchDate)
                        courseDetails[courseDetailsKey] = {
                            seasonNumber,
                            semesterRepresent,
                            programmeAcronym: programmeAcr,
                            programmeId,
                            classAcronym,
                            courseAcronym,
                            courseDetails: response
                        }
                    }
                    courseDetails[courseDetailsKey].visible = true
                    setCourseDetailsInformation(courseDetails)
                } else {
                    hideCourseDependencies(courseDetailsKey) //set not visible all  course details for this programme classes courses
                }
            } catch (e) {
                setError(e)
            }
        }
    }

    function onClickCourseDetail({ semesterRepresent, seasonNumber, programmeId, programmeAcronym, classAcronym, courseAcronym }, index) {
        return (event) => {
            const isCheck = event.target.checked
            const courseDetailsKey = createCourseDetailsKey(semesterRepresent, programmeAcronym, classAcronym, courseAcronym)
            const courseDetails = { ...courseDetailsInformation }
            const courseDetail = courseDetails[courseDetailsKey]
            courseDetail.courseDetails[index].selected = isCheck
            setCourseDetailsInformation(courseDetails)
        }
    }

    // export functions
    async function onExportProgrammes() {
        if (classesInformation) {
            setExportMessage("A criar recolhas baseadas nos cursos selecionados...")
            const promises = []
            try {
                Object.keys(classesInformation)
                    .filter(key => classesInformation[key].visible)
                    .map(key => classesInformation[key])
                    .forEach(c => {
                        promises.push(
                            thorService.createLecturesForProgramme(databaseFileName, c.seasonNumber, c.programmeId, searchDate)
                        )
                    })
                await Promise.all(promises)
                clearAllTables()
                setExportMessage(undefined)
            } catch (e) {
                setError(e)
            }
        }
    }

    async function onExportClasses() {
        if (coursesInformation) {
            setExportMessage("A criar recolhas baseadas nas turmas selecionadas...")
            const promises = []
            try {
                Object.keys(coursesInformation)
                    .filter(key => coursesInformation[key].visible)
                    .map(key => coursesInformation[key])
                    .forEach(c => {
                        promises.push(
                            thorService.createLecturesForClass(databaseFileName, c.seasonNumber, c.programmeId, c.classAcronym, searchDate)
                        )
                    })
                await Promise.all(promises)
                clearAllTables()
                setExportMessage(undefined)
            } catch (e) {
                setError(e)
            }
        }
    }

    async function onExportCourses() {
        if (courseDetailsInformation) {
            setExportMessage("A criar recolhas baseadas nas UC's selecionadas...")
            const promises = []
            try {
                Object.keys(courseDetailsInformation)
                    .filter(key => courseDetailsInformation[key].visible)
                    .map(key => courseDetailsInformation[key])
                    .forEach(c => {
                        promises.push(
                            thorService.createLecturesForCourse(databaseFileName, c.seasonNumber, c.programmeId, c.classAcronym, c.courseAcronym, searchDate)
                        )
                    })
                await Promise.all(promises)
                clearAllTables()
                setExportMessage(undefined)
            } catch (e) {
                setError(e)
            }
        }
    }

    async function onExportCourseDetails() {
        if (courseDetailsInformation) {
            setExportMessage("A criar recolhas baseadas nas aulas selecionadas...")
            const promises = []
            try {
                Object.keys(courseDetailsInformation)
                    .filter(key => courseDetailsInformation[key].visible)
                    .map(key => courseDetailsInformation[key])
                    .forEach(c => {
                        c.courseDetails
                            .filter(cd => cd.selected)
                            .forEach(cd => {
                                promises.push(
                                    thorService.createLecturesForCourseDetails(databaseFileName, c.seasonNumber, c.programmeId, c.classAcronym, c.courseAcronym, cd.classroom, cd.beginDate, cd.endDate)
                                )
                            })
                    })
                await Promise.all(promises)
                clearAllTables()
                setExportMessage(undefined)
            } catch (e) {
                setError(e)
            }
        }
    }


    const numberOfProgrammes = programmesInformation === undefined ? 0 : Object.keys(programmesInformation).filter(key => programmesInformation[key].visible).length
    const numberOfClasses = classesInformation === undefined ? 0 : Object.keys(classesInformation).filter(key => classesInformation[key].visible).length;
    const numberOfCourses = coursesInformation === undefined ? 0 : Object.keys(coursesInformation).filter(key => coursesInformation[key].visible).length;
    const numberOfCourseDetails = courseDetailsInformation === undefined ? 0 : Object.keys(courseDetailsInformation).filter(key => courseDetailsInformation[key].visible).length;
    const numberOfSelectedCourseDetails = courseDetailsInformation === undefined ? 0 : Object.keys(courseDetailsInformation).filter(key => courseDetailsInformation[key].visible).flatMap(key => courseDetailsInformation[key].courseDetails).filter(cd => cd.selected === true).length;

    if (exportMessage) {
        return <Loading loadingText={exportMessage}></Loading>
    }
    else if (noDatabaseFilesErrorMessage) {
        return (
            <div className="ui negative message">
                <div className="header">De momento não é possível agendar recolhas </div>
                <p>Não estão disponíveis as informações das aulas</p>
            </div>
        )
    }
    else {
        return !error ?
            databaseFiles ? (
                <div className="ui center aligned container">
                    <div>
                        <div className="ui icon input" style={{ padding: "10px" }}>
                            {
                                displayDatabaseFiles()
                            }
                            <input required type="date" defaultValue={searchDate} min={getCurrentDate()} onChange={(event) => { clearAllTables(); setSearchDate(event.target.value) }} />
                        </div>
                        {
                            searchDate
                                ? <button type="button" className="ui button" onClick={onSearchSeasonsForDatabaseFile}>Pesquisar</button>
                                : <button type="button" className="ui button" disabled>Pesquisar</button>
                        }
                    </div>
                    <div id="seasonsDiv">
                        {seasonsInformation ? <Seasons seasons={seasonsInformation} onClickSeason={onClickSeason} /> : ""}
                    </div>
                    <div id="programmesDiv">
                        {
                            programmesInformation
                                ? <Programmes programmes={programmesInformation} onClickProgramme={onClickProgramme} hidden={numberOfProgrammes === 0} />
                                : ""
                        }
                    </div>
                    <div id="classesDiv">
                        {classesInformation
                            ? <Classes classes={classesInformation} onClickClass={onClickClass} hidden={numberOfClasses === 0} />
                            : ""}
                    </div>
                    <div id="coursesDiv">
                        {coursesInformation
                            ? <Courses courses={coursesInformation} onClickCourse={onClickCourse} hidden={numberOfCourses === 0} />
                            : ""}
                    </div>
                    <div id="courseDetailsDiv">
                        {courseDetailsInformation
                            ? <CoursesDetails coursesDetails={courseDetailsInformation} onClickCourseDetail={onClickCourseDetail} hidden={numberOfCourseDetails === 0} />
                            : ""}
                    </div>

                    {
                        numberOfProgrammes > 0
                            ? numberOfClasses > 0
                                ? <button type="button" className="ui button" onClick={onExportProgrammes}>Exportar Cursos </button>
                                : <button type="button" className="ui button" disabled >Exportar Cursos </button>
                            : " "
                    }

                    {
                        numberOfClasses > 0
                            ? numberOfCourses > 0
                                ? <button type="button" className="ui button" onClick={onExportClasses}>Exportar Turmas </button>
                                : <button type="button" className="ui button" disabled >Exportar Turmas </button>
                            : " "

                    }

                    {
                        numberOfCourses > 0
                            ? numberOfCourseDetails > 0
                                ? <button type="button" className="ui button" onClick={onExportCourses}>Exportar UC's </button>
                                : <button type="button" className="ui button" disabled>Exportar UC's </button>
                            : " "

                    }

                    {
                        numberOfCourseDetails > 0
                            ? numberOfSelectedCourseDetails > 0
                                ? <button type="button" className="ui button" onClick={onExportCourseDetails}>Exportar Aulas Selecionadas </button>
                                : <button type="button" className="ui button" disabled>Exportar Aulas Selecionadas </button>
                            : " "

                    }



                </div>
            ) : <Loading loadingText={"A carregar informação"}></Loading>
            : <Loading loadingText={error.message}></Loading>
    }
}
