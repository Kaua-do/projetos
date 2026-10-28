import { supabaseClient } from "../config/supabase.js"; 
import { traduzirErro } from "../erros/tratamentoErro.js"; 

async function obterTarefasApi() {
    const {data, error} = await supabaseClient
    .from('tarefas')
    .select('*')

    if (error) {
        throw traduzirErro(error, 'api')
    }

    return data
}

async function criarTarefaApi(tarefaNova) {
    const {data, error} = await supabaseClient
    .from('tarefas')
    .insert(tarefaNova)
    .select()
    
    if (error) {
        throw traduzirErro(error, 'api')
    }

    return data[0]
}

async function deletarTarefaApi(id) {
    const {error} = await supabaseClient
    .from('tarefas')
    .delete()
    .eq('id', id)

    if (error) {
        throw traduzirErro(error, 'api')
    }
}

async function editarTarefaApi(id, tarefa) {
    const {data, error} = await supabaseClient
    .from('tarefas')
    .update(tarefa)
    .eq('id', id)
    .select()

    if (error) {
        throw traduzirErro(error, 'api')
    }

    return data[0]
}

export {obterTarefasApi, criarTarefaApi, deletarTarefaApi, editarTarefaApi}