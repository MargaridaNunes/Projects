import React, { useContext } from 'react';
import CreateCollectionsPage from './create-collections/CreateCollectionsPage'
import CollectionsHistoryPage from './collections-history/CollectionsHistoryPage'
import AssignCollectionsPage from './assign-collection/AssignCollectionPage'
import AttendanceHistoryPage from './attendance-history/AttendanceHistoryPage'
import HomePage from './ManagerHomePage'
import Menu from './ManagerMenu'
import { Switch, Route, Redirect } from "react-router-dom"

import CreateThorService from './services/ThorService'
import CollectionsService from './services/CollectionsService'
import RoutesService from './services/RoutesService'
import LecturesService from './services/LecturesService'
import CollectorsService from './services/CollectorsService'
import LoginContext from '../login/LoginContext'
import Service from '../service/Service'

const ROLES_URL = "/roles"
const HOME_URL = "/roles/manager"
const CREATE_COLLECTIONS_URL = "/roles/manager/create-collections"
const COLLECTIONS_URL = "/roles/manager/collections"
const ASSIGN_COLLECTIONS_URL = "/roles/manager/assign-collections"
const ATTENDANCE_HISTORY_URL = "/roles/manager/attendance"

export default function ManagerApp({ onChangeRole }) {

  const loginContext = useContext(LoginContext)
  console.log(loginContext.loginService)
  const service = Service({onForbidden : loginContext.loginService.logout})
  console.log(service)

  const thorService = CreateThorService(service, loginContext.loginService)
  const collectionService = CollectionsService(service, loginContext.loginService)
  const routesService = RoutesService(service, loginContext.loginService)
  const lecturesService = LecturesService(service, loginContext.loginService)
  const collectorsService = CollectorsService(service, loginContext.loginService)

  const userInfo = loginContext.loginService.getUserInfo()
  const hasMoreThanOneRole = userInfo.managerInformation && userInfo.adminInformation

  return (
    <Menu homePath={HOME_URL} createCollectionsPath={CREATE_COLLECTIONS_URL} collectionsPath={COLLECTIONS_URL}
      assignCollectionsPath={ASSIGN_COLLECTIONS_URL} attendanceHistoryPath={ATTENDANCE_HISTORY_URL}
      onLogout={loginContext.loginService.logout} hasMoreThanOneRole={hasMoreThanOneRole} rolesPath={ROLES_URL} onChangeRole={onChangeRole}>
      <Switch>
        <Route path={CREATE_COLLECTIONS_URL}>
          <CreateCollectionsPage thorService={thorService} />
        </Route>
        <Route path={COLLECTIONS_URL}>
          <CollectionsHistoryPage collectionsService={collectionService} />
        </Route>
        <Route path={ATTENDANCE_HISTORY_URL}>
          <AttendanceHistoryPage lecturesService={lecturesService} />
        </Route>
        <Route path={ASSIGN_COLLECTIONS_URL}>
          <AssignCollectionsPage collectionsService={collectionService} collectorsService={collectorsService} routesService={routesService} />
        </Route>
        <Route path={HOME_URL} >
          <HomePage />
        </Route>
        <Redirect to={HOME_URL} />
      </Switch>
    </Menu>
  )
}
