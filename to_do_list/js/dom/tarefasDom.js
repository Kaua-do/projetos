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

function aplicarAparenciaErro(elemento) {
    elemento.classList.add('erro')
}

function retirarAparenciaErro(elemento) {
    elemento.classList.remove('erro')
}

function cordenarAplicarAparenciaErro(contador, tipo, caracteres) {
    if (tipo === 'titulo') {

        if (caracteres === 20) {
            aplicarAparenciaErro(contador)
        } else {
            retirarAparenciaErro(contador)
        }
    }

    if (tipo === 'descricao') {

        if (caracteres === 150) {
            aplicarAparenciaErro(contador)
        } else {
            retirarAparenciaErro(contador)
        }
    }
}

function atualizarContadorCriacao(tipo) {
    if (tipo === 'titulo') {
        const contador = tarefasDom.contadorTitulo
        const caracteres = tarefasDom.titulo.value.length

        contador.textContent = `${caracteres}/20`
        
        cordenarAplicarAparenciaErro(contador, tipo, caracteres)
    }

    if (tipo === 'descricao') {
        const contador = tarefasDom.contadorDescricao
        const caracteres = tarefasDom.descricao.value.length

        contador.textContent = `${caracteres}/150`

        cordenarAplicarAparenciaErro(contador, tipo, caracteres)
    }
}

function atualizarContadorTarefa(caracteres, contador, tipo) {
    if (tipo === 'titulo') {
        contador.textContent = `${caracteres}/20`

        cordenarAplicarAparenciaErro(contador, tipo, caracteres)
    }

    if (tipo === 'descricao') {
        contador.textContent = `${caracteres}/150`

        cordenarAplicarAparenciaErro(contador, tipo, caracteres)
    }
}

function zerarContadoresCriacao() {
    tarefasDom.contadorTitulo.textContent = `0/20`
    tarefasDom.contadorDescricao.textContent = `0/150`
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

    prioridadeBaixa.classList.add('verde') 
    prioridadeMedia.classList.add('amarelo') 
    prioridadeAlta.classList.add('vermelho') 

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
   
    mensagemErroTitulo.classList.add('msgerro','oculto', 'erro')
    mensagemErroDescricao.classList.add('msgerro','oculto', 'erro')

    div.classList.add('container')

    const divMsgTitulo = document.createElement('div')
    divMsgTitulo.classList.add('divmsgtitulo')
    const contadorTitulo = document.createElement('p')
    contadorTitulo.classList.add('contador', 'oculto')
    contadorTitulo.textContent = '0/20'
    const divDoMsgErroTitulo = document.createElement('div')
    const divDoContadorTitulo = document.createElement('div')

    divDoMsgErroTitulo.appendChild(mensagemErroTitulo)
    divDoContadorTitulo.appendChild(contadorTitulo)

    divMsgTitulo.appendChild(divDoMsgErroTitulo)
    divMsgTitulo.appendChild(divDoContadorTitulo)

    const divIntermediariaTitulo = document.createElement('div')
    divIntermediariaTitulo.classList.add('divintermediaria')

    divIntermediariaTitulo.appendChild(h3Titulo)
    divIntermediariaTitulo.appendChild(btSalvarTitulo)

    divTitulo.appendChild(divIntermediariaTitulo)
    divTitulo.appendChild(divMsgTitulo)

    const iconEditDescricao = document.createElement('i')
    iconEditDescricao.classList.add('fa-regular', 'fa-pen-to-square')

    const btEditarDescricao = document.createElement('button')
    
    btEditarDescricao.textContent = 'Descrição' 

    if (tarefa.descricao === '') {
        pDescricao.classList.add('oculto')
    }

    const divMsgDescricao = document.createElement('div')
    divMsgDescricao.classList.add('divmsgdescricao')
    const contadorDescricao = document.createElement('p')
    contadorDescricao.classList.add('contador', 'oculto')
    contadorDescricao.textContent = '0/150'
    const divDoMsgErroDescricao = document.createElement('div')
    const divDoContadorDescricao = document.createElement('div')

    divDoMsgErroDescricao.appendChild(mensagemErroDescricao)
    divDoContadorDescricao.appendChild(contadorDescricao)

    divMsgDescricao.appendChild(divDoMsgErroDescricao)
    divMsgDescricao.appendChild(divDoContadorDescricao)

    const divIntermediariaDescricao = document.createElement('div')
    divIntermediariaDescricao.classList.add('divintermediaria')
    
    divIntermediariaDescricao.appendChild(pDescricao)
    divIntermediariaDescricao.appendChild(btSalvarDescricao)

    divDescricao.appendChild(divIntermediariaDescricao)
    divDescricao.appendChild(divMsgDescricao)

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

    const menu = document.createElement('div')
    menu.id = 'divmenu'
    menu.classList.add('menu')

    const divOpcao = document.createElement('div')

    const iconLixeira = document.createElement('i')
    iconLixeira.classList.add('fa-regular', 'fa-trash-can')

    const opcExcluir = document.createElement('button')
    opcExcluir.classList.add('opcaoexcluir')
    opcExcluir.textContent = 'Excluir'

    const divElementosEditarTitulo = document.createElement('div')
    const divElementosEditarDescricao = document.createElement('div')
    const divElementosExcluir = document.createElement('div')

    divElementosEditarTitulo.classList.add('divelementoseditar', 'divelementoseditartitulo')
    divElementosEditarDescricao.classList.add('divelementoseditar', 'divelementoseditardescricao')
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
    msgErroApi.classList.add('oculto', 'erro')
    
    const iconTresPontos = document.createElement('i')
    const divMsgErroApi = document.createElement('div')

    divCheckbox.appendChild(checkbox)

    divMsgErroApi.classList.add('divmsgerroapi')
    iconTresPontos.classList.add('fa-solid', 'fa-ellipsis-vertical', 'botaoopcoes')

    divOpcao.classList.add('divopcao', 'oculto')

    const areaMenu = document.createElement('div')
    areaMenu.classList.add('areamenu')

    areaMenu.appendChild(divOpcao)
    areaMenu.appendChild(iconTresPontos)
    divCheckbox.appendChild(areaMenu)

    const divContainer = document.createElement('div')
    divContainer.classList.add('containerintermediario')
    divContainer.appendChild(div)
    divMsgErroApi.appendChild(msgErroApi)
    divContainer.appendChild(divMsgErroApi)

    li.appendChild(divCheckbox)
    li.appendChild(divContainer)

    return li
}

function editarTarefa(div) {
    const btSalvar = div.querySelector('.salvar')
    const conteudo = div.querySelector('.conteudo')

    conteudo.classList.add('oculto')

    btSalvar.classList.remove('oculto')

    if (div.dataset.propriedade === 'titulo') {
        const input = document.createElement('input')
        input.classList.add('input-propriedade')
        input.value = conteudo.textContent
        input.maxLength = '20'

        return input
    }

    const input = document.createElement('textarea')

    input.classList.add('input-propriedade', 'input-descricao')

    input.maxLength = '150'
    input.value = conteudo.textContent
    
    return input
}

export {tarefasDom, adicionarNaLista, resetarFiltros, atualizarOpcoesOrdem, criarTarefaElemento, renderizarTarefas, mostrarEstadoTarefa, limparMostrarEstadoTarefa, alterarEstadoBotao, pegarFiltros, editarTarefa, limparLista, atualizarContadorCriacao, zerarContadoresCriacao, atualizarContadorTarefa}