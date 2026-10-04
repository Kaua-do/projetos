import { tarefasDom, resetarFiltros, atualizarOpcoesOrdem, renderizarTarefas, alterarEstadoBotao, mostrarEstadoTarefa, pegarFiltros, editarTarefa, limparLista} from "../dom/tarefasDom.js";
import { perfilDom, mostrarPerfil } from "../dom/perfilDom.js";
import { carregarTarefas, adicionarTarefa, salvarTarefa, excluirTarefa, atualizarPrioridade, concluirTarefa } from "../servicos/tarefasService.js";
import { sairUsuarioService, verificarAcessoPagina } from "../servicos/authService.js";
import { validarTexto, validarTitulo } from "../validacao/validacao.js";
import { tratarErro } from "../erros/tratamentoErro.js";
import { mostrarMensagemErro, apagarMensagemErro, limparValueElemento, ocultarElemento, desocultarElemento, apagarElemento, } from "../dom/domUtils.js";
import { tarefas } from "../estado/tarefasState.js";
import { filtrarTarefas } from "../utils/ordenacao.js";
import { inicializarUsuario } from "../servicos/perfilService.js";

iniciar()

async function iniciar() {
    try {
        const session = await verificarAcessoPagina()

        if (!session) {
            return
        }

        const usuario = await inicializarUsuario(session)

        mostrarPerfil(usuario.nome)

        mostrarEstadoTarefa('Carregando tarefas...')

        await carregarTarefas()

        prepararTarefasParaRenderizar()
    } catch (erro) {
        const msg = `Não foi possível carregar suas tarefas. ${tratarErro(erro)}`
        mostrarMensagemErro(tarefasDom.mostradorEstadoTarefas, msg)
    }
}

function prepararTarefasParaRenderizar() {
    if (tarefas.length === 0){
        mostrarEstadoTarefa('Você ainda não possui nenhuma tarefa.')
        limparLista()
        return
    }

    const tarefasFiltradasEordenadas = filtrarTarefas(tarefas, pegarFiltros())

    if (tarefasFiltradasEordenadas.length === 0) {
        mostrarEstadoTarefa('Nenhuma tarefa corresponde aos filtros.')
        limparLista()
        return
    }

    renderizarTarefas(tarefasFiltradasEordenadas)
}

tarefasDom.btAdicionar.addEventListener('click', tentarAdicionarTarefa)

tarefasDom.titulo.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        tentarAdicionarTarefa()
        return
    }

    apagarMensagemErro(tarefasDom.mensagemErroTitulo)
})

tarefasDom.descricao.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        tentarAdicionarTarefa()
        return
    }

    apagarMensagemErro(tarefasDom.mensagemErroDescricao)
})

async function tentarAdicionarTarefa() {
    const titulo = tarefasDom.titulo.value
    const descricao = tarefasDom.descricao.value

    const erroTitulo = validarTitulo(titulo)
    const erroTexto = validarTexto(descricao)

    if (erroTitulo) {
        mostrarMensagemErro(tarefasDom.mensagemErroTitulo, erroTitulo)
        return
    }

    if (erroTexto) {
        mostrarMensagemErro(tarefasDom.mensagemErroDescricao, erroTexto)
        return
    }

    alterarEstadoBotao(tarefasDom.btAdicionar, true, 'Adicionando...')

    try {
        await adicionarTarefa(titulo, descricao)

        prepararTarefasParaRenderizar()

        limparValueElemento(tarefasDom.titulo)
        limparValueElemento(tarefasDom.descricao)
    } catch (erro) {
        mostrarMensagemErro(tarefasDom.mensagemErroTitulo, tratarErro(erro))
    } finally {
        alterarEstadoBotao(tarefasDom.btAdicionar, false, 'Adicionar')
    }
}

perfilDom.btSair.addEventListener('click', async () => {
    perfilDom.btSair.disabled = true

    try {
        await sairUsuarioService()
    } catch (erro) {
        mostrarMensagemErro(perfilDom.msgLogout, tratarErro(erro))
    } finally {
        perfilDom.btSair.disabled = false
    }
    
})

tarefasDom.btResetar.addEventListener('click', () => {
    resetarFiltros()
    prepararTarefasParaRenderizar()
})

tarefasDom.containerDeFiltros.addEventListener('change', (evento) => {
    
    if (evento.target.tagName !== 'SELECT') {
        return
    }

    if (evento.target === tarefasDom.ordenarPor) {
        atualizarOpcoesOrdem()
    }

    prepararTarefasParaRenderizar()
}) 

tarefasDom.lista.addEventListener('click', async (evento) => {
    const elemento = evento.target
    const li = evento.target.closest('li')

    if (!li) {
        return
    }

    const id = li.dataset.id 
    
    if (elemento.classList.contains('editar-propriedade')) {
        const propriedade = elemento.closest('.propriedade')
        const msgErro = propriedade.querySelector('.msgerro')
        
        const input = editarTarefa(propriedade, elemento)
        
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

            prepararTarefasParaRenderizar()
        } catch (erro) {
            mostrarMensagemErro(msgErro, tratarErro(erro))
        } finally {
            alterarEstadoBotao(elemento, false, 'Excluir')
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

    const tarefa = {
        [property]: input.value
    }

    try {
        const dados = await salvarTarefa(id, property, tarefa) 
        
        elementoConteudo.textContent = dados[property]

        ocultarElemento(salvar)
        desocultarElemento(btEditar)
        desocultarElemento(elementoConteudo)
        apagarElemento(input)

        apagarMensagemErro(msgErro)

    } catch (erro) {
        mostrarMensagemErro(msgErro, tratarErro(erro))
    } finally {
        alterarEstadoBotao(salvar, false, 'Salvar')
    }

    return
}

tarefasDom.lista.addEventListener('change', async (evento) => {
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

        if (!tarefaEncontrada) {
            return
        }

        const prioridadeAnterior = tarefaEncontrada.prioridade
        elemento.disabled = true

        try {
            await atualizarPrioridade(id, tarefa)

            prepararTarefasParaRenderizar()

            apagarMensagemErro(msgErro)
        } catch (erro) {
            elemento.value = prioridadeAnterior
            mostrarMensagemErro(msgErro, tratarErro(erro))
        } finally {
            elemento.disabled = false
        }
    }

    if (elemento.classList.contains('checkbox')) {
        const msgErro = li.querySelector('.msgerro-api')

        elemento.disabled = true
        const estadoAnterior = !elemento.checked

        try{
            await concluirTarefa(id, elemento.checked)

            prepararTarefasParaRenderizar()
        } catch (erro) {
            elemento.checked = estadoAnterior 
            mostrarMensagemErro(msgErro, tratarErro(erro))
        } finally {
             elemento.disabled = false
        }
    }

})