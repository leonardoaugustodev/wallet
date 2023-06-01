export const state = () => ({
    showSettings: false,
    investmentTypes: [
        { name: 'Stock', priceSource: 'bovespa', isActive: true, color: { hex: '#7D1111' } },
        { name: 'Fixed Income', priceSource: null, isActive: true },
        { name: 'REIT', priceSource: 'bovespa', isActive: true },
        { name: 'International', priceSource: 'bovespa', isActive: true },
        { name: 'Crypto', priceSource: 'crypto', isActive: true },
        { name: 'Emergency Fund', priceSource: null, isActive: true },
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
