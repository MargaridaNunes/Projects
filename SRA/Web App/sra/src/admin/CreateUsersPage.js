import React, { useState } from 'react'
import Messages from '../utils/Messages'

export default function CreateUsersPage({ usersService }) {

    /*input user name*/
    const [userName, setUserName] = useState(undefined)
    /*input password */
    const [userPassword, setUserPassword] = useState(undefined)
    /*input email */
    const [userEmail, setUserEmail] = useState(undefined)
    /*input role */
    const [role, setRole] = useState(undefined)
    /*input student number if the chosen role is student */
    const [studentNumber, setStudentNumber] = useState(undefined)
    /*flag to show or not the student number input box */
    const [studentNumberInput, setStudentNumberInput] = useState(false)
    /*flag to show the success message */
    const [successMessage, setSuccessMessage] = useState(false)
    /*flag to warning that exist empty fields */
    const [emptyFieldsMessage, setEmptyFieldsMessage] = useState(false)
    /*error flag - when try to create a user tha already exists */
    const [error, setError] = useState(undefined)

    /*available roles in the system */
    const studentRole = "Aluno"
    const collectorRole = "Responsável por recolhas"
    const managerRole = "Gestor"
    const adminRole = "Administrador"

    /*create the user and clear the input fields */
    async function onCreateUserWithRole() {
        if (!userName || !userPassword || !userEmail || !role || (studentNumberInput && !studentNumber)) {
            setEmptyFieldsMessage(true)
            return
        }
        setEmptyFieldsMessage(false)
        try {
            await usersService.createUserWithRole(userName, userPassword, userEmail, role, studentNumber)
            setUserName("")
            setUserPassword("")
            setUserEmail("")
            setRole(undefined)
            setStudentNumber("")
            setStudentNumberInput(false)
            setSuccessMessage(true)
        } catch (e) {
            setError(e)
        }
    }

    /*sets the role */
    function onSelectRole(role, student) {
        return () => {
            setRole(role)
            setStudentNumberInput(student)
            setSuccessMessage(false)
            setError(false)
        }
    }

    /*student input box view */
    const studentNumberField =
        studentNumberInput ?
            <div className="field">
                <label>Número de Aluno</label>
                <div className="ui fluid input"><input type="text" value={studentNumber} onChange={(event) => setStudentNumber(event.target.value)} /></div>
            </div>
            : ""

    /*sets the input information provided */
    function onChangeInfo(info) {
        return (event) => {
            setSuccessMessage(false)
            setError(false)
            if (info === "name") setUserName(event.target.value)
            if (info === "password") setUserPassword(event.target.value)
            if (info === "email") setUserEmail(event.target.value)
        }
    }

    /*create user card view */
    const createUserCard =
        <div id="createUsersCard" className="ui centered grid container">
            <div className="nine wide column">
                <div className="ui blue segment">
                    <form className="ui form">
                        <div className="two fields">
                            <div className="field">
                                <label>Nome</label>
                                <div className="ui fluid input"><input type="text" value={userName} onChange={onChangeInfo("name")} /></div>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <div className="ui fluid input"><input type="password" value={userPassword} onChange={onChangeInfo("password")} /></div>
                            </div>
                        </div>
                        <div className="field">
                            <label>Email</label>
                            <div className="ui fluid input"><input type="text" value={userEmail} onChange={onChangeInfo("email")} /></div>
                        </div>
                        <div className="inline fields">
                            <label>Papel</label>
                            <div className="field">
                                <div className="ui radio checkbox">
                                    <input type="radio" name="radioButtonsGroup" readOnly="" tabIndex="0" value={role}
                                        onChange={onSelectRole(studentRole, true)} checked={role === studentRole} />
                                    <label>{studentRole}</label>
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui radio checkbox">
                                    <input type="radio" name="radioButtonsGroup" readOnly="" tabIndex="0" value={role}
                                        onChange={onSelectRole(collectorRole, false)} checked={role === collectorRole} />
                                    <label>{collectorRole}</label>
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui radio checkbox">
                                    <input type="radio" name="radioButtonsGroup" readOnly="" tabIndex="0" value={role}
                                        onChange={onSelectRole(managerRole, false)} checked={role === managerRole} />
                                    <label>{managerRole}</label>
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui radio checkbox">
                                    <input type="radio" name="radioButtonsGroup" readOnly="" tabIndex="0" value={role}
                                        onChange={onSelectRole(adminRole, false)} checked={role === adminRole} />
                                    <label>{adminRole}</label>
                                </div>
                            </div>
                        </div>
                        {studentNumberField}
                    </form>
                </div>
                <button type="button" className="ui right floated blue basic button" onClick={onCreateUserWithRole}><i className="ui large add user icon" /></button>
            </div>
        </div>

    return (
        <div>
            {successMessage ? <div id="createUserPageMessage"><Messages messageTitle="O utilizador foi criado!" messageBody="" messageType="positive" /></div>
                : ""}
            {emptyFieldsMessage ? <div id="createUserPageMessage"><Messages messageTitle="Preencha todos os campos!"
                messageBody="Para criar um utilizador com sucesso todos os campos tem de ser preenchidos" messageType="negative" /></div>
                : ""}
            {error ? <div id="createUserPageMessage"><Messages messageTitle={error.message} messageBody="" messageType="negative" /></div>
                : ""}
            {createUserCard}
        </div>
    )

}