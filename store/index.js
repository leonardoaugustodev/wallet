export const state = () => ({
    showSettings: false,
})

export const mutations = {
    toggleOnSettings(state) {
        state.showSettings = true;
    },
    toggleOffSettings(state) {
        state.showSettings = true;
    },
}
