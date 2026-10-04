import { formatarData } from "../utils/data.js"

const tarefasDom = {
    titulo: document.querySelector('#titulo'),
    descricao: document.querySelector('#descricao'),
    btAdicionar: document.querySelector('#adicionar'),
    lista: document.querySelector('#lista'),
    mensagemErroTitulo: document.querySelector('#errotitulo'),
    mensagemErroDescricao: document.querySelector('#errodescricao'),
    containerDeFiltros: document.querySelector('#containerfiltros'),
    btResetar: document.querySelector('#resetarfiltros'),
    filtroStatus: document.querySelector('#selectstatusfiltros'),
    filtroPrioridade: document.querySelector('#selectprioridadefiltros'),
    filtroDtCriacao: document.querySelector('#selectcriacaofiltros'),
    filtroDtConclusao: document.querySelector('#selectconclusaofiltros'),
    ordenarPor: document.querySelector('#selectordenarporfiltros'),
    ordem: document.querySelector('#selectordemfiltros'),
    ordemOpcUm:document.querySelector('.opcum'),
    ordemOpcDois: document.querySelector('.opcdois'),
    mostradorEstadoTarefas: document.querySelector('#mostrarestadotarefa')
}

function limparLista() {
    tarefasDom.lista.innerHTML = ''
}

function alterarEstadoBotao(botao, desabilitado, texto) {
    botao.disabled = desabilitado
    botao.textContent = texto
}

function mostrarEstadoTarefa(mensagem) {
    tarefasDom.mostradorEstadoTarefas.textContent = mensagem
}

function limparMostrarEstadoTarefa() {
    tarefasDom.mostradorEstadoTarefas.textContent = ''
}

function adicionarNaLista(tarefa) {
    const li = criarTarefaElemento(tarefa)
    tarefasDom.lista.appendChild(li)
}

function pegarFiltros() {
    return {
        status: tarefasDom.filtroStatus.value,
        prioridade: tarefasDom.filtroPrioridade.value,
        dtCriacao: tarefasDom.filtroDtCriacao.value,
        dtConclusao: tarefasDom.filtroDtConclusao.value,
        ordenarPor: tarefasDom.ordenarPor.value,
        ordem: tarefasDom.ordem.value
    }
}

function atualizarOpcoesOrdem() {
    const opcoesOrdem = {
            
        status: {
            opcUm: 'pendentes',
            opcDois: 'concluidas',
            textoUm: 'Pendentes',
            textoDois: 'Concluídas'
        },

        prioridade: {
            opcUm: 'maior',
            opcDois: 'menor',
            textoUm: 'Maior',
            textoDois: 'Menor'
        },

        criacao: {
            opcUm: 'recente',
            opcDois: 'antigo',
            textoUm: 'Mais recentes',
            textoDois: 'Mais antigas'
        },

        conclusao: {
            opcUm: 'recente',
            opcDois: 'antigo',
            textoUm: 'Mais recentes',
            textoDois: 'Mais antigas'
        }
    }

    const ordenarPor = tarefasDom.ordenarPor.value
    const opcUm = tarefasDom.ordemOpcUm
    const opcDois = tarefasDom.ordemOpcDois

    if (ordenarPor === 'nenhum') {
        opcUm.value = 'nenhum'
        opcUm.textContent = 'Nenhum'
        opcDois.style.display = 'none'

        return
    }
    opcDois.style.display = ''
    
    opcUm.value = opcoesOrdem[ordenarPor].opcUm
    opcUm.textContent = opcoesOrdem[ordenarPor].textoUm

    opcDois.value = opcoesOrdem[ordenarPor].opcDois
    opcDois.textContent = opcoesOrdem[ordenarPor].textoDois
}

function resetarFiltros() {
    tarefasDom.filtroStatus.value = 'todas'
    tarefasDom.filtroPrioridade.value = 'todas'
    tarefasDom.filtroDtCriacao.value = 'todas'
    tarefasDom.filtroDtConclusao.value = 'todas'
    tarefasDom.ordenarPor.value = 'status'

    atualizarOpcoesOrdem()

    tarefasDom.ordem.value = 'pendentes'
}

function renderizarTarefas(tarefas) {
    tarefasDom.lista.innerHTML = ''

    limparMostrarEstadoTarefa()

    for (const tarefa of tarefas) {
        adicionarNaLista(tarefa)
    }
}

function criarTarefaElemento(tarefa) {
    
    const li = document.createElement('li')

    li.dataset.id = tarefa.id

    const div = document.createElement('div')
    const divTitulo = document.createElement('div')
    const divDescricao = document.createElement('div')
    const divPrioridade = document.createElement('div')
    const divStatus = document.createElement('div')
    const divDtCriacao = document.createElement('div')
    const divDtConclusao = document.createElement('div')
    const spanPropriedadeDtCriacao = document.createElement('span')
    const spanPropriedadeDtConclusao = document.createElement('span')

    divPrioridade.classList.add('div-prioridade')
    divStatus.classList.add('div-status')

    spanPropriedadeDtCriacao.textContent = 'Criada em: '
    spanPropriedadeDtConclusao.textContent = 'Concluída em: '

    const spanTitulo = document.createElement('span')
    const spanDescricao = document.createElement('span')

    const selectPrioridade = document.createElement('select')
    const prioridadeBaixa = document.createElement('option')
    const prioridadeMedia = document.createElement('option')
    const prioridadeAlta = document.createElement('option')

    prioridadeBaixa.value = 'baixa'
    prioridadeMedia.value = 'media'
    prioridadeAlta.value = 'alta'

    prioridadeBaixa.textContent = 'Baixa'
    prioridadeMedia.textContent = 'Media'
    prioridadeAlta.textContent = 'Alta'

    const spanStatus = document.createElement('span')
    const spanDtCriacao = document.createElement('span')
    const spanDtConclusao = document.createElement('span')

    spanTitulo.classList.add('conteudo')
    spanDescricao.classList.add('conteudo')
    selectPrioridade.classList.add('conteudoprioridade')
    spanStatus.classList.add('conteudostatus')
    spanDtCriacao.classList.add('conteudodtcriacao')
    spanDtConclusao.classList.add('conteudodtconclusao')

    selectPrioridade.appendChild(prioridadeBaixa)
    selectPrioridade.appendChild(prioridadeMedia)
    selectPrioridade.appendChild(prioridadeAlta)

    spanTitulo.textContent = tarefa.titulo
    spanDescricao.textContent = tarefa.descricao
    selectPrioridade.value = tarefa.prioridade

    if (tarefa.status) {
        spanStatus.textContent = 'Concluída'
    } else {
        spanStatus.textContent = 'Pendente'
    }
    
    spanDtCriacao.textContent = formatarData(tarefa.dtCriacao).replace(',', ' às ')
    
    const btEditarTitulo = document.createElement('button')
    btEditarTitulo.textContent = 'Editar'
    btEditarTitulo.classList.add('editar-propriedade')

    const btEditarDescricao = document.createElement('button')
    btEditarDescricao.textContent = 'Editar'
    btEditarDescricao.classList.add('editar-propriedade')

    const btSalvarTitulo = document.createElement('button')
    btSalvarTitulo.textContent = 'Salvar'
    btSalvarTitulo.classList.add('salvar')
    btSalvarTitulo.classList.add('oculto')

    const btSalvarDescricao = document.createElement('button')
    btSalvarDescricao.textContent = 'Salvar'
    btSalvarDescricao.classList.add('salvar')
    btSalvarDescricao.classList.add('oculto')

    const btExcluir = document.createElement('button')
    btExcluir.classList.add('excluir')
    btExcluir.textContent = 'Excluir'

    const mensagemErroTitulo = document.createElement('p')
    const mensagemErroDescricao = document.createElement('p')

    mensagemErroTitulo.classList.add('msgerro')
    mensagemErroTitulo.classList.add('oculto')
    mensagemErroDescricao.classList.add('msgerro')
    mensagemErroDescricao.classList.add('oculto')

    div.classList.add('container')

    divTitulo.appendChild(spanTitulo)
    divTitulo.appendChild(btEditarTitulo)
    divTitulo.appendChild(btSalvarTitulo)
    divTitulo.appendChild(mensagemErroTitulo)

    divDescricao.appendChild(spanDescricao)
    divDescricao.appendChild(btEditarDescricao)
    divDescricao.appendChild(btSalvarDescricao)
    divDescricao.appendChild(mensagemErroDescricao)

    divTitulo.classList.add('propriedade')
    divTitulo.dataset.propriedade = 'titulo'

    divDescricao.classList.add('propriedade')
    divDescricao.dataset.propriedade = 'descricao'

    div.appendChild(divTitulo)
    div.appendChild(divDescricao)
    divPrioridade.appendChild(selectPrioridade)

    divStatus.appendChild(spanStatus)

    divDtCriacao.appendChild(spanPropriedadeDtCriacao)
    divDtCriacao.appendChild(spanDtCriacao)

    divDtConclusao.appendChild(spanPropriedadeDtConclusao)
    divDtConclusao.appendChild(spanDtConclusao)

    const divParteUm = document.createElement('div')
    divParteUm.classList.add('div-parteum')
    divParteUm.appendChild(divTitulo)
    divParteUm.appendChild(divDescricao)

    const divParteDois = document.createElement('div')
    divParteDois.classList.add('div-partedois')
    divParteDois.appendChild(divPrioridade)
    divParteDois.appendChild(divStatus)

    const divParteTres = document.createElement('div')
    divParteTres.classList.add('div-partetres')
    divParteTres.appendChild(divDtCriacao)

    div.appendChild(divParteUm)
    div.appendChild(divParteDois)
    div.appendChild(divParteTres)

    if (tarefa.dtConclusao) {
        spanDtConclusao.textContent = formatarData(tarefa.dtConclusao).replace(',', ' às ')
        divParteTres.appendChild(divDtConclusao)
    }
    
    div.appendChild(btExcluir)

    const divCheckbox = document.createElement('div')
    divCheckbox.classList.add('div-checkbox')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.classList.add('checkbox')
    checkbox.checked = tarefa.status
    const msgErroApi = document.createElement('p')
    msgErroApi.classList.add('msgerro-api')
    msgErroApi.classList.add('oculto')
    
    divCheckbox.appendChild(checkbox)
    divCheckbox.appendChild(msgErroApi)

    li.appendChild(divCheckbox)
    li.appendChild(div)

    return li
}

function editarTarefa(div, elemento) {
    const btSalvar = div.querySelector('.salvar')
    const conteudo = div.querySelector('.conteudo')

    conteudo.classList.add('oculto')
    elemento.classList.add('oculto')

    btSalvar.classList.remove('oculto')

    const descricao = document.createElement('textarea')

    descricao.classList.add('input-propriedade')

    descricao.value = conteudo.textContent
    
    return descricao
}

export {tarefasDom, adicionarNaLista, resetarFiltros, atualizarOpcoesOrdem, criarTarefaElemento, renderizarTarefas, mostrarEstadoTarefa, limparMostrarEstadoTarefa, alterarEstadoBotao, pegarFiltros, editarTarefa, limparLista}