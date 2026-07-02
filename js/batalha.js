"use strict";

const indiceFase = Number(document.body.dataset.fase);
const fase = fases[indiceFase];


const textoDialogo     = document.querySelector("#texto-dialogo");
const vidaFillJogador  = document.querySelector("#vida-fill-jogador");
const vidaFillInimigo  = document.querySelector("#vida-fill-inimigo");
const textoVidaJogador = document.querySelector("#texto-vida-jogador");
const textoVidaInimigo = document.querySelector("#texto-vida-inimigo");
const spriteJogador    = document.querySelector("#sprite-jogador");
const spriteInimigo    = document.querySelector("#sprite-inimigo");
const nomeInimigoHud   = document.querySelector("#nome-inimigo");
const btnAtacar        = document.querySelector("#btnAtacar");
const btnDefender      = document.querySelector("#btnDefender");
const btnFugir         = document.querySelector("#btnFugir");
const telaJogo         = document.querySelector("#tela-jogo");


function setDialogo(texto) {
    textoDialogo.innerHTML = texto + '<span id="cursor-dialogo"></span>';
}

function atualizarVidaJogador() {
    const pct = Math.max(0, (jogador.vida / jogador.vidaMaxima) * 100);
    vidaFillJogador.style.width = pct + "%";
    textoVidaJogador.textContent = `${Math.max(0, jogador.vida)} / ${jogador.vidaMaxima}`;
}

function atualizarVidaInimigo(vidaAtual, vidaMax) {
    const pct = Math.max(0, (vidaAtual / vidaMax) * 100);
    vidaFillInimigo.style.width = pct + "%";
    textoVidaInimigo.textContent = `${Math.max(0, vidaAtual)} / ${vidaMax}`;
}

function mostrarDano(lado, valor) {
    const el = document.createElement("div");
    el.className = "dano-flutuante";
    el.textContent = `-${valor}`;
    el.style.left = lado === "inimigo" ? "580px" : "120px";
    el.style.top  = "120px";
    telaJogo.appendChild(el);
    setTimeout(function() { el.remove(); }, 1000);
}

function animarDano(spriteId) {
    const el = document.querySelector(`#${spriteId}`);
    el.classList.remove("animacao-dano");
    void el.offsetWidth;
    el.classList.add("animacao-dano");
}

function desabilitarBotoes() {
    btnAtacar.disabled  = true;
    btnDefender.disabled = true;
    btnFugir.disabled   = true;
}

function habilitarBotoes() {
    btnAtacar.disabled  = false;
    btnDefender.disabled = false;
    btnFugir.disabled   = false;
}


function configurarBotaoAtaque() {
    if (fase.ataqueEspecial?.tipo === "furtivo") {
        btnAtacar.textContent = "⚔ Ataque Furtivo";
    } else if (fase.ataqueEspecial?.tipo === "furia") {
        btnAtacar.textContent = "⚔ Atacar em Fúria";
    } else {
        btnAtacar.textContent = "⚔ Atacar";
    }
}


function encerrarVitoria() {
    desabilitarBotoes();
    jogador.pontos += fase.recompensa;
    salvarEstado();

    const ultimaFase = indiceFase === fases.length - 1;
    setTimeout(function() {
        window.location.href = ultimaFase ? "vitoria.html" : "upgrade.html";
    }, 1500);
}

function encerrarDerrota() {
    desabilitarBotoes();
    salvarEstado();
    setTimeout(function() {
        window.location.href = "gameover.html";
    }, 1500);
}

function executarTurnoInimigo() {
    desabilitarBotoes();

    setTimeout(function() {
        const resultado = turnoInimigo(indiceFase);

        if (resultado.dano > 0) {
            animarDano("sprite-jogador");
            mostrarDano("jogador", resultado.dano);
        }

        atualizarVidaJogador();
        setDialogo(resultado.mensagem);

        if (resultado.jogadorDerrotado) {
            setTimeout(encerrarDerrota, 1200);
            return;
        }

        habilitarBotoes();
    }, 1000);
}


btnAtacar.addEventListener("click", function() {
    desabilitarBotoes();

    const resultado = atacar(indiceFase);
    animarDano("sprite-inimigo");

    if (resultado.dano > 0) mostrarDano("inimigo", resultado.dano);

    atualizarVidaInimigo(resultado.vidaInimigo, fase.inimigo.vida);
    setDialogo(resultado.mensagem);

    if (resultado.inimigoDerrotado) {
        setTimeout(encerrarVitoria, 1200);
        return;
    }

    executarTurnoInimigo();
});

btnDefender.addEventListener("click", function() {
    desabilitarBotoes();
    const resultado = defender();
    setDialogo(resultado.mensagem);
    executarTurnoInimigo();
});

btnFugir.addEventListener("click", function() {
    desabilitarBotoes();
    const resultado = tentarFugir(indiceFase);
    setDialogo(resultado.mensagem);

    if (resultado.fugiu) {
        setTimeout(function() {
            window.location.href = "gameover.html";
        }, 1500);
        return;
    }

    if (resultado.tentativasRestantes > 0) {
        habilitarBotoes();
        return;
    }

    executarTurnoInimigo();
});


(function init() {
    carregarEstado();

    const dados = iniciarBatalha(indiceFase);

    
    nomeInimigoHud.textContent = dados.nomeInimigo + " ☠";

  
    atualizarVidaJogador();
    atualizarVidaInimigo(dados.vidaInimigo, dados.vidaInimigo);

    
    configurarBotaoAtaque();

   
    setDialogo(dados.introducao);
})();