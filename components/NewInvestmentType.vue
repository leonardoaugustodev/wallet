<template>
    <!-- EDIT MODAL -->
    <v-dialog v-model="dialog" max-width="500px" @keydown="handleKeyPress">
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <!-- TICKER -->
                                <v-text-field
                                    v-model="record.name"
                                    :label="$t('name')"
                                    outlined
                                    dense
                                    :rules="[rules.required]"
                                ></v-text-field>

                                <!-- PRICE SOURCE -->
                                <v-combobox
                                    v-model="record.priceSource"
                                    :items="priceSourceOptions"
                                    :label="$t('priceSource')"
                                    item-text="label"
                                    item-value="value"
                                    outlined
                                    dense
                                ></v-combobox>

                                <!-- IS ACTIVE -->
                                <v-switch v-model="record.isActive" :label="$t('isActive')"></v-switch>

                                <!-- COLOR -->
                                <v-color-picker
                                    v-model="record.color"
                                    dot-size="25"
                                    swatches-max-height="200"
                                    mode="hexa"
                                    hide-mode-switch
                                    :show-swatches="false"
                                    width="428"
                                ></v-color-picker>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-btn color="red darken-1" text @click="deleteItem">
                    {{ $t('delete') }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                    {{ $t('cancel') }}
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> {{ $t('save') }} </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'NewInvestmentType',
    props: ['editedItem'],
    data() {
        return {
            record: {
                _id: '',
                name: '',
                color: '',
                priceSource: null,
                isActive: true,
            },
            defaultItem: {
                _id: '',
                name: '',
                color: '',
                priceSource: null,
                isActive: true,
            },
            dialog: false,
            valid: true,
            rules: {
                required: (value) => !!value || this.$t('required'),
            },
        }
    },
    computed: {
        formTitle() {
            return !this.record._id ? this.$t('newInvestmentType') : this.$t('editInvestmentType')
        },
        priceSourceOptions() {
            return this.$store.state.priceSources
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
    created() {},
    methods: {
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
                await this.update(this.record)
                this.$notifier.showMessage({
                    content: this.$t('recordUpdatedSucessfully'),
                    color: 'info',
                })
            } else {
                await this.create(this.record)
                this.$notifier.showMessage({
                    content: this.$t('newRecordCreatedSucessfully'),
                    color: 'info',
                })
            }
            await this.$store.dispatch('getAllInvestmentTypes')
            this.close()
        },
        async create(record) {
            try {
                const ref = this.$fire.firestore.collection('investmentTypes').doc()

                record._id = ref.id
                record._userUID = this.$store.getters['users/getUserUID']
                record._createdAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
                record._updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
                await ref.set(record)
            } catch (e) {
                return Promise.reject(e)
            }
        },
        async update(record) {
            const ref = this.$fire.firestore.collection('investmentTypes').doc(record._id)
            try {
                record._updatedAt = this.$fireModule.firestore.FieldValue.serverTimestamp()
                await ref.update(record)
            } catch (e) {
                return Promise.reject(e)
            }
        },
        deleteItem() {
            if (!this.editedItem._id) return
            this.$store.dispatch('deleteInvestmentType', this.editedItem._id)
            this.close()
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
        },
    },
}
</script>
