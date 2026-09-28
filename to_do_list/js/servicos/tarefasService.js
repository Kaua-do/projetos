import { criarTarefaApi, deletarTarefaApi, editarTarefaApi, obterTarefasApi} from "../api/tarefasApi.js"
import { adicionarTarefaEstado, concluirTarefaEstado, definirTarefas, apagarTarefa, editarTarefaEstado, atualizarPrioridadeEstado } from "../estado/tarefasState.js"

function criarTarefa(titulo, descricao) {
    return {
        titulo,
        descricao,
        prioridade: 'media',
        status: false,
    } 
}

async function adicionarTarefa(titulo, descricao) {
    const tarefa = criarTarefa(titulo, descricao)
    const tarefaCriada = await criarTarefaApi(tarefa)

    adicionarTarefaEstado(tarefaCriada)

    return tarefaCriada
}

async function excluirTarefa(id) {
    await deletarTarefaApi(id)

    apagarTarefa(id)
}

async function carregarTarefas() {
    const tarefasCarregadas = await obterTarefasApi()

    definirTarefas(tarefasCarregadas)
}

async function salvarTarefa(id, property, tarefa) {
    
    const dados = await editarTarefaApi(id, tarefa)

    editarTarefaEstado(id, property, dados[property])

    return dados
}

async function atualizarPrioridade(id, tarefa) {
    const dados = await editarTarefaApi(id, tarefa)

    atualizarPrioridadeEstado(id, dados.prioridade)
}

async function concluirTarefa(id, status) {
    const tarefa = {
        status,
        dtConclusao: status ? new Date() : null
    }

    const tarefaDados = await editarTarefaApi(id, tarefa)

    concluirTarefaEstado(id, tarefaDados)

    return tarefaDados
}

export {
    criarTarefa, concluirTarefa, adicionarTarefa, salvarTarefa, excluirTarefa, carregarTarefas, atualizarPrioridade
}