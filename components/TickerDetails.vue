<template>
    <div>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
            <template #activator="{ on, attrs }">
                <v-btn color="white" text small v-bind="attrs" v-on="on">
                    <v-img :src="ticker.ticker.logoUrl" max-width="24px" class="mr-2"></v-img>
                    {{ ticker.ticker.code }}
                </v-btn>
            </template>

            <v-card width="400px">
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar v-if="ticker.ticker.logoUrl" tile>
                            <v-img :src="ticker.ticker.logoUrl" alt="Logo"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title class="font-weight-bold">{{
                                    ticker.ticker.code
                            }}</v-list-item-title>
                            <v-list-item-subtitle>{{
                                    ticker.ticker.name
                            }}</v-list-item-subtitle>
                            <v-list-item-subtitle>{{
                                    ticker.ticker.group
                            }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action right>
                            <v-btn v-if="!isEditing" outlined small color="primary" @click="openEdit">Edit</v-btn>
                            <v-btn v-else outlined small color="red" @click="cancelEdit">Cancel Edit</v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                    <v-list-item>
                        <v-text-field
v-model="record.name" label="Name" outlined dense
                            :disabled="!isEditing"></v-text-field>
                    </v-list-item>
                    <v-list-item>
                        <v-text-field
v-model="record.logoUrl" label="Logo URL" outlined dense
                            :disabled="!isEditing"></v-text-field>
                    </v-list-item>
                    <v-list-item :disabled="!isEditing">
                        <v-list-item-title>External Sync?</v-list-item-title>
                        <v-list-item-action>
                            <v-switch v-model="record.externalSync" color="primary" :disabled="!isEditing"></v-switch>
                        </v-list-item-action>
                    </v-list-item>
                    <v-list-item :disabled="!isEditing">
                        <v-text-field
v-model="record.currentPrice" type="number" label="Current Price" outlined dense
                            :disabled="record.externalSync"></v-text-field>
                    </v-list-item>

                </v-list>

                <v-card-actions>
                    <v-btn text color="error" @click="menu = false">
                        Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" small text @click="save">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
export default {
    props: ['ticker'],
    data: () => ({
        record: {},
        fav: true,
        menu: false,
        message: false,
        hints: true,
        isEditing: false
    }),
    created() {
        this.initialize()
    },
    methods: {
        async save() {
            const ticker = this.$store.getters['ticker/getTickerByCode'](
                this.ticker.ticker.code
            )
            await this.$store.dispatch('ticker/update', {
                ...ticker,
                ...this.record
            })
            await this.$store.dispatch('wallet/index')
            this.menu = false
            this.record.currentPrice = this.ticker.currentPrice
        },
        openEdit() {
            this.isEditing = true;
        },
        cancelEdit() {
            this.isEditing = false;
        },
        initialize() {
            this.record = structuredClone(this.ticker.ticker)
            // this.currentPrice = this.ticker.currentPrice
            // this.logoUrl = this.ticker.logoUrl
            // this.externalSync = this.ticker.externalSync || true
        }
    },
}
</script>
