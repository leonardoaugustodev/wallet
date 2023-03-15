<template>
    <client-only>
        <ApexChart
            type="bar"
            :options="chartOptions"
            :series="chartData"
        ></ApexChart>
    </client-only>
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        summary() {
            return this.$store.getters['entries/summarizeInvestedByMonth']
        },
        aggregateByMonth() {
            const totals = this.summary.map((x) => x.total)
            const result = totals.map((x, i) => {
                return totals.slice(0, i+1).reduce((acc, cv) => acc + cv, 0)
            })

            return result
        },
        chartData() {
            return [
                {
                    name: 'Entries',
                    type: 'bar',
                    data:
                        this.summary != null
                            ? this.summary.map((x) =>
                                  Number(x.total.toFixed(2))
                              )
                            : [],
                },
                {
                    name: 'Aggregated',
                    type: 'line',
                    data:
                        this.aggregateByMonth != null
                            ? this.aggregateByMonth.map((x) =>
                                  Number(x.toFixed(2))
                              )
                            : [],
                },
            ]
        },
        chartOptions() {
            return {
                chart: {
                    foreColor: 'gray',
                    type: 'line',
                },
                stroke: {
                    width: 3,
                },
                tooltip: {
                    theme: 'dark',
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: (val) => {
                            return val !== 0
                                ? this.$utils.formatCurrency(val)
                                : ''
                        },
                    },
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
                    enabled: false,
                    formatter: function (val) {
                        return val !== 0 ? val : ''
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
