<template>
    <!-- EDIT MODAL -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
        <template #activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                small
                v-on="on"
            >
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
                                v-model="record.ticker.code"
                                label="Ticker"
                                outlined
                                dense
                                :rules="[rules.required]"
                                @change="retrieveTickerInfo"
                            ></v-text-field>

                            <!-- NAME -->
                            <v-text-field
                                v-model="record.ticker.name"
                                label="Name"
                                outlined
                                dense
                            ></v-text-field>

                            <!-- GROUP -->
                            <v-combobox
                                v-model="record.ticker.group"
                                :items="tickerGroups"
                                :rules="[rules.required]"
                                label="Group"
                                outlined
                                dense
                            ></v-combobox>

                            <!-- DATE -->
                            <v-menu
                                v-model="menu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                :rules="[rules.required]"
                                min-width="auto"
                            >
                                <template #activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="record.date"
                                        label="Date"
                                        readonly
                                        v-bind="attrs"
                                        outlined
                                        dense
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="record.date"
                                    @input="menu2 = false"
                                ></v-date-picker>
                            </v-menu>

                            <!-- DESCRIPTION -->
                            <v-text-field
                                v-model="record.description"
                                label="Description"
                                outlined
                                dense
                            ></v-text-field>

                            <!-- UNIT PRICE -->
                            <v-text-field
                                v-model="record.unitPrice"
                                label="Unit Price"
                                outlined
                                type="number"
                                dense
                                @change="updateEntryTotal"
                            ></v-text-field>

                            <!-- QUANTITY -->
                            <v-text-field
                                v-model="record.quantity"
                                label="Quantity"
                                outlined
                                type="number"
                                dense
                                @change="updateEntryTotal"
                            ></v-text-field>

                            <!-- TOTAL -->
                            <v-text-field
                                v-model="record.total"
                                label="Total"
                                readonly
                                outlined
                                dense
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                    Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'NewEntry',
    props: ['editedItem'],
    data() {
        return {
            record: {
                _id: '',
                ticker: {
                    code: '',
                    group: '',
                    name: '',
                },
                date: new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substr(0, 10),
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
                    Date.now() - new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substr(0, 10),
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0,
            },
            dialog: false,
            menu2: false,
            rules: {
                required: (value) => !!value || 'Required.',
            },
        }
    },
    computed: {
        tickerGroups() {
            return this.$store.getters['getInvestmentTypeNames']
        },
        formTitle() {
            return !this.record._id ? 'New Entry' : 'Edit Entry'
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        editedItem(val){
            this.record = structuredClone(val);
            this.dialog = true;
        }
    },
    created() {},
    methods: {
        save() {
            if (!this.validate(this.record)) {
                this.$notifier.showMessage({
                    content: 'Please fill all required fields!',
                    color: 'error',
                })
                return
            }

            if (this.editedIndex > -1) {
                this.$store.dispatch('entries/update', this.record)
                this.$notifier.showMessage({
                    content: 'The record was updated succesfully!',
                    color: 'info',
                })
            } else {
                this.$notifier.showMessage({
                    content: 'New record was saved succesfully!',
                    color: 'info',
                })
                this.$store.dispatch('entries/create', this.record)
            }

            this.close()
        },
        updateEntryTotal() {
            this.record.total =
                this.record.quantity * this.record.unitPrice
        },
        validate(entry) {
            if (entry && entry.ticker) {
                if (entry.date && entry.ticker.code && entry.ticker.group) {
                    return true
                }
            }
            return false
        },
        async retrieveTickerInfo(value) {
            try {
                const ticker = await this.$brapi.getQuotes(value)

                if (!ticker.results || !ticker.results.length) {
                    this.record.ticker.name = ''
                    return
                }

                const retrievedTicker = ticker.results[0]
                this.record.ticker.name = retrievedTicker.longName

                this.record = structuredClone(this.record)
            } catch (err) {
                this.record.ticker.name = ''
            }
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.record = structuredClone(this.defaultItem)
                this.editedIndex = -1
            })
        },
    },
}
</script>
