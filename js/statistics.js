
window.JokeyGame = window.JokeyGame || {};

JokeyGame.statistics = {
    data: null,

    init() {
        this.data = JokeyGame.storage.load();

        document.addEventListener('jokey:match-finished', (event) => {
            this.recordMatch(event.detail);
        });

        document.addEventListener('jokey:clear-history', () => {
            this.clearHistory();
        });

        this.render();
        this.renderHistory();
    },

    recordMatch(match) {
        const stats = this.data.stats;

        stats.totalGames++;

        if (match.winner === 'human') {
            stats.totalWins++;
            stats.currentStreak++;
            stats.bestStreak = Math.max(
                stats.bestStreak,
                stats.currentStreak
            );
        } else if (match.winner === 'machine') {
            stats.totalLosses++;
            stats.currentStreak = 0;
        } else {
            stats.totalDraws++;
            stats.currentStreak = 0;
        }

        this.data.matches.unshift({
            ...match
        });

        this.data.matches = this.data.matches.slice(0, 10);

        JokeyGame.storage.save(this.data);

        this.render();
        this.renderHistory();
    },

    render() {
        const stats = this.data.stats;

        const winRate = stats.totalGames > 0
            ? (stats.totalWins / stats.totalGames) * 100
            : 0;

        document.querySelector('#totalGames').textContent =
            stats.totalGames;

        document.querySelector('#totalWins').textContent =
            stats.totalWins;

        document.querySelector('#totalLosses').textContent =
            stats.totalLosses;

        document.querySelector('#winRate').textContent =
            `${winRate.toFixed(1)}%`;

        document.querySelector('#bestStreak').textContent =
            stats.bestStreak;
    },

    renderHistory() {
        const historyList = document.querySelector('#historyList');

        historyList.replaceChildren();

        if (this.data.matches.length === 0) {
            const emptyMessage = document.createElement('p');

            emptyMessage.className = 'empty-history';
            emptyMessage.textContent = 'Nenhuma partida registrada ainda.';

            historyList.appendChild(emptyMessage);
            return;
        }

        this.data.matches.forEach((match) => {
            const item = document.createElement('article');
            item.className = 'history-item';

            const title = document.createElement('strong');

            if (match.winner === 'human') {
                title.textContent = '🏆 Vitória';
            } else if (match.winner === 'machine') {
                title.textContent = '🤖 Derrota';
            } else {
                title.textContent = '🤝 Empate';
            }

            const details = document.createElement('p');
            details.textContent =
                `Placar: ${match.humanScore} x ${match.machineScore}`;

            const date = document.createElement('small');
            date.textContent = new Date(match.date).toLocaleString('pt-BR');

            item.append(title, details, date);
            historyList.appendChild(item);
        });
    },

    clearHistory() {
        this.data.matches = [];

        JokeyGame.storage.save(this.data);

        this.renderHistory();
    }
};
