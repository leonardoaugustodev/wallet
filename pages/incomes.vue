<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-data-table
                :headers="headers"
                :items="incomes"
                sort-by="date"
                class="elevation-1"
                dense
            >
                <template #top>
                    <v-toolbar flat>
                        <v-toolbar-title>Incomes</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>

                        <!-- EDIT MODAL -->
                        <v-dialog v-model="dialog" max-width="500px" persistent>
                            <template #activator="{ on, attrs }">
                                <v-btn
                                    color="primary"
                                    dark
                                    class="mb-2"
                                    v-bind="attrs"
                                    small
                                    v-on="on"
                                >
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
                                                <!-- DATE -->
                                                <v-menu
                                                    v-model="menu2"
                                                    :close-on-content-click="
                                                        false
                                                    "
                                                    :nudge-right="40"
                                                    transition="scale-transition"
                                                    offset-y
                                                    :rules="[rules.required]"
                                                    min-width="auto"
                                                >
                                                    <template
                                                        #activator="{
                                                            on,
                                                            attrs,
                                                        }"
                                                    >
                                                        <v-text-field
                                                            v-model="
                                                                editedItem.date
                                                            "
                                                            label="Date"
                                                            readonly
                                                            v-bind="attrs"
                                                            outlined
                                                            dense
                                                            v-on="on"
                                                        ></v-text-field>
                                                    </template>
                                                    <v-date-picker
                                                        v-model="
                                                            editedItem.date
                                                        "
                                                        @input="menu2 = false"
                                                    ></v-date-picker>
                                                </v-menu>

                                                <!-- TICKER -->
                                                <v-combobox
                                                    v-model="
                                                        editedItem.ticker
                                                    "
                                                    :items="availableTickers"
                                                    :rules="[rules.required]"
                                                    item-text="code"
                                                    label="Ticker"
                                                    outlined
                                                    dense
                                                    @change="getTickerData"
                                                ></v-combobox>

                                                <!-- TYPE -->
                                                <v-combobox
                                                    v-model="editedItem.type"
                                                    :items="incomeTypes"
                                                    :rules="[rules.required]"
                                                    label="Type"
                                                    outlined
                                                    dense
                                                ></v-combobox>

                                                <!-- MEMO -->
                                                <v-text-field
                                                    v-model="editedItem.memo"
                                                    label="Memo"
                                                    outlined
                                                    dense
                                                ></v-text-field>

                                                <!-- AMOUNT -->
                                                <v-text-field
                                                    v-model="editedItem.amount"
                                                    label="Amount"
                                                    outlined
                                                    type="number"
                                                    dense
                                                ></v-text-field>

                                                <!-- QUANTITY -->
                                                <v-text-field
                                                    v-model="
                                                        editedItem.quantity
                                                    "
                                                    label="Quantity"
                                                    outlined
                                                    type="number"
                                                    dense
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="close"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="save"
                                    >
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <!-- DELETE MODAL -->
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5"
                                    >Are you sure you want to delete this
                                    item?</v-card-title
                                >
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="closeDelete"
                                        >Cancel</v-btn
                                    >
                                    <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="deleteItemConfirm"
                                        >OK</v-btn
                                    >
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>

                <template #item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </template>

                <template #item.yield="{ item }">
                    {{ $utils.formatPercentage(item.yield)}}
                </template>

                <template #no-data> No data to show. </template>
            </v-data-table>
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
                    unitPrice: 0
                },
                date: new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substr(0, 10),
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
                    unitPrice: 0
                },
                date: new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substr(0, 10),
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
                { text: 'Dividend/QTY', value: 'unitDividend' },
                { text: 'Unit Price', value: 'unitPrice' },
                { text: 'Yield', value: 'yield' },
                { text: 'Actions', value: 'actions' },
            ],
            availableTickers: [],
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

        async retrieveTickerInfo(value) {
            try {
                const ticker = await this.$axios.$get(
                    `https://brapi.dev/api/quote/${value}?range=1d&interval=1d&fundamental=true`
                )

                if (!ticker.results || !ticker.results.length) {
                    this.editedItem.ticker.name = ''
                    return
                }

                const retrievedTicker = ticker.results[0]
                this.editedItem.ticker.name = retrievedTicker.longName

                this.editedItem = structuredClone(this.editedItem)
            } catch (err) {
                this.editedItem.ticker.name = ''
            }
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

        save() {
            if (!this.validate(this.editedItem)) {
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

        validate(entry) {
            if (entry && entry.ticker) {
                if (entry.date && entry.ticker.code && entry.type) {
                    return true
                }
            }
            return false
        },

        updateEntryTotal() {
            this.editedItem.total =
                this.editedItem.quantity * this.editedItem.unitPrice
        },

        async getTickerData() {

            try{
                const ticker = await this.$brapi.getQuotes(this.editedItem.ticker.code);
                if (!ticker.results || !ticker.results.length) return;

                const retrievedTicker = ticker.results[0];
                this.editedItem.ticker.unitPrice = retrievedTicker.regularMarketPrice;

            }
            catch(err){
                error(err);
            }
            
        }
    },
}
</script>
