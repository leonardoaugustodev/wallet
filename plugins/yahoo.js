
const convertSymbols = (symbols) => {
    return symbols.map(s => {
        return `${s}.SA`
    }).join(',')
}

export default ({ app, store }, inject) => {
    inject('yahoo', {
        async getQuotes(symbols) {
            try {
                const convertedSymbols = convertSymbols(symbols)
                console.log(convertedSymbols)
                const response = await app.$axios.$get(
                    `https://query1.finance.yahoo.com/v8/finance/quote/`,
                    {
                        params: {
                            "symbols": convertSymbols(symbols),
                        },
                        headers: {
                            "Content-type": "application/json;charset=utf-8",
                        }
                    },
                );
                return response.data;
            }
            catch (err) {
                console.log(err);
            }
        },
        async getHistory(symbols) {
            try {
                const response = await app.$axios.$get(
                    `https://query1.finance.yahoo.com/v8/finance/spark/`,
                    {
                        params: {
                            "symbols": convertSymbols(symbols),
                            "range": "1y",
                            "interval": "1d",
                            "indicators": "close",
                            corsDomain: 'br.financas.yahoo.com'
                        },
                        headers: {
                            "content-type": "application/json;charset=utf-8"
                        }
                    },
                );
                return response.data;
            }
            catch (err) {
                console.log(err);
            }
        }
    })
}
