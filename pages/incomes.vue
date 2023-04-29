<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-card class="pa-4">
                <v-card-title>
                    {{ $t('incomes') }}
                    <v-spacer></v-spacer>
                    <!-- EDIT MODAL -->
                    <NewIncome :edited-item="editedItem" />

                    <!-- DELETE MODAL -->
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5"> {{ $t('deleteConfirmation') }}</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete"> {{ $t('cancel') }}</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                                    {{ $t('confirm') }}</v-btn
                                >
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-title>
                <v-data-table :headers="headers" :items="incomes" sort-by="date">
                    <template #item.ticker.code="{ item }">
                        <span class="font-weight-bold">
                            {{ item.ticker.code }}
                        </span>
                    </template>

                    <template #item.amount="{ item }">
                        {{ parseFloat(item.amount)?.toFixed(2) }}
                    </template>

                    <template #item.quantity="{ item }">
                        {{ parseFloat(item.quantity)?.toFixed(2) }}
                    </template>

                    <template #item.unitPrice="{ item }">
                        {{ $utils.formatCurrency(item.unitPrice) }}
                    </template>

                    <template #item.yield="{ item }">
                        {{ $utils.formatPercentage(item.yield) }}
                    </template>

                    <template #item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
                        <v-icon small @click="deleteItem(item._id)"> mdi-delete </v-icon>
                    </template>

                    <template #no-data> {{ $t('noDataToShow') }} </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import NewIncome from '~/components/NewIncome.vue'
export default {
    name: 'IncomesPage',
    components: { NewIncome },
    data() {
        return {
            dialogDelete: false,
            itemToDelete: undefined,
            menu: false,
            modal: false,
            editedItem: {
                _id: '',
                ticker: {
                    code: '',
                    group: '',
                    name: '',
                    unitPrice: 0,
                },
                date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
                type: '',
                memo: '',
                amount: 0,
                quantity: 0,
            },

            headers: [
                { text: this.$t('date'), value: 'date' },
                { text: this.$t('ticker'), value: 'ticker.code', align: 'start' },
                { text: this.$t('type'), value: 'type' },
                { text: this.$t('memo'), value: 'memo' },
                { text: this.$t('amount'), value: 'amount' },
                { text: this.$t('quantity'), value: 'quantity' },
                { text: this.$t('unitPrice'), value: 'unitPrice' },
                { text: this.$t('yield'), value: 'yield' },
                { text: this.$t('actions'), value: 'actions' },
            ],
        }
    },
    computed: {
        incomes() {
            return this.$store.state.incomes.incomes || []
        },
    },
    watch: {
        // dialog(val) {
        //     val || this.close()
        // },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {},

    methods: {
        editItem(item) {
            this.editedItem = structuredClone(item)
        },

        deleteItem(itemId) {
            this.itemToDelete = itemId
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.$store.dispatch('incomes/delete', this.itemToDelete)
            this.closeDelete()
        },

        closeDelete() {
            this.dialogDelete = false
        },
    },
}
</script>
