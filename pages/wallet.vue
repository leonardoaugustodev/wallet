<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <!-- <v-progress-linear v-model="value" color="deep-purple"></v-progress-linear> -->
            <v-card class="pa-4">
                <v-card-title>Wallet</v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="entries"
                    sort-by="tickerCode"
                    :items-per-page="-1"
                    dense
                    group-by="ticker.group"
                    :loading="loadingWallet"
                >
                    <template #group.header="{ items, isOpen, toggle }">
                        <th colspan="4">
                            <v-icon @click="toggle">{{ isOpen ? 'mdi-minus' : 'mdi-plus' }} </v-icon>
                            {{ items[0].ticker.group }}
                        </th>
                        <th class="text-right">
                            {{ $utils.formatCurrency(calculateTotal(items, 'paidTotal')) }}
                        </th>
                        <th class="text-right">
                            {{ $utils.formatCurrency(calculateTotal(items, 'currentTotal')) }}
                        </th>
                        <th class="text-right" :class="$utils.getTextColor(calculateTotal(items, 'profit'))">
                            {{ $utils.formatCurrency(calculateTotal(items, 'profit')) }}
                        </th>
                        <th></th>
                        <th class="text-right">
                            {{ $utils.formatCurrency(calculateTotal(items, 'incomes')) }}
                        </th>
                        <th class="text-right" :class="$utils.getTextColor(calculateTotal(items, 'profitPlusIncome'))">
                            {{ $utils.formatCurrency(calculateTotal(items, 'profitPlusIncome')) }}
                        </th>
                        <th></th>
                        <th class="text-right">
                            {{ $utils.formatPercentage(calculateTotal(items, 'position')) }}
                        </th>
                    </template>

                    <template #item.ticker.code="{ item }">
                        <TickerDetails :ticker="item"></TickerDetails>
                    </template>

                    <template #item.quantity="{ item }">
                        {{ item.ticker.group === 'Crypto' ? item.quantity?.toFixed(4) : item.quantity?.toFixed(2) }}
                    </template>

                    <template #item.currentPrice="{ item }">
                        <span class="amber--text">
                            {{ $utils.formatCurrency(item.currentPrice) }}
                        </span>
                    </template>
                    <template #item.currentTotal="{ item }">
                        {{ $utils.formatCurrency(item.currentTotal) }}
                    </template>
                    <template #item.paidValue="{ item }" class="">
                        {{ $utils.formatCurrency(item.paidValue) }}
                    </template>
                    <template #item.paidTotal="{ item }">
                        {{ $utils.formatCurrency(item.paidTotal) }}
                    </template>
                    <template #item.incomes="{ item }">
                        {{ $utils.formatCurrency(item.incomes) }}
                    </template>
                    <template #item.profit="{ item }">
                        <span class="mr-1" :class="$utils.getTextColor(item.profit)">
                            {{ $utils.formatCurrency(item.profit) }}
                        </span>
                    </template>
                    <template #item.profitPercentage="{ item }">
                        <div class="d-flex">
                            <v-chip
                                :color="$utils.getColor(item.profitPercentage)"
                                dark
                                label
                                small
                                class="font-weight-black"
                            >
                                {{ $utils.formatPercentage(item.profitPercentage) }}
                            </v-chip>
                        </div>
                    </template>
                    <template #item.profitPlusIncome="{ item }">
                        <span class="mr-1" :class="$utils.getTextColor(item.profitPlusIncome)">
                            {{ $utils.formatCurrency(item.profitPlusIncome) }}
                        </span>
                    </template>
                    <template #item.profitPlusIncomePercentage="{ item }">
                        <v-chip
                            :color="$utils.getColor(item.profitPlusIncomePercentage)"
                            dark
                            label
                            small
                            class="font-weight-black"
                        >
                            {{ $utils.formatPercentage(item.profitPlusIncomePercentage) }}
                        </v-chip>
                    </template>
                    <template #item.position="{ item }">
                        {{ $utils.formatPercentage(item.position) }}
                    </template>
                    <template #no-data> No data to show! </template>
                </v-data-table>

                <span class="d-flex justify-end text--secondary text-caption mt-1">
                    {{ `Last refresh: ${lastRefresh?.toLocaleTimeString()}` }}
                </span>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import TickerDetails from '~/components/TickerDetails.vue'
export default {
    name: 'WalletPage',
    components: { TickerDetails },
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
                date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
                group: '',
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0,
            },
            defaultItem: {
                tickerCode: '',
                date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
                group: '',
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0,
            },
            headers: [
                {
                    text: 'Ticker',
                    align: 'start',
                    value: 'ticker.code',
                },
                // {
                //     text: 'Name',
                //     align: 'start',
                //     value: 'ticker.name',
                // },
                {
                    text: 'Group',
                    align: 'start',
                    value: 'ticker.group',
                },
                { text: 'Avg. Price', value: 'paidValue', align: 'right' },
                {
                    text: 'Current Price',
                    value: 'currentPrice',
                    align: 'right',
                },
                { text: 'Quantity', value: 'quantity', align: 'right' },
                { text: 'Invested Total', value: 'paidTotal', align: 'right' },
                {
                    text: 'Current Total',
                    value: 'currentTotal',
                    align: 'right',
                },
                { text: 'Profit', value: 'profit', align: 'right' },
                { text: 'Difference', value: 'profitPercentage' },
                { text: 'Incomes', value: 'incomes', align: 'right' },
                {
                    text: 'Profit + Inc.',
                    value: 'profitPlusIncome',
                    align: 'right',
                },
                {
                    text: 'Profit + Inc. %',
                    value: 'profitPlusIncomePercentage',
                },
                { text: 'Position', value: 'position', align: 'right' },
            ],
            value: 0,
            interval: 0,
            showTickerDetailsModal: false,
        }
    },
    computed: {
        entries() {
            return this.$store.state?.wallet?.wallet || []
        },
        lastRefresh() {
            return this.$store.state.wallet.lastRefresh
        },
        formTitle() {
            return this.editedIndex === -1 ? 'New Entry' : 'Edit Entry'
        },
        totalPaid() {
            return this.$store.getters['wallet/getTotalByFieldName']('paidTotal')
        },
        totalCurrent() {
            return this.$store.getters['wallet/getTotalByFieldName']('currentTotal')
        },
        profit() {
            return this.totalCurrent - this.totalPaid
        },
        loadingWallet() {
            return this.$store.state.wallet.isLoading
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
            this.editedItem.total = this.editedItem.quantity * this.editedItem.unitPrice
        },

        startBuffer() {
            clearInterval(this.interval)

            this.interval = setInterval(() => {
                this.value += 1
            }, 1000)
        },

        openTickerDetails(item) {
            this.showTickerDetailsModal = true
        },

        calculateTotal(items, field) {
            return items.reduce((acc, cv) => acc + cv[field], 0)
        },
    },
}
</script>
