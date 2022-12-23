<template>
    <client-only>
        <ApexChart type="bar" :options="chartOptions" :series="chartData"></ApexChart>
    </client-only>
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        summary() {
            return this.$store.getters['incomes/summarizeAmountByMonth']
        },
        chartData() {
            return [
                {
                    name: this.$t('incomes'),
                    data:
                        this.summary != null
                            ? this.summary.map((x) =>
                                Number(x.amount.toFixed(2))
                            )
                            : [],
                },
            ]
        },
        chartOptions() {
            return {
                chart: {
                    foreColor: 'gray',
                },
                stroke: {
                    width: 1,
                },
                tooltip: {
                    theme: 'dark',
                },
                grid: {
                    borderColor: 'gray',
                },
                xaxis: {
                    categories: this.summary.map((x) => x.date),

                    labels: {
                        style: {
                            colors: 'gray',
                        },
                    },
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: 'gray',
                        },
                    },
                },
                legend: {
                    enabled: false,
                },
                dataLabels: {
                    formatter: function (val) {
                        return val > 0 ? val : ''
                    },
                },
                theme: {
                    palette: 'palette10',
                },
            }
        },
    },
}
</script>
