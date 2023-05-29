<template>
    <v-row dense justify="center" align="center">
        <v-col cols="12">
            <!-- <v-progress-linear v-model="value" color="deep-purple"></v-progress-linear> -->
            <v-card class="pa-4">
                <v-card-title>
                    {{ $t('wallet') }}
                    <v-spacer></v-spacer>

                    <!-- <div width="300">
                        <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                        >
                            <template #activator="{ on, attrs }">
                                <v-text-field
                                    v-model="replayDate"
                                    type="date"
                                    label="Replay date"
                                    readonly
                                    v-bind="attrs"
                                    outlined
                                    dense
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="replayDate" @input="menu2 = false"></v-date-picker>
                        </v-menu>
                    </div> -->
                </v-card-title>

                <WalletTable :entries="entries" />

                <span class="d-flex justify-end text--secondary text-caption mt-1">
                    {{ `Last refresh: ${lastRefresh?.toLocaleTimeString()}` }}
                </span>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
import WalletTable from '~/components/WalletTable.vue'
export default {
    name: 'WalletPage',
    components: { WalletTable },
    data() {
        return {
            dialog: false,
            dialogDelete: false,
            editedIndex: -1,
            menu: false,
            modal: false,
            menu2: false,
            replayDate: new Date(Date.now()).toISOString().substr(0, 10),
            editedItem: {
                tickerCode: '',
                date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
                group: '',
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0,
            },
            defaultItem: {
                tickerCode: '',
                date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
                group: '',
                description: '',
                unitPrice: 0,
                quantity: 0,
                tax: 0,
                total: 0,
            },

            value: 0,
            interval: 0,
            showTickerDetailsModal: false,
        }
    },
    computed: {
        entries() {
            return this.$store.state?.wallet?.wallet || []
        },
        lastRefresh() {
            return this.$store.state.wallet.lastRefresh
        },
        formTitle() {
            return this.editedIndex === -1 ? 'New Entry' : 'Edit Entry'
        },
        totalPaid() {
            return this.$store.getters['wallet/getTotalByFieldName']('paidTotal')
        },
        totalCurrent() {
            return this.$store.getters['wallet/getTotalByFieldName']('currentTotal')
        },
        profit() {
            return this.totalCurrent - this.totalPaid
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
        value(val) {
            if (val < 100) return

            this.value = 0
            this.startBuffer()
        },
        replayDate(nv) {
            this.$store.dispatch('wallet/index', { byPassLastRefresh: true, calculateOnDate: nv })
        },
    },

    created() {},

    beforeDestroy() {
        clearInterval(this.interval)
    },

    methods: {
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
            this.editedItem.total = this.editedItem.quantity * this.editedItem.unitPrice
        },

        startBuffer() {
            clearInterval(this.interval)

            this.interval = setInterval(() => {
                this.value += 1
            }, 1000)
        },

        openTickerDetails(item) {
            this.showTickerDetailsModal = true
        },
    },
}
</script>
<style>
.inactive-wallet{
    filter: opacity(0.5)
}
</style>
