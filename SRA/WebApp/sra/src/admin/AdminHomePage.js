import React from 'react'
import sra from '../images/SRA.jpg'
import { Link } from 'react-router-dom'

export default function AdminHomePage() {

    const cards =
        <div id="adminHomePageCard" className="ui cards">
            <div className="ui card">
                <div className="ui center aligned content"><i aria-hidden="true" className="ui massive users icon" /></div>
                <div className="ui center aligned content">
                    <div className="header">Gerir utilizadores</div>
                    <div className="description">Atribua funções aos utilizadores existentes no sistema</div>
                    <br></br>
                    <Link to="/roles/admin/assign-roles"><button className="ui basic blue button">Gerir</button></Link>
                </div>
            </div>
            <div className="ui card">
                <div className="ui center aligned content"><i aria-hidden="true" className="ui massive add user icon" /></div>
                <div className="ui center aligned content">
                    <div className="header">Criar utilizador</div>
                    <div className="description">Crie utilizadores para o sistema</div>
                    <br></br>
                    <Link to="/roles/admin/create-users"><button className="ui basic blue button">Criar</button></Link>
                </div>
            </div>
        </div>

    return (
        <div>
            <img id="homePageImage" src={sra} alt=""></img>
            {cards}
        </div>
    )
}