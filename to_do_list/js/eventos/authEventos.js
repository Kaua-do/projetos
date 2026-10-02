import { domAuth } from "../dom/authDom.js";
import { cadastrarUsuarioService, entrarUsuarioService } from "../servicos/authService.js";
import { tratarErro } from "../erros/tratamentoErro.js";
import { mostrarMensagemErro, apagarMensagemErro } from "../dom/domUtils.js";
import { validarSenha, validarNome } from "../validacao/validacao.js";

domAuth.btCadastrar.addEventListener('click', async () => {
    const nome = domAuth.nomePerfil.value

    const mensagemErroNome = validarNome(nome)

    if (mensagemErroNome) {
        mostrarMensagemErro(domAuth.mensagemErroCadastro, mensagemErroNome)
        return
    }

    const email = domAuth.emailCadastro.value
    const senha = domAuth.senhaCadastro.value
    const confirmarSenha = domAuth.confirmarSenhaCadastro.value

    const mensagemErroSenha = validarSenha(senha, confirmarSenha)

    if (mensagemErroSenha) {
        mostrarMensagemErro(domAuth.mensagemErroCadastro, mensagemErroSenha)
        return
    }

    try {
        await cadastrarUsuarioService(email, senha, nome)

        domAuth.nomePerfil.value = ''
        domAuth.emailCadastro.value = ''
        domAuth.senhaCadastro.value = '' 
        domAuth.confirmarSenhaCadastro.value = ''

        apagarMensagemErro(domAuth.mensagemErroCadastro)
    } catch (erro) {
        mostrarMensagemErro(domAuth.mensagemErroCadastro, tratarErro(erro))
    }
    
})

domAuth.btEntrar.addEventListener('click', async () => {
    const email = domAuth.emailLogin.value
    const senha = domAuth.senhaLogin.value

    try {
        await entrarUsuarioService(email, senha)
        
        apagarMensagemErro(domAuth.mensagemErroLogin)
    } catch (erro) {
        mostrarMensagemErro(domAuth.mensagemErroLogin, tratarErro(erro))
    }
    
})