import React from 'react'

const contextDefaultValue = {
    loginService: undefined
}

const LoginContext = React.createContext(contextDefaultValue)

export default LoginContext
