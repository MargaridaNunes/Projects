import React, { useState, useContext, useEffect } from 'react'
import LoginContext from './LoginContext'
import ManagerApp from '../manager/ManagerApp'
import AdminApp from '../admin/AdminApp'
import { Redirect, Switch, Route } from 'react-router-dom'

export default function RolesPage() {

    const [redirectUrl, setRedirectUrl] = useState(undefined)
    const loginContext = useContext(LoginContext)

    const userInfo = loginContext.loginService.getUserInfo()

    const managerHomePageUrl = "/roles/manager"
    const adminHomePageUrl = "/roles/admin"

    useEffect(() => {
        if (userInfo.managerInformation && !userInfo.adminInformation) setRedirectUrl(managerHomePageUrl)
        if (!userInfo.managerInformation && userInfo.adminInformation) setRedirectUrl(adminHomePageUrl)
    }, [])

    const roleCard = userInfo.managerInformation && userInfo.adminInformation ?
        <div>
            <h2 className="ui center aligned blue header" style={{ marginTop: 100 }}>Entrar como</h2>
            <div className='ui middle aligned center aligned grid' style={{ marginTop: 125 }}>
                <div className="ui cards">
                    <div className="ui card" onClick={() => setRedirectUrl(managerHomePageUrl)}>
                        <div className="ui center aligned content"><i className="ui massive user icon" /></div>
                        <div className="ui center aligned content">
                            <div className="header">Gestor</div>
                        </div>
                    </div>
                    <div className="ui card" onClick={() => setRedirectUrl(adminHomePageUrl)}>
                        <div className="ui center aligned content"><i className="ui massive user outline icon" /></div>
                        <div className="ui center aligned content">
                            <div className="header">Administrador</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        : ""

    function onChangeRole() {
        setRedirectUrl(undefined)
    }


    return (
        <Switch>
            <Route path={managerHomePageUrl}>
                {userInfo.managerInformation ? <ManagerApp onChangeRole={onChangeRole} /> : <Redirect to={"/roles"} />}
            </Route>
            <Route path={adminHomePageUrl}>
                {userInfo.adminInformation ? <AdminApp onChangeRole={onChangeRole} /> : <Redirect to={"/roles"} />}
            </Route>
            <Route path="/roles">
                {redirectUrl ? <Redirect to={redirectUrl} /> : roleCard}
            </Route>
        </Switch>

    )
}