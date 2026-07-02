"use strict";

const pontosDisponiveis = document.querySelector("#pontos-disponiveis");
const gradeArmas        = document.querySelector("#grade-armas");
const gradeArmaduras    = document.querySelector("#grade-armaduras");
const textoResumo       = document.querySelector("#texto-resumo");
const btnConfirmar      = document.querySelector("#btnConfirmar");

let armaSelecionada     = null;
let armaduraSelecionada = null;

// ── RENDERIZA OS CARDS ──
function renderizarCards(catalogo, container, tipo) {
    Object.entries(catalogo).forEach(function([id, item]) {
        const card = document.createElement("div");
        card.className = "card-equipamento";
        card.dataset.id = id;
        card.dataset.tipo = tipo;

        const stat = tipo === "arma"
            ? `⚔ Dano: ${item.dano}`
            : `🛡 Defesa: ${item.defesa}`;

        card.innerHTML = `
            <p class="card-nome">${item.nome}</p>
            <p class="card-stat">${stat}</p>
            <p class="card-custo">💰 Custo: ${item.custo} pts</p>
            <button class="btn-acao btn-selecionar">Escolher</button>
        `;

        card.querySelector(".btn-selecionar").addEventListener("click", function() {
            selecionarEquipamento(tipo, id, item, card, container);
        });

        container.appendChild(card);
    });
}

function selecionarEquipamento(tipo, id, item, cardClicado, container) {
    // verifica se tem pontos suficientes
    const outroCusto = tipo === "arma"
        ? (armaduraSelecionada?.custo || 0)
        : (armaSelecionada?.custo || 0);

    const custoAnterior = tipo === "arma"
        ? (armaSelecionada?.custo || 0)
        : (armaduraSelecionada?.custo || 0);

    const pontosUsados = outroCusto + item.custo - custoAnterior;

    if (pontosUsados > jogador.pontos) {
        textoResumo.textContent = "Pontos insuficientes para essa escolha!";
        textoResumo.style.color = "#ff6b6b";
        return;
    }

    // remove seleção anterior
    container.querySelectorAll(".card-equipamento").forEach(function(c) {
        c.classList.remove("selecionado");
    });

    cardClicado.classList.add("selecionado");

    if (tipo === "arma") {
        armaSelecionada = item;
    } else {
        armaduraSelecionada = item;
    }

    atualizarResumo();
}

function atualizarResumo() {
    const custoTotal = (armaSelecionada?.custo || 0) + (armaduraSelecionada?.custo || 0);
    const pontosRestantes = jogador.pontos - custoTotal;

    let resumo = "";
    if (armaSelecionada)     resumo += `Arma: ${armaSelecionada.nome} | `;
    if (armaduraSelecionada) resumo += `Armadura: ${armaduraSelecionada.nome} | `;
    if (resumo)              resumo += `Pontos restantes: ${pontosRestantes}`;

    textoResumo.textContent = resumo || "Nenhum equipamento selecionado ainda.";
    textoResumo.style.color = "#e8dcc8";

    btnConfirmar.disabled = !(armaSelecionada && armaduraSelecionada);
}

// ── CONFIRMAR E IR PARA A FASE 1 ──
btnConfirmar.addEventListener("click", function() {
    jogador.arma     = armaSelecionada;
    jogador.armadura = armaduraSelecionada;
    jogador.pontos  -= (armaSelecionada.custo + armaduraSelecionada.custo);
    salvarEstado();
    window.location.href = "fase1.html";
});

// ── INICIALIZAÇÃO ──
(function init() {
    carregarEstado();
    pontosDisponiveis.textContent = jogador.pontos;
    renderizarCards(armas, gradeArmas, "arma");
    renderizarCards(armaduras, gradeArmaduras, "armadura");
})();