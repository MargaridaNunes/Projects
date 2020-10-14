
export default function CollectorsService(service, loginService) {

    const BASE_URI = service.sraBaseUrl()
    const GET_COLLECTORS = (collectorIdentifier) => `${BASE_URI}/collectors?collector=${collectorIdentifier}`

    return {
        async getCollectors(collectorIdentifier = "") {
            const headers = { headers: { "Authorization": loginService.getToken() } }
            const collectors = await service.doFetch(GET_COLLECTORS(collectorIdentifier), headers)
            return collectors.collectors
        }
    }
}