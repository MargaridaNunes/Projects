import React, { useState, useEffect, useRef } from 'react'
import Messages from '../utils/Messages'
import SearchBox from '../utils/SearchBox'
import Loading from '../utils/Loading'
import ListLoading from '../utils/LoadingList'

export default function AssignRolesPage({ usersService }) {

    /*scroll reference */
    const scrollObserver = useRef()

    /*users in the system */
    const [users, setUsers] = useState([])
    /*selected users */
    const [selectedUsers, setSelectedUsers] = useState([])
    /*input student number if the role to be assign is a student */
    const [studentNumber, setStudentNumber] = useState(undefined)
    /* user card with student input box */
    const [studentNumberInput, setStudentNumberInput] = useState([])
    /*search collectors box input - name or email*/
    const [searchInput, setSearchInput] = useState("")
    /*flag to show no student number message */
    const [studentMessage, setStudentMessage] = useState(undefined)
    /*error flag */
    const [error, setError] = useState(undefined)
    /*observer radio */
    const [scrollObserverRatio, setScrollObserverRatio] = useState(undefined)
    /*page number */
    const [page, setPage] = useState(0)
    /*get more collections */
    const [moreUsers, setMoreUsers] = useState(true)
    /*is loading users */
    const [isLoading, setIsLoading] = useState(false)

    /*available roles in the system */
    const avaliableRoles = ["Aluno", "Responsável por recolhas", "Gestor", "Administrador"]

    const scrollOptions = {
        root: document.querySelector('#users'),
        rootMargin: '5px',
        threshold: 1.0
    }

    /* scroll observer */
    const observer = new IntersectionObserver(entries => {
        const ratio = entries[0].intersectionRatio;
        setScrollObserverRatio(ratio)
    }, scrollOptions)

    useEffect(() => {
        observer.observe(scrollObserver.current)
        return () => {
            observer.disconnect()
        }
    }, [])

    useEffect(() => {
        if (scrollObserverRatio >= 0 && moreUsers && !isLoading) {
            setIsLoading(true)
            const newPage = page + 1
            setPage(newPage)
            usersService.getUsers(newPage, searchInput).then(usersInfo => {
                if (usersInfo.length === 0) {
                    setMoreUsers(false)
                    setIsLoading(false)
                    return
                }
                const u = [...users, ...usersInfo]
                setUsers(u)
                setIsLoading(false)
            }).catch(e => setError(e))
        }
    }, [scrollObserverRatio])


    /*when the user check box is checked put the user in selectedUsers, 
    otherwise remove the user from selectedUsers */
    function onSelectUser(user) {
        return async (event) => {
            const isCheck = event.target.checked
            if (isCheck) {
                let userInfo
                try {
                    userInfo = await usersService.getUserInfo(user.userId)
                    setSelectedUsers([...selectedUsers, userInfo])
                } catch (e) {
                    setError(e)
                }
            } else {
                const idx = selectedUsers.findIndex(u => u.userId === user.userId)
                if (idx !== -1) {
                    selectedUsers.splice(idx, 1)
                    setSelectedUsers([...selectedUsers])
                }
            }
        }
    }

    /*Users list card view */
    const usersAvaliable =
        <div id="usersList">
            <div id="users" className="ui card">
                <div className="ui center aligned content"><h3 className="ui center aligned blue header">Utilizadores</h3></div>
                {users.length === 0 ?
                    <div className="ui content center aligned container">
                        <h3>Não existem utilizadores</h3>
                        <i className="ui big users icon"></i>
                    </div> :
                    users.map(u =>
                        <div className="content" key={u.userId}>
                            <div className="ui checkbox">
                                <input type="checkbox" tabIndex="0" onChange={onSelectUser(u)} />
                                <label>
                                    <h4 className="ui header">{u.name}</h4>
                                    <div className="meta">{u.email}</div>
                                </label>
                            </div>
                        </div>
                    ) 
                }
                {isLoading ? <div className="ui center aligned content"><ListLoading/></div> : ""}
            </div>
            <div ref={scrollObserver}></div>
        </div>
            

    /*assign student role to the user*/
    function onAssignStudentRole(userId) {
        return async () => {
            if (!studentNumber) {
                setStudentMessage({messageTitle : "Não inseriu o número de aluno!",
                messageBody : "Para atribuir a função de aluno ao utilizador insira o respetivo número de aluno",
                messageType : "negative"})
                return
            }
            try {
                await usersService.UpadateStudentRole(userId, studentNumber)
                updateUserRoles(userId)
                setStudentNumberInput(undefined)
                setStudentNumber(undefined)
            } catch (e) {
                if(e.title && e.title === "Student number already in use"){
                    setStudentMessage({messageTitle : e.message, messageBody : "", messageType : "negative"})
                    return
                }
                setError(e)
            }
        }
    }

    /*student number input box view */
    const studentNumberField = (userId) =>
        studentNumberInput === userId ?
            <div className="inline fields">
                <div className="field">
                    <label>Número de Aluno</label>
                    <div className="ui fluid input"><input type="text" value={studentNumber} onChange={(event) => { setStudentNumber(event.target.value); setStudentMessage(false) }} /></div>
                </div>
                <button type="button" className="ui right floated green basic button" onClick={onAssignStudentRole(userId)}><i className="ui check icon"></i></button>
            </div>
            : ""

    /*removes a user role*/
    function onDeleteRole(userId, role) {
        return async () => {
            try {
                await usersService.deleteRole(userId, role)
                updateUserRoles(userId)
            } catch (e) {
                setError(e)
            }
        }
    }

    /*assign a role (collector, manager or admin) to a user */
    function onAssignRole(userId, role) {
        return async () => {
            if (role === avaliableRoles[0]) {
                setStudentNumberInput(userId)
                return
            }
            try {
                await usersService.updateRoles(userId, role)
                updateUserRoles(userId)
                setStudentNumberInput(undefined)
            } catch (e) {
                setError(e)
            }
        }
    }

    /*update de user role that was assign or delete */
    async function updateUserRoles(userId) {
        let userInfo
        try {
            userInfo = await usersService.getUserInfo(userId)
            const index = selectedUsers.findIndex(u => u.userId === userId)
            if (index !== -1) {
                selectedUsers.splice(index, 1)
                setSelectedUsers([userInfo, ...selectedUsers])
            }
        } catch (e) {
            setError(e)
        }
    }

    /*Delete a user */
    function onDeleteUser(userId) {
        return async () => {
            try {
                await usersService.deleteUser(userId)
                const idx = users.findIndex(u => u.userId === userId)
                if (idx !== -1) {
                    users.splice(idx, 1)
                    setUsers([...users])
                }
                const selectUserIdx = selectedUsers.findIndex(u => u.userId === userId)
                if (selectUserIdx !== -1) {
                    selectedUsers.splice(selectUserIdx, 1)
                    setSelectedUsers([...selectedUsers])
                }
            } catch (e) {
                setError(e)
            }
        }
    }

    /*users details cards view */
    const userDetailsCards =
        <div className="ui cards">
            {selectedUsers.length !== 0 ?
                selectedUsers.map(user =>
                    <div className="ui card" key={user.userId}>
                        <div className="content">
                            <i className="ui mini right floated big user icon" />
                            <div className="header">{user.name}</div>
                            <div className="meta">{user.email}</div>
                            {user.roles.map(r =>
                                <div className="description" key={r.roleId + r.role}>
                                    {r.role}
                                    <div className="label right floated" onClick={onDeleteRole(user.userId, r.role)}><i className="ui red delete icon" /></div>
                                </div>
                            )}
                        </div>
                        <div className="extra content">
                            {rolesNotAssign(user).length !== 0 ?
                                <div role="listbox" aria-expanded="false" className="ui item simple dropdown" tabIndex="0">
                                    <div className="text" role="alert" aria-live="polite" aria-atomic="true"></div>
                                    <strong>Atribuir função </strong>
                                    <i className="ui dropdown icon"></i>
                                    <div className="menu transition">
                                        {rolesNotAssign(user).map(r => <div className="item" key={r} onClick={onAssignRole(user.userId, r)}>{r}</div>
                                        )}
                                    </div>
                                </div>
                                : ""
                            }
                            <button type="button" className="ui right floated basic red button" onClick={onDeleteUser(user.userId)}><i className="ui delete icon" /></button>
                            {studentNumberField(user.userId)}
                        </div>
                    </div>
                ) : ""}
        </div>

    /*gets the roles that can be assign to the user */
    function rolesNotAssign(user) {
        if (user.roles.length === avaliableRoles.length) return []
        const userRoles = user.roles.map(r => r.role)
        const roles = avaliableRoles.filter(r => !userRoles.includes(r))
        return roles
    }

    /*put the search box changed input in search input */
    function onChangeInputSearch(event) {
        setSearchInput(event.target.value)
    }

    /*get users base on the input in the serach box*/
    async function onSearchUsers() {
        try {
            const newPage = 1
            setPage(newPage)
            setMoreUsers(true)
            setIsLoading(false)
            const userInfo = await usersService.getUsers(newPage, searchInput)
            setSelectedUsers([])
            setUsers(userInfo)
        } catch (e) {
            setError(e)
        }
    }

    /*clear search box input and set users list with all users available*/
    async function onFinishSearch() {
        try {
            const newPage = 1
            setPage(newPage)
            setMoreUsers(true)
            setIsLoading(false)
            setSearchInput("")
            const userInfo = await usersService.getUsers(newPage)
            setSelectedUsers([])
            setUsers(userInfo)
        } catch (e) {
            setError(e)
        }
    }

    return (
        !error ?
            <div>
                <div id="assignUsersSearchBox"><SearchBox changeInputSearch={onChangeInputSearch} finishSearch={onFinishSearch} search={onSearchUsers} searchInput={searchInput} /></div>
                <div>{usersAvaliable} </div>
                
                <div id="usersRolesCards">
                    <div id="noStudentNumberMessage">{studentMessage ? 
                        <Messages messageTitle={studentMessage.messageTitle} messageBody={studentMessage.messageBody} messageType={studentMessage.messageType} />
                        : ""}
                    </div>
                    {userDetailsCards}
                </div>
            </div>
            : <Loading loadingText={error.message}></Loading>
    )
}