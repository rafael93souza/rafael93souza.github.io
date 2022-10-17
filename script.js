const body = document.querySelector("body");
const temaSite = document.querySelector(".btn-theme");
const resgatarTema = localStorage.getItem("tema");
const mudarTema = resgatarTema ? temaFundo(resgatarTema) : '';

temaSite.addEventListener("click", () => {
    const tema = body.style.getPropertyValue('--background-color') === '#242424' ? 'claro' : 'escuro';
    temaFundo(tema)
    localStorage.setItem("tema", resgatarTema === 'escuro' ? 'claro' : 'escuro');
});

/*--------FUNÇÃO PARA TROCAR O TEMA DO SITE---------- */
function temaFundo(tema) {
    let corFundo = body.style.getPropertyValue('--background-color');
    let corTexto = body.style.getPropertyValue('--color');
    let corFilmeDia = body.style.getPropertyValue('--highlight-background');
    let corTextoFilmeDia = body.style.getPropertyValue('--highlight-color');
    let corDescricaoFilmeDia = body.style.getPropertyValue('--highlight-description');
    let corBordaPesquisar = body.style.getPropertyValue('  --input-border-color');
    let corSombra = body.style.getPropertyValue('--shadow-color');
    let setaEsquerda = document.querySelector(".btn-prev");
    let setaDireita = document.querySelector(".btn-next");

    if (tema === 'escuro') {
        corFundo = '#242424';
        corTexto = '#fff';
        corFilmeDia = '#454545';
        corTextoFilmeDia = 'rgba(255, 255, 255, 0.7)';
        corDescricaoFilmeDia = '#FFFFFF';
        corBordaPesquisar = '#FFFFFF';
        corSombra = ' 0px 4px 8px rgba(255, 255, 255, 0.15)'
        setaDireita.src = './assets/seta-direita-branca.svg';
        setaEsquerda.src = './assets/seta-esquerda-branca.svg'
        temaSite.src = './assets/dark-mode.svg';
    } else {
        corFundo = '#fff';
        corTexto = '#000';
        corFilmeDia = '#FFFFFF'
        corTextoFilmeDia = ' rgba(0, 0, 0, 0.7)';
        corDescricaoFilmeDia = '#000000';
        corBordaPesquisar = '#979797';
        corSombra = ' 0px 4px 8px rgba(0, 0, 0, 0.15)'
        setaDireita.src = './assets/seta-direita-preta.svg';
        setaEsquerda.src = './assets/seta-esquerda-preta.svg'
        temaSite.src = './assets/light-mode.svg'
    }
    body.style.setProperty("--background-color", corFundo);
    body.style.setProperty('--color', corTexto);
    body.style.setProperty('--highlight-background', corFilmeDia);
    body.style.setProperty('--highlight-color', corTextoFilmeDia);
    body.style.setProperty('--highlight-description', corDescricaoFilmeDia);
    body.style.setProperty('--input-border-color', corBordaPesquisar);
    body.style.setProperty('--shadow-color', corSombra);
}