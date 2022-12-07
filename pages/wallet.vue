<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-data-table
:headers="headers" :items="entries" sort-by="tickerCode" class="elevation-1" dense
        group-by="ticker.group">
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Wallet</v-toolbar-title>
          </v-toolbar>
        </template>
        <template #item.profit="{ item }">
          <v-chip :color="getColor(item.profit)" dark label small>
            {{ formatNumber(item.profit) }}
          </v-chip>
        </template>
        <template #item.profitPercentage="{ item }">
          <v-chip :color="getColor(item.profitPercentage)" dark label small>
            {{ `${item.profitPercentage.toFixed(2)}%` }}
          </v-chip>
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
  name: 'WalletPage',

  data() {
    return {
      entries: [],
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
        {
          text: 'Name',
          align: 'start',
          value: 'ticker.name',
        },
        {
          text: 'Group',
          align: 'start',
          value: 'ticker.group',
        },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Today Value', value: 'todayValue' },
        { text: 'Payed Value', value: 'paidValue' },
        { text: 'Total Paid', value: 'paidTotal' },
        { text: 'Today Total', value: 'todayTotal' },
        { text: 'Profit', value: 'profit' },
        { text: 'Profit %', value: 'profitPercentage' },
        { text: 'Dividend', value: 'dividends' },
        { text: 'Position', value: 'position' }
      ]
    }
  },
  computed: {
    tickers() {
      const tickers = this.$store.state.entries.entries.map(e => e.ticker.code);
      return tickers.filter((v, i, a) => a.indexOf(v) === i);
    },
    stockTickers() {
      const stockTickers = this.$store.state.entries.entries.filter(s => s.ticker.group === 'Stock');
      const tickers = stockTickers.map(e => e.ticker.code);
      return tickers.filter((v, i, a) => a.indexOf(v) === i);
    },
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

      try {

        if (!this.tickers.length) return;

        const tickers = await this.$axios.$get(`https://brapi.dev/api/quote/${this.stockTickers.join('%2C')}?range=1d&interval=1d&fundamental=true`)

        const entries = this.$store.state.entries.entries || [];

        const summary = [];

        for (const entry of entries) {
          let reduced = summary[entry.ticker.code];

          if (!reduced) {
            reduced = {
              ...entry,
              quantity: 0,
              price: 0,
              total: 0
            };
          }

          reduced.quantity += entry?.quantity || 0;
          reduced.total += entry?.total || 0;
          reduced.price = reduced.total / reduced.quantity;

          summary[entry.ticker.code] = reduced;
        }

        // MERGE WITH SERVER DATA
        for (const tickerCode in summary) {
          const entry = summary[tickerCode];

          const serverTicker = tickers.results.find(t => t.symbol === tickerCode);

          if (serverTicker) {
            entry.todayTotal = serverTicker.regularMarketPrice * entry?.quantity;
            entry.todayValue = serverTicker.regularMarketPrice;
          }
          else {
            entry.todayTotal = 1;
            entry.todayValue = 1;
          }

          const profit = (entry?.todayTotal || 0) - (entry?.total || 0);

          this.entries.push(
            {
              'ticker': {
                code: tickerCode,
                name: entry.ticker.name,
                group: entry.ticker.group
              },
              quantity: entry?.quantity || 0,
              todayValue: this.formatNumber(entry?.todayValue),
              paidValue: this.formatNumber(entry?.price),
              paidTotal: this.formatNumber(entry?.total),
              todayTotal: this.formatNumber(entry?.todayTotal),
              profit,
              profitPercentage: ((profit / (entry?.total || 1)) * 100),
              dividends: 0,
              position: 0
            }
          )
        }
      }
      catch (err) {
        console.log(err);
      }
    },

    formatNumber(value) {
      if (!value) value = 0;
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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
    },

    getColor(value) {
      if (value > 0) return 'green';
      else if (value === 0) return 'yellow';
      else return 'red'
    },
  },
}
</script>
