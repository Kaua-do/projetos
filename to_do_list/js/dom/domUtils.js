function mostrarMensagemErro(elemento, mensagem) {
    elemento.classList.remove('oculto')
    elemento.textContent = mensagem
}

function apagarMensagemErro(elemento) {
    elemento.textContent = ''
    elemento.classList.add('oculto')
}

function limparValueElemento(elemento) {
    elemento.value = ''
}

function ocultarElemento(elemento) {
    elemento.classList.add('oculto')
}

function desocultarElemento(elemento) {
    elemento.classList.remove('oculto')
}

function apagarElemento(elemento) {
    elemento.remove()
}

function adicionarAnimacaoErro(elemento) {
    elemento.classList.add('campoinvalido')
}

function removerAnimacaoErro(elemento) {
    elemento.classList.remove('campoinvalido')
}

function alterarEstadoBotao(botao, estado, texto) {
    botao.disabled = estado
    botao.textContent = texto
}

function restaurarBotao(botao, html) {
    botao.disabled = false
    botao.innerHTML = html
}

function criarIcon(classe) {
    const icon = document.createElement('i')
    icon.classList.add('fa-solid', classe)
    return icon
}

export {mostrarMensagemErro, apagarMensagemErro, limparValueElemento, ocultarElemento, desocultarElemento, apagarElemento, criarIcon, adicionarAnimacaoErro, removerAnimacaoErro, alterarEstadoBotao, restaurarBotao}