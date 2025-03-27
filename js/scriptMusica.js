'use strict'

const params = new URLSearchParams(window.location.search);
const idMusica = params.get('id')

async function pegarDadosMusica(){

    const url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://api.deezer.com/track/${idMusica}`)}`;
// corrigir
    const response = await fetch(url);
    const music = await response.json();


    return music
}

async function pegarDadosAlbum(idAlbum){

    const url = `https://api.codetabs.com/v1/proxy?quest=https://api.deezer.com/album/${idAlbum}`;


    const response = await fetch(url);
    const album = await response.json();


    return album
}

async function pegarDadosRadio(idArtista){

    const url = `https://api.codetabs.com/v1/proxy?quest=https://api.deezer.com/album/${idArtista}`;
    const response = await fetch(url);
    const radio = await response.json();


    return radio.data
}

async function verificarAutores(musica) {
    const music = musica

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

async function preencherMusica(){

    let contador = 0
    const limite = 5

    //PRIMEIRA COLUNA
    const musica = await pegarDadosMusica()

    const primeiroArtista = musica.contributors[0].name
    const idPrimeiroArtista = musica.contributors[0].id
    const musicasRadio = await pegarDadosRadio(idPrimeiroArtista)
    const listaMusicaRelated = document.getElementById('listaMusicaRelated')

    const audio = document.getElementById('audio')
    audio.src = musica.preview


    musicasRadio.forEach(musicaNoRadio => {
        if(contador < limite){
            const li = document.createElement('li')
            const imgMusica = document.createElement('img')
            const a = document.createElement('a')
            a.textContent = musicaNoRadio.title
    
            imgMusica.src = musicaNoRadio.album.cover_medium
            a.setAttribute('href', `indexMusica.html?id=${musicaNoRadio.id}`)
    
            li.appendChild(imgMusica)
            li.appendChild(a)

            listaMusicaRelated.appendChild(li)

            contador++
        }});

    const deArtista = document.getElementById('deArtista')
    deArtista.textContent = `Parecidas com ${primeiroArtista}`



    //SEGUNDA COLUNA

    const nomeMusica = document.getElementById('nomeMusica')
    const artistaMusica = document.getElementById('artistaMusica')
    const botaoCapa = document.getElementById('botao')
    nomeMusica.textContent = musica.title_short
    artistaMusica.textContent = await processamentoAutores(musica)
    botaoCapa.style.backgroundImage = `url(${musica.album.cover_xl})`

    const ouvirCompleto = document.getElementById('versaoCompleta')
    ouvirCompleto.href = musica.link


    //TERCEIRA COLUNA

    const listaMusica = document.getElementById('listaMusica')
    const musicasAlbum = await pegarDadosAlbum(musica.album.id)

    
    contador = 0
    musicasAlbum.tracks.data.forEach(musicaNoAlbum => {
        if(contador < limite){
            const li = document.createElement('li')
            const imgMusica = document.createElement('img')
            const a = document.createElement('a')
            a.textContent = musicaNoAlbum.title
    
            imgMusica.src = musicaNoAlbum.album.cover_medium
            a.setAttribute('href', `indexMusica.html?id=${musicaNoAlbum.id}`)
    
            li.appendChild(imgMusica)
            li.appendChild(a)

            listaMusica.appendChild(li)

            contador++
        }});

}


function playPauseMusic(){
    const audio = document.getElementById('audio');
    const botao = document.getElementById('botao');
    const icon = document.getElementById('iconPlay')

    if (audio.paused) {
        audio.play();
        icon.src = '../img/pause.png'
        botao.classList.remove('play');
        botao.classList.add('pause');
    } else {
        audio.pause();
        icon.src = '../img/playGrande.png'
        botao.classList.remove('pause');
        botao.classList.add('play');
    }

    audio.addEventListener('ended', () => {
        icon.src = '../img/playGrande.png'
        botao.classList.remove('pause');
        botao.classList.add('play');
    });
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

document.getElementById('botao').addEventListener("click", playPauseMusic)

window.onload = function() {
    preencherMusica()
  };

