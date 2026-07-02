"use strict";

const nomeJogador = document.querySelector("#nome-jogador");
const btnComecar  = document.querySelector("#btnComecar");
const btnLogout   = document.querySelector("#btnLogout");


const sessao = Auth.getSessao();
nomeJogador.textContent = sessao.nome + "!";

btnComecar.addEventListener("click", function() {
    window.location.href = "equipamento.html";
});

btnLogout.addEventListener("click", function() {
    Auth.logout();
});