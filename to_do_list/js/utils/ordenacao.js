function filtrarTarefas(tarefas, filtros) {
    const tarefasCopia = [...tarefas]

    const agora = new Date()

    const dias = {
        setedias: 7,
        trintadias: 30,
        noventadias: 90
    }
    
    let tarefasFiltradas = tarefasCopia.filter(tarefa => {
        const filtroOk = filtros.status === 'todas' || tarefa.status === (filtros.status === 'concluidas')

        return filtroOk
    })
    
    tarefasFiltradas = tarefasFiltradas.filter(tarefa => {
        const filtroOk = filtros.prioridade === 'todas' || tarefa.prioridade === filtros.prioridade

        return filtroOk
    })
    
    if (filtros.dtCriacao !== 'todas') {
        
        tarefasFiltradas = tarefasFiltradas.filter(tarefa => {
            const dataCriacao = new Date(tarefa.dtCriacao)
            const diasAtras = agora.getTime() - dias[filtros.dtCriacao] * 24 * 60 * 60 * 1000
            
            return dataCriacao >= diasAtras
        })
    }
   
    if (filtros.dtConclusao !== 'todas' && filtros.dtConclusao !== null) {

        tarefasFiltradas = tarefasFiltradas.filter(tarefa => {

            if (!tarefa.dtConclusao) {
                return false
            }
            
            const dataConclusao = new Date(tarefa.dtConclusao)
            const diasAtras = agora.getTime() - dias[filtros.dtConclusao] * 24 * 60 * 60 * 1000

            return dataConclusao >= diasAtras
            
        })
    }

    return ordenarTarefas(tarefasFiltradas, filtros.ordenarPor, filtros.ordem)
}

function ordenarTarefas(tarefas, ordenarPor, ordem) {
    let tarefasOrdenadas = []
    
    switch (ordenarPor) {

        case 'nenhum':
            tarefasOrdenadas = tarefas
            return tarefasOrdenadas
        
        case 'status':
            
            switch (ordem) {

                case 'concluidas':
                    return tarefas.sort((a, b) => b.status - a.status)

                case 'pendentes':
                    return tarefas.sort((a, b) => a.status - b.status)

                default:
                    return tarefas
            }
        
        case 'prioridade':
            const ordemPrioridade = {
                baixa: 1,
                media: 2,
                alta: 3
            }
            
            switch (ordem) {

                case 'menor':
                    return tarefas.sort((a, b) => {
                        return ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]
                    })
                    
                    

                case 'maior':
                    return tarefas.sort((a, b) => {
                        return ordemPrioridade[b.prioridade] - ordemPrioridade[a.prioridade]}
                    )

                    

                default:
                    return tarefas 
            }

        case 'criacao':

            switch (ordem) {
                
                case 'recente':
                    return tarefas.sort((a, b) => {
                        const dataA = new Date(a.dtCriacao).getTime()
                        const dataB = new Date(b.dtCriacao).getTime()
                        return dataB - dataA
                    })

                case 'antigo':
                    return tarefas.sort((a, b) => {
                        const dataA = new Date(a.dtCriacao).getTime()
                        const dataB = new Date(b.dtCriacao).getTime()
                        return dataA - dataB
                    })

                default:
                    return tarefas
            }

        case 'conclusao':
            
            switch (ordem) {
                
                case 'recente':
                    return tarefas.sort((a, b) => {

                        if (!a.dtConclusao) return 1
                        if (!b.dtConclusao) return -1

                        const dataA = new Date(a.dtConclusao).getTime()
                        const dataB = new Date(b.dtConclusao).getTime()
                        return dataB - dataA
                    })
                    

                case 'antigo':
                    return tarefas.sort((a, b) => {
                        
                        if (!a.dtConclusao) return 1
                        if (!b.dtConclusao) return -1

                        const dataA = new Date(a.dtConclusao).getTime()
                        const dataB = new Date(b.dtConclusao).getTime()
                        return dataA - dataB
                    })
                    

                default:
                    return tarefas
            }

        default:
            return tarefas  
    }
    
}

export {filtrarTarefas, ordenarTarefas}