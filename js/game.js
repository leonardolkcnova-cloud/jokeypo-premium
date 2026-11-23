
/* =========================================
   JOKEYPO - GAME ENGINE
   ARQUIVO: game.js
========================================= */

window.JokeyGame = window.JokeyGame || {};

// Opções disponíveis
JokeyGame.choices = ['rock', 'paper', 'scissors'];

// Emojis das jogadas
JokeyGame.emojis = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

// Histórico das escolhas do jogador nesta partida
JokeyGame.playerMoves = [];

// Escolha aleatória
JokeyGame.randomChoice = function () {
    const randomIndex = Math.floor(
        Math.random() * this.choices.length
    );

    return this.choices[randomIndex];
};

// Identifica o vencedor de uma rodada
JokeyGame.getWinner = function (human, machine) {

    if (human === machine) {
        return 'draw';
    }

    const humanWins =
        (human === 'rock' && machine === 'scissors') ||
        (human === 'paper' && machine === 'rock') ||
        (human === 'scissors' && machine === 'paper');

    return humanWins ? 'human' : 'machine';
};

// Descobre qual jogada vence uma escolha
JokeyGame.getCounterMove = function (choice) {

    const counters = {
        rock: 'paper',
        paper: 'scissors',
        scissors: 'rock'
    };

    return counters[choice];
};

// Identifica a escolha mais frequente
JokeyGame.getMostFrequentMove = function (moves) {

    if (moves.length === 0) {
        return this.randomChoice();
    }

    const frequency = {
        rock: 0,
        paper: 0,
        scissors: 0
    };

    moves.forEach(move => {
        frequency[move]++;
    });

    return Object.keys(frequency).reduce((previous, current) => {
        return frequency[current] > frequency[previous]
            ? current
            : previous;
    });
};

// Dificuldade fácil
JokeyGame.easyMode = function () {
    return this.randomChoice();
};

// Dificuldade média
JokeyGame.mediumMode = function () {

    if (this.playerMoves.length < 2) {
        return this.randomChoice();
    }

    const predictedMove = this.getMostFrequentMove(
        this.playerMoves
    );

    return this.getCounterMove(predictedMove);
};

// Dificuldade difícil
JokeyGame.hardMode = function () {

    if (this.playerMoves.length < 2) {
        return this.randomChoice();
    }

    // Analisa as últimas cinco jogadas
    const recentMoves = this.playerMoves.slice(-5);

    const frequency = {
        rock: 0,
        paper: 0,
        scissors: 0
    };

    recentMoves.forEach((move, index) => {
        // Jogadas recentes possuem maior peso
        frequency[move] += index + 1;
    });

    const predictedMove = Object.keys(frequency).reduce(
        (previous, current) => {
            return frequency[current] > frequency[previous]
                ? current
                : previous;
        }
    );

    return this.getCounterMove(predictedMove);
};

// Escolha da máquina conforme dificuldade
JokeyGame.playMachine = function (difficulty) {

    switch (difficulty) {

        case 'easy':
            return this.easyMode();

        case 'medium':
            return this.mediumMode();

        case 'hard':
            return this.hardMode();

        default:
            return this.randomChoice();
    }
};

// Registra a escolha do jogador
JokeyGame.registerPlayerMove = function (choice) {

    this.playerMoves.push(choice);

};
