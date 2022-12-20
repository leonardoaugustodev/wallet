export const state = () => ({
    showSettings: false,
    investmentTypes: [
        { name: 'Stock', priceSource: 'bovespa' },
        { name: 'Fixed Income', priceSource: null },
        { name: 'REIT', priceSource: 'bovespa' },
        { name: 'International', priceSource: 'bovespa' },
        { name: 'Crypto', priceSource: null },
        { name: 'Emergency Fund', priceSource: null },
    ],
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
    toggleOnSettings(state) {
        state.showSettings = true
    },
    toggleOffSettings(state) {
        state.showSettings = true
    },
    addInvestmentType(state, typeName){
        const existingType = state.investmentTypes.find((e) => e.name === typeName);

        if(!existingType){
            state.investmentTypes.push({ name: typeName, priceSource: null });
        }
    }
}

// export const actions = {
//     async nuxtServerInit ({ dispatch }, { req }) {
//         await dispatch('ticker/index')
//         await dispatch('entries/index')
//         await dispatch('wallet/index')
//         await dispatch('incomes/index')
//     }
//   }
