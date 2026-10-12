const domAuth = {
    telaCadastro: document.querySelector('#telacadastro'),
    nomePerfil: document.querySelector('#nome'),
    emailCadastro: document.querySelector('#emailcadastro'),
    senhaCadastro: document.querySelector('#senhacadastro'),
    confirmarSenhaCadastro: document.querySelector('#confirmarsenhacadastro'),
    mensagemErroCadastro: document.querySelector('#errocadastro'),
    btCadastrar: document.querySelector('#cadastrar'),
    telaLogin: document.querySelector('#telalogin'),
    emailLogin: document.querySelector('#emaillogin'),
    senhaLogin: document.querySelector('#senhalogin'),
    btEntrar: document.querySelector('#entrar'),
    mensagemErroLogin: document.querySelector('#errologin')
}

function ocultarElemento(elemento) {
    elemento.classList.add('oculto')
}

function desocultarElemento(elemento) {
    elemento.classList.remove('oculto')
}

function adicionarAnimacaoErro(elemento) {
    elemento.classList.add('campoinvalido')
}

function removerAnimacaoErro(elemento) {
    elemento.classList.remove('campoinvalido')
}

export {domAuth, ocultarElemento, desocultarElemento, adicionarAnimacaoErro, removerAnimacaoErro}