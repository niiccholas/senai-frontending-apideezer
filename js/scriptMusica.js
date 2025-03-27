'use strict'

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

document.getElementById('botao').addEventListener("click", playPauseMusic)