async function pesquisarMusica(nomeMusica) {
    // URL correta para pesquisa de músicas
    const url = `https://corsproxy.io/?https://api.deezer.com/search?q=${encodeURIComponent(nomeMusica)}`;

    const response = await fetch(url);
    const data = await response.json();

    // Retorna a lista de músicas, que está dentro de data.data
    return data.data || [];
}

async function criarLinhaMusica(musica) {
    const lista = document.getElementById('lista');

    const novaLinha = document.createElement('li');

    const playImg = document.createElement('img');
    playImg.src = "./img/play.png";

    const botaoPlay = document.createElement('div');
    botaoPlay.appendChild(playImg);

    const capaMusica = document.createElement('a');
    capaMusica.setAttribute('href', '#');
    capaMusica.appendChild(botaoPlay);

    const nomeMusica = document.createElement('h1');
    nomeMusica.textContent = musica.title;

    const containerCapa = document.createElement('div');
    containerCapa.classList.add('musica');
    containerCapa.appendChild(capaMusica);
    containerCapa.appendChild(nomeMusica);

    const nomeAutor = document.createElement('h2');
    nomeAutor.textContent = await processamentoAutores(musica);

    const duracao = document.createElement('h2');
    duracao.textContent = formatarTempo(musica.duration);

    novaLinha.appendChild(containerCapa);
    novaLinha.appendChild(nomeAutor);
    novaLinha.appendChild(duracao);

    capaMusica.style.backgroundImage = `url(${musica.album.cover_medium})`;

    lista.appendChild(novaLinha);
}

async function verificarAutores(musica) {
    const url = `https://corsproxy.io/?https://api.deezer.com/track/${musica.id}`;

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
    const json = await verificarAutores(musica);

    let contribuitorData = '.';
    if (json.status === true) {
        contribuitorData = '';
        json.data.forEach(contribuidor => {
            if (contribuitorData == '') {
                contribuitorData = contribuidor.name; // Exemplo: Poppy
            } else {
                contribuitorData = `${contribuitorData}, ` + contribuidor.name;
            }
        });
    } else {
        contribuitorData = musica.artist.name;
    }
    return contribuitorData;
}


function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    const minutosFormatados = minutos < 10 ? '0' + minutos : minutos;
    const segundosFormatados = segundosRestantes < 10 ? '0' + segundosRestantes : segundosRestantes;

    return `${minutosFormatados}:${segundosFormatados}`;
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
