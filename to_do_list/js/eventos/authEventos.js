import { domAuth} from "../dom/authDom.js";
import { cadastrarUsuarioService, entrarUsuarioService } from "../servicos/authService.js";
import { tratarErro } from "../erros/tratamentoErro.js";
import { mostrarMensagemErro, apagarMensagemErro, ocultarElemento, desocultarElemento, adicionarAnimacaoErro, removerAnimacaoErro, alterarEstadoBotao } from "../dom/domUtils.js";
import { validarSenha, validarNome, validarCampoEmailLogin, validarCampoSenhaLogin } from "../validacao/validacao.js";

document.addEventListener('click', (evento) => {
    const elemento = evento.target
    const divElementos = elemento.closest('.elementos')

    if (elemento.classList.contains('fa-x')) {
        const input = divElementos.querySelector('input')
    
        input.value = ''
        input.focus()

        return
    }

    if (elemento.closest('.elementos')) {
        const input = divElementos.querySelector('input')

        input.focus()

        return
    }

    if (elemento.classList.contains('login')) {

        alternarFormulario(domAuth.telaCadastro, domAuth.telaLogin, 'login')

        return
    }

    if (elemento.classList.contains('cadastro')) {

        alternarFormulario(domAuth.telaLogin, domAuth.telaCadastro, 'login')
        
        return
    }
})

async function alternarFormulario(sai, entra, destinatario) {
    const classeSaida = destinatario === 'login'
        ? 'saindocadastro'
        : 'saindologin'

    const classeEntrada = destinatario === 'login'
        ? 'entrandologin'
        : 'entrandocadastro'

    const nomeAnimacaoSaida = destinatario === 'login'
        ? 'sairFormularioCadastro'
        : 'sairFormularioLogin'

    const nomeAnimacaoEntrada = destinatario === 'login'
        ? 'entrarFormularioLogin'
        : 'entrarFormularioCadastro'

    desocultarElemento(entra)

    sai.classList.remove(
        'saindocadastro',
        'saindologin'
    )

    entra.classList.remove(
        'entrandologin',
        'entrandocadastro'
    )

    sai.classList.add(classeSaida)
    entra.classList.add(classeEntrada)
    
    await aguardarAnimacao(sai, nomeAnimacaoSaida)
    
    ocultarElemento(sai)
    
    sai.classList.remove(classeSaida)
    entra.classList.remove(classeEntrada)
}

function aguardarAnimacao(elemento, nomeAnimacao) {
    return new Promise(resolve => {
        function finalizar(evento) {
            if (evento.target !== elemento) return
            if (evento.animationName !== nomeAnimacao) return

            elemento.removeEventListener('animationend', finalizar)
            resolve()
        }

        elemento.addEventListener('animationend', finalizar)
    })
}

document.addEventListener('focusin', (evento) => {
    const elemento = evento.target
    
    if (elemento.classList.contains('input')) {
        const divElementos = elemento.closest('.elementos')
        const limparCampo = divElementos.querySelector('.limparcampo')

        desocultarElemento(limparCampo)
    }
})

document.addEventListener('focusout', (evento) => {
    const elemento = evento.target

    if (elemento.classList.contains('input')) {
        const divElementos = elemento.closest('.elementos')
        const limparCampo = divElementos.querySelector('.limparcampo')

        ocultarElemento(limparCampo)
    }
})

document.addEventListener('mousedown', (evento) => {
    
    if (evento.target.closest('.limparcampo')) {
        evento.preventDefault()
    }
})

document.addEventListener('input', (evento) => {
    const elemento = evento.target

    const campo = elemento.closest('.elementos')
    removerAnimacaoErro(campo)
    domAuth.mensagemErroCadastro.textContent = ''
})

domAuth.btCadastrar.addEventListener('click', async () => {
    ocultarElemento(domAuth.mensagemSucessoCadastro)
    const nome = domAuth.nomePerfil.value

    const mensagemErroNome = validarNome(nome)

    if (mensagemErroNome) {
        const campo = domAuth.nomePerfil.closest('.elementos')
        mostrarMensagemErro(domAuth.mensagemErroCadastro, mensagemErroNome)
        adicionarAnimacaoErro(campo)
        return
    }

    const email = domAuth.emailCadastro.value
    const senha = domAuth.senhaCadastro.value
    const confirmarSenha = domAuth.confirmarSenhaCadastro.value

    const mensagemErroCampoEmail = validarCampoEmailLogin(email)
    
    if (mensagemErroCampoEmail) {
        const campo = domAuth.emailCadastro.closest('.elementos')
        mostrarMensagemErro(domAuth.mensagemErroCadastro, mensagemErroCampoEmail)
        adicionarAnimacaoErro(campo)     
        return
    }

    const mensagemErroCampoSenha = validarCampoSenhaLogin(senha)

    if (mensagemErroCampoSenha) {
        const campo = domAuth.senhaCadastro.closest('.elementos')
        mostrarMensagemErro(domAuth.mensagemErroCadastro, mensagemErroCampoSenha)
        adicionarAnimacaoErro(campo)     
        return
    }
    
    const mensagemErroSenha = validarSenha(senha, confirmarSenha)

    if (mensagemErroSenha) {
        const campoUm = domAuth.senhaCadastro.closest('.elementos')
        const campoDois = domAuth.confirmarSenhaCadastro.closest('.elementos')
        mostrarMensagemErro(domAuth.mensagemErroCadastro, mensagemErroSenha)
        adicionarAnimacaoErro(campoUm)
        adicionarAnimacaoErro(campoDois)
        return
    }

    alterarEstadoBotao(domAuth.btCadastrar, true, 'Cadastrar')

    try {
        await cadastrarUsuarioService(email, senha, nome)

        domAuth.nomePerfil.value = ''
        domAuth.emailCadastro.value = ''
        domAuth.senhaCadastro.value = '' 
        domAuth.confirmarSenhaCadastro.value = ''

        apagarMensagemErro(domAuth.mensagemErroCadastro)
    } catch (erro) {
        mostrarMensagemErro(domAuth.mensagemErroCadastro, tratarErro(erro))
    } finally {
        alterarEstadoBotao(domAuth.btCadastrar, false, 'Cadastrar')
    }
    
})

domAuth.emailLogin.addEventListener('input', () => {
    apagarMensagemErro(domAuth.mensagemErroLogin)
})

domAuth.senhaLogin.addEventListener('input', () => {
    apagarMensagemErro(domAuth.mensagemErroLogin)
})

domAuth.btEntrar.addEventListener('click', async () => {
    const email = domAuth.emailLogin.value
    const senha = domAuth.senhaLogin.value

    const mensagemErroCampoEmail = validarCampoEmailLogin(email)
    
    if (mensagemErroCampoEmail) {
        const campo = domAuth.emailLogin.closest('.elementos')
        mostrarMensagemErro(domAuth.mensagemErroLogin, mensagemErroCampoEmail)
        adicionarAnimacaoErro(campo)     
        return
    }

    const mensagemErroCampoSenha = validarCampoSenhaLogin(senha)

    if (mensagemErroCampoSenha) {
        const campo = domAuth.senhaLogin.closest('.elementos')
        mostrarMensagemErro(domAuth.mensagemErroLogin, mensagemErroCampoSenha)
        adicionarAnimacaoErro(campo)     
        return
    }

    const divBotao = domAuth.btEntrar.closest('.botaoentrar')
    const divIcon = divBotao.querySelector('.iconcarregamento')

    desocultarElemento(divIcon)
    divIcon.classList.add('carregando')

    alterarEstadoBotao(domAuth.btEntrar, true, 'Entrando...')

    try {
        await entrarUsuarioService(email, senha)

        apagarMensagemErro(domAuth.mensagemErroLogin)
    } catch (erro) {
        mostrarMensagemErro(domAuth.mensagemErroLogin, tratarErro(erro))
    } finally {
        ocultarElemento(divIcon)
        divIcon.classList.remove('carregando')
        alterarEstadoBotao(domAuth.btEntrar, false, 'Entrar')
    }
})