<template>
    <client-only>
        <ApexChart
            type="treemap"
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
                ? [
                      {
                          data: Object.keys(this.summary).map((x) => {
                              return {
                                  x: x,
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
                    },
                },
                stroke: {
                    show: false,
                },
                theme: {
                    palette: 'palette10',
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '12px',
                    },
                    formatter: (text, op) => {
                        return [text, this.$utils.formatCurrency(op.value)]
                    },
                    offsetY: -4,
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
