
/* =========================================
   JOKEYPO - SCOREBOARD
   ARQUIVO: scoreboard.js
========================================= */

window.JokeyGame = window.JokeyGame || {};

JokeyGame.state = {
    humanScore: 0,
    machineScore: 0,
    draws: 0,
    roundsPlayed: 0,
    maxRounds: 5,
    gameFinished: false
};

// Atualiza o placar na tela
JokeyGame.updateScoreboard = function () {

    document.querySelector('#score').textContent =
        this.state.humanScore;

    document.querySelector('#alexaScore').textContent =
        this.state.machineScore;

    document.querySelector('#round').textContent =
        `RODADA ${Math.min(this.state.roundsPlayed + 1, 5)} DE 5`;

};

// Registra o resultado de uma rodada
JokeyGame.registerRound = function (winner) {

    if (this.state.gameFinished) {
        return;
    }

    this.state.roundsPlayed++;

    if (winner === 'human') {
        this.state.humanScore++;
    }

    if (winner === 'machine') {
        this.state.machineScore++;
    }

    if (winner === 'draw') {
        this.state.draws++;
    }

    this.updateScoreboard();

    return this.checkGameStatus();

};

// Verifica se a partida terminou
JokeyGame.checkGameStatus = function () {

    const state = this.state;

    if (
        state.humanScore === 3 ||
        state.machineScore === 3 ||
        state.roundsPlayed >= state.maxRounds
    ) {

        state.gameFinished = true;

        if (state.humanScore > state.machineScore) {
            return 'human';
        }

        if (state.machineScore > state.humanScore) {
            return 'machine';
        }

        return 'draw';
    }

    return null;

};

// Reinicia a partida
JokeyGame.resetGame = function () {

    this.state.humanScore = 0;
    this.state.machineScore = 0;
    this.state.draws = 0;
    this.state.roundsPlayed = 0;
    this.state.gameFinished = false;

    this.playerMoves = [];

    this.updateScoreboard();

};
