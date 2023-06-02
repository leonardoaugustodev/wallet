<template>
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
        <NewInvestmentType :edited-item="editedInvestmentType"></NewInvestmentType>
        <NewIncomeType :edited-item="editedIncomeType"></NewIncomeType>

        <template #activator="{ on, attrs }">
            <v-btn block text v-bind="attrs" v-on="on"> {{ $t('settings') }} </v-btn>
        </template>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>{{ $t('settings') }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items> </v-toolbar-items>
            </v-toolbar>

            <v-card-title class="text-h5"> </v-card-title>
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
                                <v-tab> {{ $t('entries') }} </v-tab>
                                <v-tab> {{ $t('incomes') }} </v-tab>

                                <v-tab-item class="mt-4">
                                    <v-data-table
                                        :headers="typeTableHeaders"
                                        :items="investmentTypes"
                                        :items-per-page="-1"
                                        class="elevation-1"
                                        dense
                                    >
                                        <template #top>
                                            <v-toolbar flat dense>
                                                <v-toolbar-title>{{ $t('investmentTypes') }}</v-toolbar-title>
                                                <v-spacer></v-spacer>
                                                <v-btn color="primary" small @click="handleAddInvestmentType()">
                                                    {{ $t('add') }}
                                                </v-btn>
                                            </v-toolbar>
                                        </template>
                                        <template #[`item.color`]="{ item }">
                                            <v-icon v-if="item.color" small :color="item.color">
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

                                <v-tab-item class="mt-4">
                                    <v-data-table
                                        :headers="typeTableHeaders"
                                        :items="incomeTypes"
                                        :items-per-page="-1"
                                        class="elevation-1"
                                        dense
                                    >
                                        <template #top>
                                            <v-toolbar flat dense>
                                                <v-toolbar-title>{{ $t('incomeTypes') }}</v-toolbar-title>
                                                <v-spacer></v-spacer>
                                                <v-btn color="primary" small @click="handleAddIncomeType()">
                                                    {{ $t('add') }}
                                                </v-btn>
                                            </v-toolbar>
                                        </template>
                                        <template #[`item.color`]="{ item }">
                                            <v-icon v-if="item.color" small :color="item.color">
                                                mdi-circle-slice-8
                                            </v-icon>
                                        </template>
                                        <template #[`item.isActive`]="{ item }">
                                            <v-icon v-if="item.isActive" small color="green"> mdi-check-bold </v-icon>
                                        </template>
                                        <template #[`item.actions`]="{ item }">
                                            <v-icon small class="mr-2" @click="editIncomeType(item)">
                                                mdi-pencil
                                            </v-icon>
                                        </template>
                                    </v-data-table>
                                </v-tab-item>
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
import NewIncomeType from '~/components/NewIncomeType.vue'
export default {
    name: 'Settings',
    components: { NewInvestmentType, NewIncomeType },
    data() {
        return {
            dialog: false,
            editedInvestmentType: {},
            editedIncomeType: {},
            model: [],
            search: null,
        }
    },
    computed: {
        investmentTypes() {
            const types = this.$store.state.investmentTypes
            return types
        },
        incomeTypes() {
            const types = this.$store.state.incomeTypes
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
        typeTableHeaders() {
            return [
                { text: this.$t('name'), value: 'name' },
                { text: this.$t('color'), value: 'color', align: 'center' },
                { text: this.$t('isActive'), value: 'isActive', align: 'center' },
                { text: this.$t('actions'), value: 'actions', sortable: false, align: 'right' },
            ]
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
                priceSource: null,
                isActive: true,
            }
        },
        editInvestmentType(item) {
            this.editedInvestmentType = structuredClone(item)
        },
        handleAddIncomeType() {
            this.editedIncomeType = {
                name: '',
                color: '',
                priceSource: null,
                isActive: true,
            }
        },
        editIncomeType(item) {
            this.editedIncomeType = structuredClone(item)
        },
    },
}
</script>
