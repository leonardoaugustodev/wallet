<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-card class="pa-4">
                <v-card-title>
                    Incomes
                    <v-spacer></v-spacer>
                    <!-- EDIT MODAL -->
                    <v-dialog v-model="dialog" max-width="500px" persistent>
                        <template #activator="{ on, attrs }">
                            <v-btn color="primary" v-bind="attrs" small depressed v-on="on">
                                New Income
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
v-model="menu2" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    :rules="[rules.required]" min-width="auto">
                                                    <template #activator="{ on, attrs }">
                                                        <v-text-field
v-model="
                                                            editedItem.date
                                                        " type="date" label="Date" readonly v-bind="attrs" outlined
                                                            dense v-on="on"></v-text-field>
                                                    </template>
                                                    <v-date-picker
v-model="editedItem.date"
                                                        @input="menu2 = false"></v-date-picker>
                                                </v-menu>

                                                <!-- TICKER -->
                                                <v-combobox
v-model="editedItem.ticker" :items="availableTickers"
                                                    :rules="tickerRules" item-text="code" label="Ticker" outlined
                                                    dense></v-combobox>

                                                <!-- TYPE -->
                                                <v-combobox
v-model="editedItem.type" :items="incomeTypes"
                                                    :rules="[rules.required]" label="Type" outlined dense></v-combobox>

                                                <!-- MEMO -->
                                                <v-text-field
v-model="editedItem.memo" label="Memo" outlined
                                                    dense></v-text-field>

                                                <!-- AMOUNT -->
                                                <v-text-field
v-model="editedItem.amount" label="Amount" outlined
                                                    type="number" dense></v-text-field>

                                                <!-- QUANTITY -->
                                                <v-text-field
v-model="editedItem.quantity" label="Quantity" outlined
                                                    type="number" dense></v-text-field>
                                            </v-form>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-btn color="error" text @click="close">
                                    Cancel
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click="save">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- DELETE MODAL -->
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">Are you sure you want to delete this
                                item?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="incomes"
                    sort-by="date"
                >
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
                        <v-icon small class="mr-2" @click="editItem(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon small @click="deleteItem(item)">
                            mdi-delete
                        </v-icon>
                    </template>

                    <template #no-data> No data to show. </template>
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
                required: (value) => !!value || 'Required.',
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
                date: new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substring(0, 10),
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
                date: new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substring(0, 10),
                type: '',
                memo: '',
                amount: 0,
                quantity: 0,
            },
            headers: [
                { text: 'Date', value: 'date' },
                { text: 'Ticker', value: 'ticker.code', align: 'start' },
                { text: 'Type', value: 'type' },
                { text: 'Memo', value: 'memo' },
                { text: 'Amount', value: 'amount' },
                { text: 'Quantity', value: 'quantity' },
                // { text: 'Dividend/QTY', value: 'unitDividend' },
                { text: 'Unit Price', value: 'unitPrice' },
                { text: 'Yield', value: 'yield' },
                { text: 'Actions', value: 'actions' },
            ],
            availableTickers: [],
            tickerRules: [
                v => !!v.code || 'Required.'
            ]
        }
    },
    computed: {
        incomes() {
            return this.$store.state.incomes.incomes || []
        },
        formTitle() {
            return this.editedIndex === -1 ? 'New Income' : 'Edit Income'
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
                    content: 'Please fill all required fields!',
                    color: 'error',
                })
                return
            }

            if (this.editedIndex > -1) {
                this.$store.dispatch('incomes/update', this.editedItem)
                this.$notifier.showMessage({
                    content: 'The record was updated succesfully!',
                    color: 'info',
                })
            } else {
                this.$notifier.showMessage({
                    content: 'New record was saved succesfully!',
                    color: 'info',
                })
                this.$store.dispatch('incomes/create', this.editedItem)
            }

            this.close()
        },

        updateEntryTotal() {
            this.editedItem.total =
                this.editedItem.quantity * this.editedItem.unitPrice
        },
    },
}
</script>
