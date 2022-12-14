<template>
    <client-only>
        <ApexChart type="bar" :options="chartOptions" :series="chartData"></ApexChart>
    </client-only>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    computed: {
        summary() {
            return this.$store.getters['incomes/summarizeAmountByMonth']
        },
        chartData() {
            return [{
                name: 'Incomes',
                data: this.summary != null ? this.summary.map(x => Number(x.amount.toFixed(2))) : []
            }]

        },
        chartOptions() {
            return {

                chart: {
                    id: 'incomes-30-days',
                    redrawOnParentResize: true,
                    redrawOnWindowResize: true
                },
                xaxis: {
                    categories: this.summary.map(x => x.date)
                },
                grid: {
                    borderColor: 'transparent'
                },
                stroke: {
                    show: false
                },
                legend: {
                    enabled: false
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val > 0 ? val : '';
                    },
                }

            }
        }
    }
}
</script>
