<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-card class="pa-4">
                <v-card-title>
                    {{ $t('incomes') }}
                    <v-spacer></v-spacer>
                    <!-- EDIT MODAL -->
                    <v-dialog v-model="dialog" max-width="500px" persistent>
                        <template #activator="{ on, attrs }">
                            <v-btn color="primary" v-bind="attrs" small depressed v-on="on">
                                {{ $t('newIncome') }}
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col>
                                            <v-form ref="form" v-model="valid" lazy-validation>
                                                <!-- DATE -->
                                                <v-menu
                                                    v-model="menu2"
                                                    :close-on-content-click="false"
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    :rules="[rules.required]"
                                                    min-width="auto"
                                                >
                                                    <template #activator="{ on, attrs }">
                                                        <v-text-field
                                                            v-model="editedItem.date"
                                                            type="date"
                                                            :label="$t('date')"
                                                            readonly
                                                            v-bind="attrs"
                                                            outlined
                                                            dense
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                        v-model="editedItem.date"
                                                        @input="menu2 = false"
                                                    ></v-date-picker>
                                                </v-menu>

                                                <!-- TICKER -->
                                                <v-combobox
                                                    v-model="editedItem.ticker"
                                                    :items="availableTickers"
                                                    :rules="tickerRules"
                                                    item-text="code"
                                                    :label="$t('ticker')"
                                                    outlined
                                                    dense
                                                ></v-combobox>

                                                <!-- TYPE -->
                                                <v-combobox
                                                    v-model="editedItem.type"
                                                    :items="incomeTypes"
                                                    :rules="[rules.required]"
                                                    :label="$t('type')"
                                                    outlined
                                                    dense
                                                ></v-combobox>

                                                <!-- MEMO -->
                                                <v-text-field
                                                    v-model="editedItem.memo"
                                                    :label="$t('memo')"
                                                    outlined
                                                    dense
                                                ></v-text-field>

                                                <!-- AMOUNT -->
                                                <v-text-field
                                                    v-model="editedItem.amount"
                                                    :label="$t('amount')"
                                                    outlined
                                                    type="number"
                                                    dense
                                                ></v-text-field>

                                                <!-- QUANTITY -->
                                                <v-text-field
                                                    v-model="editedItem.quantity"
                                                    :label="$t('quantity')"
                                                    outlined
                                                    type="number"
                                                    dense
                                                ></v-text-field>
                                            </v-form>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="error" text @click="close"> {{ $t('cancel') }} </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click="save"> {{ $t('save') }} </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- DELETE MODAL -->
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5"> {{ $t('deleteConfirmation') }}</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete"> {{ $t('cancel') }}</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                                    {{ $t('confirm') }}</v-btn
                                >
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-title>
                <v-data-table :headers="headers" :items="incomes" sort-by="date">
                    <template #item.ticker.code="{ item }">
                        <span class="font-weight-bold">
                            {{ item.ticker.code }}
                        </span>
                    </template>

                    <template #item.amount="{ item }">
                        {{ parseFloat(item.amount)?.toFixed(2) }}
                    </template>

                    <template #item.quantity="{ item }">
                        {{ parseFloat(item.quantity)?.toFixed(2) }}
                    </template>

                    <template #item.unitPrice="{ item }">
                        {{ $utils.formatCurrency(item.unitPrice) }}
                    </template>

                    <template #item.yield="{ item }">
                        {{ $utils.formatPercentage(item.yield) }}
                    </template>

                    <template #item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                    </template>

                    <template #no-data> {{ $t('noDataToShow') }} </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'IncomesPage',
    data() {
        return {
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            menu: false,
            modal: false,
            menu2: false,
            valid: true,
            rules: {
                required: (value) => !!value || this.$t('required'),
            },
            incomeTypes: ['Dividend', 'Interest'],
            editedItem: {
                _id: '',
                ticker: {
                    code: '',
                    group: '',
                    name: '',
                    unitPrice: 0,
                },
                date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
                type: '',
                memo: '',
                amount: 0,
                quantity: 0,
            },
            defaultItem: {
                _id: '',
                ticker: {
                    code: '',
                    group: '',
                    name: '',
                    unitPrice: 0,
                },
                date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
                type: '',
                memo: '',
                amount: 0,
                quantity: 0,
            },
            headers: [
                { text: this.$t('date'), value: 'date' },
                { text: this.$t('ticker'), value: 'ticker.code', align: 'start' },
                { text: this.$t('type'), value: 'type' },
                { text: this.$t('memo'), value: 'memo' },
                { text: this.$t('amount'), value: 'amount' },
                { text: this.$t('quantity'), value: 'quantity' },
                { text: this.$t('unitPrice'), value: 'unitPrice' },
                { text: this.$t('yield'), value: 'yield' },
                { text: this.$t('actions'), value: 'actions' },
            ],
            availableTickers: [],
            tickerRules: [(v) => !!v.code || this.$t('required')],
        }
    },
    computed: {
        incomes() {
            return this.$store.state.incomes.incomes || []
        },
        formTitle() {
            return this.editedIndex === -1 ? this.$t('newIncome') : this.$t('editIncome')
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.getAvailableTickers()

        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'entries/index') {
                this.getAvailableTickers()
            }
        })
    },

    methods: {
        getAvailableTickers() {
            const entries = this.$store.state.entries.entries
            this.availableTickers = entries?.map((t) => {
                return t.ticker
            })
        },

        editItem(item) {
            this.editedIndex = this.incomes.indexOf(item)
            this.editedItem = structuredClone(item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.incomes.indexOf(item)
            this.editedItem = structuredClone(item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.$store.dispatch('incomes/delete', this.editedItem._id)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = structuredClone(this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = structuredClone(this.defaultItem)
                this.editedIndex = -1
            })
        },

        async save() {
            await this.$refs.form.validate()

            if (!this.valid) {
                this.$notifier.showMessage({
                    content: this.$t('fillAllFields'),
                    color: 'error',
                })
                return
            }

            if (this.editedIndex > -1) {
                this.$store.dispatch('incomes/update', this.editedItem)
                this.$notifier.showMessage({
                    content: this.$t('recordUpdatedSucessfully'),
                    color: 'info',
                })
            } else {
                this.$notifier.showMessage({
                    content: this.$t('newRecordCreatedSucessfully'),
                    color: 'info',
                })
                this.$store.dispatch('incomes/create', this.editedItem)
            }

            this.close()
        },

        updateEntryTotal() {
            this.editedItem.total = this.editedItem.quantity * this.editedItem.unitPrice
        },
    },
}
</script>
