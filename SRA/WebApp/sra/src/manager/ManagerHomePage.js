import React from 'react'
import sra from '../images/SRA.jpg'
import { Link } from 'react-router-dom'

export default function ManagerHomePage() {

    const cards =
        <div id="homePageCard" className="ui cards center aligned content">
            <div className="ui card">
                <div className="ui center aligned content"><i aria-hidden="true" className="ui massive calendar alternate outline icon" /></div>
                <div className="ui center aligned content">
                    <div className="header">Agendar recolhas</div>
                    <div className="description">Pertende realizar uma recolha? Agende</div>
                    <br></br>
                    <Link to="/roles/manager/create-collections"><button className="ui basic blue button">Agendar</button></Link>
                </div>
            </div>
            <div className="ui card">
                <div className="ui center aligned content"><i aria-hidden="true" className="ui massive tasks icon" /></div>
                <div className="ui center aligned content">
                    <div className="header">Atribuir recolha</div>
                    <div className="description">Predente atribuir uma recolha a responsável? Atribua</div>
                    <br></br>
                    <Link to="/roles/manager/assign-collections"><button className="ui basic blue button">Atribuir</button></Link>
                </div>
            </div>
            <div className="ui card">
                <div className="ui center aligned content"><i aria-hidden="true" className="ui massive history icon" /></div>
                <div className="ui center aligned content">
                    <div className="header">Histórico de recolhas</div>
                    <div className="description">Veja as recolhas agendadas, a decorrer e terminadas</div>
                    <br></br>
                    <Link to="/roles/manager/collections"><button className="ui basic blue button">Ver</button></Link>
                </div>
            </div>
            <div className="ui card">
                <div className="ui center aligned content"><i aria-hidden="true" className="ui massive qrcode icon" /></div>
                <div className="ui center aligned content">
                    <div className="header">Histórico de presenças</div>
                    <div className="description">Veja o registo de presenças dos alunos</div>
                    <br></br>
                    <Link to="/roles/manager/attendance"><button className="ui basic blue button">Ver</button></Link>
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