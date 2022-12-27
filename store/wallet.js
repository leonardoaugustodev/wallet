export const state = () => ({
    wallet: [],
    lastRefresh: null,
    isLoading: false,
})

export const getters = {
    getTotalByFieldName: (state) => (fieldName) => {
        return state.wallet.reduce((acc, cv) => {
            return acc + parseFloat(cv[fieldName])
        }, 0)
    },
}

export const mutations = {
    updateWallet(state, wallet) {
        state.wallet = wallet
    },
    updateLastRefresh(state) {
        state.lastRefresh = new Date()
    },
    turnOnLoading(state) {
        state.isLoading = true
    },
    turnOffLoading(state) {
        state.isLoading = false
    },
}

export const actions = {
    async index(
        { state, commit, dispatch, rootState, rootGetters },
        { byPassLastRefresh, calculateOnDate  }
    ) {
        try {
            console.log(calculateOnDate)
            console.log(byPassLastRefresh)

            if(!calculateOnDate) calculateOnDate = new Date()

            if (!byPassLastRefresh && state.lastRefresh && new Date() - state.lastRefresh < 900000) return

            commit('turnOnLoading')
            const wallet = []

            const entries = rootState.entries.entries.filter((e) => new Date(e.date) <= new Date(calculateOnDate)) || []
            console.log(entries.length)
            if (!entries || !entries.length) return

            const tickerCodes = rootGetters['entries/getTickerCodes']
            if (!tickerCodes) return

            await dispatch('ticker/sync', null, { root: true })

            const summary = rootGetters['entries/summarizeByTicker']
            const profitSummary = await rootGetters['incomes/summarizeByTicker']

            // MERGE WITH SERVER DATA
            for (const tickerCode in summary) {
                const entry = summary[tickerCode]
                if (entry?.quantity <= 0) continue

                const existingTicker = rootGetters['ticker/getTickerByCode'](tickerCode)

                entry.currentTotal = (existingTicker?.currentPrice || 0) * entry?.quantity
                entry.currentPrice = existingTicker?.currentPrice || 0

                const profit = (entry?.currentTotal || 0) - (entry?.total || 0)
                const incomes = profitSummary[tickerCode] || 0

                wallet.push({
                    ticker: structuredClone(existingTicker),
                    quantity: entry?.quantity || 0,
                    currentPrice: entry?.currentPrice,
                    paidValue: entry?.price,
                    paidTotal: entry?.total,
                    currentTotal: entry?.currentTotal,
                    profit,
                    profitPercentage: profit / (entry?.total || 1),
                    incomes,
                    profitPlusIncome: profit + incomes,
                    profitPlusIncomePercentage: (profit + incomes) / (entry?.total || 1),
                    position: 0,
                })
            }

            commit('updateWallet', wallet)
            commit('updateLastRefresh')
            dispatch('calculatePosition')
        } catch (err) {
            console.log(err)
        } finally {
            commit('turnOffLoading')
        }
    },
    calculatePosition({ state, commit, getters }) {
        const total = getters.getTotalByFieldName('currentTotal') || 1
        const wallet = state.wallet.map((w) => {
            return {
                ...w,
                position: w?.currentTotal / total,
            }
        })

        commit('updateWallet', wallet)
    },
}
