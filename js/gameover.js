"use strict";

const mensagemGameover   = document.querySelector("#mensagem-gameover");
const btnTentarNovamente = document.querySelector("#btnTentarNovamente");
const btnLogout          = document.querySelector("#btnLogout");

const sessao = Auth.getSessao();
mensagemGameover.textContent = `${sessao.nome}, você foi derrotado em batalha...`;

btnTentarNovamente.addEventListener("click", function() {
    localStorage.removeItem("estadoJogo");
    localStorage.removeItem("faseAtual");
    window.location.href = "equipamento.html";
});

btnLogout.addEventListener("click", function() {
    localStorage.removeItem("estadoJogo");
    localStorage.removeItem("faseAtual");
    Auth.logout();
});