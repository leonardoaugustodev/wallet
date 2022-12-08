<template>
    <v-dialog v-model="dialog" persistent max-width="800">
        <template v-slot:activator="{ on, attrs }">
            <v-btn block text v-bind="attrs" v-on="on"> Settings </v-btn>
        </template>
        <v-card>
            <v-card-title class="text-h5"> Settings </v-card-title>
            <v-card-text>
                <v-tabs vertical>
                    <v-tab>
                        <v-icon left> mdi-account </v-icon>
                        Profile
                    </v-tab>
                    <v-tab>
                        <v-icon left> mdi-tools </v-icon>
                        General
                    </v-tab>
                    <v-tab>
                        <v-icon left> mdi-test-tube </v-icon>
                        Developer
                    </v-tab>

                    <v-tab-item>
                        <v-card flat>
                            <v-card-text> Profile </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card flat>
                            <v-card-text> General </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card flat>
                            <v-card-text>
                                <v-btn outlined block color="primary" @click="loadTestData">
                                    Load Test Data
                                </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="dialog = false">
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <!-- 
    <v-card class="mt-4">
            <v-col cols="12">
                <v-btn @click="loadTestData"> Load Test Data </v-btn>
            </v-col>
    </v-card> -->
</template>

<script>
import { data } from '~/static/testData.js'

export default {
    name: 'Settings',
    data() {
        return {
            dialog: false,
        }
    },
    computed: {},
    watch: {},
    created() {},
    methods: {
        loadTestData() {
            data.forEach((d) => this.$store.dispatch('entries/create', d))
        },
    },
}
</script>
