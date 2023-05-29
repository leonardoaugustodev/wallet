<template>
    <v-row dense justify="center" align="center">
        <v-col cols="12">
            <v-card class="pa-4">
                <v-card-title>
                    {{ $t('entries') }}
                    <v-spacer></v-spacer>
                    <NewEntry :edited-item="editedItem"></NewEntry>
                </v-card-title>

                <v-data-table :headers="headers" :items="entries" sort-by="tickerCode">
                    <template #item.ticker.code="{ item }">
                        <span class="font-weight-bold">
                            {{ item.ticker.code }}
                        </span>
                    </template>

                    <template #item.unitPrice="{ item }">
                        {{ $utils.formatCurrency(item.unitPrice) }}
                    </template>

                    <template #item.quantity="{ item }">
                        {{ Number(item.quantity).toFixed(2) }}
                    </template>

                    <template #item.total="{ item }">
                        <span :class="$utils.getTextColor(item.total)">
                            {{ $utils.formatCurrency(item.total) }}
                        </span>
                    </template>

                    <template #item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                    </template>

                    <template #no-data> {{ $t('noDataToShow') }} </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import NewEntry from '~/components/NewEntry.vue'
export default {
    name: 'EntryPage',
    components: { NewEntry },
    data() {
        return {
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            menu: false,
            modal: false,
            editedItem: {
                _id: '',
                ticker: {
                    code: '',
                    group: '',
                    name: '',
                },
                date: new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000).toLocaleDateString(),
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0,
            },
            defaultItem: {
                _id: '',
                ticker: {
                    code: '',
                    group: '',
                    name: '',
                },
                date: new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000).toLocaleDateString(),
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0,
            },
            headers: [
                {
                    text: this.$t('ticker'),
                    align: 'start',
                    value: 'ticker.code',
                },
                { text: this.$t('date'), value: 'date' },
                { text: this.$t('group'), value: 'ticker.group' },
                { text: this.$t('description'), value: 'description' },
                { text: this.$t('unitPrice'), value: 'unitPrice' },
                { text: this.$t('quantity'), value: 'quantity' },
                { text: this.$t('total'), value: 'total' },
                { text: this.$t('actions'), value: 'actions' },
            ],
        }
    },
    computed: {
        entries() {
            return this.$store.state.entries.entries || []
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {},

    methods: {
        editItem(item) {
            this.editedIndex = this.entries.indexOf(item)
            this.editedItem = structuredClone(item)
            this.dialog = true
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = structuredClone(this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = structuredClone(this.defaultItem)
                this.editedIndex = -1
            })
        },
    },
}
</script>

<style lang="scss">
thead {
    background: $table-header;
}
</style>
