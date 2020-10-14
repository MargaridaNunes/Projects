import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom'
import LoginService from './LoginService'
import LoginContext from './LoginContext'
import RolesPage from './RolesPage'
import Message from '../utils/Messages'

export default function LoginPage() {

  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [loginService] = useState(new LoginService(onLogout))
  const [isLogin, setIsLogin] = useState(loginService.isLogin())
  const [error, setError] = useState(undefined)

  function onLogout() {
    setIsLogin(false)
  }

  function handleInputChange(event) {
    setError(undefined)
    const newCredentials = { ...credentials }
    newCredentials[event.target.name] = event.target.value
    setCredentials(newCredentials)
  }

  async function handleSubmit() {
    if (!credentials.email || !credentials.password) {
      setError({ message: "Insira as suas credenciais" })
      return
    }
    try {
      await loginService.login(credentials.email, credentials.password)
      setIsLogin(loginService.isLogin())
    } catch (e) {
      setError(e)
    }
  }

  const login =
    <div className='ui middle aligned center aligned grid' style={{ marginTop: 125 }}>
      <div className='column' style={{ maxWidth: 380 }}>
        <h2 className='ui header centered'>
          <div className='content'>SRA</div>
        </h2>
        <form className='ui large form'>
          <div className='ui segment'>
            <div className='field'>
              <div className='ui left icon required input'>
                <i className='user icon'></i>
                <input type='text' name='email' placeholder='email' onChange={handleInputChange} />
              </div>
            </div>
            <div className='field'>
              <div className='ui left icon required input'>
                <i className='key icon'></i>
                <input type='password' name='password' placeholder='password' onChange={handleInputChange} />
              </div>
            </div>
            <button className='ui fluid large submit blue button' type='button' onClick={handleSubmit}>
              <i className='sign in icon'></i>Entrar
            </button>
          </div>
        </form>
      </div>
    </div>

  return (
    <Router>
      <Switch>
        <Route path={"/login"}>
          {isLogin ? <Redirect to={"/roles"} /> :
            <div>
              {error ? <div id="LoginErrorMessage" className="ui center aligned container"><Message messageTitle={error.message} messageBody="" messageType="negative" /></div> : ""}
              {login}
            </div>
          }
        </Route>
        <Route path={"/roles"}>
          {isLogin ?
            <LoginContext.Provider value={{ loginService: loginService }}><RolesPage /></LoginContext.Provider> : <Redirect to={"/login"} />}
        </Route>
        <Redirect to={"/login"} />
      </Switch>
    </Router>
  )
}