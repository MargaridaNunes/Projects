
import ErrorHandler from '../errorHandler/ErrorHandler';

const exceptionsMapper = ErrorHandler()

const HOST = `10.62.73.49`
const PORT = `8090`

export default function Service({onForbidden}) {
    return {
        async doFetch(url, params, successfulStatusCode = 200) {
            let respJson, status
            try {
                const response = await fetch(url, params)
                status = response.status
                respJson = await response.json()
                if (status !== successfulStatusCode) {
                    throw respJson
                }
            } catch (e) {
                const ex = exceptionsMapper(e)
                if(ex.title && (ex.title === "Forbidden" || ex.title === "Invalid Credentials")) onForbidden()
                throw ex
            }
            return respJson
        },
        sraBaseUrl() { return `http://${HOST}:${PORT}/sra/api` }
    }
}