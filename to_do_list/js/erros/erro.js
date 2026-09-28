function criarModeloErro(nome, tipo, motivo) {
    const erro = new Error(nome)
    erro.tipo = tipo
    erro.codigo = motivo
    erro.padronizado = true

    return erro
}

function identificarErroDeRede(erro) {

    const mensagem = erro?.message?.toLowerCase() || ''

    if (
        mensagem.includes('failed to fetch') ||
        mensagem.includes('networkerror') ||
        mensagem.includes('network request failed') ||
        mensagem.includes('load failed')
    ) {
        return 'falha_conexao'
    }

    return null
}


export {criarModeloErro, identificarErroDeRede}