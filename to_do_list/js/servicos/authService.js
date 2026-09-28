import { cadastrarUsuarioApi, entrarUsuarioApi, sairUsuarioApi, verificarSessionApi } from "../api/authApi.js"
import { definirUsuarioAtual } from "../estado/usuarioState.js"

async function cadastrarUsuarioService(email, senha) {
    await cadastrarUsuarioApi(email, senha)
}

async function entrarUsuarioService(email, senha) {
    await entrarUsuarioApi(email, senha)
}

async function sairUsuarioService() {
    await sairUsuarioApi()

    await tratarEstadoAutenticacao()
}

async function tratarEstadoAutenticacao() {
    const session = await verificarSessionApi()

    const paginaAtual = window.location.pathname

    if (session) {
        if (!paginaAtual.includes('perfil.html')) {
            window.location.href = './perfil.html'
        }
       
        definirUsuarioAtual()

        return
    }

    if (!paginaAtual.includes('login.html')) {
        window.location.href = 'login.html'

        return
    }
}

export {
    cadastrarUsuarioService, entrarUsuarioService, tratarEstadoAutenticacao, sairUsuarioService
}