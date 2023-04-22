<template>
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
                <v-chip :color="$utils.getColor(item.profitPercentage)" dark label small class="font-weight-black">
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
</template>

<script>
import TickerDetails from '~/components/TickerDetails.vue'

export default {
    components: { TickerDetails },
    props: ['entries'],
    data() {
        return {
            headers: [
                {
                    text: this.$t('ticker'),
                    align: 'start',
                    value: 'ticker.code',
                },
                // {
                //     text: 'Name',
                //     align: 'start',
                //     value: 'ticker.name',
                // },
                {
                    text: this.$t('group'),
                    align: 'start',
                    value: 'ticker.group',
                },
                { text: this.$t('averagePrice'), value: 'paidValue', align: 'right' },
                {
                    text: this.$t('currentPrice'),
                    value: 'currentPrice',
                    align: 'right',
                },
                { text: this.$t('quantity'), value: 'quantity', align: 'right' },
                { text: this.$t('totalInvested'), value: 'paidTotal', align: 'right' },
                {
                    text: this.$t('totalCurrent'),
                    value: 'currentTotal',
                    align: 'right',
                },
                { text: this.$t('profit'), value: 'profit', align: 'right' },
                { text: this.$t('difference'), value: 'profitPercentage' },
                { text: this.$t('incomes'), value: 'incomes', align: 'right' },
                {
                    text: this.$t('profitPlusIncome'),
                    value: 'profitPlusIncome',
                    align: 'right',
                },
                {
                    text: this.$t('profitPlusIncomePercentage'),
                    value: 'profitPlusIncomePercentage',
                },
                { text: this.$t('position'), value: 'position', align: 'right' },
            ],
        }
    },
    computed: {
        loadingWallet() {
            return this.$store.state.wallet.isLoading
        },
    },
    created() {
        // this.initialize()
    },
    methods: {
        calculateTotal(items, field) {
            return items.reduce((acc, cv) => acc + cv[field], 0)
        },
    },
}
</script>
