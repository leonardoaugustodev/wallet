export const state = () => ({
    wallet: [],
    lastRefresh: new Date().toLocaleTimeString()
})

export const getters = {
    getTotalByFieldName: (state) => (fieldName) => {
        return state.wallet.reduce((acc, cv) => {
            return acc + parseFloat(cv[fieldName])
        }, 0)
    }
}

export const mutations = {
    updateWallet(state, wallet){
        state.wallet = wallet
    },
    updateLastRefresh(state) {
        state.lastRefresh = new Date().toLocaleTimeString()
    }
}

export const actions = {
    async index({ commit, dispatch, rootState, rootGetters }) {
        try {

            const wallet = [];

            const entries = rootState.entries.entries || [];
            if(!entries || !entries.length) return;

            const stockTickers = rootGetters['entries/getStocksCodeByType']('Stock');
            const internationalTickers = rootGetters['entries/getStocksCodeByType']('International');
            const realStateTickers = rootGetters['entries/getStocksCodeByType']('Real State');
            const tickersData = await this.$brapi.getQuotes([...stockTickers, ...internationalTickers, ...realStateTickers].join('%2C'))

            const summary = rootGetters['entries/getTotalsByStock'];

            // MERGE WITH SERVER DATA
            for (const tickerCode in summary) {
                const entry = summary[tickerCode];

                if(entry?.quantity <= 0) continue;

                const serverTicker = tickersData.results.find(t => t.symbol === tickerCode);

                entry.todayTotal = (serverTicker ? serverTicker.regularMarketPrice : 1) * entry?.quantity;
                entry.todayValue = serverTicker ? serverTicker.regularMarketPrice : 1;

                const profit = (entry?.todayTotal || 0) - (entry?.total || 0);
                const incomes = rootGetters['incomes/getAmountByTicker'](tickerCode);

                wallet.push(
                    {
                        'ticker': {
                            code: tickerCode,
                            name: entry.ticker.name,
                            group: entry.ticker.group
                        },
                        quantity: entry?.quantity || 0,
                        todayValue: entry?.todayValue,
                        paidValue: entry?.price,
                        paidTotal: entry?.total,
                        todayTotal: entry?.todayTotal,
                        profit,
                        profitPercentage: profit / (entry?.total || 1),
                        incomes,
                        profitPlusIncome: profit + incomes,
                        profitPlusIncomePercentage: (profit + incomes) / (entry?.total || 1),
                        position: 0
                    }
                )
            }

            commit('updateWallet', wallet);
            commit('updateLastRefresh');
            commit('snackbar/showMessage', {content: 'Wallet refresh!', color: 'success'}, {root: true})
            dispatch('calculatePosition');
        }
        catch (err) {
            console.log(err);
        }
    },
    calculatePosition({state, commit, getters}) {
        const total = (getters.getTotalByFieldName('todayTotal') || 1);
        const wallet = state.wallet.map(w => {
            return {
                ...w,
                position: w?.todayTotal / total
            }
        });

        commit('updateWallet', wallet);
    }

}
