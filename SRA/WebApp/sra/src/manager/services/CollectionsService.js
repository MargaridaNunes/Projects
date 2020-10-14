
export default function CollectionsService(service,loginService) {

    const BASE_URI = service.sraBaseUrl()
    const GET_COLLECTIONS_BY_STATE = (state, page) => `${BASE_URI}/collections?state=${state}&page=${page}`
    const GET_COLLECTIONS_NOT_ASSIGN = (page) => `${BASE_URI}/collections/not-assigned?page=${page}`
    const GET_COLLECTIONS_NOT_ASSIGN_BY_DATE = (page, date) => `${BASE_URI}/collections/not-assigned?page=${page}&date=${date}`
    const UPDATE_COLLECTOR_IN_COLLECTIONS = (collectorId) => `${BASE_URI}/collectors/${collectorId}/assign-collections`

    return {
        async getCollections(state, page) {
            const collections = await service.doFetch(GET_COLLECTIONS_BY_STATE(state, page), getAuthorizationHeader())
            return collections.collections
        },
        async getCollectionsNotAssign(page, date) {
            let uri
            if (!date) uri = GET_COLLECTIONS_NOT_ASSIGN(page)
            else uri = GET_COLLECTIONS_NOT_ASSIGN_BY_DATE(page, date)
            const collections = await service.doFetch(uri, getAuthorizationHeader())
            return convertCollectionsToHaveCheck(collections.collections)
        },
        async updateCollectorInCollection(collectorId, collections) {
            console.log(JSON.stringify(collections))
            const requestParams = {
                headers: { "Content-Type": "application/json", "Authorization": loginService.getToken() },
                method: "PUT",
                body: JSON.stringify({ "collections" : collections})
            }
            return await service.doFetch(UPDATE_COLLECTOR_IN_COLLECTIONS(collectorId), requestParams)
        }
    }

    function getAuthorizationHeader() {
        return { headers: { "Authorization": loginService.getToken() } }
    }
}

function convertCollectionsToHaveCheck(collections){
    return collections.map(c => ({"isChecked" : false, "collectionInfo" : c}))
}