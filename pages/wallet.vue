<template>

    <v-row justify="center" align="center">
        <v-col cols="12">

            <v-progress-linear v-model="value"></v-progress-linear>

            <v-data-table :headers="headers" :items="entries" sort-by="tickerCode" class="elevation-1" dense
                group-by="ticker.group">
                <template #top>
                    <v-toolbar flat>
                        <v-toolbar-title>Wallet</v-toolbar-title>
                    </v-toolbar>
                </template>
                <template #item.profit="{ item }">
                    <v-chip :color="$utils.getColor(item.profit)" dark label small>
                        {{ $utils.formatCurrency(item.profit) }}
                    </v-chip>
                </template>
                <template #item.profitPercentage="{ item }">
                    <v-chip :color="$utils.getColor(item.profitPercentage)" dark label small>
                        {{ item.profitPercentage }}
                    </v-chip>
                </template>
                <template #no-data>
                    <v-btn color="primary" @click="initialize">
                        Reset
                    </v-btn>
                </template>
            </v-data-table>

            <span class="d-flex justify-end text--secondary text-caption mt-1">
                {{ `Last refresh: ${lastRefresh}` }}
            </span>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'WalletPage',

    data() {
        return {
            entries: [],
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
                { text: 'Profit %', value: 'profitPercentage' },
                { text: 'Dividend', value: 'dividends' },
                { text: 'Position', value: 'position' }
            ],
            value: 0,
            interval: 0,
            lastRefresh: new Date().toLocaleTimeString()
        }
    },
    computed: {
        tickers() {
            const tickers = this.$store.state.entries.entries.map(e => e.ticker.code);
            return tickers.filter((v, i, a) => a.indexOf(v) === i);
        },
        stockTickers() {
            const stockTickers = this.$store.state.entries.entries.filter(s => s.ticker.group === 'Stock');
            const tickers = stockTickers.map(e => e.ticker.code);
            return tickers.filter((v, i, a) => a.indexOf(v) === i);
        },
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
        value(val) {
            if (val < 100) return

            this.initialize()

            this.value = 0
            this.startBuffer()
        },
    },

    created() {
        this.initialize()

        this.$store.subscribe((mutation, state) => {
            if (mutation.type === 'entries/index') {
                this.initialize()
            }
        })

        // this.startBuffer()
    },

    beforeDestroy() {
        clearInterval(this.interval)
    },

    methods: {
        async initialize() {

            try {

                if (!this.tickers.length) return;

                this.entries = [];

                const tickers = await this.$axios.$get(`https://brapi.dev/api/quote/${this.stockTickers.join('%2C')}?range=1d&interval=1d&fundamental=true`)

                const entries = this.$store.state.entries.entries || [];
                
                const summary = [];

                for (const entry of entries) {
                    let reduced = summary[entry.ticker.code];

                    if (!reduced) {
                        reduced = {
                            ...entry,
                            quantity: 0,
                            price: 0,
                            total: 0
                        };
                    }

                    reduced.quantity += Number(entry?.quantity || 0);
                    reduced.total += Number(entry?.total || 0);
                    reduced.price = Number(reduced.total / reduced.quantity);

                    summary[entry.ticker.code] = reduced;
                }

                for (const entry of entries) {
                    let reduced = summary[entry.ticker.code];

                    if (!reduced) {
                        reduced = {
                            ...entry,
                            quantity: 0,
                            price: 0,
                            total: 0
                        };
                    }

                    reduced.quantity += Number(entry?.quantity || 0);
                    reduced.total += Number(entry?.total || 0);
                    reduced.price = Number(reduced.total / reduced.quantity);

                    summary[entry.ticker.code] = reduced;
                }

                // MERGE WITH SERVER DATA
                for (const tickerCode in summary) {
                    const entry = summary[tickerCode];

                    const serverTicker = tickers.results.find(t => t.symbol === tickerCode);

                    if (serverTicker) {
                        entry.todayTotal = serverTicker.regularMarketPrice * entry?.quantity;
                        entry.todayValue = serverTicker.regularMarketPrice;
                    }
                    else {
                        entry.todayTotal = 1 * entry?.quantity;
                        entry.todayValue = 1;
                    }

                    const profit = (entry?.todayTotal || 0) - (entry?.total || 0);

                    this.entries.push(
                        {
                            'ticker': {
                                code: tickerCode,
                                name: entry.ticker.name,
                                group: entry.ticker.group
                            },
                            quantity: entry?.quantity || 0,
                            todayValue: this.$utils.formatCurrency(entry?.todayValue),
                            paidValue: this.$utils.formatCurrency(entry?.price),
                            paidTotal: this.$utils.formatCurrency(entry?.total),
                            todayTotal: this.$utils.formatCurrency(entry?.todayTotal),
                            profit,
                            profitPercentage: this.$utils.formatPercentage(profit / (entry?.total || 1)),
                            dividends: this.$store.getters['incomes/getAmountByTicker'](tickerCode),
                            position: 0
                        }
                    )
                }

                this.lastRefresh = new Date().toLocaleTimeString();
            }
            catch (err) {
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
        },

        startBuffer() {
            clearInterval(this.interval)

            this.interval = setInterval(() => {
                this.value += 1
            }, 1000)
        }
    }
}
</script>
