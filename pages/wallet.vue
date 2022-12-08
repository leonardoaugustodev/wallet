<template>

    <v-row justify="center" align="center">
        <v-col cols="12">

            <v-progress-linear v-model="value"></v-progress-linear>

            <v-data-table
:headers="headers" :items="entries" sort-by="tickerCode" class="elevation-1" dense
                group-by="ticker.group">
                <template #top>
                    <v-toolbar flat>
                        <v-toolbar-title>Wallet</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <div class="ma-2" outlined>
                            <div class="text-caption">Current: </div>
                            {{ $utils.formatCurrency(totalToday) }}
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
                <template #item.todayValue="{ item }">
                    {{ $utils.formatCurrency(item.todayValue) }}
                </template>
                <template #item.todayTotal="{ item }">
                    {{ $utils.formatCurrency(item.todayTotal) }}
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
export default {
    name: 'WalletPage',

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
                { text: 'Today Value', value: 'todayValue' },
                { text: 'Payed Value', value: 'paidValue' },
                { text: 'Total Paid', value: 'paidTotal' },
                { text: 'Today Total', value: 'todayTotal' },
                { text: 'Profit', value: 'profit' },
                { text: 'Profit %', value: 'profitPercentage' },
                { text: 'Incomes', value: 'incomes' },
                { text: 'Profit + Inc.', value: 'profitPlusIncome' },
                { text: 'Profit + Inc. %', value: 'profitPlusIncomePercentage' },
                { text: 'Position', value: 'position' }
            ],
            value: 0,
            interval: 0
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
        totalToday () {
            return this.$store.getters['wallet/getTotalByFieldName']('todayTotal');
        },
        profit () {
            return this.totalToday - this.totalPaid;
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

            this.$store.dispatch('wallet/index');

            this.value = 0
            this.startBuffer()
        },
    },

    created() {
        // this.initialize()
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
        }
    }
}
</script>
