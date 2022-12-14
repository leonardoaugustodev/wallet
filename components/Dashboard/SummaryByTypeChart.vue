<template>
    <client-only>
        <ApexChart
            type="pie"
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
            return this.$store.getters['entries/summarizeByType']
        },
        chartData() {
            return this.summary != null
                ? Object.keys(this.summary).map((x) =>
                      Number(this.summary[x].total.toFixed(2))
                  )
                : []
        },
        chartOptions() {
            return {
                chart: {
                    id: 'summary-by-type',
                    redrawOnParentResize: true,
                    redrawOnWindowResize: true,
                },
                labels: Object.keys(this.summary),
                grid: {
                    borderColor: 'transparent',
                },
                stroke: {
                    show: false,
                },
                legend: {
                    labels: {
                        colors: '#FFF',
                    },
                    position: 'bottom',
                },
                theme: {
                    palette: 'palette10',
                },
                tooltip: {
                    formatter: function (val) {
                        return `@@${val}`
                    },
                }
            }
        },
    },
}
</script>
