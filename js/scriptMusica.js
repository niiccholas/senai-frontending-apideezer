'use strict'


async function pesquisarMusica(nomeMusica){

    const url = `https://api.deezer.com/search?q=${encodeURIComponent(nomeMusica)}`

    const response = await fetch(url)
    const data = await response.json()

    return data.data
}

async function criarLinhaMusica(musica){
    const lista = document.getElementById('lista')

    const novaLinha = document.createElement('li')

    const playImg = document.createElement('img')
    playImg.src = "./img/play.png"

    const botaoPlay = document.createElement('div')
    botaoPlay.appendChild(playImg)

    const capaMusica = document.createElement('a')
    capaMusica.setAttribute('href', '#')
    capaMusica.appendChild(botaoPlay)

    const nomeMusica = document.createElement('h1')
    nomeMusica.textContent = musica.title

    const containerCapa = document.createElement('div')
    containerCapa.classList.add('musica')
    containerCapa.appendChild(capaMusica)
    containerCapa.appendChild(nomeMusica)

    const nomeAutor = document.createElement('h2')
    nomeAutor.textContent = processamentoAutores(musica)

    const duracao = document.createElement('h2')
    duracao.textContent = formatarTempo(musica.duration)

    novaLinha.appendChild(containerCapa)
    novaLinha.appendChild(nomeAutor)
    novaLinha.appendChild(duracao)

    capaMusica.style.backgroundImage = `url(${musica.album.cover_medium})`
    
    lista.appendChild(novaLinha)
}

async function verificarAutores(musica){
    const url = `https://api.deezer.com/track/${musica.id}`

    const response = await fetch(url)
    const musica = await response.json()

    if(musica.contributors.length > 1){
        return {data: musica.contributors,
                status: true
        }
    }else{
        return {data: (musica.artist),
                status: false
        }
    }
}

async function processamentoAutores(musica){

    json = verificarAutores(musica)

    if(json.status == true){
        contribuitorData = '.'
        json.data.forEach(contribuidor => {
            if(contribuitorData == '.'){
                contribuitorData = contribuidor.name // poppy
            }else{
                contribuitorData = `${contribuitorData}, ` + contribuidor.name
            }
        });
    }else{
        contribuitorData = musica.artist.name
    }
    return contribuitorData
}

function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    
    // adiciona o zero a esquerda conforme a condicional antes do ?
    const minutosFormatados = minutos < 10 ? '0' + minutos : minutos;
    const segundosFormatados = segundosRestantes < 10 ? '0' + segundosRestantes : segundosRestantes;
    
    return `${minutosFormatados}:${segundosFormatados}`;
}

async function preencherMusica() {
    const musicaSolicitada = document.getElementById('musica').value
    const musicas = await pesquisarMusica(musicaSolicitada)
    const lista = document.getElementById('lista')
    lista.replaceChildren()

    musicas.forEach(criarLinhaMusica)
}

document.getElementById('musica').addEventListener('keydown', function(tecla){
    if (tecla.key === 'Enter'){
        tecla.preventDefault()
        preencherMusica()
    }
})

document.getElementById('botao').addEventListener("click", preencherMusica)
