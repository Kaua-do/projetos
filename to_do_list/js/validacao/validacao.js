function validarTitulo(tituloRecebido) {
    const titulo = tituloRecebido.trim()

    if (titulo === '') {
        return 'O título não pode estar vazio.'
    }

    if (titulo.length > 20) {
        return 'Limite de até 20 caracteres.'
    }

    if (titulo.length < 3) {
        return 'Mínimo de 3 caracteres.'
    }

    return null
}

function validarTexto(textoRecebido) {
    const texto = textoRecebido.trim()

    if (texto.length > 200) {
        return 'Máximo de 200 caracteres.'
    }

    return null
}

function validarSenha(senha, confirmarSenha) {
    if (senha !== confirmarSenha) {
        return 'As senhas não se correspondem.'
    }

    return null
}

function validarNome(nome) {
    if (nome.trim() === '') {
        return 'Nome não pode estar vazio'
    }

    if (nome.length > 9) {
        return 'Nome muito longo.'
    }

    if (nome.length < 3) {
        return 'Nome muito curto.'
    }

    return null
}

export {validarTitulo, validarTexto, validarSenha, validarNome}