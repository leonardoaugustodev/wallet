<template>
    <v-menu bottom min-width="200px" rounded offset-y>
        <template #activator="{ on }">
            <v-btn icon x-large v-on="on">
                <v-avatar color="brown" size="32">
                    <v-img v-if="user.photoURL" :src="user?.photoURL"></v-img>
                    <span v-else class="white--text text-body-1">{{ initials }}</span>
                </v-avatar>
            </v-btn>
        </template>

        <v-card>
            <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">
                    <h3 class="my-2">{{ user?.displayName }}</h3>
                    <p class="text-caption mt-1">
                        {{ user?.email }}
                    </p>
                    <v-divider class="my-2"></v-divider>
                    <Settings></Settings>
                    <v-divider class="my-2"></v-divider>
                    <v-btn block text @click="logout"> Logout </v-btn>
                </div>
            </v-list-item-content>
        </v-card>
    </v-menu>
</template>

<script>
import Settings from '~/components/Settings.vue'

export default {
    components: { Settings },
    data() {
        return {
            options: [
                {
                    title: 'Settings',
                    to: '/settings',
                },
            ]
        }
    },
    computed: {
        user(){
            return this.$store.state.users.user
        },
        initials(){
            let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

            let initials = [...this.user.displayName.matchAll(rgx)] || [];

            initials = (
            (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
            ).toUpperCase();

            return initials
        }
    },
    created() {},
    methods: {
        logout(){
            this.$store.dispatch('users/logout');
        },
        openSettings(){
            this.$store.commit('toggleOnSettings');
        },


    }
}
</script>
