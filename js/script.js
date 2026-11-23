/* =========================================
   JOKEYPO - MAIN CONTROLLER
   ARQUIVO: script.js
========================================= */

document.addEventListener('DOMContentLoaded', () => {

    JokeyGame.statistics.init();

    const choiceButtons = document.querySelectorAll('.choice-button');
    const result = document.querySelector('#result');

    const humanChoiceDisplay = document.querySelector('#humanChoice');
    const machineChoiceDisplay = document.querySelector('#machineChoice');

    const difficultySelect = document.querySelector('#difficulty');
    const restartButton = document.querySelector('#restartButton');
    const clearHistoryButton = document.querySelector('#clearHistory');


    function playSound(type) {
        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContext) return;

        const audio = new AudioContext();

        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        const sounds = {
            human: 600,
            machine: 220,
            draw: 400,
            match: 800
        };

        const frequency = sounds[type] || 400;

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(
            frequency,
            audio.currentTime
        );

        gain.gain.setValueAtTime(0.08, audio.currentTime);

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime + 0.2
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start();
        oscillator.stop(audio.currentTime + 0.2);

        oscillator.onended = () => {
            audio.close();
        };
    }

    function animateScore(element) {
        element.classList.remove('score-pop');

        // Reinicia a animação
        void element.offsetWidth;

        element.classList.add('score-pop');

        element.addEventListener('animationend', () => {
            element.classList.remove('score-pop');
        }, { once: true });
    }



    // Exibe as escolhas na tela
    function displayChoices(human, machine) {

        humanChoiceDisplay.textContent =
            JokeyGame.emojis[human];

        machineChoiceDisplay.textContent =
            JokeyGame.emojis[machine];

        const battleDisplay = document.querySelector('.battle-display');

        battleDisplay.classList.remove('result-animation');

        void battleDisplay.offsetWidth;

        battleDisplay.classList.add('result-animation');
    }

    // Exibe o resultado da rodada
    function displayRoundResult(winner) {

        if (winner === 'human') {
            result.textContent = '🎉 Você venceu esta rodada!';
        }

        else if (winner === 'machine') {
            result.textContent = '🤖 A máquina venceu esta rodada!';
        }

        else {
            result.textContent = '🤝 Empate! Ninguém pontuou.';
        }

        result.classList.remove('result-animation');

        void result.offsetWidth;

        result.classList.add('result-animation');
    }

    // Finaliza a partida
    function finishGame(winner) {

        choiceButtons.forEach(button => {
            button.disabled = true;
        });

        if (winner === 'human') {
            result.textContent = '🏆 PARABÉNS! VOCÊ VENCEU A PARTIDA!';
        }

        else if (winner === 'machine') {
            result.textContent = '🤖 A MÁQUINA VENCEU A PARTIDA!';
        }

        else {
            result.textContent = '🤝 A PARTIDA TERMINOU EMPATADA!';
        }

        // Comunica o resultado final aos outros módulos
        document.dispatchEvent(
            new CustomEvent('jokey:match-finished', {
                detail: {
                    winner: winner,
                    humanScore: JokeyGame.state.humanScore,
                    machineScore: JokeyGame.state.machineScore,
                    draws: JokeyGame.state.draws,
                    roundsPlayed: JokeyGame.state.roundsPlayed,
                    difficulty: difficultySelect.value,
                    date: new Date().toISOString()
                }
            })
        );

    }

    // Executa uma rodada
    function playHuman(humanChoice) {

        if (JokeyGame.state.gameFinished) {
            return;
        }

        if (!JokeyGame.choices.includes(humanChoice)) {
            return;
        }

        // A máquina escolhe antes de registrar a jogada atual
        const machineChoice = JokeyGame.playMachine(
            difficultySelect.value
        );

        // Registra a escolha do jogador
        JokeyGame.registerPlayerMove(humanChoice);

        // Identifica o vencedor da rodada
        const winner = JokeyGame.getWinner(
            humanChoice,
            machineChoice
        );

        // Mostra as escolhas
        displayChoices(humanChoice, machineChoice);

        // Atualiza a pontuação
        const matchWinner = JokeyGame.registerRound(winner);

        if (winner === 'human') {
            animateScore(document.querySelector('#score'));
        }

        if (winner === 'machine') {
            animateScore(document.querySelector('#alexaScore'));
        }

        // Mostra o resultado
        displayRoundResult(winner);
        playSound(winner);

        // Verifica o encerramento da partida
        if (matchWinner !== null) {
            finishGame(matchWinner);
            playSound('match');
        }
    

    }

    // Eventos dos botões de escolha
    choiceButtons.forEach(button => {

        button.addEventListener('click', () => {

            const choice = button.dataset.choice;

            playHuman(choice);

        });

    });

    // Reinicia a partida
    restartButton.addEventListener('click', () => {

        result.classList.remove('match-celebration');

        JokeyGame.resetGame();

        choiceButtons.forEach(button => {
            button.disabled = false;
        });

        humanChoiceDisplay.textContent = '❔';
        machineChoiceDisplay.textContent = '❔';

        result.textContent = 'Nova partida! Faça sua escolha.';

    });

    // Limpa o histórico quando o módulo estiver conectado
    clearHistoryButton.addEventListener('click', () => {

        document.dispatchEvent(
            new CustomEvent('jokey:clear-history')
        );

    });

    // Inicializa o placar
    JokeyGame.updateScoreboard();

});