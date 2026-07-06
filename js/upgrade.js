"use strict";

const pontosDisponiveis = document.querySelector("#pontos-disponiveis");
const gradeMelhorias    = document.querySelector("#grade-melhorias");
const textoResumo       = document.querySelector("#texto-resumo");
const btnConfirmar      = document.querySelector("#btnConfirmar");

const melhorias = [
    {
        chave: "vida",
        nome: "Poção de Vida",
        descricao: "Aumenta 20 pontos de vida",
        icone: "",
        custo: 10,
        aplicar: function() { jogador.vida += 20; jogador.vidaMaxima += 20; }
    },
    {
        chave: "arma",
        nome: "Afiar Arma",
        descricao: "Aumenta o dano em 5 pontos",
        icone: "",
        custo: 12,
        aplicar: function() { jogador.arma.dano += 5; }
    },
    {
        chave: "armadura",
        nome: "Reforçar Armadura",
        descricao: "Aumenta a defesa em 3 pontos",
        icone: "",
        custo: 12,
        aplicar: function() { jogador.armadura.defesa += 3; }
    },
];


const compras = { vida: 0, arma: 0, armadura: 0 };

function atualizarPontos() {
    pontosDisponiveis.textContent = jogador.pontos;
    textoResumo.textContent = `Pontos restantes: ${jogador.pontos}`;
}

function renderizarMelhorias() {
    gradeMelhorias.innerHTML = "";

    melhorias.forEach(function(melhoria) {
        const card = document.createElement("div");
        card.className = "card-equipamento";

        const vezesComprado = compras[melhoria.chave];

        card.innerHTML = `
            <p class="card-nome">${melhoria.icone} ${melhoria.nome}</p>
            <p class="card-stat">${melhoria.descricao}</p>
            <p class="card-custo"> Custo: ${melhoria.custo} pts</p>
            <button class="btn-acao btn-selecionar" id="btn-${melhoria.chave}">Comprar</button>
        `;

        card.querySelector(`#btn-${melhoria.chave}`).addEventListener("click", function() {
            comprarMelhoria(melhoria, card);
        });

        gradeMelhorias.appendChild(card);
    });
}

function comprarMelhoria(melhoria) {
    if (jogador.pontos < melhoria.custo) {
        textoResumo.textContent = "Pontos insuficientes!";
        textoResumo.style.color = "#ff6b6b";
        return;
    }

    jogador.pontos -= melhoria.custo;
    melhoria.aplicar();
    compras[melhoria.chave]++;
    textoResumo.style.color = "#e8dcc8";

  
    renderizarMelhorias();
    atualizarPontos();
}

btnConfirmar.addEventListener("click", function() {
    salvarEstado();

    
    const faseAtual = Number(localStorage.getItem("faseAtual") || "0");
    const proximaFase = faseAtual + 1;
    localStorage.setItem("faseAtual", proximaFase);

    window.location.href = `fase${proximaFase + 1}.html`;
});


(function init() {
    carregarEstado();
    atualizarPontos();
    renderizarMelhorias();
})();