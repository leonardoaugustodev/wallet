<template>
    <v-container>
        <v-row>
            <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2">
                    One of three columns
                </v-card>
            </v-col>
            <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2">
                    <v-card-title>Incomes last year</v-card-title>

                    <Incomes30DaysChart></Incomes30DaysChart>
                </v-card>
            </v-col>
            <v-col cols="12" lg="4" md="6">
                <v-card class="pa-2">
                    <v-card-title>Distribuition</v-card-title>
                    <SummaryByTypeChart></SummaryByTypeChart>
                </v-card>
            </v-col>
        </v-row>

        <p>
            - Last entries
            - Incomes by month
            - This month incomes
            - Profit: all time, this year, this month
        </p>

    </v-container>


</template>
<script>
import SummaryByTypeChart from '~/components/Dashboard/SummaryByTypeChart.vue';
import Incomes30DaysChart from '~/components/Dashboard/Incomes30DaysChart.vue';
export default {
    name: 'IndexPage',
    components: { SummaryByTypeChart, Incomes30DaysChart },
    data() {
        return {
        }
    },
    computed: {
        incomesByMonth(){
            return this.$store.getters['incomes/summarizeAmountByMonth']
        }
    },
    watch: {
    },
    created() {
    },
    beforeDestroy() {
    },
    methods: {
    }
}
</script>
