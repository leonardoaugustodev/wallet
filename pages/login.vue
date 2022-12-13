<template>
    <div class="d-flex flex-column align-center justify-center">
        <img class="mt-5" src="~/static/wallet-logo.png" alt="" width="200px">

        <span class="text-h3 ma-10">Wallet</span>

        <v-btn color="primary" @click="login">Login with Google</v-btn>

    </div>
</template>

<script>
export default {
    name: 'LoginPage',
    created() {
        if(this.$store.getters['users/getUserUID'] != null){
            this.$router.push('/wallet')
        }
    },
    methods: {
        async login() {
            const provider = new this.$fireModule.auth.GoogleAuthProvider();
            await this.$fire.auth.signInWithPopup(provider)
            this.$router.push('/wallet')
        }
    }
}
</script>
