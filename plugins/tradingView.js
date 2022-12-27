const Markets = {
    BOVESPA: Symbol("brazil"),
    CRYPTO: Symbol("coin")
}

const getOptions = (tickers) => {
    return {
        "filter": [
            {
                "left": "market_cap_basic",
                "operation": "nempty"
            },
            {
                "left": "is_primary",
                "operation": "equal",
                "right": true
            },
            {
                "left": "active_symbol",
                "operation": "equal",
                "right": true
            }
        ],
        "options": {
            "lang": "pt"
        },
        "markets": [
            "brazil"
        ],
        "symbols": {
            "query": {
                "types": []
            },
            "tickers": tickers ? [...tickers] : []
        },
        "columns": [
            "logoid",
            "name",
            "close",
            "change",
            "change_abs",
            "Recommend.All",
            "volume",
            "Value.Traded",
            "market_cap_basic",
            "price_earnings_ttm",
            "earnings_per_share_basic_ttm",
            "number_of_employees",
            "sector",
            "description",
            "type",
            "subtype",
            "update_mode",
            "pricescale",
            "minmov",
            "fractional",
            "minmove2",
            "currency",
            "fundamental_currency_code"
        ],
        "sort": {
            "sortBy": "market_cap_basic",
            "sortOrder": "desc"
        },
        "price_conversion": {
            "to_symbol": false
        },
        "range": [
            0, 1000
        ]
    }
}

const getQuotes = async (symbols) => {

}

export default ({ app, store }, inject) => {
    inject('tradingView', {
        async getQuotes(symbols) {
            try {
                const payload = getOptions(symbols)
                const response = await app.$axios.$post(
                    `https://scanner.tradingview.com/brazil/scan`,
                    payload,
                    {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    },
                );
                console.log(response)
                return response;
            }
            catch (err) {
                console.log(err);
            }
        }
    })
}
