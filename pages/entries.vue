<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-data-table :headers="headers" :items="entries" sort-by="tickerCode" class="elevation-1" dense>
                <template #top>
                    <v-toolbar flat>
                        <v-toolbar-title>Entries</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>

                        <!-- EDIT MODAL -->
                        <v-dialog v-model="dialog" max-width="500px">
                            <template #activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" small v-on="on">
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
                                                <v-text-field
v-model="editedItem.ticker.code" label="Ticker" outlined
                                                    dense :rules="[rules.required]"
                                                    @change="retrieveTickerInfo"></v-text-field>

                                                <!-- NAME -->
                                                <v-text-field
v-model="editedItem.ticker.name" label="Name" outlined
                                                    dense></v-text-field>

                                                <!-- GROUP -->
                                                <v-combobox
v-model="editedItem.ticker.group" :items="tickerGroups"
                                                    :rules="[rules.required]" label="Group" outlined dense></v-combobox>

                                                <!-- DATE -->
                                                <v-menu
v-model="menu2" :close-on-content-click="false"
                                                    :nudge-right="40" transition="scale-transition" offset-y :rules="[rules.required]"
                                                    min-width="auto">
                                                    <template #activator="{ on, attrs }">
                                                        <v-text-field
v-model="editedItem.date" label="Date" readonly
                                                            v-bind="attrs" outlined dense v-on="on"></v-text-field>
                                                    </template>
                                                    <v-date-picker
v-model="editedItem.date"
                                                        @input="menu2 = false"></v-date-picker>
                                                </v-menu>

                                                <!-- DESCRIPTION -->
                                                <v-text-field
v-model="editedItem.description" label="Description"
                                                    outlined dense></v-text-field>

                                                <!-- UNIT PRICE -->
                                                <v-text-field
v-model="editedItem.unitPrice" label="Unit Price" outlined
                                                    dense @change="updateEntryTotal"></v-text-field>

                                                <!-- QUANTITY -->
                                                <v-text-field
v-model="editedItem.quantity" label="Quantity" outlined
                                                    dense @change="updateEntryTotal"></v-text-field>

                                                <!-- TOTAL -->
                                                <v-text-field
v-model="editedItem.total" label="Total" readonly outlined
                                                    dense></v-text-field>
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
                <template #item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </template>
                <template #no-data>
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
            rules: {
                required: value => !!value || 'Required.',
            },
            tickerGroups: [
                'Stock', 'FII', 'International', 'Crypto', 'Fixed Income', 'Saving'
            ],
            editedItem: {
                _id: '',
                ticker: {
                    code: '',
                    group: '',
                    name: ''
                },
                date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0
            },
            defaultItem: {
                _id: '',
                ticker: {
                    code: '',
                    group: '',
                    name: '',
                },
                date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
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
                { text: 'Actions', value: 'actions' },

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
        async initialize() {
            await this.$store.dispatch('entries/index');
            this.entries = this.$store.state.entries.entries;
        },

        async retrieveTickerInfo(value) {
            try {
                const ticker = await this.$axios.$get(`https://brapi.dev/api/quote/${value}?range=1d&interval=1d&fundamental=true`);

                if (!ticker.results || !ticker.results.length) {
                    this.editedItem.ticker.name = '';
                    return;
                }

                const retrievedTicker = ticker.results[0];
                this.editedItem.ticker.name = retrievedTicker.longName;

                this.editedItem = structuredClone(this.editedItem)

            }
            catch (err) {
                this.editedItem.ticker.name = '';
            }

        },

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

        save() {
            if (this.editedIndex > -1) {
                this.$store.dispatch('entries/update', this.editedItem);
            } else {
                this.$store.dispatch('entries/create', this.editedItem);
            }
            this.close()
        },

        updateEntryTotal() {
            this.editedItem.total = this.editedItem.quantity * this.editedItem.unitPrice;
        }
    },
}
</script>
