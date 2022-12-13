export const state = () => ({
    incomes: []
})

export const getters = {
    getAmountByTicker: (state) => (tickerCode) => {
        return state.incomes.reduce((acc, cv) => {
            if(cv.ticker.code !== tickerCode) return acc;
            return acc + parseFloat(cv.amount);
        }, 0);
    }
}

export const mutations = {
    index(state, incomes){
        state.incomes = incomes
    },
    create(state, income) {
        state.incomes.push(income)
    },
    update(state, income) {
        const incomeIndex = state.incomes.findIndex((e) => e._id === income._id)
        state.incomes.splice(incomeIndex, 1, income)
    },
    delete(state, id) {
        const incomeIndex = state.incomes.findIndex((e) => e._id === id)
        state.incomes.splice(incomeIndex, 1)
    },
}

export const actions = {
    async index({ commit }) {
        const ref = this.$fire.firestore.collection('incomes');
        try {
            const snapshot = await ref.get()
            const incomes = []
            snapshot.forEach(doc => incomes.push(doc.data()))
            commit('index', incomes);
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async create({ commit, rootGetters }, income) {
        try {
            const ref = this.$fire.firestore.collection('incomes').doc();
            income._id = ref.id;
            income._userUID = rootGetters['users/getUserUID'];
            income._createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            income._updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
            // income.date = new Date(new Date(income.date).getTime() + (new Date().getTimezoneOffset() * 60000))

            income.unitDividend = Number((income?.amount || 0) / (income?.quantity || 1));
            income.unitPrice = Number(income?.ticker.unitPrice || 1);
            income.yield = Number((income.unitDividend || 0) / (income.unitPrice || 1));

            await ref.set(income)
            commit('create', income);
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async update({ commit }, income) {
        const ref = this.$fire.firestore.collection('incomes').doc(income._id);
        try {
            income._updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()

            income.unitDividend = Number((income?.amount || 0) / (income?.quantity || 1));
            income.unitPrice = 1;
            income.yield = Number((income.unitDividend || 0) / (income.unitPrice || 1));

            await ref.update(income)
            commit('update', income);
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async delete({ commit }, incomeId) {
        const ref = this.$fire.firestore.collection('incomes').doc(incomeId);
        try {
            await ref.delete()
            commit('delete', incomeId);
        } catch (e) {
            return Promise.reject(e)
        }
    }
}
