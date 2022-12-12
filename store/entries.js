export const state = () => ({
    entries: []
})

export const getters = {
    tickers(state) {
        return state.entries.map((e) => e.ticker.code)
    },
    getEntryByTicker: (state) => (tickerCode) => {
        return state.entries.find(e => e.ticker.code === tickerCode);
    },
    getStocksCodeByType: (state) => (type) => {
        return state.entries.filter(s => s.ticker.group === type).map(e => e.ticker.code);
    },
    getTotalsByStock: (state) => {
        return state.entries.reduce((acc, entry) => {
            let reduced = acc[entry.ticker.code];

            if (!reduced) {
                reduced = {
                    ...entry,
                    quantity: 0,
                    price: 0,
                    total: 0
                };
            }

            reduced.quantity += Number(entry?.quantity || 0);
            reduced.total += Number(entry?.total || 0);
            reduced.price = Number(reduced.total / reduced.quantity);

            acc[entry.ticker.code] = reduced;

            return acc;
        }, {});
    },
}

export const mutations = {
    index(state, entries){
        state.entries = entries
    },
    create(state, entry) {
        state.entries.push(entry)
    },
    update(state, entry) {
        const entryIndex = state.entries.findIndex((e) => e._id === entry._id)
        state.entries.splice(entryIndex, 1, entry)
    },
    delete(state, id) {
        const entryIndex = state.entries.findIndex((e) => e._id === id)
        state.entries.splice(entryIndex, 1)
    },
}

export const actions = {
    async index({ commit }) {
        const ref = this.$fire.firestore.collection('entries');
        try {
            const snapshot = await ref.get()
            const entries = []
            snapshot.forEach(doc => entries.push(doc.data()))
            commit('index', entries);
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async create({ commit, dispatch }, entry) {
        try {
            const ref = this.$fire.firestore.collection('entries').doc();

            entry._id = ref.id;
            entry._createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            entry._updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            entry.total = entry?.unitPrice * entry?.quantity;

            await ref.set(entry)
            commit('create', entry);
            dispatch('ticker/create', {...entry.ticker}, {root: true})
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async update({ commit }, entry) {
        const ref = this.$fire.firestore.collection('entries').doc(entry._id);
        try {
            entry._updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            await ref.update(entry)
            commit('update', entry);
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async delete({ commit }, entryId) {
        const ref = this.$fire.firestore.collection('entries').doc(entryId);
        try {
            await ref.delete()
            commit('delete', entryId);
        } catch (e) {
            return Promise.reject(e)
        }
    }
}
