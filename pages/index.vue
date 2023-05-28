<template>
    <v-container fluid>
        <v-row>
            <!-- INVESTED THIS MONTH -->
            <v-col cols="12" lg="3" md="6">
                <v-card>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <div class="text-overline mb-4">
                                {{ $t('investedThisMonth') }}
                            </div>
                            <v-list-item-title class="text-h5 mb-1">
                                <span
                                    class="primary--text text-h6 font-weight-bold"
                                >
                                    {{
                                        $utils.formatCurrency(investedThisMonth)
                                    }}
                                </span>
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-avatar tile>
                            <v-icon x-large class="card-icon"
                                >mdi-currency-usd
                            </v-icon>
                        </v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </v-col>

            <!-- TOTAL INVESTED -->
            <v-col cols="12" lg="3" md="6">
                <v-card>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <div class="text-overline mb-4">
                                {{ $t('totalInvested') }}
                            </div>
                            <v-list-item-title class="text-h5 mb-1">
                                <span
                                    class="primary--text text-h6 font-weight-bold"
                                >
                                    {{ $utils.formatCurrency(investedTotal) }}
                                </span>
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-avatar tile>
                            <v-icon x-large class="card-icon"
                                >mdi-currency-usd
                            </v-icon>
                        </v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </v-col>

            <!-- TOTAL CURRENT -->
            <v-col cols="12" lg="3" md="6">
                <v-card>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <div class="text-overline mb-4">
                                {{ $t('totalCurrent') }}
                            </div>
                            <v-list-item-title class="text-h5 mb-1">
                                <span
                                    class="primary--text text-h6 font-weight-bold"
                                >
                                    {{ $utils.formatCurrency(currentTotal) }}
                                </span>
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-avatar tile>
                            <v-icon x-large class="card-icon"
                                >mdi-currency-usd
                            </v-icon>
                        </v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </v-col>

            <!-- PROFIT -->
            <v-col cols="12" lg="3" md="6">
                <v-card>
                    <v-list-item two-line>
                        <v-list-item-content>
                            <div class="text-overline mb-4">{{ $t('profit') }}</div>
                            <v-list-item-title class="text-h5 mb-1">
                                <span
                                    class="accent--text text-h6 font-weight-bold"
                                >
                                    {{ $utils.formatCurrency(profit) }}
                                </span>
                                <v-chip
                                    :color="$utils.getColor(profit) + ' '"
                                    dark
                                    label
                                    small
                                >
                                    {{
                                        $utils.formatPercentage(
                                            profitPercentage
                                        )
                                    }}
                                </v-chip>
                            </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-avatar tile>
                            <v-icon x-large class="card-icon"
                                >mdi-finance
                            </v-icon>
                        </v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <!-- INVESTED LAST YEAR -->
            <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2" height="min">
                    <v-card-title class="text-overline mb-4"
                        >{{ $t('investedLastYear') }}</v-card-title
                    >
                    <EntriesLastYearChart></EntriesLastYearChart>
                </v-card>
            </v-col>

             <!-- INCOMES LAST YEAR -->
             <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2">
                    <v-card-title class="text-overline mb-4"
                        >{{ $t('incomesLastYear') }}</v-card-title
                    >
                    <IncomesLastYearChart></IncomesLastYearChart>
                </v-card>
            </v-col>

            <!-- DISTRIBUITION -->
            <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2">
                    <v-card-title class="text-overline mb-4"
                        >{{ $t('distribuition') }}</v-card-title
                    >
                    <SummaryByTypeChart></SummaryByTypeChart>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <!-- LAST ENTRIES -->
            <v-col cols="12">
                <v-card class="pa-2">
                    <v-card-title class="text-overline mb-4"
                        >{{ $t('lastEntries') }}</v-card-title
                    >
                    <v-data-table
                        :headers="headers"
                        :items="lastEntries"
                        sort-by="date"
                        dense
                    >
                        <template #item.unitPrice="{ item }">
                            {{ $utils.formatCurrency(item.unitPrice) }}
                        </template>

                        <template #item.date="{ item }">
                            {{
                                `${new Date(item.date).getDate()}/${
                                    new Date(item.date).getMonth() + 1
                                }`
                            }}
                        </template>

                        <template #item.quantity="{ item }">
                            {{ Number(item.quantity).toFixed(2) }}
                        </template>

                        <template #item.total="{ item }">
                            {{ $utils.formatCurrency(item.total) }}
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>

           
        </v-row>
    </v-container>
</template>

<script>
import SummaryByTypeChart from '~/components/Dashboard/SummaryByTypeTreeChart.vue'
import IncomesLastYearChart from '~/components/Dashboard/IncomesLastYearChart.vue'
import EntriesLastYearChart from '~/components/Dashboard/EntriesLastYearChart.vue'
export default {
    name: 'IndexPage',
    components: {
        SummaryByTypeChart,
        IncomesLastYearChart,
        EntriesLastYearChart,
    },
    data() {
        return {
            headers: [
                { text: this.$t('date'), value: 'date' },
                { text: this.$t('ticker'), value: 'ticker.code' },
                { text: this.$t('unitPrice'), value: 'unitPrice' },
                { text: this.$t('quantity'), value: 'quantity' },
                { text: this.$t('total'), value: 'total' },
            ],
        }
    },
    computed: {
        incomesByMonth() {
            return this.$store.getters['incomes/summarizeAmountByMonth']
        },
        investedThisMonth() {
            return this.$store.getters['entries/summarizeInvestedThisMonth']
        },
        investedTotal() {
            return this.$store.getters['entries/summarizeInvestedTotal']
        },
        currentTotal() {
            return this.$store.getters['wallet/getTotalByFieldName'](
                'currentTotal'
            )
        },
        profit() {
            return this.currentTotal - this.investedTotal
        },
        profitPercentage() {
            return this.profit / this.investedTotal
        },
        lastEntries() {
            return this.$store.getters['entries/getLast10Entries']
        },
    },
    watch: {},
    created() {},
    beforeDestroy() {},
    methods: {},
}
</script>

<style>
.card-icon {
    mix-blend-mode: overlay;
    filter: brightness(0.7);
}
</style>
