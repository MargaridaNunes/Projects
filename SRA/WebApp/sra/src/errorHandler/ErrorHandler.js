
export default () => (e) => {
    const errorTitle = e.title || "default"
    console.log(JSON.stringify(e))
    return map[`${errorTitle}`]()
}

const map = {
    "Invalid Credentials": function () {
        return {
            title: "Invalid Credentials",
            message: "As credenciais inseridas são inválidas"
        }
    },
    "No permissions": function () {
        return {
            message: "As suas credenciais não lhe permitem utilizar a aplicação"
        }
    },
    "Email already in use": function () {
        return {
            message: "Já existe um utilizador com o email inserido"
        }
    },
    "Student number already in use" : function () {
        return {
            title: "Student number already in use",
            message: "Já existe um aluno com o número inserido"
        }
    },
    "Invalid email format" : function () {
        return {
            message: "As credenciais inseridas são inválidas"
        }
    },
    "Couldn't solve algorithm": function () {
        return {
            title: "Couldn't solve algorithm",
            message: `Não foi possível gerar uma rota para as recolhas selecionadas `
        }
    },
    "Invalid Algorithm Parameters" : function () {
        return {
            title: "Invalid Algorithm Parameters",
            message: `Não foi possível gerar uma rota para as recolhas selecionadas `
        }
    },
    "Invalid classroom format": function () {
        return {
            title: "Invalid classroom format",
            message: `Uma das recolhas selecionadas tem uma sala que não é possível incluir nas rotas `
        }
    },
    "Forbidden" : function (){
        return{
            title: "Forbidden",
            message: `Não tem permissões para aceder à página desejada`
        }
    },
    "default": function () {
        return {
            message: `Não foi possível realizar a operação! Por favor, tente novamente`
        }
    },
    "Internal server error": function () {
        return {
            message: `Não foi possível realizar a operação! Por favor, tente novamente`
        }
    }

}