"use strict";

const inputEmail = document.querySelector ("#email");
const inputSenha = document.querySelector ("#senha");
const btnLogin = document.querySelector ("#btnLogin");
const mensagem = document.querySelector ("#mensagem");

btnLogin.addEventListener("click", function(event) {
    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

    if (email === "" || senha === "") {
        mensagem.textContent = "Por favor, preencha todos os campos.";
        mensagem.className = "mensagem erro";
        return;
    }

    const resultado = Auth.login(email, senha);

    if (resultado.sucesso) {
        localStorage.removeItem("estadoJogo");
localStorage.removeItem("faseAtual");

        window.location.href = "bemvindo.html";
    } else {
        mensagem.textContent = resultado.mensagem;
        mensagem.className = "mensagem erro";
    }
});