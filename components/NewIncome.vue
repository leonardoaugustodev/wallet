<template>
    <v-dialog v-model="dialog" max-width="500px" persistent>
        <template #activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" small depressed v-on="on">
                {{ $t('newIncome') }}
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
                                            type="date"
                                            :label="$t('date')"
                                            readonly
                                            v-bind="attrs"
                                            outlined
                                            dense
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="record.date" @input="menu2 = false"></v-date-picker>
                                </v-menu>

                                <!-- TICKER -->
                                <v-combobox
                                    v-model="record.ticker"
                                    :items="availableTickers"
                                    :rules="tickerRules"
                                    item-text="code"
                                    :label="$t('ticker')"
                                    outlined
                                    dense
                                ></v-combobox>

                                <!-- TYPE -->
                                <v-combobox
                                    v-model="record.type"
                                    :items="incomeTypes"
                                    :rules="[rules.required]"
                                    :label="$t('type')"
                                    outlined
                                    dense
                                ></v-combobox>

                                <!-- MEMO -->
                                <v-text-field v-model="record.memo" :label="$t('memo')" outlined dense></v-text-field>

                                <!-- AMOUNT -->
                                <v-text-field
                                    v-model="record.amount"
                                    :label="$t('amount')"
                                    outlined
                                    type="number"
                                    dense
                                ></v-text-field>

                                <!-- QUANTITY -->
                                <v-text-field
                                    v-model="record.quantity"
                                    :label="$t('quantity')"
                                    outlined
                                    type="number"
                                    dense
                                ></v-text-field>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-btn color="error" text @click="close"> {{ $t('cancel') }} </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="saveAndNew"> {{ $t('saveAndNew') }} </v-btn>
                <v-btn color="accent" text @click="save"> {{ $t('save') }} </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'NewIncome',
    props: ['editedItem'],
    data() {
        return {
            dialog: false,
            valid: true,
            rules: {
                required: (value) => !!value || this.$t('required'),
            },
            incomeTypes: ['Dividend', 'Interest'],
            menu2: false,
            availableTickers: [],
            tickerRules: [(v) => !!v?.code || this.$t('required')],
            record: {
                _id: '',
                ticker: {
                    code: '',
                    group: '',
                    name: '',
                    unitPrice: 0,
                },
                date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substring(0, 10),
                type: 'Dividend',
                memo: '',
                amount: 0,
                quantity: 0,
            },
            defaultItem: {
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
        }
    },
    computed: {
        formTitle() {
            return this.record._id ? this.$t('editIncome') : this.$t('newIncome')
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
    created() {
        this.getAvailableTickers()

        this.$store.subscribe((mutation) => {
            if (mutation.type === 'entries/index') {
                this.getAvailableTickers()
            }
        })
    },
    methods: {
        getAvailableTickers() {
            const entries = this.$store.state.entries.entries
            this.availableTickers = entries?.map((t) => {
                return t.ticker
            })
        },

        close() {
            this.dialog = false
        },

        async saveAndNew() {
            const date = this.record.date
            await this.save()

            this.$nextTick(() => {
                this.record = structuredClone(this.defaultItem)
                this.record.date = date
                this.dialog = true
            })
        },

        async save() {
            await this.$refs.form.validate()

            if (!this.valid) {
                this.$notifier.showMessage({
                    content: this.$t('fillAllFields'),
                    color: 'error',
                })
                return
            }

            if (this.record._id) {
                await this.$store.dispatch('incomes/update', this.record)
                this.$notifier.showMessage({
                    content: this.$t('recordUpdatedSucessfully'),
                    color: 'info',
                })
            } else {
                await this.$store.dispatch('incomes/create', this.record)
                this.$notifier.showMessage({
                    content: this.$t('newRecordCreatedSucessfully'),
                    color: 'info',
                })
            }

            this.record = structuredClone(this.defaultItem)
            this.$refs.form.reset()
            this.close()

        },
    },
}
</script>
