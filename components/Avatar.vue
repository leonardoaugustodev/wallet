<template>
    <v-menu bottom min-width="200px" rounded offset-y>
        <template #activator="{ on }">
            <v-btn icon x-large v-on="on">
                <v-avatar color="brown" size="32">
                    <span class="white--text text-body-1">{{
                        user.initials
                    }}</span>
                </v-avatar>
            </v-btn>
        </template>

        <v-card>
            <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">

                    <h3 class="my-2">{{ user.fullName }}</h3>
                    <p class="text-caption mt-1">
                        {{ user.email }}
                    </p>
                    <v-divider class="my-2"></v-divider>
                    <!-- <v-btn block text @click="openSettings" router exact> Settings </v-btn> -->
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
            user: {
                initials: 'JD',
                fullName: 'John Doe',
                email: 'john.doe@doe.com',
            },
            options: [
                {
                    title: 'Settings',
                    to: '/settings',
                },
            ]
        }
    },

    created() {},
    methods: {
        logout(){
            this.$store.dispatch('users/logout');
        },
        openSettings(){
            this.$store.commit('toggleOnSettings');
        }
    }
}
</script>
