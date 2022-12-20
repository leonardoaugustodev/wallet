export const state = () => ({
    user: {},
})

export const getters = {
    getUserUID: (state) => {
        return state.user?.uid
    },
}

export const mutations = {
    setUser(state, user) {
        state.user = user
    },
    clearUser(state){
        state.user = {}
    }
}

export const actions = {
    async onAuthStateChanged({dispatch, commit}, { authUser }) {
        if (!authUser) {
            commit('clearUser')
        } else {
            const { uid, email, emailVerified, displayName, photoURL } = authUser
            commit('setUser', { uid, email, emailVerified, displayName, photoURL })

            await dispatch('ticker/index', null, { root: true })
            await dispatch('incomes/index', null, { root: true })
            await dispatch('entries/index', null, { root: true })
            await dispatch('wallet/index', null, { root: true })
        }
    },
    async logout(store) {
        try {
            await this.$fire.auth.signOut()
            this.$router.push('/login')
            this.$router.go()
        } catch (e) {
            alert(e)
        }
    },
}
