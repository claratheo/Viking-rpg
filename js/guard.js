"use strict";

( function () {
    const sessao = JSON.parse(localStorage.getItem("sessao"));
    if (!sessao) {
        window.location.href = "login.html";
    }
}) ();