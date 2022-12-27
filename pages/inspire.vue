<template>
    <v-row>
        <v-col class="text-center">
            <img src="/v.png" alt="Vuetify.js" class="mb-5" />
            <blockquote class="blockquote">
                &#8220;First, solve the problem. Then, write the code.&#8221;
                <footer>
                    <small>
                        <em>&mdash;John Johnson</em>
                    </small>
                </footer>
            </blockquote>
        </v-col>
    </v-row>
</template>

<script>
export default {
  name: 'InspirePage',
  created() {
      this.getQuote()
  },
  methods: {
    async getQuote(){
      const getHistory = this.$fire.functions.httpsCallable('getHistory')
      const result = await getHistory({symbols: ["VALE3", "PETR3", "WEGE3"]})
      //await this.$yahoo.getQuotes(["VALE3", "PETR3", "WEGE3"])
      console.log(result)
    }
  }
}
</script>
