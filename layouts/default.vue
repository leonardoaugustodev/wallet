<template>
    <v-app>
        <Snackbar></Snackbar>

        <v-app-bar v-if="userIsAuthenticated" app flat>
            <!-- <Avatar if:true="$vuetify.breakpoint.smAndDown" /> -->

            <v-tabs centered class="ml-n9" color="grey darken-1">
                <v-tab v-for="(item, i) in items" :key="i" :to="localePath(item.to)" router exact>
                    {{ getTranslation(item.title) }}
                </v-tab>
            </v-tabs>

            <Avatar class="hidden-sm-and-down" />

        </v-app-bar>

        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
        <!-- <v-footer :absolute="!fixed" app>
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer> -->
    </v-app>
</template>

<script>
import Snackbar from '~/components/Snackbar.vue'
import Avatar from '~/components/Avatar.vue'

export default {
    name: 'DefaultLayout',
    components: { Snackbar, Avatar },
    data() {
        return {
            clipped: false,
            drawer: false,
            fixed: false,
            items: [
                {
                    icon: 'mdi-dashboard',
                    title: 'dashboard',
                    to: '/',
                },
                {
                    icon: 'mdi-wallet',
                    title: 'wallet',
                    to: '/wallet',
                },
                {
                    icon: 'mdi-table-large-plus',
                    title: 'entries',
                    to: '/entries',
                },
                {
                    icon: 'mdi-wallet-plus',
                    title: 'incomes',
                    to: '/incomes',
                },
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: 'Wallet',
        }
    },
    computed: {
        showSettings() {
            return this.$store.state.showSettings;
        },
        userIsAuthenticated() {
            return this.$store.state.users.user.uid != null;
        }
    },
    created() {
        if(!this.userIsAuthenticated) this.$router.push('/login')
    },

    async fetch() {
        // await this.$store.dispatch('ticker/index')
        // await this.$store.dispatch('incomes/index')
        // await this.$store.dispatch('entries/index')
        // await this.$store.dispatch('wallet/index')
    },

    methods: {
        getTranslation(key){
            return this.$t(key)
        }
    },
}
</script>

