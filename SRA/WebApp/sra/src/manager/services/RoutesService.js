
export default function RoutesService(service, loginService) {

    const BASE_URI = service.sraBaseUrl()
    const GET_COLLECTIONS_ROUTES = `${BASE_URI}/school-system/getRoomsDistribution`

    return {
        async collectionsRoutes(collections, numberOfPersons) {
            const classesDetails = collections.map(c => ({
                "lectureId": c.lectureId,
                "classroom": c.classroom,
                "startDate": c.classStartDate,
                "endDate": c.classEndDate
            }))
            const requestParams = {
                headers: { "Content-Type": "application/json", "Authorization": loginService.getToken() },
                method: "PUT",
                body: JSON.stringify({ "classesDetails": classesDetails, "numberOfPersons": numberOfPersons })
            }
            return await service.doFetch(GET_COLLECTIONS_ROUTES, requestParams)
        }
    }
}