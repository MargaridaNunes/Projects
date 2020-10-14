import React from 'react'
import {
    Link
} from "react-router-dom"

export default function managerMenu({ children, homePath, createCollectionsPath, collectionsPath,
    assignCollectionsPath, attendanceHistoryPath, onLogout, hasMoreThanOneRole, rolesPath, onChangeRole }) {
    return (
        <div>
            <div className="ui menu">
                <Link to={homePath} className="item">
                    SRA
                </Link>
                <div>
                    <div className="ui top attached menu">
                        <div role="listbox" aria-expanded="false" className="ui item simple dropdown" tabIndex="0">
                            <div className="text" role="alert" aria-live="polite" aria-atomic="true"></div>
                            Recolhas
                            <i className="ui dropdown icon"></i>
                            <div className="menu transition">
                                <Link to={createCollectionsPath} className="item">
                                    Agendar Recolhas
                                </Link>
                                <Link to={assignCollectionsPath} className="item">
                                    Atribuir Recolhas
                                </Link>
                                <Link to={collectionsPath} className="item">
                                    Histórico de Recolhas
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to={attendanceHistoryPath} className="item">
                    Presenças
                </Link>
                <div className="right menu">
                    {hasMoreThanOneRole ? <Link to={rolesPath} onClick={onChangeRole} className="item"><i className="ui user icon" /></Link> : ""}
                    <Link to="" className="item" onClick={onLogout}>Logout</Link>
                </div>
            </div>
            {children}
        </div>
    )

}