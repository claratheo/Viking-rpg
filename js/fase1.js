"use strict";


const textoDialogo      = document.querySelector("#texto-dialogo");
const vidaFillJogador   = document.querySelector("#vida-fill-jogador");
const vidaFillInimigo   = document.querySelector("#vida-fill-inimigo");
const textoVidaJogador  = document.querySelector("#texto-vida-jogador");
const textoVidaInimigo  = document.querySelector("#texto-vida-inimigo");
const spriteJogador     = document.querySelector("#sprite-jogador");
const spriteInimigo     = document.querySelector("#sprite-inimigo");
const btnAtacar         = document.querySelector("#btnAtacar");
const btnDefender       = document.querySelector("#btnDefender");
const btnFugir          = document.querySelector("#btnFugir");
const telaJogo          = document.querySelector("#tela-jogo");


function setDialogo(texto) {
    textoDialogo.innerHTML = texto + '<span id="cursor-dialogo"></span>';
}

function atualizarVida(quem, atual, max) {
    const pct = Math.max(0, (atual / max) * 100);
    document.querySelector(`#vida-fill-${quem}`).style.width = pct + "%";
    document.querySelector(`#texto-vida-${quem}`).textContent =
        `${Math.max(0, atual)} / ${max}`;
}

function mostrarDano(x, y, valor) {
    const el = document.createElement("div");
    el.className = "dano-flutuante";
    el.textContent = `-${valor}`;
    el.style.left = x + "px";
    el.style.top  = y + "px";
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


btnAtacar.addEventListener("click", function() {
  
    setDialogo("Astrid avança com seu machado!");
    animarDano("sprite-inimigo");
    mostrarDano(580, 120, 8);
    atualizarVida("inimigo", 22, 30);
});

btnDefender.addEventListener("click", function() {
    setDialogo("Astrid levanta a guarda! Defesa aumentada por 1 turno.");
});

btnFugir.addEventListener("click", function() {
    setDialogo("Astrid tenta fugir...");
    animarDano("sprite-jogador");
    mostrarDano(160, 120, 10);
    atualizarVida("jogador", 80, 100);
});