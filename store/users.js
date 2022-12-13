export const state = () => ({
    user: {},
})

export const getters = {
    getUserUID: (state) => {
        return state.user?.uid;
    }
}

export const mutations = {
    onAuthStateChanged: (state, { authUser, claims }) => {
        if (!authUser) {
            state.user = {}
        } else {
            const { uid, email, emailVerified, displayName, photoURL } =
                authUser
            state.user = { uid, email, emailVerified, displayName, photoURL }
        }
    },
}

export const actions = {
    async logout() {
        try {
            await this.$fire.auth.signOut()
            this.$router.push('/login')
        } catch (e) {
            alert(e)
        }
    },
}
