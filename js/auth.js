"use strict"; 

const Auth = {
    cadastrar(nome, email, senha) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        const existente = usuarios.find(u => u.email === email);
        if (existente) {
            return { sucesso: false, mensagem: "Esse email já está cadastrado."}
        }

        usuarios.push({ nome, email, senha });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        return { sucesso: true, mensagem: "Cadastro feito com sucesso!"}
    },

    login(email, senha) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

        const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);
        if (!usuarioEncontrado) {
            return { sucesso: false, mensagem: "Email ou senha invalidos."}
        }
        localStorage.setItem("sessao", JSON.stringify({ nome: usuarioEncontrado.nome, email: usuarioEncontrado.email}));
        return { sucesso: true};
    },

    getSessao() {
        return JSON.parse(localStorage.getItem("sessao"));
    },

    logout() {
     localStorage.removeItem("sessao");
     window.location.href = "login.html"

    }

};