
window.JokeyGame = window.JokeyGame || {};

JokeyGame.storage = {
    key: 'jokeypo_data_v1',

    defaultData() {
        return {
            matches: [],
            stats: {
                totalGames: 0,
                totalWins: 0,
                totalLosses: 0,
                totalDraws: 0,
                currentStreak: 0,
                bestStreak: 0
            }
        };
    },

    load() {
        try {
            const savedData = localStorage.getItem(this.key);

            if (!savedData) {
                return this.defaultData();
            }

            const parsedData = JSON.parse(savedData);
            const defaults = this.defaultData();

            return {
                matches: Array.isArray(parsedData.matches)
                    ? parsedData.matches.slice(0, 10)
                    : [],
                stats: {
                    ...defaults.stats,
                    ...(parsedData.stats || {})
                }
            };
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return this.defaultData();
        }
    },

    save(data) {
        try {
            localStorage.setItem(
                this.key,
                JSON.stringify(data)
            );

            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }
};
