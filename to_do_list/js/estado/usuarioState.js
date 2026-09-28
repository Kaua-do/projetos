import { obterUsuarioLogadoApi } from "../api/authApi.js" 

let usuarioAtual = null

function definirUsuarioAtual() {
    usuarioAtual = obterUsuarioLogadoApi()
}

export {usuarioAtual, definirUsuarioAtual}