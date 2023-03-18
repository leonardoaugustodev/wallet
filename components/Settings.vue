<template>
    <v-dialog v-model="dialog" persistent max-width="800">
        <template #activator="{ on, attrs }">
            <v-btn block text v-bind="attrs" v-on="on"> {{$t('settings')}} </v-btn>
        </template>
        <v-card>
            <v-card-title class="text-h5"> {{ $t('settings')}} </v-card-title>
            <v-card-text>
                <v-tabs vertical>
                    <v-tab>
                        <v-icon left> mdi-account </v-icon>
                        {{  $t('profile') }}
                    </v-tab>
                    <v-tab>
                        <v-icon left> mdi-tools </v-icon>
                        {{  $t('general') }}
                    </v-tab>
                    <v-tab>
                        <v-icon left> mdi-test-tube </v-icon>
                        {{  $t('developer') }}
                    </v-tab>

                    <v-tab-item>
                        <v-card flat class="ma-2">
                            <v-card-text>
                                <h4>{{  $t('language') }}</h4>
                                <v-combobox
                                    :items="availableLocales"
                                    v-model="currentLocale"
                                    item-text="name"
                                    item-value="code"
                                    @input="changeLocale"
                                    outlined
                                    dense
                                >
                                </v-combobox>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <v-card flat class="ma-2">
                            <v-card-text>
                                <h4>{{  $t('investmentTypes') }}</h4>
                                <v-combobox
                                    v-model="model"
                                    :items="items"
                                    :search-input.sync="search"
                                    @input="handleInvestmentTypeInput"
                                    hide-selected
                                    multiple
                                    persistent-hint
                                    small-chips
                                    deletable-chips
                                    outlined
                                    dense
                                >
                                    <template #no-data>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    No results matching "<strong>{{ search }}</strong
                                                    >". Press <kbd>enter</kbd> to create a new one
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                </v-combobox>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <v-card flat class="ma-2">
                            <v-card-text>
                                <v-btn outlined block color="primary" @click="loadEntryData"> Load Entries Data </v-btn>
                                <v-btn outlined block color="primary" @click="loadIncomeData"> Load Income Data </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey darken-1" text @click="dialog = false"> {{  $t('close') }} </v-btn>
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
            return this.$store.getters.getInvestmentTypeNames
        },
        availableLocales() {
            return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
        },
        currentLocale() {
            return this.$i18n.locales.find((i) => i.code === this.$i18n.locale)
        },
    },
    watch: {},
    created() {},
    methods: {
        loadEntryData() {
            data.forEach((d) => this.$store.dispatch('entries/create', d))
        },
        loadIncomeData() {
            incomeData.forEach((d) => this.$store.dispatch('incomes/create', d))
        },
        handleInvestmentTypeInput(typeName) {
            typeName.forEach((name) => {
                this.$store.commit('addInvestmentType', name)
            })
        },
        changeLocale(locale) {
            console.log(locale)
            this.$i18n.setLocale(locale.code)
        },
    },
}
</script>
