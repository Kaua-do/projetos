import { formatarData } from "../utils/data.js"

const tarefasDom = {
    main: document.querySelector('main'),
    titulo: document.querySelector('#titulo'),
    descricao: document.querySelector('#descricao'),
    btAdicionar: document.querySelector('#adicionar'),
    lista: document.querySelector('#lista'),
    mensagemErroTitulo: document.querySelector('#errotitulo'),
    mensagemErroDescricao: document.querySelector('#errodescricao'),
    contadorTitulo: document.querySelector('#contadortitulo'),
    contadorDescricao: document.querySelector('#contadordescricao'),
    containerDeFiltros: document.querySelector('#containerfiltros'),
    btMostrarFiltros: document.querySelector('#mostrarfiltros'),
    btResetar: document.querySelector('#resetarfiltros'),
    filtroStatus: document.querySelector('#selectstatusfiltros'),
    filtroPrioridade: document.querySelector('#selectprioridadefiltros'),
    filtroDtCriacao: document.querySelector('#selectcriacaofiltros'),
    filtroDtConclusao: document.querySelector('#selectconclusaofiltros'),
    ordenarPor: document.querySelector('#selectordenarporfiltros'),
    ordem: document.querySelector('#selectordemfiltros'),
    ordemOpcUm:document.querySelector('.opcum'),
    ordemOpcDois: document.querySelector('.opcdois'),
    mostradorEstadoTarefas: document.querySelector('#mostrarestadotarefa'),
    modalConfirmacao: document.querySelector('#modalconfirmacao')
}

function atualizarContador(tipo) {
    if (tipo === 'titulo') {
        tarefasDom.contadorTitulo.textContent = `${tarefasDom.titulo.value.length}/20`
    }

    if (tipo === 'descricao') {
        tarefasDom.contadorDescricao.textContent = `${tarefasDom.descricao.value.length}/200`
    }
}

function zerarContadores() {
    tarefasDom.contadorTitulo.textContent = `0/20`
    tarefasDom.contadorDescricao.textContent = `0/200`
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

    const iconCalendarioUm = document.createElement('i')
    iconCalendarioUm.classList.add('fa-regular', 'fa-calendar-days')

    const iconCalendarioDois = document.createElement('i')
    iconCalendarioDois.classList.add('fa-regular', 'fa-calendar-check')

    spanPropriedadeDtCriacao.textContent = ` Criada em: `
    spanPropriedadeDtConclusao.textContent = ` Concluída em: `

    const h3Titulo = document.createElement('h3')
    const pDescricao = document.createElement('p')

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

    h3Titulo.classList.add('conteudo')
    pDescricao.classList.add('conteudo')
    selectPrioridade.classList.add('conteudoprioridade')
    spanStatus.classList.add('conteudostatus')
    spanDtCriacao.classList.add('conteudodtcriacao')
    spanDtConclusao.classList.add('conteudodtconclusao')

    selectPrioridade.appendChild(prioridadeBaixa)
    selectPrioridade.appendChild(prioridadeMedia)
    selectPrioridade.appendChild(prioridadeAlta)

    h3Titulo.textContent = tarefa.titulo
    pDescricao.textContent = tarefa.descricao
    selectPrioridade.value = tarefa.prioridade

    if (tarefa.status) {
        spanStatus.textContent = 'Concluída'
    } else {
        spanStatus.textContent = 'Pendente'
    }
    
    spanDtCriacao.textContent = formatarData(tarefa.dtCriacao).replace(',', ' às ')

    const iconEditTitulo = document.createElement('i')
    iconEditTitulo.classList.add('fa-regular', 'fa-pen-to-square')
    
    const btEditarTitulo = document.createElement('button')
    btEditarTitulo.textContent = 'Título'
    btEditarTitulo.classList.add('editar-propriedade')

    const btSalvarTitulo = document.createElement('button')
    btSalvarTitulo.textContent = 'Salvar'
    btSalvarTitulo.classList.add('salvar')
    btSalvarTitulo.classList.add('oculto')

    const btSalvarDescricao = document.createElement('button')
    btSalvarDescricao.textContent = 'Salvar'
    btSalvarDescricao.classList.add('salvar')
    btSalvarDescricao.classList.add('oculto')

    const mensagemErroTitulo = document.createElement('p')
    const mensagemErroDescricao = document.createElement('p')

    mensagemErroTitulo.classList.add('msgerro')
    mensagemErroTitulo.classList.add('oculto')
    mensagemErroDescricao.classList.add('msgerro')
    mensagemErroDescricao.classList.add('oculto')

    div.classList.add('container')

    divTitulo.appendChild(h3Titulo)
    divTitulo.appendChild(btEditarTitulo)
    divTitulo.appendChild(btSalvarTitulo)
    divTitulo.appendChild(mensagemErroTitulo)

    const iconEditDescricao = document.createElement('i')
    iconEditDescricao.classList.add('fa-regular', 'fa-pen-to-square')

    const btEditarDescricao = document.createElement('button')
    
    btEditarDescricao.textContent = 'Descrição' 

    if (tarefa.descricao === '') {
        pDescricao.classList.add('oculto')
    }
    
    divDescricao.appendChild(pDescricao)
    divDescricao.appendChild(btEditarDescricao)
    divDescricao.appendChild(btSalvarDescricao)
    divDescricao.appendChild(mensagemErroDescricao)

    btEditarDescricao.classList.add('editar-propriedade')
    divTitulo.classList.add('divtitulo', 'propriedade')
    divTitulo.dataset.propriedade = 'titulo'

    divDescricao.classList.add('divdescricao', 'propriedade')
    divDescricao.dataset.propriedade = 'descricao'

    div.appendChild(divTitulo)
    div.appendChild(divDescricao)
    divPrioridade.appendChild(selectPrioridade)

    divStatus.appendChild(spanStatus)

    divDtCriacao.appendChild(iconCalendarioUm)
    divDtCriacao.appendChild(spanPropriedadeDtCriacao)
    divDtCriacao.appendChild(spanDtCriacao)

    divDtConclusao.appendChild(iconCalendarioDois)
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

    const divCheckbox = document.createElement('div')
    divCheckbox.classList.add('div-checkbox')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.classList.add('checkbox')
    checkbox.checked = tarefa.status
    const msgErroApi = document.createElement('p')
    msgErroApi.classList.add('msgerro-api')
    msgErroApi.classList.add('ocult')
    msgErroApi.textContent = 'Ocoreu um erro no servidor.'
    
    divCheckbox.appendChild(checkbox)

    const divMenu = document.createElement('div')
    const divIntermediaria = document.createElement('div')
    const menu = document.createElement('div')
    const divOpcao = document.createElement('div')
    const opcExcluir = document.createElement('button')
    const iconLixeira = document.createElement('i')
    const iconTresPontos = document.createElement('i')
    const divMsgErroApi = document.createElement('div')

    divIntermediaria.classList.add('divintermediaria', 'oculto')
    iconLixeira.classList.add('fa-regular', 'fa-trash-can')
    divMenu.id = 'menu'
    iconTresPontos.classList.add('fa-solid', 'fa-ellipsis-vertical', 'botaoopcoes')
    menu.classList.add('menu')

    opcExcluir.classList.add('opcaoexcluir')
    opcExcluir.textContent = 'Excluir'
    divOpcao.classList.add('divopcao')

    const divElementosEditarTitulo = document.createElement('div')
    const divElementosEditarDescricao = document.createElement('div')
    const divElementosExcluir = document.createElement('div')

    divElementosEditarTitulo.classList.add('divelementoseditar')
    divElementosEditarDescricao.classList.add('divelementoseditar')
    divElementosExcluir.classList.add('divelementosexcluir')

    divElementosEditarTitulo.dataset.propriedade = 'titulo'
    divElementosEditarDescricao.dataset.propriedade = 'descricao'

    divElementosEditarTitulo.appendChild(iconEditTitulo)
    divElementosEditarTitulo.appendChild(btEditarTitulo)
    divElementosEditarDescricao.appendChild(iconEditDescricao)
    divElementosEditarDescricao.appendChild(btEditarDescricao)
    divElementosExcluir.appendChild(iconLixeira)
    divElementosExcluir.appendChild(opcExcluir)
    divOpcao.appendChild(divElementosEditarTitulo)
    divOpcao.appendChild(divElementosEditarDescricao)
    divOpcao.appendChild(divElementosExcluir)
    divIntermediaria.appendChild(menu)
    menu.appendChild(divOpcao)
    divMenu.appendChild(divIntermediaria)
    divMenu.appendChild(iconTresPontos)

    const divContainer = document.createElement('div')
    divContainer.classList.add('containerintermediario')
    divContainer.appendChild(div)
    divMsgErroApi.appendChild(msgErroApi)
    divContainer.appendChild(divMsgErroApi)
    divContainer.appendChild(divMenu)

    li.appendChild(divCheckbox)
    li.appendChild(divContainer)

    return li
}

function editarTarefa(div, elemento) {
    const btSalvar = div.querySelector('.salvar')
    const conteudo = div.querySelector('.conteudo')

    conteudo.classList.add('oculto')

    btSalvar.classList.remove('oculto')

    if (div.dataset.propriedade === 'titulo') {
        const input = document.createElement('input')
        input.classList.add('input-propriedade')
        input.value = conteudo.textContent

        return input
    }

    const input = document.createElement('textarea')

    input.classList.add('input-propriedade', 'input-descricao')

    input.value = conteudo.textContent
    
    return input
}

export {tarefasDom, adicionarNaLista, resetarFiltros, atualizarOpcoesOrdem, criarTarefaElemento, renderizarTarefas, mostrarEstadoTarefa, limparMostrarEstadoTarefa, alterarEstadoBotao, pegarFiltros, editarTarefa, limparLista, atualizarContador, zerarContadores}