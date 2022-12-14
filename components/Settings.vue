<template>
    <v-dialog v-model="dialog" persistent max-width="800">
        <template #activator="{ on, attrs }">
            <v-btn block text v-bind="attrs" v-on="on"> Settings </v-btn>
        </template>
        <v-card>
            <v-card-title class="text-h5"> Settings </v-card-title>
            <v-card-text>
                <v-tabs vertical>
                    <!-- <v-tab>
                        <v-icon left> mdi-account </v-icon>
                        Profile
                    </v-tab> -->
                    <v-tab>
                        <v-icon left> mdi-tools </v-icon>
                        General
                    </v-tab>
                    <v-tab>
                        <v-icon left> mdi-test-tube </v-icon>
                        Developer
                    </v-tab>

                    <!-- <v-tab-item>
                        <v-card flat>
                            <v-card-text> Profile </v-card-text>
                        </v-card>
                    </v-tab-item> -->
                    <v-tab-item>
                        <v-card flat>
                            <v-card-text>
                                <v-card flat>
                                    <v-card-title>
                                        Investment Types
                                    </v-card-title>
                                    <v-card-text>
                                        <v-combobox
v-model="model" :items="items" :search-input.sync="search"
                                            hide-selected multiple persistent-hint small-chips deletable-chips
                                            @input="handleInvestmentTypeInput">
                                            <template #no-data>
                                                <v-list-item>
                                                    <v-list-item-content>
                                                        <v-list-item-title>
                                                            No results matching
                                                            "<strong>{{
                                                                    search
                                                            }}</strong>". Press
                                                            <kbd>enter</kbd> to
                                                            create a new one
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </template>
                                        </v-combobox>
                                    </v-card-text>
                                </v-card>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card flat>
                            <v-card-text>
                                <v-btn outlined block color="primary" @click="loadEntryData">
                                    Load Entries Data
                                </v-btn>
                                <v-btn outlined block color="primary" @click="loadIncomeData">
                                    Load Income Data
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
import { incomeData } from '~/static/incomeData.js'

export default {
    name: 'Settings',
    data() {
        return {
            dialog: false,
            model: [],
            search: null,
        }
    },
    computed: {
        items() {
            return this.$store.getters.getInvestmentTypeNames;
        }
    },
    watch: {

    },
    created() {
    },
    methods: {
        loadEntryData() {
            data.forEach((d) => this.$store.dispatch(
                'entries/create', d
            ));
        },
        loadIncomeData() {
            incomeData.forEach((d) => this.$store.dispatch(
                'incomes/create', d
            ));
        },  
        handleInvestmentTypeInput(typeName) {
            typeName.forEach(name => {
                this.$store.commit('addInvestmentType', name);
            })
        }
    },
}
</script>
