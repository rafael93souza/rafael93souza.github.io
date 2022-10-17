let filmesTotal = { pagina1: [], pagina2: [], pagina3: [], pagina4: [] };
let contador = 0, numeroPaginas = 3
const pesquisarFilme = document.querySelector(".input");
const modal = document.querySelector(".modal");
const divTodosFilmes = document.querySelector(".movies");
const filmeDiaDiv = document.querySelector(".highlight__title-rating");
const play = document.querySelector(".play");
const imagemFilmeMoodal = document.querySelector(".modal__img");

const videoYoutube = document.querySelector(".highlight__videoYoutube");
const divFilmeDia = document.querySelector(".highlight__video");

async function requisitarFilmes(resultado) {
    try {
        const promesaFilmes = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR');
        const filmes = await promesaFilmes.json();
        resultado(filmes);
    } catch (error) {
        alert(`500 Internal Server Error
        ${error}`);
    }
}
function fazerRequisicao() {
    requisitarFilmes((filmes) => {
        dividirPaginas(filmes)
        codigoDOM();
    });
}
fazerRequisicao();

async function requisitarFilmeDia() {
    try {
        const promesaFilmeDia = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR`);

        const promesaFilmeVideo = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR`);

        const filmeDia = await promesaFilmeDia.json();
        const videoFilme = await promesaFilmeVideo.json();

        divFilmeDia.style.backgroundImage = `url(${filmeDia.backdrop_path})`
        divFilmeDia.style.backgroundSize = '110%';


        const tituloFilmeDia = document.querySelector(".highlight__title");
        tituloFilmeDia.textContent = filmeDia.title;

        const avaliacaoFilmeDia = document.querySelector(".highlight__rating");
        avaliacaoFilmeDia.textContent = filmeDia.vote_average;

        const generoFilmeDia = document.querySelector(".highlight__genres");

        let generos = []
        filmeDia.genres.map((genero) => {
            return generos.push(genero.name);
        });
        generos = generos.join(", ");
        generoFilmeDia.textContent = generos;

        const data = document.querySelector(".highlight__launch");
        const datas = new Date(filmeDia.release_date);
        const formatarData = Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });
        data.textContent = formatarData.format(datas);

        const descricaoFilmeDia = document.querySelector(".highlight__description");
        descricaoFilmeDia.textContent = filmeDia.overview;



        divFilmeDia.addEventListener("click", () => {
            videoYoutube.src = `https://www.youtube.com/embed/${videoFilme.results[0].key}?autoplay=1&mute=1`
            setTimeout(() => {
                videoYoutube.classList.remove('hidden');
                divFilmeDia.classList.add("hidden");
            }, 200)

        });
        /*   const linkFilmeDia = document.querySelector(".highlight__video-link");
          linkFilmeDia.href = `https://www.youtube.com/watch?v=${videoFilme.results[0].key}` */
    } catch (error) {
        alert(`500 Internal Server Error
        ${error}`);
    }
}
requisitarFilmeDia();

async function requisitarFilmeModal(idFilme, modal) {
    try {
        const promesaFilmeModal = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idFilme}?language=pt-BR`);

        const filmeModal = await promesaFilmeModal.json();

        const promesaLinkVideoModal = await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idFilme}/videos?language=pt-BR`);

        const linkVideoModal = await promesaLinkVideoModal.json();

        divFilmeDia.classList.remove("hidden");
        videoYoutube.classList.add('hidden');
        requisitarFilmeDia();

        const imagem = document.querySelector(".highlight__videoYoutubeModal");

        imagemFilme = document.querySelector(".modal__img")
        imagemFilme.src = filmeModal.backdrop_path;
        imagemFilme.classList.remove("hidden")
        play.classList.remove("hidden");
        imagem.classList.add("hidden");
        if (linkVideoModal.results.length > 0) {

            imagem.src = `https://www.youtube.com/embed/${linkVideoModal.results[0].key}?autoplay=1&mute=1`
        } else {
            imagem.src = "";
        }
        const generosAnteriores = document.querySelectorAll(".modal__genre");
        generosAnteriores.forEach((genero) => { genero.remove(); });

        const titulo = document.querySelector(".modal__title");
        titulo.textContent = filmeModal.title;

        const descricao = document.querySelector(".modal__description");
        descricao.textContent = filmeModal.overview;

        const avaliacao = document.querySelector(".modal__average");
        avaliacao.textContent = filmeModal.vote_average.toFixed(1);

        const generos = document.querySelector(".modal__genres");

        filmeModal.genres.forEach((genero) => {
            const generoFilme = document.createElement("span");
            generoFilme.classList.add("modal__genre");
            generoFilme.textContent = genero.name;
            generos.append(generoFilme);
        });
        modal.classList.remove("hidden");
    } catch (error) {
        alert(`500 Internal Server Error
        ${error}`);
    }
}
function criarElementos(element) {
    const divFilme = document.createElement("div");
    divFilme.classList.add("movie");
    divFilme.style.backgroundImage = `url(${element.poster_path})`;

    const divInformacoes = document.createElement("div");
    divInformacoes.classList.add("movie__info");

    const spanTitulo = document.createElement("span");
    spanTitulo.classList.add("movie__title");
    spanTitulo.textContent = element.title;

    const spanAvaliacao = document.createElement("span");
    spanAvaliacao.classList.add("movie__rating");
    spanAvaliacao.textContent = element.vote_average;

    const imagemEstrela = document.createElement("img");
    imagemEstrela.src = "./assets/estrela.svg";
    imagemEstrela.alt = "Estrela";

    const id = document.createElement("span");
    id.textContent = element.id;
    id.classList.add("hidden");
    id.classList.add("id__filme");

    spanAvaliacao.append(id);
    spanAvaliacao.append(imagemEstrela);
    divInformacoes.append(spanTitulo, spanAvaliacao);
    divFilme.append(divInformacoes);
    divTodosFilmes.append(divFilme);

    divFilme.addEventListener("click", (event) => {
        const filmeclicado = event.target;
        const id = filmeclicado.querySelector(".id__filme");
        requisitarFilmeModal(id.textContent, modal);
    });
}
function codigoDOM() {
    filmesTotal.pagina1.forEach((filme) => {
        criarElementos(filme);
    });
    pesquisarFilme.addEventListener("keyup", (event) => {
        if (event.key !== "Enter") { return }
        if (pesquisarFilme.value === "") {
            contador = 0;
            trocarfilmes(contador);
            return
        }
        pesquisarFilme.value = pesquisarFilme.value.trim();

        if (!pesquisarFilme.value) {
            filmesTotal = { pagina1: [], pagina2: [], pagina3: [], pagina4: [] }
            let filmes = document.querySelectorAll(".movie");
            filmes.forEach((filme) => { filme.remove(); });
            fazerRequisicao();
            return
        }
        let filme = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query=${pesquisarFilme.value}**`
        requisitarFilmePesquisado(filme);
        pesquisarFilme.value = "";
    });

    async function requisitarFilmePesquisado(filme) {
        try {
            const promesaFilme = await fetch(filme);
            let respostaFilme = await promesaFilme.json();

            if (respostaFilme.results.length < 1) { return }

            const divFilmes = document.querySelectorAll(".movie");
            respostaFilme.results = respostaFilme.results.filter((elemento) => {
                return elemento.backdrop_path != null || elemento.poster_path != null;
            });

            divFilmes.forEach((filme) => {
                filme.remove();
            });
            for (i = 0; i < 5; i++) {
                if (respostaFilme.results.length > i) {
                    criarElementos(respostaFilme.results[i]);
                }
            }
            filmesTotal = { pagina1: [], pagina2: [], pagina3: [], pagina4: [] }
            dividirPaginas(respostaFilme);
            contador = 0
            trocarfilmes(contador);
        } catch (error) {
            alert(`500 Internal Server Error
        ${error}`);
        }
    }
}
const botaoProximo = document.querySelector(".btn-next");
const botaoAnterior = document.querySelector(".btn-prev");

botaoProximo.addEventListener("click", proximoFilmes);
botaoAnterior.addEventListener("click", anterioresFilmes);

function proximoFilmes() {
    if (contador < numeroPaginas) {
        contador++
    } else {
        contador = 0
    }
    trocarfilmes(contador);
}
function anterioresFilmes() {
    if (contador > 0) {
        contador--
    } else {
        contador = numeroPaginas
    }
    trocarfilmes(contador);
}
filmeDiaDiv.addEventListener("click", () => {
    requisitarFilmeModal(436969, modal);
});
modal.addEventListener("click", () => {
    modal.classList.add("hidden");

    const imagem = document.querySelector(".highlight__videoYoutubeModal");
    imagem.src = "";

});


const imagemYoutube = document.querySelector(".highlight__videoYoutubeModal");

play.addEventListener("click", (event) => {
    event.stopPropagation();
    trocarImagemVideo();
});
imagemFilmeMoodal.addEventListener("click", (event) => {
    event.stopPropagation();
    trocarImagemVideo();
});


function trocarImagemVideo() {
    if (imagemYoutube.classList.contains("hidden")) {
        imagemYoutube.classList.remove("hidden")
        play.classList.add("hidden");
        imagemFilmeMoodal.classList.add("hidden")
    } else {
        imagemYoutube.classList.add("hidden")
        play.classList.remove("hidden");
        imagemFilmeMoodal.classList.remove("hidden")

    }

}

function trocarfilmes(contador) {
    let filmesListados = document.querySelectorAll(".movie");
    let pagina = listarApagina(contador);

    filmesListados.forEach((filme, index) => {
        if (!pagina[index]) { return }
        filme.style.backgroundImage = `url(${pagina[index].poster_path})`
        const titulo = filme.querySelector(".movie__title");
        titulo.textContent = pagina[index].title

        const avaliacao = filme.querySelector(".movie__rating");

        const imagemEstrela = avaliacao.querySelector("img");
        imagemEstrela.src = "./assets/estrela.svg";
        imagemEstrela.alt = "Estrela";

        const id = avaliacao.querySelector("span");
        id.textContent = pagina[index].id
        avaliacao.textContent = `${pagina[index].vote_average}`;
        avaliacao.append(id, imagemEstrela);
    });
}

function dividirPaginas(filmes) {
    if (filmes.results.length > 5) { numeroPaginas = 1; }
    if (filmes.results.length > 10) { numeroPaginas = 2; }
    if (filmes.results.length > 15) { numeroPaginas = 3; }

    for (i = 0; i < filmes.results.length; i++) {
        for (j = 0; j < 5; j++) {
            filmesTotal.pagina1.push(filmes.results.shift());
        }
        for (j = 0; j < 5; j++) {
            filmesTotal.pagina2.push(filmes.results.shift());
            if (filmes.results.length === 0) { return }
        }
        for (j = 0; j < 5; j++) {
            filmesTotal.pagina3.push(filmes.results.shift());
            if (filmes.results.length === 0) { return }
        }
        for (j = 0; j < 5; j++) {
            filmesTotal.pagina4.push(filmes.results.shift());
            if (filmes.results.length === 0) { return }
        }
    }
}
function listarApagina(contador) {
    if (contador === 0) { return filmesTotal.pagina1 }
    if (contador === 1) { return filmesTotal.pagina2 }
    if (contador === 2) { return filmesTotal.pagina3 }
    if (contador === 3) { return filmesTotal.pagina4 }
}

