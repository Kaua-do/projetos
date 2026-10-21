import { tarefasDom, resetarFiltros, atualizarOpcoesOrdem, renderizarTarefas, mostrarEstadoTarefa, pegarFiltros, editarTarefa, limparLista, atualizarContadorCriacao, zerarContadoresCriacao, atualizarContadorTarefa, atualizarAparenciaFiltros} from "../dom/tarefasDom.js";
import { perfilDom, mostrarPerfil } from "../dom/perfilDom.js";
import { carregarTarefas, adicionarTarefa, salvarTarefa, excluirTarefa, atualizarPrioridade, concluirTarefa } from "../servicos/tarefasService.js";
import { sairUsuarioService, verificarAcessoPagina } from "../servicos/authService.js";
import { validarTexto, validarTitulo } from "../validacao/validacao.js";
import { tratarErro } from "../erros/tratamentoErro.js";
import { mostrarMensagemErro, apagarMensagemErro, limparValueElemento, ocultarElemento, desocultarElemento, apagarElemento, criarIcon, alterarEstadoBotao, adicionarAnimacaoErro, removerAnimacaoErro} from "../dom/domUtils.js";
import { tarefas, obterTarefa, alternarModoSelecao, adicionarIdTarefaSelecionada, zerarIdsSelecao, estadoModoSelecao, tarefasSelecionadasIds} from "../estado/tarefasState.js";
import { filtrarTarefas } from "../utils/ordenacao.js";
import { inicializarUsuario } from "../servicos/perfilService.js";

iniciar()

let tarefaPendenteExclusao = {
    id: null,
    msgErro: null,
    liDom: null
}

let idTarefaRecemCriada = null

let idsTarefasFiltradas = []

async function iniciar() {
    try {
        const session = await verificarAcessoPagina()

        if (!session) {
            return
        }

        const usuario = await inicializarUsuario(session)

        mostrarPerfil(usuario.nome)

        atualizarAparenciaFiltros()

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

    renderizarTarefas(tarefasFiltradasEordenadas, idTarefaRecemCriada)
}

function guardarIdsTarefasFiltradas(tarefasFiltradas) {
    for (const tarefa of tarefasFiltradas) {
        idsTarefasFiltradas.push(tarefa.id)
    }
}

function atualizarCarregamentoApagarMultiplo(atual, ids) {
    const modal = tarefasDom.modalConfirmacaoMulti
    const carregamento = modal.querySelector('#carregamento')
    const SpanPorcentagem = carregamento.querySelector('.porcentagem')
    const barraCarregamento = carregamento.querySelector('.divbarracarregamento')
    const total = ids.length
    const porcentagem = ((atual / total) * 100).toFixed(0) + '%'
    SpanPorcentagem.textContent = porcentagem
    console.log(SpanPorcentagem)
    const carregado = document.createElement('div')
    carregado.classList.add('carregado')
    carregado.style.backgroundColor = 'rgba(2, 179, 2, 0.87)'
    carregado.style.height = '100%'
    carregado.style.width = porcentagem
    carregado.style.borderRadius = '6px'

    barraCarregamento.innerHTML = ''
    barraCarregamento.appendChild(carregado)
    
}

function verificarModoSelecao(elemento) {
    const divSelecionar = elemento.closest('.divselecionartarefas')

    if (elemento.classList.contains('excluirselecionadas')) {
        const ids = [...tarefasSelecionadasIds()]

        if (ids.length === 0) {
            return
        }

        const modal = tarefasDom.modalConfirmacaoMulti
        modal.dataset.origem = 'selecao'

        const tituloAviso = modal.querySelector('.tituloaviso')
        tituloAviso.innerHTML = ''
        const icon = document.createElement('i')
        icon.classList.add('fa-solid', 'fa-triangle-exclamation')
        tituloAviso.textContent = `Excluir ${ids.length} tarefas?`
        tituloAviso.appendChild(icon)

        divSelecionar.classList.toggle('aberto')

        desocultarElemento(tarefasDom.modalConfirmacaoMulti)
    }

    if (elemento.classList.contains('cancelarselecao')) {
        cancelarSelecao()
    }
    
    if (elemento.classList.contains("selecionartarefas")) {
        alternarModoSelecao(true)

        const btCancelarSelecao = document.createElement('button')
        btCancelarSelecao.textContent = 'Cancelar'
        btCancelarSelecao.classList.add('cancelarselecao')

        const btExcluirSelecionadas = document.createElement('button')
        btExcluirSelecionadas.textContent = 'Excluir'
        btExcluirSelecionadas.classList.add('excluirselecionadas')

        const divSelecionar = elemento.closest('.divselecionartarefas')
        const divIntermediaria = divSelecionar.querySelector('.intermediaria')

        ocultarElemento(elemento)
        divIntermediaria.appendChild(btCancelarSelecao)
        divIntermediaria.appendChild(btExcluirSelecionadas)

        divSelecionar.appendChild(divIntermediaria)
    }

    if (elemento.closest('li')) {
        if (estadoModoSelecao()) {
            const li = elemento.closest('li')
            
            if (li.classList.contains('tarefamarcada')) {
                li.classList.remove('tarefamarcada')
            } else {
                li.classList.add('tarefamarcada')
            }

            adicionarIdTarefaSelecionada(li.dataset.id)
        }
    }
    
    return estadoModoSelecao()
}

function cancelarSelecao() {
    const divSelecionar = document.querySelector('.divselecionartarefas')

    alternarModoSelecao(false)
    zerarIdsSelecao()
    prepararTarefasParaRenderizar()
    
    const btSelecao = divSelecionar.querySelector('.selecionartarefas')
    const btExcluirSelecionadas = divSelecionar.querySelector('.excluirselecionadas')
    const btCancelarSelecao = divSelecionar.querySelector('.cancelarselecao')

    desocultarElemento(btSelecao)
    btExcluirSelecionadas.remove()
    btCancelarSelecao.remove()

    divSelecionar.classList.remove('aberto')
}

tarefasDom.btApagarFiltradas.addEventListener('click', (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }

    if (evento.target.classList.contains('selecionartarefas')) {
        return
    }

    const tarefasFiltradas = filtrarTarefas(tarefas, pegarFiltros())
    
    if (tarefasFiltradas.length === 0) {
        return
    }

    guardarIdsTarefasFiltradas(tarefasFiltradas)

    const tarefasFiltradasCopia = [...idsTarefasFiltradas]

    const modal = tarefasDom.modalConfirmacaoMulti
    modal.dataset.origem = 'filtro'

    const tituloAviso = modal.querySelector('.tituloaviso')
    tituloAviso.innerHTML = ''
    const icon = document.createElement('i')
    icon.classList.add('fa-solid', 'fa-triangle-exclamation')
    tituloAviso.textContent = `Excluir ${tarefasFiltradasCopia.length} tarefas?`
    tituloAviso.appendChild(icon)

    desocultarElemento(tarefasDom.modalConfirmacaoMulti)
})

tarefasDom.modalConfirmacaoMulti.addEventListener('click', async (evento) => {
    if (evento.target.classList.contains('excluir')) {
        if (tarefasDom.modalConfirmacaoMulti.dataset.origem === 'filtro') {
            const tarefasFiltradasCopia = [...idsTarefasFiltradas]
            apagarMultiplasTarefas(evento.target, tarefasFiltradasCopia)
            idsTarefasFiltradas = []

            return
        }

        if (tarefasDom.modalConfirmacaoMulti.dataset.origem === 'selecao') {
            const divSelecionar = document.querySelector('.divselecionartarefas')
            const selecionarTarefas = divSelecionar.querySelector('.selecionartarefas')
            const btExluir = divSelecionar.querySelector('.excluirselecionadas')
            const btCancelar = divSelecionar.querySelector('.cancelarselecao')
            const ids = [...tarefasSelecionadasIds()]
            apagarMultiplasTarefas(evento.target, ids)
            divSelecionar.classList.toggle('aberto')
            alternarModoSelecao(false)
            zerarIdsSelecao()
            btExluir.remove()
            btCancelar.remove()
            desocultarElemento(selecionarTarefas)

            return
        } 
    }

    if (evento.target.classList.contains('cancelar')) {
        if (tarefasDom.modalConfirmacaoMulti.dataset.origem === 'filtro') {
            ocultarElemento(tarefasDom.modalConfirmacaoMulti)
            idsTarefasFiltradas = []

            return
        }  
    }

    if (evento.target.classList.contains('cancelar')) {
        if (tarefasDom.modalConfirmacaoMulti.dataset.origem === 'selecao') {
            ocultarElemento(tarefasDom.modalConfirmacaoMulti)
            cancelarSelecao()

            return
        }
    }
})  

async function apagarMultiplasTarefas(elemento,ids) {
    const modal = tarefasDom.modalConfirmacaoMulti
    const carregamento = modal.querySelector('#carregamento')

    const barraCarregamento = carregamento.querySelector('.divbarracarregamento')
    const porcentagem = carregamento.querySelector('.porcentagem')
    
    desocultarElemento(carregamento)
    desocultarElemento(tarefasDom.modalConfirmacaoMulti)
    alterarEstadoBotao(elemento, true, 'Excluindo...')

    let cont = 0

    for (const id of ids) {
        
        try {
            await excluirTarefa(id)
            cont++
            atualizarCarregamentoApagarMultiplo(cont, ids)
        } catch (erro) {
            console.log(erro)
        }
    }

    barraCarregamento.innerHTML = ''
    porcentagem.innerHTML = '0%'

    prepararTarefasParaRenderizar()
    cont = 0
    
    ocultarElemento(tarefasDom.modalConfirmacaoMulti)
    alterarEstadoBotao(elemento, false, 'Excluir')
    ocultarElemento(carregamento)
}

tarefasDom.btAdicionar.addEventListener('click', (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }
    
    tentarAdicionarTarefa()
})

tarefasDom.titulo.addEventListener('keydown', (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }

    if (evento.key === 'Enter') {
        tentarAdicionarTarefa()
        return
    }
})

tarefasDom.descricao.addEventListener('keydown', (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }

    if (evento.key === 'Enter') {
        tentarAdicionarTarefa()
        return
    }
})

tarefasDom.titulo.addEventListener('input', () => {
    atualizarContadorCriacao('titulo')
    removerAnimacaoErro(tarefasDom.titulo)
    apagarMensagemErro(tarefasDom.mensagemErroTitulo)
})

tarefasDom.descricao.addEventListener('input', () => {
    atualizarContadorCriacao('descricao')
    removerAnimacaoErro(tarefasDom.descricao)
    apagarMensagemErro(tarefasDom.mensagemErroDescricao)
})

async function tentarAdicionarTarefa() {
    const titulo = tarefasDom.titulo.value
    const descricao = tarefasDom.descricao.value
    let data = null
    const erroTitulo = validarTitulo(titulo)
    const erroTexto = validarTexto(descricao)

    if (tarefasDom.data.value) {
        data = tarefasDom.data.value
    }

    if (erroTitulo) {
        adicionarAnimacaoErro(tarefasDom.titulo)
        mostrarMensagemErro(tarefasDom.mensagemErroTitulo, erroTitulo)
        tarefasDom.titulo.focus()
        return
    }

    if (erroTexto) {
        adicionarAnimacaoErro(tarefasDom.descricao)
        mostrarMensagemErro(tarefasDom.mensagemErroDescricao, erroTexto)
        tarefasDom.descricao.focus()
        return
    }

    alterarEstadoBotao(tarefasDom.btAdicionar, true, 'Adicionando...')

    try {
        const novaTarefa = await adicionarTarefa(titulo, descricao, data)

        idTarefaRecemCriada = novaTarefa.id
        
        prepararTarefasParaRenderizar()
        
        idTarefaRecemCriada = null
        
        limparValueElemento(tarefasDom.titulo)
        limparValueElemento(tarefasDom.descricao)
        limparValueElemento(tarefasDom.data)
        zerarContadoresCriacao()
    } catch (erro) {
        mostrarMensagemErro(tarefasDom.mensagemErroTitulo, tratarErro(erro))
    } finally {
        alterarEstadoBotao(tarefasDom.btAdicionar, false, 'Adicionar')
    }
}

perfilDom.btSair.addEventListener('click', async (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }

    perfilDom.btSair.disabled = true

    try {
        await sairUsuarioService()
    } catch (erro) {
        mostrarMensagemErro(perfilDom.msgLogout, tratarErro(erro))
    } finally {
        perfilDom.btSair.disabled = false
    }
    
})

tarefasDom.btResetar.addEventListener('click', (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }

    resetarFiltros()
    atualizarAparenciaFiltros()
    prepararTarefasParaRenderizar()
})

tarefasDom.containerDeFiltros.addEventListener('change', (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }
    
    if (evento.target.tagName !== 'SELECT') {
        return
    }

    if (evento.target === tarefasDom.ordenarPor) {
        atualizarOpcoesOrdem()
    }

    atualizarAparenciaFiltros()

    prepararTarefasParaRenderizar()
}) 

tarefasDom.btMostrarFiltros.addEventListener('click', (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }

    const botao = evento.target.closest('#mostrarfiltros')
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

    divReset.classList.toggle('aberto')
    tarefasDom.containerDeFiltros.classList.toggle('aberto')
    divFiltros.classList.toggle('aberto')
})

tarefasDom.divLista.addEventListener('click', async (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }

    if (evento.target.closest('#divlista')) {
        const divSelecionar = document.querySelector('.divselecionartarefas')
        divSelecionar.classList.remove('aberto')
    }

    if (evento.target.classList.contains('menuselecao')) {
        const elementosLista = evento.target.closest('.elementoslista')
        const divSelecionar = elementosLista.querySelector('.divselecionartarefas')
        divSelecionar.classList.toggle('aberto')
    }

    const elemento = evento.target
    const li = evento.target.closest('li')

    if (!li) {
        return
    }

    const id = li.dataset.id 

    if (elemento.classList.contains('salvar')) {
        const divPropriedade = elemento.closest('.propriedade')
        const propriedade = divPropriedade.dataset.propriedade
        let divElementos = null

        if (propriedade === 'titulo') {
            divElementos = li.querySelector('.divelementoseditartitulo')
        } else {
            divElementos = li.querySelector('.divelementoseditardescricao')
        }

        tentarSalvarTarefa(id, divPropriedade, divElementos)
    }

    if (elemento.classList.contains('salvardata')) {
        const divConteudo = elemento.closest('.divdata')
        const divElementos = li.querySelector('.divelementosprazo')

        tentarSalvarTarefa(id, divConteudo, divElementos)
    }
    
    if (elemento.classList.contains('botaoopcoes')) {
        const divMenu = elemento.closest('.div-checkbox')
        const menu = divMenu.querySelector('.divopcao')

        menu.classList.toggle('aberto')
        
        return
    }

    if (elemento.closest('.divopcao')) {
        
        if (elemento.closest('.divelementoseditar')) {
            const divElementos = elemento.closest('.divelementoseditar')
            const divParte = li.querySelector('.div-parteum')
            const propriedade = divElementos.dataset.propriedade
            let divConteudo = null

            if (propriedade === 'titulo') {
                divConteudo = divParte.querySelector('.divtitulo')
            } else {
                divConteudo = divParte.querySelector('.divdescricao')
            }
            
            const contador = divConteudo.querySelector('.contador')
            const conteudo = divConteudo.querySelector('.conteudo')
            const msgErro = divConteudo.querySelector('.msgerro')
            
            ocultarElemento(divElementos)
            const input = editarTarefa(divConteudo)

            atualizarContadorTarefa(input.value.length, contador, propriedade)

            input.addEventListener('keydown', async (evento) => {
                if (evento.key === 'Enter') {
                    const divOpcao = elemento.closest('.divopcao')
                    
                    ocultarElemento(divOpcao)
                    tentarSalvarTarefa(id, divConteudo, divElementos) 
                } else {
                    apagarMensagemErro(msgErro)
                }
            })

            input.addEventListener('input', () => {
                atualizarContadorTarefa(input.value.length, contador, propriedade)
                removerAnimacaoErro(input)
            })

            const divIntermediaria = divConteudo.querySelector('.divintermediaria')
            
            divIntermediaria.insertBefore(input, conteudo)

            ocultarElemento(divElementos)
            desocultarElemento(contador)
            input.focus()

            return
        }

        if (elemento.closest('.divelementosprazo')) {
            const divData = li.querySelector('.divdata')
            const divIntermediaria = divData.querySelector('.divintermediaria')
            const btSalvar = divIntermediaria.querySelector('.salvardata')
            const divElementos = elemento.closest('.divelementosprazo')
        
            ocultarElemento(divElementos)
            const input = editarTarefa(divIntermediaria)

            divIntermediaria.insertBefore(input, btSalvar)
        }

        if (elemento.closest('.divelementosexcluir')) {
            const divOpcao = document.querySelector('.divopcao')
            const mensagem = tarefasDom.modalConfirmacao.querySelector('.titulotarefa')
            const msgErro = li.querySelector('.msgerro-api')

            const tarefa = obterTarefa(id)

            if (!tarefa) {
                return
            }

            tarefaPendenteExclusao.id = id
            tarefaPendenteExclusao.msgErro = msgErro
            tarefaPendenteExclusao.liDom = li

            ocultarElemento(divOpcao)
            desocultarElemento(tarefasDom.modalConfirmacao)
            mensagem.textContent = tarefa.titulo

            return
        }
    }

    const areaMenu = li.querySelector('.areamenu')
    
    if (!areaMenu.contains(evento.target)) {
        const divOpcao = areaMenu.querySelector('.divopcao')
        
        divOpcao.classList.remove('aberto')
    }
})

tarefasDom.modalConfirmacao.addEventListener('click', async (evento) => {

    const elemento = evento.target
    
    if (elemento.classList.contains('cancelar')) {
        const mensagem = tarefasDom.modalConfirmacao.querySelector('.titulotarefa')
        mensagem.textContent = ''
        ocultarElemento(tarefasDom.modalConfirmacao)
        tarefaPendenteExclusao.id = null
        tarefaPendenteExclusao.msgErro = null
        tarefaPendenteExclusao.liDom = null
        return
    }

    if (elemento.classList.contains('excluir')) {
        alterarEstadoBotao(elemento, true, 'Excluindo...')

        tarefaPendenteExclusao.liDom.classList.add('removendotarefa')

        try {
            await excluirTarefa(tarefaPendenteExclusao.id)
            
            prepararTarefasParaRenderizar()
        } catch (erro) {
            mostrarMensagemErro(tarefaPendenteExclusao.msgErro, tratarErro(erro))
        } finally {
            ocultarElemento(tarefasDom.modalConfirmacao)
            tarefaPendenteExclusao.id = null
            tarefaPendenteExclusao.msgErro = null
            tarefaPendenteExclusao.liDom = null
            alterarEstadoBotao(elemento, false, 'Excluir')
        }
        
        return
    }
})

async function tentarSalvarTarefa(id, divConteudo, divElementos) {
    if (divConteudo.classList.contains('divdata')) {
        const input = divConteudo.querySelector('.input-propriedade')
        const elementoConteudo = divConteudo.querySelector('.conteudo')
        const salvar = divConteudo.querySelector('.salvardata')
        const msgErro = divConteudo.querySelector('.msgerrodata')
        const property = 'data'

        const tarefa = {
            data: null
        }

        if (input.value) {
            tarefa.data = input.value
        }

        try {
            const dados = await salvarTarefa(id, property, tarefa) 
            
            elementoConteudo.textContent = dados.data
            
            ocultarElemento(salvar)
            desocultarElemento(elementoConteudo)
            apagarElemento(input)
            desocultarElemento(divElementos)
            apagarMensagemErro(msgErro)

        } catch (erro) {
            mostrarMensagemErro(msgErro, tratarErro(erro))
        } finally {
            alterarEstadoBotao(salvar, false, 'Salvar')
        }

        return
    } 

    const msgErro = divConteudo.querySelector('.msgerro')
    const input = divConteudo.querySelector('.input-propriedade')
    const salvar = divConteudo.querySelector('.salvar')
    const elementoConteudo = divConteudo.querySelector('.conteudo')
    const property = divConteudo.dataset.propriedade
    const contador = divConteudo.querySelector('.contador')
    
    if (property === 'titulo') {
        const erroTitulo = validarTitulo(input.value)

        if (erroTitulo) {
            input.focus()
            adicionarAnimacaoErro(input)
            mostrarMensagemErro(msgErro, erroTitulo)
            return
        }
    } else {
        const erroTexto = validarTexto(input.value)

        if (erroTexto) {
            input.focus()
            adicionarAnimacaoErro(input)
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

        if (property === 'titulo') {
            contador.textContent = '0/20'
        } else {
            contador.textContent = '0/150'
        }
        
        ocultarElemento(contador)
        ocultarElemento(salvar)
        desocultarElemento(elementoConteudo)
        apagarElemento(input)
        desocultarElemento(divElementos)
        apagarMensagemErro(msgErro)

    } catch (erro) {
        mostrarMensagemErro(msgErro, tratarErro(erro))
    } finally {
        alterarEstadoBotao(salvar, false, 'Salvar')
    }

    return
}

tarefasDom.lista.addEventListener('change', async (evento) => {
    if (verificarModoSelecao(evento.target)) {
        return
    }

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