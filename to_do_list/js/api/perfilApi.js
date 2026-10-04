import { supabaseClient } from "../config/supabase.js";
import { traduzirErro } from "../erros/tratamentoErro.js";

async function obterPerfilApi(usuarioId) {
    const {data, error} = await supabaseClient
    .from('perfis')
    .select('*')
    .eq('id', usuarioId)
    .maybeSingle()

    if (error) {
        throw traduzirErro(error, 'api')
    }

    return data
}

async function criarPerfilApi(nome) {
    const {data, error} = await supabaseClient
    .from('perfis')
    .insert({
        nome: nome
    })
    .select()
    .single()

    if (error) {
        throw traduzirErro(error, 'api')
    }

    return data
}

export {obterPerfilApi, criarPerfilApi}

