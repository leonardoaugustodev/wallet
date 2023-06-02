export const state = () => ({
    showSettings: false,
    investmentTypes: [
        // { name: 'Stock', priceSource: 'bovespa', isActive: true, color: { hex: '#7D1111' } },
        // { name: 'Fixed Income', priceSource: null, isActive: true },
        // { name: 'REIT', priceSource: 'bovespa', isActive: true },
        // { name: 'International', priceSource: 'bovespa', isActive: true },
        // { name: 'Crypto', priceSource: 'crypto', isActive: true },
        // { name: 'Emergency Fund', priceSource: null, isActive: true },
    ],
    priceSources: [
        { label: 'Bovespa', value: 'bovespa' },
        { label: 'Crypto', value: 'crypto' },
    ]
})

export const getters = {
    getInvestmentTypeNames(state) {
        return state.investmentTypes.map((e) => e.name)
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
}
