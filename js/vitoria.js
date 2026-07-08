"use strict";

const mensagemVitoria    = document.querySelector("#mensagem-vitoria");
const btnJogarNovamente  = document.querySelector("#btnJogarNovamente");
const btnLogout          = document.querySelector("#btnLogout");

const sessao = Auth.getSessao();
mensagemVitoria.textContent = `Parabéns, ${sessao.nome}! Você derrotou o Chefe Comandante!`;

btnJogarNovamente.addEventListener("click", function() {
    localStorage.removeItem("estadoJogo");
    localStorage.removeItem("faseAtual");
    window.location.href = "equipamento.html";
});

btnLogout.addEventListener("click", function() {
    localStorage.removeItem("estadoJogo");
    localStorage.removeItem("faseAtual");
    Auth.logout();
});