let usuarioAtual = null

function definirUsuarioAtual(usuario) {
    usuarioAtual = usuario
}

function obterUsuarioAtual() {
    return usuarioAtual
}

export {definirUsuarioAtual, obterUsuarioAtual}