<template>
    <v-dialog v-model="dialog" persistent max-width="800">
        <NewInvestmentType :edited-item="editedInvestmentType"></NewInvestmentType>

        <template #activator="{ on, attrs }">
            <v-btn block text v-bind="attrs" v-on="on"> {{ $t('settings') }} </v-btn>
        </template>
        <v-card>
            <v-card-title class="text-h5"> {{ $t('settings') }} </v-card-title>
            <v-card-text>
                <v-tabs vertical>
                    <v-tab>
                        <v-icon left> mdi-account </v-icon>
                        {{ $t('profile') }}
                    </v-tab>
                    <v-tab>
                        <v-icon left> mdi-tools </v-icon>
                        {{ $t('general') }}
                    </v-tab>
                    <v-tab v-if="isDevEnvironment">
                        <v-icon left> mdi-test-tube </v-icon>
                        {{ $t('developer') }}
                    </v-tab>

                    <v-tab-item>
                        <v-card flat>
                            <v-card-text>
                                <h4>{{ $t('language') }}</h4>
                                <v-combobox
                                    v-model="currentLocale"
                                    :items="availableLocales"
                                    item-text="name"
                                    item-value="code"
                                    outlined
                                    dense
                                    @input="changeLocale"
                                >
                                </v-combobox>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <v-card flat>
                            <!-- <v-card-text> -->
                            <v-tabs fixed-tabs dark>
                                <v-tab> Entries </v-tab>
                                <v-tab> Incomes </v-tab>

                                <v-tab-item>
                                    <v-data-table
                                        :headers="investmentTypeHeaders"
                                        :items="investmentTypes"
                                        :items-per-page="-1"
                                        class="elevation-1"
                                        dense
                                    >
                                        <template #top>
                                            <v-toolbar flat dense>
                                                <v-toolbar-title>Investment Types</v-toolbar-title>
                                                <v-spacer></v-spacer>
                                                <v-btn color="primary" small @click="handleAddInvestmentType()">
                                                    Add
                                                </v-btn>
                                            </v-toolbar>
                                        </template>
                                        <template #[`item.color`]="{ item }">
                                            <v-icon v-if="item.color" small :color="item.color.hex">
                                                mdi-circle-slice-8
                                            </v-icon>
                                        </template>
                                        <template #[`item.isActive`]="{ item }">
                                            <v-icon v-if="item.isActive" small color="green"> mdi-check-bold </v-icon>
                                        </template>
                                        <template #[`item.actions`]="{ item }">
                                            <v-icon small class="mr-2" @click="editInvestmentType(item)">
                                                mdi-pencil
                                            </v-icon>
                                        </template>
                                    </v-data-table>
                                </v-tab-item>

                                <v-tab-item> Incomes </v-tab-item>
                            </v-tabs>
                            <!-- </v-card-text> -->
                        </v-card>
                    </v-tab-item>

                    <v-tab-item>
                        <v-card flat>
                            <v-card-text>
                                <v-btn outlined block color="primary" @click="loadEntryData"> Load Entries Data </v-btn>
                                <v-btn outlined block color="primary" @click="loadIncomeData"> Load Income Data </v-btn>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { data } from '~/static/testData.js'
import { incomeData } from '~/static/incomeData.js'
import NewInvestmentType from '~/components/NewInvestmentType.vue'
export default {
    name: 'Settings',
    components: { NewInvestmentType },
    data() {
        return {
            dialog: false,
            investmentTypeDialog: false,
            editedInvestmentType: {},
            model: [],
            search: null,
            investmentTypeHeaders: [
                { text: 'Name', value: 'name' },
                { text: 'Color', value: 'color', align: 'center' },
                { text: 'Is Active', value: 'isActive', align: 'center' },
                { text: 'Actions', value: 'actions', sortable: false, align: 'right' },
            ],
        }
    },
    computed: {
        investmentTypes() {
            const types = this.$store.state.investmentTypes
            console.log(types)
            return types
        },
        availableLocales() {
            return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
        },
        currentLocale() {
            return this.$i18n.locales.find((i) => i.code === this.$i18n.locale)
        },
        isDevEnvironment() {
            return process.env.NODE_ENV === 'development'
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
            this.$i18n.setLocale(locale.code)
        },
        handleAddInvestmentType() {
            this.editedInvestmentType = {
                name: '',
                color: '',
            }
        },
        editInvestmentType(item) {
            this.editedInvestmentType = structuredClone(item)
        },
    },
}
</script>
