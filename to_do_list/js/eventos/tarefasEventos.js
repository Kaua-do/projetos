import { tarefasDom, resetarFiltros, atualizarOpcoesOrdem, renderizarTarefas, alterarEstadoBotao, mostrarEstadoTarefa, pegarFiltros, editarTarefa, limparLista, atualizarContador, zerarContadores} from "../dom/tarefasDom.js";
import { perfilDom, mostrarPerfil } from "../dom/perfilDom.js";
import { carregarTarefas, adicionarTarefa, salvarTarefa, excluirTarefa, atualizarPrioridade, concluirTarefa } from "../servicos/tarefasService.js";
import { sairUsuarioService, verificarAcessoPagina } from "../servicos/authService.js";
import { validarTexto, validarTitulo } from "../validacao/validacao.js";
import { tratarErro } from "../erros/tratamentoErro.js";
import { mostrarMensagemErro, apagarMensagemErro, limparValueElemento, ocultarElemento, desocultarElemento, apagarElemento, criarIcon} from "../dom/domUtils.js";
import { tarefas, obterTarefa} from "../estado/tarefasState.js";
import { filtrarTarefas } from "../utils/ordenacao.js";
import { inicializarUsuario } from "../servicos/perfilService.js";

iniciar()

let tarefaPendenteExclusao = {
    id: null,
    msgErro: null
}

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
})

tarefasDom.descricao.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        tentarAdicionarTarefa()
        return
    }
})

tarefasDom.titulo.addEventListener('input', () => {
    atualizarContador('titulo')
    apagarMensagemErro(tarefasDom.mensagemErroTitulo)
})

tarefasDom.descricao.addEventListener('input', () => {
    atualizarContador('descricao')
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
        zerarContadores()
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

tarefasDom.btMostrarFiltros.addEventListener('click', (evento) => {
    const botao = evento.target
    const divFiltros = botao.closest('#filtros')
    const divReset = divFiltros.querySelector('#divreset')
    const i = botao.querySelector('i')

    if (!i) {
        return
    }

    if (i.className === "fa-solid fa-arrow-down-wide-short") {
        i.remove()
        const icon = criarIcon('fa-arrow-up-wide-short')
        botao.prepend(icon)
    }

    if (i.className === "fa-solid fa-arrow-up-wide-short") {
        i.remove()
        const icon = criarIcon('fa-arrow-down-wide-short')
        botao.prepend(icon)
    }

    divReset.classList.toggle('oculto')
    tarefasDom.containerDeFiltros.classList.toggle('oculto')
})

tarefasDom.lista.addEventListener('click', async (evento) => {
    const elemento = evento.target
    const li = evento.target.closest('li')

    if (!li) {
        return
    }

    const id = li.dataset.id 

    if (elemento.classList.contains('salvar')) {
        const divConteudo = elemento.closest('.propriedade')
        tentarSalvarTarefa(id, divConteudo)
    }
    
    if (elemento.classList.contains('botaoopcoes')) {
        const divMenu = elemento.closest('#menu')
        const divIntermediaria = divMenu.querySelector('.divintermediaria')
        
        if (divIntermediaria.classList.contains('oculto')) {
            desocultarElemento(divIntermediaria)

            return
        }

        ocultarElemento(divIntermediaria)

        return
    }

    if (elemento.closest('.menu')) {

        if (elemento.closest('.divelementoseditar')) {
            const divElementos = elemento.closest('.divelementoseditar')
            const container = elemento.closest('.containerintermediario')
            const divParte = container.querySelector('.div-parteum')
            const propriedade = divElementos.dataset.propriedade
            let divConteudo = null

            if (propriedade === 'titulo') {
                divConteudo = divParte.querySelector('.divtitulo')
            } else {
                divConteudo = divParte.querySelector('.divdescricao')
            }
            
            const conteudo = divConteudo.querySelector('.conteudo')
            const msgErro = divConteudo.querySelector('.msgerro')
            
            const input = editarTarefa(divConteudo)
            
            input.addEventListener('keydown', async (evento) => {
                if (evento.key === 'Enter') {
                    tentarSalvarTarefa(id, divConteudo)
                }

                apagarMensagemErro(msgErro)
            })

            divConteudo.insertBefore(input, conteudo)

            input.focus()

            return
        }

        if (elemento.closest('.divelementosexcluir')) {
            const mensagem = tarefasDom.modalConfirmacao.querySelector('.informacao')
            const msgErro = li.querySelector('.msgerro-api')

            const tarefa = obterTarefa(id)

            if (!tarefa) {
                return
            }

            tarefaPendenteExclusao.id = id
            tarefaPendenteExclusao.msgErro = msgErro

            desocultarElemento(tarefasDom.modalConfirmacao)
            mensagem.textContent = tarefa.titulo

            return
        }
    }
})

tarefasDom.modalConfirmacao.addEventListener('click', async (evento) => {
    const elemento = evento.target
    
    if (elemento.classList.contains('cancelar')) {
        const mensagem = tarefasDom.modalConfirmacao.querySelector('.informacao')
        mensagem.textContent = ''
        ocultarElemento(tarefasDom.modalConfirmacao)
        tarefaPendenteExclusao.id = null
        tarefaPendenteExclusao.msgErro = null
        return
    }

    if (elemento.classList.contains('confirmar')) {
        alterarEstadoBotao(elemento, true, 'Excluindo...')

        try {
            await excluirTarefa(tarefaPendenteExclusao.id)
            
            prepararTarefasParaRenderizar()
        } catch (erro) {
            mostrarMensagemErro(tarefaPendenteExclusao.msgErro, tratarErro(erro))
        } finally {
            ocultarElemento(tarefasDom.modalConfirmacao)
            tarefaPendenteExclusao.id = null
            tarefaPendenteExclusao.msgErro = null
            alterarEstadoBotao(elemento, false, 'Excluir')
        }
        
        return
    }
})

async function tentarSalvarTarefa(id, divConteudo) {
    const msgErro = divConteudo.querySelector('.msgerro')
    const input = divConteudo.querySelector('.input-propriedade')
    const salvar = divConteudo.querySelector('.salvar')
    const elementoConteudo = divConteudo.querySelector('.conteudo')
    const property = divConteudo.dataset.propriedade
    
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