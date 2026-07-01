"use strict";

const inputNome = document.querySelector ("#nome");
const inputEmail = document.querySelector ("#email");
const inputSenha = document.querySelector ("#senha");
const btnCadastrar = document.querySelector ("#btnCadastrar");
const mensagem = document.querySelector ("#mensagem");

btnCadastrar.addEventListener("click", function(event) {
    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

    if (nome === "" || email === "" || senha === "") {

        alert("POr favor, preencha todos os campos.");
        return;
    }

    const resultado = Auth.cadastrar(nome, email, senha);
    mensagem.textContent = resultado.mensagem;
    mensagem.className = resultado.sucesso ? "mensagem sucesso" : "mensagem erro";

    if (resultado.sucesso) {

        setTimeout(function() {
            window.location.href = "login.html";
        }, 1500);

    }
});

