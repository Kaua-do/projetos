import { traduzirErro } from "../erros/tratamentoErro.js" 
import { supabaseClient } from "../config/supabase.js"

async function cadastrarUsuarioApi(email, senha) {
    const {data, error} = await supabaseClient
    .auth
    .signUp({
        email,
        password: senha
    })
    
    if (error) {
        throw traduzirErro(error, 'auth')
    }
}

async function entrarUsuarioApi(email, senha) {
    const {data, error} = await supabaseClient
    .auth
    .signInWithPassword({
        email,
        password: senha
    })
    
    if (error) {
        throw traduzirErro(error, 'auth')
    }

    return data.session
}

async function sairUsuarioApi() {
    const {error} = await supabaseClient
    .auth
    .signOut()

    if (error) {
        throw traduzirErro(error, 'auth')
    }
}

async function obterUsuarioLogadoApi() {
    const {data, error} = await supabaseClient
    .auth
    .getUser()

    if (error) {
        throw traduzirErro(error, 'auth')
    }

    return data.user
}

async function verificarSessionApi() {
    const {data, error} = await supabaseClient
    .auth
    .getSession()

    if (error) {
        throw traduzirErro(error, 'auth')
    }
    
    return data.session
}

export {
    cadastrarUsuarioApi, entrarUsuarioApi, sairUsuarioApi,obterUsuarioLogadoApi, verificarSessionApi
}
