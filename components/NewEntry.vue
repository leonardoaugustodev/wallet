<template>
    <!-- EDIT MODAL -->
    <v-dialog v-model="dialog" max-width="500px" persistent @keydown="handleKeyPress">
        <template #activator="{ on, attrs }">
            <v-btn color="primary" dark depressed v-bind="attrs" small v-on="on">
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
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <!-- GROUP -->
                                <v-combobox
v-model="record.ticker.group" :items="tickerGroups"
                                    :rules="[rules.required]" label="Type" outlined dense></v-combobox>

                                <!-- TICKER -->
                                <v-text-field
v-model="record.ticker.code" label="Ticker" outlined dense
                                    :rules="[rules.required]" @change="retrieveTickerInfo"></v-text-field>

                                <!-- NAME -->
                                <v-text-field v-model="record.ticker.name" label="Name" outlined dense></v-text-field>

                                <!-- DATE -->
                                <v-menu
v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y :rules="[rules.required]" min-width="auto">
                                    <template #activator="{ on, attrs }">
                                        <v-text-field
v-model="record.date" type="date" label="Date" readonly
                                            v-bind="attrs" outlined dense v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="record.date" @input="menu2 = false"></v-date-picker>
                                </v-menu>

                                <!-- DESCRIPTION -->
                                <v-text-field
v-model="record.description" label="Description" outlined
                                    dense></v-text-field>

                                <!-- UNIT PRICE -->
                                <v-text-field
v-model="record.unitPrice" label="Unit Price" outlined type="number" dense
                                    @change="updateEntryTotal"></v-text-field>

                                <!-- QUANTITY -->
                                <v-text-field
v-model="record.quantity" label="Quantity" outlined type="number" dense
                                    @change="updateEntryTotal"></v-text-field>

                                <!-- TOTAL -->
                                <v-text-field v-model="totalPrice" label="Total" readonly outlined dense></v-text-field>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-btn color="red darken-1" text @click="deleteItem">
                    Delete
                </v-btn>
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
                    .substring(0, 10),
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
                    .substring(0, 10),
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0,
            },
            dialog: false,
            menu2: false,
            valid: true,
            rules: {
                required: (value) => !!value || 'Required.',
            },
        }
    },
    computed: {
        tickerGroups() {
            return this.$store.getters.getInvestmentTypeNames
        },
        formTitle() {
            return !this.record._id ? 'New Entry' : 'Edit Entry'
        },
        totalPrice() {
            return this.record.total?.toFixed(2)
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        editedItem(val) {
            this.record = structuredClone(val)
            this.dialog = true
        },
    },
    created() { },
    methods: {
        async save() {

            await this.$refs.form.validate()

            if (!this.valid) {
                this.$notifier.showMessage({
                    content: 'Please fill all required fields!',
                    color: 'error',
                })
                return
            }

            if (this.record._id) {
                this.$store.dispatch('entries/update', this.record)
                this.$notifier.showMessage({
                    content: 'The record was updated succesfully!',
                    color: 'info',
                })
                this.$store.dispatch('wallet/index')
            } else {
                this.$notifier.showMessage({
                    content: 'New record was saved succesfully!',
                    color: 'info',
                })
                this.$store.dispatch('entries/create', this.record)
            }

            this.close()
        },
        deleteItem() {
            if (!this.editedItem._id) return
            this.$store.dispatch('entries/delete', this.editedItem._id)
            this.close()
        },
        updateEntryTotal() {
            this.record.total = this.record.quantity * this.record.unitPrice
        },
        async retrieveTickerInfo(tickerCode) {
            try {
                const existingTicker =
                    this.$store.getters['ticker/getTickerByCode'](tickerCode)

                if (existingTicker) {
                    this.record.ticker = structuredClone(existingTicker)
                    return
                }

                const grp = this.$store.getters.getInvestmentTypeByName(
                    this.record.ticker.group
                )

                if (grp.priceSource === 'bovespa') {
                    const tickerData = await this.$brapi.getQuotes(tickerCode)
                    console.log(tickerData)
                    if (tickerData.results && tickerData.results.length) {
                        const retrievedTicker = tickerData.results[0]

                        this.record.ticker.currentPrice =
                            tickerData.results[0].regularMarketPrice

                        this.record.ticker.name = retrievedTicker.longName
                    } else {
                        this.record.ticker.name = ''
                        return
                    }
                }

                this.record = structuredClone(this.record)
            } catch (err) {
                console.log(err)
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

        handleKeyPress(key) {
            if (key.code === 'Escape') {
                this.close()
            }
        }
    },
}
</script>
