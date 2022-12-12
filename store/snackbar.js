export const state = () => ({
    snackbars: []
})

export const mutations = {
    showMessage(state, payload) {
        const ref = this.$fire.firestore.collection('snackbar').doc();
        state.snackbars.push(
            {
                _id: ref.id,
                message: payload.content,
                color: payload.color,
                show: true
            }
        )
    },
    deleteMessage(state, snackId){
        state.snackbars.splice(
            state.snackbars.findIndex(s => s._id === snackId),
            1
        );
    }
}
