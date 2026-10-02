import { obterPerfilApi, criarPerfilApi } from "../api/perfilApi.js"
import { definirUsuarioAtual } from "../estado/usuarioState.js"

async function garantirPerfil(usuario) {
    let perfil = await obterPerfilApi()

    if (!perfil) {
        perfil = await criarPerfilApi(
            usuario.user_metadata.nome
        )
    }

    return perfil
}

async function inicializarUsuario(session) {
    const perfil = await garantirPerfil(session.user)

    const usuario = {
        id: session.user.id,
        email: session.user.email,
        nome: perfil.nome
    }

    definirUsuarioAtual(usuario)

    return usuario
}

export {garantirPerfil, inicializarUsuario}