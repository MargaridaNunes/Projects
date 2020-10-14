/*
    Module that exports a service that interacts with the Web-API to obtain the necessary information from 
    the THOR database.
    The service exposes the following operations for a given THOR database :
        -   Obtain all the database files in the school system
        -   Obtain all the seasons in the school system
        -   Obtain all programmes for a given season
        -   Obtain all classes for a given programme
        -   Obtain all courses (UC's) for a given class
        -   Obtain the details of a specific course
*/

/**
 * Function used to obtain a version of the THOR service which communicates with the SRA Web-API
 */
export default function CreateThorService(service, loginService) {
    console.log(service)
    const BASE_URI = service.sraBaseUrl()
    const SCHOOL_SYSTEM_BASE_URI = `${BASE_URI}/school-system`
    const GET_ALL_SEASONS_URI = (databaseFileName) => `${SCHOOL_SYSTEM_BASE_URI}/${databaseFileName}/seasons`
    const GET_PROGRAMMES_IN_A_SEASON_URI = (databaseFileName, season) => `${SCHOOL_SYSTEM_BASE_URI}/${databaseFileName}/seasons/${season}/programmes`
    const GET_CLASSES_OF_A_PROGRAMME_URI = (databaseFileName, season, programme) => `${SCHOOL_SYSTEM_BASE_URI}/${databaseFileName}/seasons/${season}/programmes/${programme}/classes`
    const GET_COURSES_OF_A_CLASS_URI = (databaseFileName, season, programme, classId) => `${SCHOOL_SYSTEM_BASE_URI}/${databaseFileName}/seasons/${season}/programmes/${programme}/classes/${classId}/courses`
    const GET_COURSE_DETAILS_URI = (databaseFileName, season, programme, classId, course, date) => `${SCHOOL_SYSTEM_BASE_URI}/${databaseFileName}/seasons/${season}/programmes/${programme}/classes/${classId}/courses/${course}?beginningDay=${date}`
    const CREATE_LECTURES_FOR_A_PROGRAMME = (databaseFileName, season) => `${SCHOOL_SYSTEM_BASE_URI}/${databaseFileName}/seasons/${season}/programmes`
    const CREATE_LECTURES_FOR_A_CLASS = (databaseFileName, season, programme) => `${SCHOOL_SYSTEM_BASE_URI}/${databaseFileName}/seasons/${season}/programmes/${programme}/classes`
    const CREATE_LECTURES_FOR_A_COURSE = (databaseFileName, season, programme, classId) => `${SCHOOL_SYSTEM_BASE_URI}/${databaseFileName}/seasons/${season}/programmes/${programme}/classes/${classId}/courses`
    const CREATE_LECTURES_FOR_A_COURSE_DETAIL = (databaseFileName, season, programme, classId, course) => `${SCHOOL_SYSTEM_BASE_URI}/${databaseFileName}/seasons/${season}/programmes/${programme}/classes/${classId}/courses/${course}`

    return {
        /*
            Obtain the information of all the files in the school-system.
        */
        async getAllDatabaseFilesInformation() {
            return await service.doFetch(SCHOOL_SYSTEM_BASE_URI, getAuthorizationHeader())
        }
        ,
        /*
            Obtain all seasons in the school system available in the given THOR database.
            @param thorDatabaseName - the THOR database name
        */
        async getAllSeasons(databaseFileName) {
            return await service.doFetch(GET_ALL_SEASONS_URI(databaseFileName), getAuthorizationHeader())
        },
        /*
            Obtain all programmes in the school system in a specific season in the THOR database.
            @param thorDatabaseName - the THOR database name
            @param season - the season in which we want to obtain its programmes
        */
        async getProgrammes(databaseFileName, season) {
            return await service.doFetch(GET_PROGRAMMES_IN_A_SEASON_URI(databaseFileName, season), getAuthorizationHeader())
        },
        /*
            Obtain all classes in the school system in a specific programme ( in a specific season in the THOR database).
            @param thorDatabaseName - the THOR database name
            @param season - the season in the school system
            @param programme - the programme in which we want to obtain its classes
        */
        async getClasses(databaseFileName, season, programme) {
            return await service.doFetch(GET_CLASSES_OF_A_PROGRAMME_URI(databaseFileName, season, programme), getAuthorizationHeader())
        },
        /*
            Obtain all courses in the school system for a specific class ( which is inside a programme in a specific season in the THOR database).
            @param thorDatabaseName - the THOR database name
            @param season - the season in the school system
            @param programme - the programme in the school system
            @param classId - the class identifier in which we want to obtain its courses
        */
        async getCourses(databaseFileName, season, programme, classId) {
            return await service.doFetch(GET_COURSES_OF_A_CLASS_URI(databaseFileName, season, programme, classId), getAuthorizationHeader())
        },
        /*
            Obtain the details of a course in the school system for a specific class ( which is inside a programme in a specific season in the THOR database).
            @param thorDatabaseName - the THOR database name
            @param season - the season in the school system
            @param programme - the programme in the school system
            @param classId - the class identifier in the school system
            @param course - the identifier of the course we want details of
            @param date - the day in which to look for classes, with format yyyy-MM-dd
        */
        async getCourseDetails(databaseFileName, season, programme, classId, course, date) {
            const mappedCourse = course.replace("[", "*").replace("]", "-")
            return await service.doFetch(GET_COURSE_DETAILS_URI(databaseFileName, season, programme, classId, mappedCourse, date), getAuthorizationHeader())
        },
        async createLecturesForProgramme(databaseFileName, season, programmeId, date) {
            const body = {
                programmeId,
                date
            }
            const requestOptions = buildRequestOptions(body)
            const url = CREATE_LECTURES_FOR_A_PROGRAMME(databaseFileName, season)
            await service.doFetch(url, requestOptions)
        },
        async createLecturesForClass(databaseFileName, season, programmeId, classId, date) {
            const body = {
                classId,
                date
            }
            const requestOptions = buildRequestOptions(body)
            const url = CREATE_LECTURES_FOR_A_CLASS(databaseFileName, season, programmeId)
            await service.doFetch(url, requestOptions)
        },
        async createLecturesForCourse(databaseFileName, season, programmeId, classId, courseAcronym, date) {
            const body = {
                courseAcronym,
                date
            }
            const requestOptions = buildRequestOptions(body)
            const url = CREATE_LECTURES_FOR_A_COURSE(databaseFileName, season, programmeId, classId)
            await service.doFetch(url, requestOptions)
        },
        async createLecturesForCourseDetails(databaseFileName, season, programmeId, classId, courseAcronym, classroom, startDate, endDate) {
            const mappedCourse = courseAcronym.replace("[", "*").replace("]", "-")
            const body = {
                classroom,
                startDate,
                endDate
            }
            const requestOptions = buildRequestOptions(body)
            const url = CREATE_LECTURES_FOR_A_COURSE_DETAIL(databaseFileName, season, programmeId, classId, mappedCourse)
            await service.doFetch(url, requestOptions)
        }

    }

    function getAuthorizationHeader() {
        return { headers: { "Authorization": loginService.getToken() } }
    }

    function getHeaders() {
        return {
            "Content-type": "application/json",
            "Authorization": loginService.getToken()
        }
    }

    function buildRequestOptions(body, method = "POST") {
        return {
            headers: getHeaders(),
            body: JSON.stringify(body),
            method
        }
    }
}
