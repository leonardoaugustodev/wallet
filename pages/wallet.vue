<template>

    <v-row justify="center" align="center">
        <v-col cols="12">

            <v-progress-linear v-model="value" color="deep-purple"></v-progress-linear>

            <v-data-table
:headers="headers" :items="entries" sort-by="tickerCode" :items-per-page="-1" class="elevation-1" dense
                group-by="ticker.group" :loading="loadingWallet">
                <template #top>
                    <v-toolbar flat>
                        <v-toolbar-title>Wallet</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <div class="ma-2" outlined>
                            <div class="text-caption">Current: </div>
                            {{ $utils.formatCurrency(totalCurrent) }}
                        </div>
                        <div class="ma-2" outlined>
                            <div class="text-caption">Paid: </div>
                            {{ $utils.formatCurrency(totalPaid) }}
                        </div>
                        <div class="ma-2" outlined>
                            <div class="text-caption">Profit: </div>
                            {{ $utils.formatCurrency(profit) }}
                        </div>

                    </v-toolbar>
                </template>

                <template #item.ticker.code="{ item }">
                    <TickerDetails :ticker="item"></TickerDetails>
                </template>

                <template #item.currentPrice="{ item }">
                    <span class="amber--text">
                        {{ $utils.formatCurrency(item.currentPrice) }}
                    </span>
                </template>
                <template #item.currentTotal="{ item }">
                    {{ $utils.formatCurrency(item.currentTotal) }}
                </template>
                <template #item.paidValue="{ item }">
                    {{ $utils.formatCurrency(item.paidValue) }}
                </template>
                <template #item.paidTotal="{ item }">
                    {{ $utils.formatCurrency(item.paidTotal) }}
                </template>
                <template #item.incomes="{ item }">
                    {{ $utils.formatCurrency(item.incomes) }}
                </template>
                <template #item.profit="{ item }">
                    <v-chip :color="$utils.getColor(item.profit)" dark label small>
                        {{ $utils.formatCurrency(item.profit) }}
                    </v-chip>
                </template>
                <template #item.profitPercentage="{ item }">
                    <v-chip :color="$utils.getColor(item.profitPercentage)" dark label small>
                        {{ $utils.formatPercentage(item.profitPercentage) }}
                    </v-chip>
                </template>
                <template #item.profitPlusIncome="{ item }">
                    <v-chip :color="$utils.getColor(item.profitPlusIncome)" dark label small>
                        {{ $utils.formatCurrency(item.profitPlusIncome) }}
                    </v-chip>
                </template>
                <template #item.profitPlusIncomePercentage="{ item }">
                    <v-chip :color="$utils.getColor(item.profitPlusIncomePercentage)" dark label small>
                        {{ $utils.formatPercentage(item.profitPlusIncomePercentage) }}
                    </v-chip>
                </template>
                <template #item.position="{ item }">
                    {{ $utils.formatPercentage(item.position) }}
                </template>
                <template #no-data>
                    No data to show!
                </template>
            </v-data-table>

            <span class="d-flex justify-end text--secondary text-caption mt-1">
                {{ `Last refresh: ${lastRefresh}` }}
            </span>
        </v-col>
    </v-row>
</template>

<script>
import TickerDetails from '~/components/TickerDetails.vue'
export default {
    name: 'WalletPage',
    components: {TickerDetails},
    data() {
        return {
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
                { text: 'Payed Value', value: 'paidValue' },
                { text: 'Payed Total', value: 'paidTotal' },
                { text: 'Current Price', value: 'currentPrice' },
                { text: 'Current Total', value: 'currentTotal' },
                { text: 'Profit', value: 'profit' },
                { text: 'Profit %', value: 'profitPercentage' },
                { text: 'Incomes', value: 'incomes' },
                { text: 'Profit + Inc.', value: 'profitPlusIncome' },
                { text: 'Profit + Inc. %', value: 'profitPlusIncomePercentage' },
                { text: 'Position', value: 'position' }
            ],
            value: 0,
            interval: 0,
            showTickerDetailsModal: false
        }
    },
    computed: {
        entries() {
            return this.$store.state?.wallet?.wallet || [];
        },
        lastRefresh() {
            return this.$store.state.wallet.lastRefresh;
        },
        formTitle() {
            return this.editedIndex === -1 ? 'New Entry' : 'Edit Entry'
        },
        totalPaid () {
            return this.$store.getters['wallet/getTotalByFieldName']('paidTotal');
        },
        totalCurrent () {
            return this.$store.getters['wallet/getTotalByFieldName']('currentTotal');
        },
        profit () {
            return this.totalCurrent - this.totalPaid;
        },
        loadingWallet(){
            return this.$store.state.wallet.isLoading;
        }
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

            // this.$store.dispatch('wallet/index');

            this.value = 0
            this.startBuffer()
        },
    },

    created() {
        // this.$store.subscribe((mutation) => {
        //     if (mutation.type === 'ticker/update') {
        //         // this.$store.dispatch('wallet/index')
        //     }
        // })
    },

    beforeDestroy() {
        clearInterval(this.interval)
    },

    methods: {


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
        },

        openTickerDetails(item){
            this.showTickerDetailsModal = true;
        }
    }
}
</script>
