export const state = () => ({
    tickers: []
})

export const getters = {
    getTickerByCode: (state) => (tickerCode) => {
        return state.tickers.find(e => e.code === tickerCode);
    }
}

export const mutations = {
    index(state, tickers){
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
    async index({ commit }) {
        const ref = this.$fire.firestore.collection('tickers');
        try {
            const snapshot = await ref.get()
            const tickers = []
            snapshot.forEach(doc => tickers.push(doc.data()))
            commit('index', tickers);
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async create({ state, commit, rootGetters }, ticker) {

        try {

            const existingTicker = state.tickers.find((e) => e.code === ticker.code);

            if(existingTicker) return;

            const ref = this.$fire.firestore.collection('tickers').doc();
            ticker._id = ref.id;
            ticker._userUID = rootGetters['users/getUserUID'];
            ticker._createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            ticker._updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            await ref.set(ticker)
            commit('create', ticker);
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async update({ commit }, ticker) {
        const ref = this.$fire.firestore.collection('tickers').doc(ticker._id);
        try {
            ticker._updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            await ref.update(ticker)
            commit('update', ticker);
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async delete({ commit }, tickerId) {
        const ref = this.$fire.firestore.collection('tickers').doc(tickerId);
        try {
            await ref.delete()
            commit('delete', tickerId);
        } catch (e) {
            return Promise.reject(e)
        }
    }
}
