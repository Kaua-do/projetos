import { domPerfil, resetarFiltros, atualizarOpcoesOrdem, renderizarTarefas, alterarEstadoBotao, mostrarEstadoTarefa, pegarFiltros, editarTarefa } from "../dom/tarefasDom.js";
import { carregarTarefas, adicionarTarefa, salvarTarefa, excluirTarefa, atualizarPrioridade, concluirTarefa } from "../servicos/tarefasService.js";
import { sairUsuarioService, tratarEstadoAutenticacao } from "../servicos/authService.js";
import { validarTexto, validarTitulo } from "../validacao/validacao.js";
import { tratarErro } from "../erros/tratamentoErro.js";
import { mostrarMensagemErro, apagarMensagemErro, limparValueElemento, ocultarElemento, desocultarElemento, apagarElemento, } from "../dom/domUtils.js";
import { tarefas } from "../estado/tarefasState.js";
import { filtrarTarefas } from "../utils/ordenacao.js";

mostrarEstadoTarefa('Carregando tarefas...')

try {
    await tratarEstadoAutenticacao()
    await carregarTarefas()
    prepararTarefasParaRenderizar()
} catch (erro) {
    const msg = `Não foi possível carregar suas tarefas. ${tratarErro(erro)}`
    mostrarMensagemErro(domPerfil.mostradorEstadoTarefas, msg)
}

function prepararTarefasParaRenderizar() {
    const tarefasFiltradasEordenadas = filtrarTarefas(tarefas, pegarFiltros())

    if (tarefasFiltradasEordenadas.length === 0) {
        mostrarEstadoTarefa('Nenhuma tarefa corresponde aos filtros.')
        return
    }

    renderizarTarefas(tarefasFiltradasEordenadas)
}

domPerfil.btAdicionar.addEventListener('click', tentarAdicionarTarefa)

domPerfil.titulo.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        tentarAdicionarTarefa()
    }

    apagarMensagemErro(domPerfil.mensagemErroTitulo)
})

domPerfil.descricao.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        tentarAdicionarTarefa()
    }

    apagarMensagemErro(domPerfil.mensagemErroDescricao)
})

async function tentarAdicionarTarefa() {
    const titulo = domPerfil.titulo.value
    const descricao = domPerfil.descricao.value

    alterarEstadoBotao(domPerfil.btAdicionar, true, 'Adicionando...')

    const erroTitulo = validarTitulo(titulo)
    const erroTexto = validarTexto(descricao)

    if (erroTitulo) {
        mostrarMensagemErro(domPerfil.mensagemErroTitulo, erroTitulo)
        return
    }

    if (erroTexto) {
        mostrarMensagemErro(domPerfil.mensagemErroDescricao, erroTexto)
        return
    }

    alterarEstadoBotao(domPerfil.btAdicionar, true, 'Adicionando...')

    try {
        await adicionarTarefa(titulo, descricao)
        
        alterarEstadoBotao(domPerfil.btAdicionar, false, 'Adicionar')

        prepararTarefasParaRenderizar()

        limparValueElemento(domPerfil.titulo)
        limparValueElemento(domPerfil.descricao)
    } catch (erro) {
        alterarEstadoBotao(domPerfil.btAdicionar, false, 'Adicionar')
        mostrarMensagemErro(domPerfil.mensagemErroTitulo, tratarErro(erro))
    }
}

domPerfil.btSair.addEventListener('click', async () => {
    alterarEstadoBotao(domPerfil.btSair, true, 'Saindo...')

    try {
        await sairUsuarioService()

        alterarEstadoBotao(domPerfil.btSair, false, 'Sair')
    } catch (erro) {
        alterarEstadoBotao(domPerfil.btSair, false, 'Sair')
        mostrarMensagemErro(domPerfil.msgLogout, tratarErro(erro))
    }
    
})

domPerfil.btResetar.addEventListener('click', () => {
    resetarFiltros()
    prepararTarefasParaRenderizar()
})

domPerfil.containerDeFiltros.addEventListener('change', (evento) => {
    
    if (evento.target.tagName !== 'SELECT') {
        return
    }

    if (evento.target === domPerfil.ordenarPor) {
        atualizarOpcoesOrdem()
    }

    prepararTarefasParaRenderizar()
}) 

domPerfil.lista.addEventListener('click', async (evento) => {
    const elemento = evento.target
    const li = evento.target.closest('li')

    if (!li) {
        return
    }

    const id = li.dataset.id 
    
    if (elemento.classList.contains('editar-propriedade')) {
        const propriedade = elemento.closest('.propriedade')
        const msgErro = propriedade.querySelector('.msgerro')
        
        const input = editarTarefa(propriedade, elemento, msgErro)
        
        input.addEventListener('keydown', async (evento) => {
            if (evento.key === 'Enter') {
                tentarSalvarTarefa(id, elemento)
            }

            apagarMensagemErro(msgErro)
        })

        propriedade.insertBefore(input, elemento)

        input.focus()

        return
    }

    if (elemento.classList.contains('salvar')) {
        tentarSalvarTarefa(id, elemento)
    }

    if (elemento.classList.contains('excluir')) {
        const msgErro = li.querySelector('.msgerro-api')

        alterarEstadoBotao(elemento, true, 'Excluindo...')

        try {
            await excluirTarefa(id)

            elemento.textContent = 'Excluir'
            elemento.disabled = false

            prepararTarefasParaRenderizar()
        } catch (erro) {
            alterarEstadoBotao(elemento, false, 'Excluir')
            mostrarMensagemErro(msgErro, tratarErro(erro))
        }
        
        return
    }
})

async function tentarSalvarTarefa(id, elemento) {
    const propriedade = elemento.closest('.propriedade')
    const msgErro = propriedade.querySelector('.msgerro')
    const input = propriedade.querySelector('.input-propriedade')
    const btEditar = propriedade.querySelector('.editar-propriedade')
    const salvar = propriedade.querySelector('.salvar')
    const elementoConteudo = propriedade.querySelector('.conteudo')
    const property = propriedade.dataset.propriedade

    if (property === 'titulo') {
        const erroTitulo = validarTitulo(input.value)

        if (erroTitulo) {
            mostrarMensagemErro(msgErro, erroTitulo)
            return
        }
    } else {
        const erroTexto = validarTexto(input.value)

        if (erroTexto) {
            mostrarMensagemErro(msgErro, erroTexto)
            return
        }
    }

    alterarEstadoBotao(salvar, true, 'Salvando...')

    const textoAnterior = elementoConteudo.textContent

    const tarefa = {
        [property]: input.value
    }

    try {
        await salvarTarefa(id, property, tarefa) 

        alterarEstadoBotao(salvar, false, 'Salvar')
        
        elementoConteudo.textContent = tarefa[property]

        ocultarElemento(salvar)
        desocultarElemento(btEditar)
        desocultarElemento(elementoConteudo)
        apagarElemento(input)

        apagarMensagemErro(msgErro)

    } catch (erro) {
        alterarEstadoBotao(salvar, false, 'Salvar')
        mostrarMensagemErro(msgErro, tratarErro(erro))
    }

    return
}

domPerfil.lista.addEventListener('change', async (evento) => {
    const elemento = evento.target
    const li = evento.target.closest('li')

    if (!li) {
        return
    }

    const id = li.dataset.id

    if (elemento.classList.contains('conteudoprioridade')) {

        const msgErro = li.querySelector('.msgerro-api')

        const tarefa = {
            prioridade: elemento.value
        }

        const tarefaEncontrada = tarefas.find(tarefa => tarefa.id === id)
        const prioridadeAnterior = tarefaEncontrada.prioridade

        try {
            await atualizarPrioridade(id, tarefa)
        } catch (erro) {
            elemento.value = prioridadeAnterior
            mostrarMensagemErro(msgErro, tratarErro(erro))
        }
    }

    if (elemento.classList.contains('checkbox')) {
        const msgErro = li.querySelector('.msgerro-api')

        elemento.disabled = true
        const estadoAnterior = !elemento.checked

        try{
            await concluirTarefa(id, elemento.checked)

            elemento.disabled = false

            prepararTarefasParaRenderizar()

            apagarMensagemErro(msgErro)
        } catch (erro) {
            elemento.checked = estadoAnterior 
            elemento.disabled = false
            mostrarMensagemErro(msgErro, tratarErro(erro))
        }
    }

})