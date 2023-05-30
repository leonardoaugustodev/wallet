<template>
    <v-row dense>
        <v-col cols="6">
            <v-menu
                v-model="startDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
                <template #activator="{ on, attrs }">
                    <v-text-field
                        v-model="startDate"
                        type="date"
                        :label="$t('startDate')"
                        readonly
                        v-bind="attrs"
                        outlined
                        dense
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="startDate" @input="startDateMenu = false"></v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="6">
            <v-menu
                v-model="endDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
            >
                <template #activator="{ on, attrs }">
                    <v-text-field
                        v-model="endDate"
                        type="date"
                        :label="$t('endDate')"
                        readonly
                        v-bind="attrs"
                        outlined
                        dense
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="endDate" @input="endDateMenu = false"></v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12">
            <v-card>
                <v-data-table :headers="columns" :items="reportData" sort-by="tickerCode" :items-per-page="-1">
                    <template #[`item.tickerCode`]="{ item }">
                        <span class="font-weight-bold">
                            {{ item.tickerCode }}
                        </span>
                    </template>

                    <template #item.quantity="{ item }">
                        {{ parseFloat(item.quantity)?.toFixed(2) }}
                    </template>

                    <template #item.value="{ item }">
                        {{ $utils.formatCurrency(item.value) }}
                    </template>

                    <template #item.incomes="{ item }">
                        {{ $utils.formatCurrency(item.incomes) }}
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'ReportsPage',
    components: {},

    data() {
        return {
            startDateMenu: false,
            startDate: null,
            endDateMenu: false,
            endDate: null,
            columns: [
                { text: this.$t('ticker'), value: 'tickerCode', align: 'start' },
                { text: this.$t('quantity'), value: 'quantity' },
                { text: this.$t('value'), value: 'value' },
                { text: this.$t('incomes'), value: 'incomes' },
            ],
        }
    },
    computed: {
        reportData() {
            const incomes = this.$store.getters['incomes/summarizeByTicker'](this.endDate, this.startDate)
            const entries = this.$store.getters['entries/summarizeByTicker'](this.endDate, this.startDate)
            const toReturn = []
            for (const tickerCode of Object.keys(entries)) {
                const value = entries[tickerCode]
                toReturn.push({
                    tickerCode,
                    quantity: value.quantity,
                    value: value.total,
                    incomes: 0,
                })
            }

            for (const tickerCode of Object.keys(incomes)) {
                let existingAggregate = toReturn.find((x) => x.tickerCode === tickerCode)

                if (!existingAggregate) {
                    existingAggregate = {
                        tickerCode,
                        quantity: 0,
                        value: 0,
                        incomes: 0,
                    };

                    toReturn.push(existingAggregate);
                }
                existingAggregate.incomes = incomes[tickerCode];
                
            }
            return toReturn
        },
    },
    watch: {},
    created() {
        const dt = new Date()
        dt.setFullYear(dt.getFullYear() - 1)
        dt.setDate(1)
        this.startDate = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().substring(0, 10)
        this.endDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10)
    },
    beforeDestroy() {},
    methods: {},
}
</script>

<style></style>
