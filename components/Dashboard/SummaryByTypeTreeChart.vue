<template>
    <client-only>
        <ApexChart type="treemap" :options="chartOptions" :series="chartData"></ApexChart>
    </client-only>
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        total() {
            return this.$store.getters['entries/summarizeInvestedTotal']
        },
        summary() {
            return this.$store.getters['entries/summarizeByType']
        },
        chartData() {
            return this.summary != null
                ? [
                    {
                        data: Object.keys(this.summary).map((x) => {
                            return {
                                x,
                                y: Number(this.summary[x].total.toFixed(2)),
                            }
                        }),
                    },
                ]
                : []
        },
        chartOptions() {
            return {
                plotOptions: {
                    treemap: {
                        distributed: true,
                        enableShades: false,
                        useFillColorAsStroke: true
                    },
                },
                
                theme: {
                    palette: 'palette10',
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '14px',
                        colors: ['#ddd']
                    },
                    formatter: (text, op) => {
                        return [text, this.$utils.formatCurrency(op.value), this.$utils.formatPercentage(op.value / this.total)]
                    },
                },
                tooltip: {
                    theme: 'dark',
                },
                colors: ['#A300D6', '#7D02EB', '#5653FE', '#2983FF', '#00B1F2'],
            }
        },
    },
}
</script>
