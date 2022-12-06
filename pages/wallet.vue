<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-data-table :headers="headers" :items="entries" sort-by="tickerCode" class="elevation-1" dense>
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Wallet</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>

                        <!-- EDIT MODAL -->
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" small>
                                    New Entry
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

                                                <!-- TICKER -->
                                                <v-text-field v-model="editedItem.tickerCode"
                                                    label="Ticker"></v-text-field>

                                                <!-- DATE -->
                                                <v-menu v-model="menu2" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    min-width="auto">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-model="editedItem.date" label="Date" readonly
                                                            v-bind="attrs" v-on="on"></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="editedItem.date"
                                                        @input="menu2 = false"></v-date-picker>
                                                </v-menu>

                                                <!-- DESCRIPTION -->
                                                <v-text-field v-model="editedItem.description"
                                                    label="Description"></v-text-field>

                                                <!-- UNIT PRICE -->
                                                <v-text-field v-model="editedItem.unitPrice"
                                                    label="Unit Price" @change="updateEntryTotal"></v-text-field>

                                                <!-- QUANTITY -->
                                                <v-text-field v-model="editedItem.quantity"
                                                    label="Quantity" @change="updateEntryTotal"></v-text-field>

                                                <!-- TOTAL -->
                                                <v-text-field v-model="editedItem.total" label="Total" readonly></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close">
                                        Cancel
                                    </v-btn>
                                    <v-btn color="blue darken-1" text @click="save">
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <!-- DELETE MODAL -->
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="initialize">
                        Reset
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'WalletPage',
    
    data() {
        return {
            entries: [],
            tickers: ['EZTC3','KLBN11','SULA11','MOVI3','TASA4','PARD3','PRIO3','RENT3','BPAC11','HYPE3','IVVB11','MRVE3'],
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            menu: false,
            modal: false,
            menu2: false,
            editedItem: {
                tickerCode: '',
                date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                group: '',
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0
            },
            defaultItem: {
                tickerCode: '',
                date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                group: '',
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0
            },
            headers: [
                {
                    text: 'Ticker',
                    align: 'start',
                    value: 'ticker.code',
                },
                {
                    text: 'Name',
                    align: 'start',
                    value: 'ticker.name',
                },
                {
                    text: 'Group',
                    align: 'start',
                    value: 'ticker.group',
                },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Today Value', value: 'todayValue' },
                { text: 'Payed Value', value: 'paidValue' },
                { text: 'Total Paid', value: 'paidTotal' },
                { text: 'Today Total', value: 'todayTotal' },
                { text: 'Profit', value: 'profit' },
                { text: 'Dividend', value: 'dividends' },
                { text: 'Position', value: 'position' }
            ],
            entries: []
        }
    },
    computed: {
       
        formTitle() {
            return this.editedIndex === -1 ? 'New Entry' : 'Edit Entry'
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
        // this.initialize()
        this.retrieveTickers();
    },

    methods: {
        initialize() {
            this.entries = [
                {
                    ticker: {
                        code: 'EZTC3',
                        name: 'Ezetec',
                        group: 'Stock',
                    },
                    quantity: 43,
                    todayValue: 0,
                    paidValue: 0,
                    paidTotal: 0,
                    todayTotal: 0,
                    profit: 0,
                    dividends: 0,
                    position: '5%'
                },
                {
                    ticker: {
                        code: 'EZTC3',
                        name: 'Ezetec',
                        group: 'Stock',
                    },
                    quantity: 43,
                    todayValue: 0,
                    paidValue: 0,
                    paidTotal: 0,
                    todayTotal: 0,
                    profit: 0,
                    dividends: 0,
                    position: '5%'
                },
                {
                    ticker: {
                        code: 'EZTC3',
                        name: 'Ezetec',
                        group: 'Stock',
                    },
                    quantity: 43,
                    todayValue: 0,
                    paidValue: 0,
                    paidTotal: 0,
                    todayTotal: 0,
                    profit: 0,
                    dividends: 0,
                    position: '5%'
                },
                {
                    ticker: {
                        code: 'EZTC3',
                        name: 'Ezetec',
                        group: 'Stock',
                    },
                    quantity: 43,
                    todayValue: 0,
                    paidValue: 0,
                    paidTotal: 0,
                    todayTotal: 0,
                    profit: 0,
                    dividends: 0,
                    position: '5%'
                },
                {
                    ticker: {
                        code: 'EZTC3',
                        name: 'Ezetec',
                        group: 'Stock',
                    },
                    quantity: 43,
                    todayValue: 0,
                    paidValue: 0,
                    paidTotal: 0,
                    todayTotal: 0,
                    profit: 0,
                    dividends: 0,
                    position: '5%'
                },
                {
                    ticker: {
                        code: 'EZTC3',
                        name: 'Ezetec',
                        group: 'Stock',
                    },
                    quantity: 43,
                    todayValue: 0,
                    paidValue: 0,
                    paidTotal: 0,
                    todayTotal: 0,
                    profit: 0,
                    dividends: 0,
                    position: '5%'
                },
                {
                    ticker: {
                        code: 'EZTC3',
                        name: 'Ezetec',
                        group: 'Stock',
                    },
                    quantity: 43,
                    todayValue: 0,
                    paidValue: 0,
                    paidTotal: 0,
                    todayTotal: 0,
                    profit: 0,
                    dividends: 0,
                    position: '5%'
                },
                {
                    ticker: {
                        code: 'EZTC3',
                        name: 'Ezetec',
                        group: 'Stock',
                    },
                    quantity: 43,
                    todayValue: 0,
                    paidValue: 0,
                    paidTotal: 0,
                    todayTotal: 0,
                    profit: 0,
                    dividends: 0,
                    position: '5%'
                }
            ]
        },

        async retrieveTickers(){

            try{
                const tickers = await this.$axios.$get(`https://brapi.dev/api/quote/${this.tickers.join('%2C')}?range=1d&interval=1d&fundamental=true`)
                
                const entries = this.$store.state.entries.entries || [];

                const summary = [];
                
                for(let entry of entries){
                    console.log(entry);
                    let reduced = summary[entry.ticker.code];
                    
                    if(!reduced) {
                        reduced = {
                            quantity: 0,
                            price: 0,
                            total: 0
                        };
                    }

                    reduced.quantity += entry?.quantity || 0;
                    reduced.total += entry?.total || 0;
                    reduced.price = reduced.total / reduced.quantity;

                    summary[entry.ticker.code] = reduced;
                }

                console.log(summary);

                this.entries = tickers.results.map(ticker => {

                    return {
                        'ticker': {
                            code: ticker.symbol,
                            name: ticker.shortName,
                            group: 'Stock'
                        },
                        quantity: (summary[ticker.symbol]?.quantity)?.toFixed(2) || 0,
                        todayValue: ticker.regularMarketPrice,
                        paidValue: (summary[ticker.symbol]?.price)?.toFixed(2) || 0,
                        paidTotal: (summary[ticker.symbol]?.total)?.toFixed(2) || 0,
                        todayTotal: (ticker.regularMarketPrice * summary[ticker.symbol]?.quantity)?.toFixed(2) || 0,
                        profit: 0,
                        dividends: 0, 
                        position: 0
                    }
                })
            }
            catch(err){
                console.log(err);
            }
        },

        editItem(item) {
            this.editedIndex = this.entries.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.entries.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.entries.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.entries[this.editedIndex], this.editedItem)
            } else {
                this.entries.push(this.editedItem)
            }
            this.close()
        },

        updateEntryTotal() {
            this.editedItem.total = this.editedItem.quantity * this.editedItem.unitPrice; 
        }
    },
}
</script>
