"use strict";

// ── ESTADO DO JOGADOR ──
const jogador = {
    nome: "",
    pontos: 10,
    vida: 100,
    vidaMaxima: 100,
    arma:     { nome: "", custo: 0, dano: 0 },
    armadura: { nome: "", custo: 0, defesa: 0 },
};

// ── CATÁLOGOS ──
const armas = {
    1: { nome: "Espada",      custo: 5, dano: 8  },
    2: { nome: "Arco e flecha", custo: 7, dano: 16 },
    3: { nome: "Adaga",       custo: 3, dano: 4  },
};

const armaduras = {
    1: { nome: "Armadura de couro", custo: 2, defesa: 2 },
    2: { nome: "Armadura de ferro", custo: 4, defesa: 4 },
    3: { nome: "Armadura de aço",   custo: 6, defesa: 6 },
};

// ── CONFIGURAÇÃO DAS FASES ──
const fases = [
    {
        nome: "Bandidos",
        introducao: "Você está caminhando pela floresta quando de repente é atacado por um grupo de bandidos!",
        inimigo: { vida: 30, dano: 10, defesa: 2 },
        recompensa: 24,
        fuga: { tentativas: 1, chanceSucesso: 0.5 },
        ataqueEspecial: null,
        inimigoCritico: null,
    },
    {
        nome: "Espião",
        introducao: "Durante sua vigia na floresta, você se encontra com um guerreiro espião de outra vila!",
        inimigo: { vida: 60, dano: 12, defesa: 4 },
        recompensa: 30,
        fuga: { tentativas: 2, chanceSucesso: 0.5 },
        ataqueEspecial: { tipo: "furtivo", bonusPercentual: 0.3 },
        inimigoCritico: null,
    },
    {
        nome: "Chefe Comandante",
        introducao: "O Chefe Comandante surge diante de você prestes a incitar uma guerra contra sua vila!",
        inimigo: { vida: 120, dano: 18, defesa: 6 },
        recompensa: 0,
        fuga: { tentativas: 1, chanceSucesso: 0.1 },
        ataqueEspecial: { tipo: "furia", bonusPercentual: 0.5 },
        inimigoCritico: { chanceAcimaDe: 75, multiplicador: 2 },
    },
];

// ── ESTADO DA BATALHA ATUAL ──
// Fica aqui para fase1.js, fase2.js e fase3.js acessarem
let inimigoBatalha = null;
let defesaInimigoTurno = 0;
let defesaJogadorTurno = 0;
let tentativasFugaRestantes = 0;

// ── INICIAR BATALHA ──
// Chamado pelo faseX.js ao carregar a página
function iniciarBatalha(indiceFase) {
    const fase = fases[indiceFase];
    inimigoBatalha = { ...fase.inimigo }; // cópia para não mutar a config
    defesaInimigoTurno = 0;
    defesaJogadorTurno = 0;
    tentativasFugaRestantes = fase.fuga.tentativas;
    return {
        introducao: fase.introducao,
        nomeInimigo: fase.nome,
        vidaInimigo: inimigoBatalha.vida,
        vidaJogador: jogador.vida,
        vidaMaximaJogador: jogador.vidaMaxima,
    };
}

// ── AÇÃO: ATACAR ──
// Retorna um objeto descrevendo o que aconteceu — faseX.js decide como mostrar
function atacar(indiceFase) {
    const fase = fases[indiceFase];
    let dano = jogador.arma.dano;
    let mensagemAtaque = `Você ataca com ${jogador.arma.nome}`;

    if (fase.ataqueEspecial?.tipo === "furtivo") {
        dano += Math.floor(dano * fase.ataqueEspecial.bonusPercentual);
        mensagemAtaque = `Ataque furtivo com ${jogador.arma.nome}`;
    } else if (fase.ataqueEspecial?.tipo === "furia") {
        dano += Math.floor(dano * fase.ataqueEspecial.bonusPercentual);
        mensagemAtaque = `Em fúria, você golpeia com ${jogador.arma.nome}`;
    }

    const danoFinal = Math.max(0, dano - (inimigoBatalha.defesa + defesaInimigoTurno));
    inimigoBatalha.vida -= danoFinal;
    defesaInimigoTurno = 0; // reseta defesa do inimigo após turno

    return {
        dano: danoFinal,
        mensagem: `${mensagemAtaque} e causa ${danoFinal} de dano!`,
        vidaInimigo: Math.max(0, inimigoBatalha.vida),
        inimigoDerrotado: inimigoBatalha.vida <= 0,
    };
}

// ── AÇÃO: DEFENDER ──
function defender() {
    defesaJogadorTurno = 2;
    return {
        mensagem: "Você levanta a guarda! Sua defesa aumentou por 1 turno.",
    };
}

// ── AÇÃO: FUGIR ──
function tentarFugir(indiceFase) {
    const fase = fases[indiceFase];
    const sucesso = Math.random() < fase.fuga.chanceSucesso;
    tentativasFugaRestantes--;

    if (sucesso) {
        return { fugiu: true, mensagem: "Você conseguiu fugir!" };
    }

    if (tentativasFugaRestantes > 0) {
        return { fugiu: false, tentativasRestantes: tentativasFugaRestantes, mensagem: "Você quase conseguiu! Mais uma tentativa..." };
    }

    return { fugiu: false, tentativasRestantes: 0, mensagem: "Você falhou em fugir! Prepare-se." };
}

// ── TURNO DO INIMIGO ──
// Chamado pelo faseX.js após cada ação do jogador
function turnoInimigo(indiceFase) {
    const fase = fases[indiceFase];
    const rolagem = Math.floor(Math.random() * 100);

    // reseta defesa do jogador após o turno
    const defesaAtual = defesaJogadorTurno;
    defesaJogadorTurno = 0;

    // crítico (só chefe)
    if (fase.inimigoCritico && rolagem > fase.inimigoCritico.chanceAcimaDe) {
        const dano = Math.max(0, inimigoBatalha.dano * fase.inimigoCritico.multiplicador - (jogador.armadura.defesa + defesaAtual));
        jogador.vida -= dano;
        return {
            tipo: "critico",
            dano,
            mensagem: `ATAQUE CRÍTICO! Você sofreu ${dano} de dano!`,
            vidaJogador: Math.max(0, jogador.vida),
            jogadorDerrotado: jogador.vida <= 0,
        };
    }

    if (rolagem <= 30) {
        return {
            tipo: "errou",
            dano: 0,
            mensagem: "O inimigo erra o ataque!",
            vidaJogador: jogador.vida,
            jogadorDerrotado: false,
        };
    }

    if (rolagem <= 70) {
        const dano = Math.max(0, inimigoBatalha.dano - (jogador.armadura.defesa + defesaAtual));
        jogador.vida -= dano;
        return {
            tipo: "acertou",
            dano,
            mensagem: `O inimigo te ataca e causa ${dano} de dano!`,
            vidaJogador: Math.max(0, jogador.vida),
            jogadorDerrotado: jogador.vida <= 0,
        };
    }

    // inimigo defende
    defesaInimigoTurno = 2;
    return {
        tipo: "defendeu",
        dano: 0,
        mensagem: "O inimigo se prepara para defender!",
        vidaJogador: jogador.vida,
        jogadorDerrotado: false,
    };
}

// ── SALVAR E CARREGAR ESTADO NO LOCALSTORAGE ──
// Necessário para passar o estado do jogador entre as fases
function salvarEstado() {
    localStorage.setItem("estadoJogo", JSON.stringify(jogador));
}

function carregarEstado() {
    const salvo = localStorage.getItem("estadoJogo");
    if (salvo) {
        const dados = JSON.parse(salvo);
        Object.assign(jogador, dados);
    }
}