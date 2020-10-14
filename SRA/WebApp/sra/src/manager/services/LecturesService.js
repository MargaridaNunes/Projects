

export default function LecturesService(service, loginService) {

    const BASE_URI = service.sraBaseUrl()
    const GET_LECTURES = (page, course, date) => `${BASE_URI}/lectures?page=${page}&course=${course}&date=${date}`
    const GET_LECTURE_ATTENDANCE = (lectureId) => `${BASE_URI}/lectures/${lectureId}/collection`

    return {
        async getLectures(page = 1, course = "", date = "") {
            console.log(page)
            const lectures = await service.doFetch(GET_LECTURES(page, course, date), getAuthorizationHeader())
            return lectures.lectures
        },
        async getLectureAttendance(lectureId) {
            return await service.doFetch(GET_LECTURE_ATTENDANCE(lectureId), getAuthorizationHeader())
        }
    }

    function getAuthorizationHeader() {
        return { headers: { "Authorization": loginService.getToken() } }
    }
}