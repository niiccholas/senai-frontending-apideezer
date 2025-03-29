'use strict'


let images = [
    {
        imagem: "https://cdn-images.dzcdn.net/images/cover/5026c46b38ed035092df6cfc5a4a288f/0x1900-000000-80-0-0.jpg",
        artista: 'Eminem',
        musica: 'Encore'
    }, 
    {
        imagem: "https://cdn-images.dzcdn.net/images/cover/19e761f5efadd86098265258cb4e3615/500x500.jpg",
        artista: 'Steve Lacy',
        musica: 'Dark Red'
    }, 
    {
        imagem: "https://cdn-images.dzcdn.net/images/cover/91d20e91970ce75c6edba1ce281f4a58/500x500-000000-80-0-0.jpg",
        artista: 'Lady Gaga',
        musica: 'Abracadabra'
    },
    {
        imagem: 'https://cdn-images.dzcdn.net/images/cover/67c9a56d66ac10b5bbc73ee4bd5b1d12/500x500-000000-80-0-0.jpg',
        artista: 'LISA',
        musica: 'Rockstar'
    }
];

let index = 0; 
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const img3 = document.getElementById("img3");

const h2 = document.getElementById('musica')
const h3 = document.getElementById('artista')

const updateImages = () => {

    img1.style.opacity = 0
    img2.style.opacity = 0
    img3.style.opacity = 0
    h2.style.opacity = 0
    h3.style.opacity = 0

    setTimeout(() => {
        img1.src = images[index].imagem;
        img2.src = images[(index + 1) % images.length].imagem;  
        h2.textContent = images[(index + 1) % images.length].musica // atualiza titulo só da música do meio
        h3.textContent = images[(index + 1) % images.length].artista
        img3.src = images[(index + 2) % images.length].imagem;

        index++

        img1.style.opacity = 1
        img2.style.opacity = 1
        img3.style.opacity = 1
        h2.style.opacity = 1
        h3.style.opacity = 1

        if (index >= images.length) {
            index = 0
        }
    }, 900)
    
}

setInterval(updateImages, 3500);