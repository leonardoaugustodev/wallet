<template>
    <v-app dark>
        <Snackbar></Snackbar>
        <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
            <v-list>
                <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="clipped" fixed app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer />
            <!-- <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
        </v-app-bar>
        <v-main>
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>
        <v-footer :absolute="!fixed" app>
            <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
    </v-app>
</template>

<script>
import Snackbar from '~/components/Snackbar.vue'

export default {
    name: 'DefaultLayout',
    components: { Snackbar },
    data() {
        return {
            clipped: false,
            drawer: false,
            fixed: false,
            items: [
                {
                    icon: 'mdi-apps',
                    title: 'Welcome',
                    to: '/',
                },
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
    created() {
        this.initialize()
    },

    methods: {
        async initialize() {
            await this.$store.dispatch('incomes/index');
            await this.$store.dispatch('entries/index');
            // this.entries = this.$store.state.entries.entries;
        },
    }
}
</script>
