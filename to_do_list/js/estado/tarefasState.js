let tarefas = []

let modoSelecaoAtivo = false
let idsTarefasSelecionadas = new Set()

function alternarModoSelecao(novoEstado) {
    modoSelecaoAtivo = novoEstado
}

function adicionarIdTarefaSelecionada(id) {
    if (idsTarefasSelecionadas.has(id)) {
        idsTarefasSelecionadas.delete(id)
    } else {
        idsTarefasSelecionadas.add(id)
    }
}

function zerarIdsSelecao() {
    idsTarefasSelecionadas.clear()
}

function estadoModoSelecao() {
    return modoSelecaoAtivo
}

function tarefasSelecionadasIds() {
    return idsTarefasSelecionadas
}

function definirTarefas(tarefasNovas) {
    tarefas = tarefasNovas
}

function adicionarTarefaEstado(tarefaNova) {
    tarefas.push(tarefaNova)
}

function apagarTarefa(id) {
    tarefas = tarefas.filter(tarefa => tarefa.id !== id)
}

function atualizarPrioridadeEstado(id, novaPrioridade) {
    const tarefa = tarefas.find(tarefa => tarefa.id === id)

    if (!tarefa) {
        return
    }

    tarefa.prioridade = novaPrioridade
}

function editarTarefaEstado(id, propriedade, dados) {
    const tarefa = tarefas.find(tarefa => tarefa.id === id)
    
    if (!tarefa) {
        return
    }

    tarefa[propriedade] = dados
}

function concluirTarefaEstado(id, tarefaDados) {
    const tarefa = tarefas.find(tarefa => tarefa.id === id) 

    if (!tarefa) {
        return
    }

    tarefa.status = tarefaDados.status
    
    if (tarefa.status) {
        tarefa.dtConclusao = tarefaDados.dtConclusao
    } else {
        tarefa.dtConclusao = null
    }
}

function obterTarefa(id) {
    return tarefas.find(tarefa => tarefa.id === id)
}

export {tarefas, definirTarefas, adicionarTarefaEstado, apagarTarefa, atualizarPrioridadeEstado, concluirTarefaEstado, editarTarefaEstado, obterTarefa, adicionarIdTarefaSelecionada, alternarModoSelecao,zerarIdsSelecao, estadoModoSelecao, tarefasSelecionadasIds}