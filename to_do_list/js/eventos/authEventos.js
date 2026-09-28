import { domAuth } from "../dom/authDom.js";
import { cadastrarUsuarioService, entrarUsuarioService, tratarEstadoAutenticacao } from "../servicos/authService.js";
import { supabaseClient } from "../config/supabase.js"; 
import { tratarErro } from "../erros/tratamentoErro.js";
import { mostrarMensagemErro, apagarMensagemErro } from "../dom/domUtils.js";

domAuth.btCadastrar.addEventListener('click', async () => {
    const email = domAuth.emailCadastro.value
    const senha = domAuth.senhaCadastro.value

    try {
        await cadastrarUsuarioService(email, senha)

        domAuth.emailCadastro.value = ''
        domAuth.senhaCadastro.value = '' 

        apagarMensagemErro(domAuth.mensagemErro)
    } catch (erro) {
        mostrarMensagemErro(domAuth.mensagemErro, tratarErro(erro))
    }
    
})

domAuth.btEntrar.addEventListener('click', async () => {
    const email = domAuth.emailLogin.value
    const senha = domAuth.senhaLogin.value

    try {
        await entrarUsuarioService(email, senha)

        apagarMensagemErro(domAuth.mensagemErro)
    } catch (erro) {
        mostrarMensagemErro(domAuth.mensagemErro, tratarErro(erro))
    }
    
})

supabaseClient.auth.onAuthStateChange(async () => {
    try {
        await tratarEstadoAutenticacao()

        apagarMensagemErro(domAuth.mensagemErro)
    } catch (erro) {
        mostrarMensagemErro(domAuth.mensagemErro, tratarErro(erro))
    }
    
})