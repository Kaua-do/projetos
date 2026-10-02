import { cadastrarUsuarioApi, entrarUsuarioApi, sairUsuarioApi, verificarSessionApi } from "../api/authApi.js"
import { definirUsuarioAtual } from "../estado/usuarioState.js"

async function cadastrarUsuarioService(email, senha, nome) {
    await cadastrarUsuarioApi(email, senha, nome)
}

async function entrarUsuarioService(email, senha) {
    await entrarUsuarioApi(email, senha)
}

async function sairUsuarioService() {
    await sairUsuarioApi()
    definirUsuarioAtual(null)
}

async function verificarAcessoPagina() {
    const session = await verificarSessionApi()
    
    if (!session) { 
        window.location.href = './login.html'

        return null
    }

    return session
}

export {
    cadastrarUsuarioService, entrarUsuarioService, verificarAcessoPagina, sairUsuarioService
}