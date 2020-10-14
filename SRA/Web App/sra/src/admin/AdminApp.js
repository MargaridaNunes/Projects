import React, { useContext } from 'react';
import AssignRolesPage from './AssignRolesPage'
import CreateUsersPage from './CreateUsersPage'
import UsersService from './UsersService'
import Menu from './AdminMenu'
import HomePage from './AdminHomePage'
import { Switch, Route, Redirect } from "react-router-dom"
import LoginContext from '../login/LoginContext'
import Service from '../service/Service'

const ROLES_URL = "/roles"
const HOME_URL = "/roles/admin"
const ASSIGN_ROLES_URL = "/roles/admin/assign-roles"
const CREATE_USERS_URL = "/roles/admin/create-users"

export default function AdminApp({ onChangeRole }) {

    const loginContext = useContext(LoginContext)
    const service = Service({onForbidden : loginContext.loginService.logout})

    const usersService = UsersService(service, loginContext.loginService)

    const userInfo = loginContext.loginService.getUserInfo()
    const hasMoreThanOneRole = userInfo.managerInformation && userInfo.adminInformation

    return (
        <Menu homePath={HOME_URL} assignRolesPath={ASSIGN_ROLES_URL} createUsersPath={CREATE_USERS_URL} onLogout={loginContext.loginService.logout}
            hasMoreThanOneRole={hasMoreThanOneRole} rolesPath={ROLES_URL} onChangeRole={onChangeRole}>
            <Switch>
                <Route path={ASSIGN_ROLES_URL}>
                    <AssignRolesPage usersService={usersService} />
                </Route>
                <Route path={CREATE_USERS_URL}>
                    <CreateUsersPage usersService={usersService} />
                </Route>
                <Route path={HOME_URL}>
                    <HomePage />
                </Route>
                <Redirect to={HOME_URL} />
            </Switch>
        </Menu>
    );
}