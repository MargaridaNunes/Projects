import React from 'react'
import {
    Link
} from "react-router-dom"

export default function managerMenu({ children, homePath, assignRolesPath, createUsersPath, onLogout, hasMoreThanOneRole, rolesPath, onChangeRole }) {


    return (
        <div>
            <div className="ui menu">
                <Link to={homePath} className="item">
                    SRA
                </Link>
                <Link to={createUsersPath} className="item">
                    Criar utilizadores
                </Link>
                <Link to={assignRolesPath} className="item">
                    Gerir utilizadores
                </Link>
                <div className="right menu">
                    {hasMoreThanOneRole ? <Link to={rolesPath} onClick={onChangeRole} className="item"><i className="ui user icon" /></Link> : ""}
                    <Link className="item" onClick={onLogout}>Logout</Link>
                </div>
            </div>
            {children}
        </div>
    )

}