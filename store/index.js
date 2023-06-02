export const state = () => ({
    showSettings: false,
    investmentTypes: [],
    incomeTypes: [],
    priceSources: [
        { label: 'Bovespa', value: 'bovespa' },
        { label: 'Crypto', value: 'crypto' },
    ]
})

export const getters = {
    getInvestmentTypeNames(state) {
        return state.investmentTypes.filter(x => x.isActive).map((e) => e.name)
    },
    getInvestmentTypeByName: (state) => (name) => {
        return state.investmentTypes.find((e) => e.name === name);
    },
}

export const mutations = {
    setInvestmentTypes(state, investmentTypes) {
        state.investmentTypes = investmentTypes
    },
    deleteInvestmentType(state, id) {
        const typeIndex = state.investmentTypes.findIndex((e) => e._id === id)
        state.investmentTypes.splice(typeIndex, 1)
    },
    setIncomeTypes(state, incomeTypes) {
        state.incomeTypes = incomeTypes
    },
    deleteIncomeType(state, id) {
        const typeIndex = state.incomeTypes.findIndex((e) => e._id === id)
        state.incomeTypes.splice(typeIndex, 1)
    },
    toggleOnSettings(state) {
        state.showSettings = true
    },
    toggleOffSettings(state) {
        state.showSettings = true
    },
    addInvestmentType(state, typeName) {
        const existingType = state.investmentTypes.find((e) => e.name === typeName);

        if (!existingType) {
            state.investmentTypes.push({ name: typeName, priceSource: null });
        }
    }
}

export const actions = {
    async getAllInvestmentTypes({ commit, rootGetters }) {
        const userUID = await rootGetters['users/getUserUID']
        const ref = this.$fire.firestore.collection('investmentTypes').where("_userUID", "==", userUID)
        try {
            const snapshot = await ref.get()
            const investmentTypes = []
            snapshot.forEach((doc) => investmentTypes.push(doc.data()))
            commit('setInvestmentTypes', investmentTypes)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async deleteInvestmentType({ commit }, typeId) {
        const ref = this.$fire.firestore.collection('investmentTypes').doc(typeId)
        try {
            await ref.delete()
            commit('deleteInvestmentType', typeId)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async getAllIncomeTypes({ commit, rootGetters }) {
        const userUID = await rootGetters['users/getUserUID']
        const ref = this.$fire.firestore.collection('incomeTypes').where("_userUID", "==", userUID)
        try {
            const snapshot = await ref.get()
            const incomeTypes = []
            snapshot.forEach((doc) => incomeTypes.push(doc.data()))
            commit('setIncomeTypes', incomeTypes)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async deleteIncomeType({ commit }, typeId) {
        const ref = this.$fire.firestore.collection('incomeTypes').doc(typeId)
        try {
            await ref.delete()
            commit('deleteIncomeType', typeId)
        } catch (e) {
            return Promise.reject(e)
        }
    }
}
