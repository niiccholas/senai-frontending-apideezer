'use strict'

async function pesquisarMusica(nomeMusica) {

    const url = `https://corsproxy.io/?key=21d7902b&url=https://api.deezer.com/search?q=${encodeURIComponent(nomeMusica)}&type=track`;
    // const url = `https://api.codetabs.com/v1/proxy?quest=https://api.deezer.com/search?q=${encodeURIComponent(nomeMusica)}`;


    const response = await fetch(url);
    const data = await response.json();

    console.log(data)

    return data.data
}

async function criarLinhaMusica(musica) {

    const lista = document.getElementById('lista')

    const container = document.createElement('div')
    container.classList.add('container')

    const playImg = document.createElement('img')
    playImg.src = "./img/play.png"

    const botaoPlay = document.createElement('div')
    botaoPlay.appendChild(playImg)

    const capaMusica = document.createElement('a')
    capaMusica.setAttribute('href', `/senai-frontending-apideezer/indexMusica.html?id=${musica.id}`) //leva para outra página, alterar se o código estiver local
    capaMusica.appendChild(botaoPlay)
    capaMusica.style.backgroundImage = `url(${musica.album.cover_medium})`

    const nomeMusica = document.createElement('h3')
    nomeMusica.textContent = musica.title

    const musicaContent = document.createElement('div')
    musicaContent.classList.add('musica')
    musicaContent.appendChild(capaMusica)
    musicaContent.appendChild(nomeMusica)

    const listaMusica = document.createElement('section')
    listaMusica.id = 'listaMusica'
    listaMusica.appendChild(musicaContent)

    const musicaCategoriaText = document.createElement('h1')
    musicaCategoriaText.textContent = 'MÚSICA'

    const colunaMusica = document.createElement('li')
    colunaMusica.classList.add('coluna')
    colunaMusica.appendChild(musicaCategoriaText)
    colunaMusica.appendChild(listaMusica)

    const linha = document.createElement('div')
    linha.classList.add('linha')

    const nomeArtista = document.createElement('h2')
    nomeArtista.textContent = await processamentoAutores(musica)
    const listaAutor = document.createElement('section')
    listaAutor.id = 'listaAutor'
    listaAutor.appendChild(nomeArtista)

    const artistaCategoriaText = document.createElement('h1')
    artistaCategoriaText.textContent = 'ARTISTA'

    const colunaArtista = document.createElement('li')
    colunaArtista.classList.add('coluna')
    colunaArtista.appendChild(artistaCategoriaText)
    colunaArtista.appendChild(listaAutor)

    const duracao = document.createElement('h2')
    duracao.textContent = formatarTempo(musica.duration)

    const listaDuracao = document.createElement('section')
    listaDuracao.id = 'listaDuracao'
    listaDuracao.appendChild(duracao)

    const duracaoCategoriaText = document.createElement('h1')
    duracaoCategoriaText.textContent = 'DURAÇÃO'

    const colunaDuracao = document.createElement('li')
    colunaDuracao.classList.add('coluna')
    colunaDuracao.appendChild(duracaoCategoriaText)
    colunaDuracao.appendChild(listaDuracao)

    container.appendChild(linha)
    container.appendChild(colunaMusica)
    container.appendChild(colunaArtista)
    container.appendChild(colunaDuracao)

    lista.appendChild(container);
}

function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    const minutosFormatados = minutos < 10 ? '0' + minutos : minutos;
    const segundosFormatados = segundosRestantes < 10 ? '0' + segundosRestantes : segundosRestantes;

    return `${minutosFormatados}:${segundosFormatados}`;
}

async function verificarAutores(musica) {
    const url = `https://corsproxy.io/?key=df2c5a13&url=https://api.deezer.com/track/${musica.id}`;

    const response = await fetch(url);
    const music = await response.json();

    // Verifique se 'contributors' existe e tem comprimento maior que 0
    if (music.contributors && music.contributors.length > 1) {
        return { data: music.contributors, status: true };
    } else {
        return { data: music.artist ? music.artist.name : 'Desconhecido', status: false };
    }
}

async function processamentoAutores(musica) {
    const json = await verificarAutores(musica)

    let contribuitorData = '.'
    if (json.status === true) {
        contribuitorData = ''
        json.data.forEach(contribuidor => {
            if (contribuitorData == '') {
                contribuitorData = contribuidor.name
            } else {
                contribuitorData = `${contribuitorData}, ` + contribuidor.name
            }
        })
    } else {
        contribuitorData = musica.artist.name;
    }
    return contribuitorData;
}

async function preencherMusica() {
    const musicaSolicitada = document.getElementById('musica').value;
    const musicas = await pesquisarMusica(musicaSolicitada);
    const lista = document.getElementById('lista');
    lista.replaceChildren();

    if (musicas.length > 0) {
        musicas.forEach(criarLinhaMusica);
    } else {
        const noResults = document.createElement('li');
        noResults.textContent = "Nenhuma música encontrada.";
        lista.appendChild(noResults);
    }
}

document.getElementById('musica').addEventListener('keydown', function(tecla) {
    if (tecla.key === 'Enter') {
        tecla.preventDefault();
        preencherMusica();
    }
});

document.getElementById('botao').addEventListener("click", preencherMusica);
