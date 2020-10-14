import Service from '../service/Service'
import ErrorHandler from '../errorHandler/ErrorHandler'

const exceptionsMapper = ErrorHandler()

const LOGIN = `http://10.62.73.49:8090/sra/api/login`

const userInfoKey = "UserInfo"

let userInformation = undefined

export default function LoginService(onLogout) {
    const loginService = {
        getToken() {
            if (!userInformation) {
                const loginInfo = sessionStorage.getItem(userInfoKey)
                userInformation = JSON.parse(loginInfo)
            }
            return `Basic ${btoa(`${userInformation.email}:${userInformation.password}`)}`
        },
        getUserInfo() {
            if (!userInformation) {
                const loginInfo = sessionStorage.getItem(userInfoKey)
                userInformation = JSON.parse(loginInfo)
            }
            const info = { ...userInformation }
            info.password = undefined
            return info
        },
        isLogin() {
            return sessionStorage.getItem(userInfoKey) !== null
        },
        async login(email, password) {
            const p = btoa(password)
            const requestParams = {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ "email": email, "password": p })
            }
            let status, respJson, loginInfo
            try{
                respJson = await fetch(LOGIN, requestParams)
                status = respJson.status
                loginInfo = await respJson.json()
                if (status !== 200) {
                throw loginInfo
            }
            } catch (e) {
                const ex = exceptionsMapper(e)
                if(ex.title && (ex.title == "Forbidden" || ex.title == "Invalid Credentials")) this.logout()
                throw ex
            }
            
            if (!loginInfo.managerInformation && !loginInfo.adminInformation) throw exceptionsMapper({ title: "No permissions" })
            userInformation = { password : p, ...loginInfo }
            console.log(userInformation)
            sessionStorage.setItem(userInfoKey, JSON.stringify(userInformation))
        },
        logout() {
            sessionStorage.removeItem(userInfoKey)
            userInformation = undefined
            onLogout()
        }
    }
    return loginService
}