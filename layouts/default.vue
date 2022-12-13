<template>
    <v-app dark>
        <Snackbar></Snackbar>

        <v-app-bar v-if="userIsAuthenticated" app flat>
            <!-- <Avatar if:true="$vuetify.breakpoint.smAndDown" /> -->

            <v-tabs centered class="ml-n9" color="grey darken-1">
                <v-tab v-for="(item, i) in items" :key="i" :to="item.to" router exact>
                    {{ item.title }}
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
                    icon: 'mdi-wallet',
                    title: 'Wallet',
                    to: '/wallet',
                },
                {
                    icon: 'mdi-table-large-plus',
                    title: 'Entries',
                    to: '/entries',
                },
                {
                    icon: 'mdi-wallet-plus',
                    title: 'Incomes',
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
        userIsAuthenticated(){
            return this.$store.state.users.user.uid != null;
        }
    },
    created() {
        this.initialize()
    },

    methods: {
        async initialize() {
            this.$store.subscribe((mutation) => {
                if (mutation.type === 'entries/index') {
                    this.$store.dispatch('wallet/index')
                    this.$store.dispatch('incomes/index')
                }
            })

            await this.$store.dispatch('entries/index')
        },
    },
}
</script>
