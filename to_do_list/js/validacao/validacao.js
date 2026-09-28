function validarTitulo(tituloRecebido) {
    const titulo = tituloRecebido.trim()

    if (titulo === '') {
        return 'O título não pode estar vazio.'
    }

    if (titulo.length > 20) {
        return 'Límite de até 20 caracteres.'
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

export {validarTitulo, validarTexto}