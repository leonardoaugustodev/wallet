<template>
    <div class="text-center">
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="white" text small v-bind="attrs" v-on="on">
                    {{ ticker.ticker.code }}
                </v-btn>
            </template>

            <v-card width="400px">
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar v-if="ticker.ticker.logoUrl">
                            <img :src="ticker.ticker.logoUrl" />
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
                            <v-btn outlined small color="primary" @click="openEdit">Edit</v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list >
                    <v-list-item :disabled="!isEditing">
                        <v-list-item-title>External Sync?</v-list-item-title>
                        <v-list-item-action>
                            <v-switch
                                v-model="externalSync"
                                color="primary"
                            ></v-switch>
                        </v-list-item-action>
                    </v-list-item>
                    <v-list-item :disabled="!isEditing">
                        <v-text-field
                            v-model="currentPrice"
                            type="number"
                            label="Current Price"
                            outlined
                            dense
                            :disabled="externalSync"
                        ></v-text-field>
                    </v-list-item>
                    <v-list-item :disabled="!isEditing">
                        <v-text-field
                            v-model="logoUrl"
                            label="Logo URL"
                            outlined
                            dense
                        ></v-text-field>
                    </v-list-item>
                </v-list>

                <v-card-actions>
                    <v-btn text @click="menu = false" color="error">
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
        fav: true,
        menu: false,
        message: false,
        hints: true,
        currentPrice: 0,
        externalSync: false,
        logoUrl: '',
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
                currentPrice: Number(this.currentPrice),
                externalSync: this.externalSync,
            })
            await this.$store.dispatch('wallet/index')
            this.menu = false
            this.currentPrice = this.ticker.currentPrice
        },
        openEdit(){
            this.isEditing = true;
        },
        initialize(){
            this.currentPrice = this.ticker.currentPrice
            this.logoUrl = this.ticker.logoUrl
            this.externalSync = this.ticker.externalSync || true
        }
    },
}
</script>
