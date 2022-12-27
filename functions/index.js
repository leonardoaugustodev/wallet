const functions = require("firebase-functions");
const axios = require('axios');

const convertSymbols = (symbols) => {
    return symbols.map(s => {
        return `${s}.SA`
    }).join(',')
}

exports.getQuotes = functions.region('southamerica-east1').https.onCall(async (data, ctx) => {
    // return { message: "Hello from Firebase!" };

    try {
        const symbols = data.symbols
        const convertedSymbols = convertSymbols(symbols)
        console.log(convertedSymbols)
        const response = await axios.get(
            `https://query1.finance.yahoo.com/v7/finance/quote`,
            {
                params: {
                    "symbols": convertSymbols(symbols),
                },
                headers: {
                    "Content-type": "application/json;charset=utf-8",
                }
            },
        );

        const { quoteResponse } = response.data
        return quoteResponse.result || [];
    }
    catch (err) {
        throw new functions.https.HttpsError(err);
    }

});

exports.getHistory = functions.region('southamerica-east1').https.onCall(async (data, ctx) => {
    // return { message: "Hello from Firebase!" };

    try {
        const symbols = data.symbols
        const convertedSymbols = convertSymbols(symbols)
        console.log(convertedSymbols)
        const response = await axios.get(
            `https://query1.finance.yahoo.com/v8/finance/spark`,
            {
                params: {
                    "symbols": convertedSymbols,
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

        return response.data || {}
    }
    catch (err) {
        throw new functions.https.HttpsError(err);
    }

});
