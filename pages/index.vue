<template>
    <v-container>
        <v-row>
            <v-col cols="12" lg="3" md="6">
                <v-card>
                    <v-card-title>Invested this month</v-card-title>
                    <v-card-text>
                        <span class="accent--text text-h6 font-weight-bold">
                            {{ $utils.formatCurrency(investedThisMonth) }}
                        </span>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="3" md="6">
                <v-card>
                    <v-card-title>Total Invested</v-card-title>
                    <v-card-text>
                        <span class="accent--text text-h6 font-weight-bold">
                            {{ $utils.formatCurrency(investedTotal) }}
                        </span>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="3" md="6">
                <v-card>
                    <v-card-title>Total Current</v-card-title>
                    <v-card-text>
                        <span class="accent--text text-h6 font-weight-bold">
                            {{ $utils.formatCurrency(currentTotal) }}
                        </span>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="3" md="6">
                <v-card>
                    <v-card-title>Profit</v-card-title>
                    <v-card-text>
                        <span class="accent--text text-h6 font-weight-bold">
                            {{ $utils.formatCurrency(profit) }}
                        </span>
                        <v-chip
                            :color="$utils.getColor(profit) + ' '"
                            dark
                            label
                            small
                        >
                            {{ $utils.formatPercentage(profitPercentage) }}
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2"> One of three columns </v-card>
            </v-col>
            <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2">
                    <v-card-title>Incomes last year</v-card-title>
                    <IncomesLastYearChart></IncomesLastYearChart>
                </v-card>
            </v-col>
            <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2">
                    <v-card-title>Distribuition</v-card-title>
                    <SummaryByTypeChart></SummaryByTypeChart>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2"> - Last entries </v-card>
            </v-col>
        </v-row>

        <p>- This month incomes - Profit: all time, this year, this month</p>
    </v-container>
</template>
<script>
import SummaryByTypeChart from '~/components/Dashboard/SummaryByTypeTreeChart.vue'
import IncomesLastYearChart from '~/components/Dashboard/IncomesLastYearChart.vue'
export default {
    name: 'IndexPage',
    components: { SummaryByTypeChart, IncomesLastYearChart },
    data() {
        return {}
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
    },
    watch: {},
    created() {},
    beforeDestroy() {},
    methods: {},
}
</script>
