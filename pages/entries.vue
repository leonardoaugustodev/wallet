<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-data-table :headers="headers" :items="entries" sort-by="tickerCode" class="elevation-1" dense>
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Entries</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>

                        <!-- EDIT MODAL -->
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" small>
                                    New Entry
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col>

                                                <!-- TICKER -->
                                                <v-text-field v-model="editedItem.tickerCode"
                                                    label="Ticker"></v-text-field>

                                                <!-- DATE -->
                                                <v-menu v-model="menu2" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y
                                                    min-width="auto">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-model="editedItem.date" label="Date" readonly
                                                            v-bind="attrs" v-on="on"></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="editedItem.date"
                                                        @input="menu2 = false"></v-date-picker>
                                                </v-menu>

                                                <!-- DESCRIPTION -->
                                                <v-text-field v-model="editedItem.description"
                                                    label="Description"></v-text-field>

                                                <!-- UNIT PRICE -->
                                                <v-text-field v-model="editedItem.unitPrice"
                                                    label="Unit Price" @change="updateEntryTotal"></v-text-field>

                                                <!-- QUANTITY -->
                                                <v-text-field v-model="editedItem.quantity"
                                                    label="Quantity" @change="updateEntryTotal"></v-text-field>

                                                <!-- TOTAL -->
                                                <v-text-field v-model="editedItem.total" label="Total" readonly></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close">
                                        Cancel
                                    </v-btn>
                                    <v-btn color="blue darken-1" text @click="save">
                                        Save
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <!-- DELETE MODAL -->
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
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
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="initialize">
                        Reset
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'EntryPage',
    data() {
        return {
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            menu: false,
            modal: false,
            menu2: false,
            editedItem: {
                tickerCode: '',
                date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                group: '',
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0
            },
            defaultItem: {
                tickerCode: '',
                date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                group: '',
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0
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
                { text: 'Tax', value: 'tax' },
                { text: 'Total', value: 'total' },
            ],
            entries: []
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Entry' : 'Edit Entry'
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
        this.initialize()
    },

    methods: {
        initialize() {
            this.entries = this.$store.state.entries.entries;
        },

        editItem(item) {
            this.editedIndex = this.entries.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.entries.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.entries.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.entries[this.editedIndex], this.editedItem)
            } else {
                this.entries.push(this.editedItem)
            }
            this.close()
        },

        updateEntryTotal() {
            this.editedItem.total = this.editedItem.quantity * this.editedItem.unitPrice; 
        }
    },
}
</script>
