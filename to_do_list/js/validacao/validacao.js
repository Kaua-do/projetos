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

    if (texto.length > 150) {
        return 'Máximo de 150 caracteres.'
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

function validarCampoEmailLogin(email) {
    
    if (email.trim() === '') {
        return 'Digite o email.'
    }

    return null
}

function validarCampoSenhaLogin(senha) {
    if (senha.trim() === '') {
        return 'Digite a senha.'
    }

    return null
}

function validarData(valor) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return 'Formato de data inválido.';
    }

    return false
}

export {validarTitulo, validarTexto, validarSenha, validarNome, validarCampoEmailLogin as validarCampoEmailLogin, validarCampoSenhaLogin, validarData}