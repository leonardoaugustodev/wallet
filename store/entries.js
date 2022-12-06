export const state = () => ({
    entries: []
})

export const getters = {
    tickers(state) {
        return state.entries.map((e) => e.ticker.code)
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

            console.log(entries);
            commit('index', entries);
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async create({ commit }, entry) {
        const ref = this.$fire.firestore.collection('entries').doc();
        try {
            entry._id = ref.id;
            entry._createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            entry._updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            await ref.set(entry)
            commit('create', entry);
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
    async delete({ commit }, entry) {
        const ref = this.$fire.firestore.collection('entries').doc(entry._id);
        try {
            await ref.delete()
            commit('delete', entry._id);
        } catch (e) {
            return Promise.reject(e)
        }
    }
}
