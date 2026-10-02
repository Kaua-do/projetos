const perfilDom = {
    perfil: document.querySelector('.perfiltexto'),
    btSair: document.querySelector('#logout'),
    msgLogout: document.querySelector('#msglogout')
}

function mostrarPerfil(nome) {
    perfilDom.perfil.textContent = `Olá, ${nome}!`
}

export {perfilDom, mostrarPerfil}