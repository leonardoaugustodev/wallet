export const state = () => ({
    tickers: [],
})

export const getters = {
    getTickerByCode: (state) => (tickerCode) => {
        const ticker = state.tickers.find((e) => e.code === tickerCode)
        return ticker
    },
}

export const mutations = {
    index(state, tickers) {
        state.tickers = tickers
    },
    create(state, ticker) {
        state.tickers.push(ticker)
    },
    update(state, ticker) {
        const tickerIndex = state.tickers.findIndex((e) => e._id === ticker._id)
        state.tickers.splice(tickerIndex, 1, ticker)
    },
    delete(state, id) {
        const tickerIndex = state.tickers.findIndex((e) => e._id === id)
        state.tickers.splice(tickerIndex, 1)
    },
}

export const actions = {
    async index({ commit, rootGetters }) {
        const userUID = await rootGetters['users/getUserUID']
        const ref = this.$fire.firestore.collection('tickers').where("_userUID", "==", userUID )
        try {
            const snapshot = await ref.get()
            const tickers = []
            snapshot.forEach((doc) => tickers.push(doc.data()))
            commit('index', tickers)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async create({ state, commit, rootGetters }, ticker) {
        try {
            const existingTicker = state.tickers.find(
                (e) => e.code === ticker.code
            )

            if (existingTicker) return

            const ref = this.$fire.firestore.collection('tickers').doc()
            ticker._id = ref.id
            ticker._userUID = rootGetters['users/getUserUID']
            ticker._createdAt =
                this.$fireModule.firestore.FieldValue.serverTimestamp()
            ticker._updatedAt =
                this.$fireModule.firestore.FieldValue.serverTimestamp()
            ticker.currentPrice = 1
            ticker.externalSync = true
            await ref.set(ticker)
            commit('create', ticker)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async update({ commit, dispatch }, ticker) {
        const ref = this.$fire.firestore.collection('tickers').doc(ticker._id)
        try {
            ticker._updatedAt =
                this.$fireModule.firestore.FieldValue.serverTimestamp()
            await ref.update(ticker)
            commit('update', ticker)
            dispatch('index')
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async delete({ commit }, tickerId) {
        const ref = this.$fire.firestore.collection('tickers').doc(tickerId)
        try {
            await ref.delete()
            commit('delete', tickerId)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async sync({ commit, rootState, state }) {
        const types = rootState.investmentTypes
        const tickers = state.tickers.map((t) => {
            return {
                ...t,
                source: types.find((x) => x.name === t.group)?.priceSource,
            }
        })

        const bovespaTickers = tickers
            .filter((t) => t.source === 'bovespa' && t.externalSync)
            ?.map((x) => x.code)
        if(!bovespaTickers || !bovespaTickers.length) return;

        const getQuotes = this.$fire.functions.httpsCallable('getQuotes')
        const tickersData = await getQuotes({symbols: bovespaTickers})
        if (!tickersData || !tickersData.data?.length) return

        for (const tickerData of tickersData.data) {
            const stateTicker = tickers.find(
                (t) => t.code === tickerData.symbol
            )

            commit('update', {
                ...stateTicker,
                currentPrice: tickerData.regularMarketPrice || 1,
                name: tickerData.longName,
                logoUrl: tickerData.logourl,
            })
        }
    },
}
