
const studentRole = "Aluno"
const collectorRole = "Responsável por recolhas"
const managerRole = "Gestor"
const adminRole = "Administrador"

export default function UsersService(service, loginService) {
    const BASE_URI = service.sraBaseUrl()
    const GET_USERS = (page, userInfo) => `${BASE_URI}/users?user=${userInfo}&page=${page}`
    const SPECIFIC_USER = (userId) => `${BASE_URI}/users/${userId}`
    const DELETE_STUDENT_ROLE = (userId) => `${SPECIFIC_USER(userId)}/student-role`
    const DELETE_COLLECTOR_ROLE = (userId) => `${SPECIFIC_USER(userId)}/collector-role`
    const DELETE_MANAGER_ROLE = (userId) => `${SPECIFIC_USER(userId)}/manager-role`
    const DELETE_ADMIN_ROLE = (userId) => `${SPECIFIC_USER(userId)}/admin-role`
    const CREATE_STUDENT = `${BASE_URI}/students`
    const CREATE_COLLECTOR = `${BASE_URI}/collectors`
    const CREATE_MANAGER = `${BASE_URI}/managers`
    const CREATE_ADMIN = `${BASE_URI}/admins`
    const UPDATE_STUDENT_ROLE = (userId) => `${SPECIFIC_USER(userId)}/student-role`
    const UPDATE_COLLECTOR_ROLE = (userId) => `${SPECIFIC_USER(userId)}/collector-role`
    const UPDATE_MANAGER_ROLE = (userId) => `${SPECIFIC_USER(userId)}/manager-role`
    const UPDATE_ADMIN_ROLE = (userId) => `${SPECIFIC_USER(userId)}/admin-role`

    return {
        async getUsers(page, userInfo = "") {
            console.log(page)
            const response = await service.doFetch(GET_USERS(page,userInfo), getAuthorizationHeader())
            return response.users
        },
        async getUserInfo(userId) {
            const userInfo = await service.doFetch(SPECIFIC_USER(userId), getAuthorizationHeader())
            return convertRolesInformation(userInfo)
        },
        async deleteUser(userId) {
            return await service.doFetch(SPECIFIC_USER(userId), { method: "DELETE", headers: { "Authorization": loginService.getToken() } })
        },
        async deleteRole(userId, role) {
            let uri
            if (role === studentRole) uri = DELETE_STUDENT_ROLE(userId)
            if (role === collectorRole) uri = DELETE_COLLECTOR_ROLE(userId)
            if (role === managerRole) uri = DELETE_MANAGER_ROLE(userId)
            if (role === adminRole) uri = DELETE_ADMIN_ROLE(userId)
            return await service.doFetch(uri, { method: "DELETE", headers: { "Authorization": loginService.getToken() } })
        },
        async updateRoles(userId, role) {
            let uri
            if (role === collectorRole) uri = UPDATE_COLLECTOR_ROLE(userId)
            if (role === managerRole) uri = UPDATE_MANAGER_ROLE(userId)
            if (role === adminRole) uri = UPDATE_ADMIN_ROLE(userId)
            return await service.doFetch(uri, { method: "PUT", headers: { "Authorization": loginService.getToken() } })
        },
        async UpadateStudentRole(userId, studentNumber) {
            if (!studentNumber) return
            const requestParams = {
                headers: { "Content-Type": "application/json", "Authorization": loginService.getToken() },
                method: "PUT",
                body: JSON.stringify({ "studentNumber": studentNumber })
            }
            return await service.doFetch(UPDATE_STUDENT_ROLE(userId), requestParams)
        },
        async createUserWithRole(userName, userPassword, userEmail, userRole, studentNumber) {
            let uri, bodyInfo
            const p = btoa(userPassword)
            if (userRole === studentRole) {
                uri = CREATE_STUDENT
                bodyInfo = { "email": userEmail, "password": p, "name": userName, "studentNumber": studentNumber }
            } else {
                bodyInfo = { "email": userEmail, "password": p, "name": userName }
            }
            if (userRole === collectorRole) uri = CREATE_COLLECTOR
            if (userRole === managerRole) uri = CREATE_MANAGER
            if (userRole === adminRole) uri = CREATE_ADMIN
            const requestParams = {
                headers: { "Content-Type": "application/json", "Authorization": loginService.getToken() },
                method: "POST",
                body: JSON.stringify(bodyInfo)
            }
            return await service.doFetch(uri, requestParams, 201)
        }

    }

    function getAuthorizationHeader() {
        return { headers: { "Authorization": loginService.getToken() } }
    }
}

function convertRolesInformation(user) {
    let roles = []
    if (user.studentInformation) roles = [...roles, { "role": studentRole, "roleId": user.studentInformation.studentNumber }]
    if (user.collectorInformation) roles = [...roles, { "role": collectorRole, "roleId": user.collectorInformation.collectorId }]
    if (user.managerInformation) roles = [...roles, { "role": managerRole, "roleId": user.managerInformation.managerId }]
    if (user.adminInformation) roles = [...roles, { "role": adminRole, "roleId": user.adminInformation.adminId }]
    return ({
        "userId": user.userId,
        "email": user.email,
        "name": user.name,
        "roles": roles
    })
}