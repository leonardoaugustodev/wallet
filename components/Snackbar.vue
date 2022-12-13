<template>
    <div>
        <v-snackbar
            v-for="(snack, i) in snackbars"
            :key="snack._id"
            v-model="snack.show"
            :style="{ 'margin-bottom': calcMargin(i) }"
            :color="snack.color"
            :timeout="-1"
            bottom
            right
        >

                <span>{{ snack.message }}</span>
                <template #action="{ attrs }">
                    <v-btn x-small icon text @click="close(snack._id)">
                    <v-icon> mdi-close </v-icon>
                </v-btn>
                </template>

        </v-snackbar>
    </div>
</template>

<script>
export default {
    data() {
        return {
            snackbars: [],
        }
    },

    created() {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'snackbar/showMessage') {
                this.snackbars = structuredClone(state.snackbar.snackbars)

                const lastSnack = this.snackbars[this.snackbars.length - 1]

                window.setTimeout(() => {
                    this.removeSnack(lastSnack._id)
                }, 4000)
            }
        })
    },

    methods: {
        calcMargin(i) {
            return i * 70 + 'px'
        },
        close(snack) {
            this.removeSnack(snack._id)
        },
        removeSnack(snackId) {
            this.snackbars.splice(
                this.snackbars.findIndex((s) => s._id === snackId),
                1
            )
            this.$store.commit('snackbar/deleteMessage', snackId)
        },
    },
}
</script>
