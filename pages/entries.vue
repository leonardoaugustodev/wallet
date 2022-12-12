<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-data-table :headers="headers" :items="entries" sort-by="tickerCode" class="elevation-1" dense>
                <template #top>
                    <v-toolbar flat>
                        <v-toolbar-title>Entries</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>

                        <NewEntry :edited-item="editedItem"></NewEntry>

                        <!-- DELETE MODAL -->
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5">Are you sure you want to delete this
                                    item?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>

                <!-- <template #item.date="{ item }">
                    {{ new Date(item.date.seconds * 1000).toLocaleDateString() }}
                </template> -->

                <template #item.unitPrice="{ item }">
                    {{ $utils.formatCurrency(item.unitPrice) }}
                </template>

                <template #item.quantity="{ item }">
                    {{ Number(item.quantity).toFixed(2) }}
                </template>

                <template #item.total="{ item }">
                    {{ $utils.formatCurrency(item.total) }}
                </template>

                <template #item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </template>

                <template #no-data> No data to show. </template>
            </v-data-table>
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
                date: new Date(
                    new Date().getTime() + new Date().getTimezoneOffset() * 60000
                ).toLocaleDateString(),
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
                date: new Date(
                    new Date().getTime() + new Date().getTimezoneOffset() * 60000
                ).toLocaleDateString(),
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0,
            },
            headers: [
                {
                    text: 'Ticker',
                    align: 'start',
                    value: 'ticker.code',
                },
                { text: 'Date', value: 'date' },
                { text: 'Group', value: 'ticker.group' },
                { text: 'Description', value: 'description' },
                { text: 'Unit Price', value: 'unitPrice' },
                { text: 'Quantity', value: 'quantity' },
                // { text: 'Tax', value: 'tax' },
                { text: 'Total', value: 'total' },
                { text: 'Actions', value: 'actions' },
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

    created() {
        // this.initialize()
    },

    methods: {
        // async initialize() {
        //     await this.$store.dispatch('entries/index');
        //     this.entries = this.$store.state.entries.entries;
        // },



        editItem(item) {
            this.editedIndex = this.entries.indexOf(item)
            this.editedItem = structuredClone(item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.entries.indexOf(item)
            this.editedItem = structuredClone(item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.$store.dispatch('entries/delete', this.editedItem._id)
            this.closeDelete()
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
