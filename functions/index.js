const functions = require("firebase-functions");
const axios = require('axios');

const convertSymbols = (symbols) => {
    return symbols.map(s => {
        return `${s}.SA`
    }).join(',')
}

exports.getQuotes = functions.region('southamerica-east1').https.onCall(async (data, ctx) => {
    try {
        const symbols = data.symbols
        const response = await axios.get(
            `https://query2.finance.yahoo.com/v7/finance/quote`,
            {
                params: {
                    crumb: 'm2gFpu0n8s0',
                    symbols: symbols.join(','),
                },
                headers: {
                    "Content-type": "application/json;charset=utf-8",
                    "Cookie": "F=d=tW2oPW49vCPKU19ott7ZUDhgQ0uaezFb40gAG943oiM-;PH=l=pt-BR;Y=v=1&n=3jhnr6emb3uiu&l=mjsb92h5om8cf02k38c2p8d1k18dxpoamhpjiivg/o&p=o2pvvbr00000000&r=12d&intl=br;A1=d=AQABBANDtGMCEJE-i-4764LC1JziIkJv25YFEgEACAIbMmRfZB6kxyMA_eMBAAcIA0O0Y0Jv25YIDwFekaSctB5oArGj6-Et8wkBBwoBQw&S=AQAAAtzKXvRnYjeOHIR0t1skacU;A3=d=AQABBANDtGMCEJE-i-4764LC1JziIkJv25YFEgEACAIbMmRfZB6kxyMA_eMBAAcIA0O0Y0Jv25YIDwFekaSctB5oArGj6-Et8wkBBwoBQw&S=AQAAAtzKXvRnYjeOHIR0t1skacU;B=9dmrf89hr8go3&b=4&d=7lKBHvxtYFjPFHO.rkwd&s=hv&i=AV6RpJy0HmgCsaPr4S3z;GUC=AQEACAJkMhtkX0IfegRv;A1S=d=AQABBANDtGMCEJE-i-4764LC1JziIkJv25YFEgEACAIbMmRfZB6kxyMA_eMBAAcIA0O0Y0Jv25YIDwFekaSctB5oArGj6-Et8wkBBwoBQw&S=AQAAAtzKXvRnYjeOHIR0t1skacU&j=WORLD;ucs=tr=1872072168000;OTH=v=1&d=eyJraWQiOiIwMTY0MGY5MDNhMjRlMWMxZjA5N2ViZGEyZDA5YjE5NmM5ZGUzZWQ5IiwiYWxnIjoiUlMyNTYifQ.eyJjdSI6eyJndWlkIjoiQU5ENjdJU0lWWVNPSE5aSkZLMlhYVkFHRFkiLCJwZXJzaXN0ZW50Ijp0cnVlLCJzaWQiOiJHQUpTVmR6eXVuOVIifX0.VFcVF3OrrYoX8RbQ2e0iHBjxZJ1NIQirzM4BLm9TIFqYpFuvuLJfb1d2JsGvtwsQw5keXFSNjG8y8tVtDcQmeDe5Gl3fXwSfz0fn0f2Q2jdx9fnPyOj2Jpg5_VieVxr1vujGYulPXyfuBRHsnnModUn3mElT2hROVBhlEi1Vbd0;T=af=JnRzPTE2ODE5ODU3NjkmcHM9MUV3SHFwb3VmeWZjWURLSWQ0VWlYQS0t&d=bnMBeWFob28BZwFBTkQ2N0lTSVZZU09ITlpKRksyWFhWQUdEWQFhYwFBTzZyQmVjQQFhbAFsZW9uYXJkbzIxODkBc2MBZGVza3RvcF93ZWIBZnMBOURCTE1fUmtNTk1NAXp6AU1NTk1rQk1RSgFhAVFBRQFsYXQBTU1OTWtCAW51ATA-&kt=EAAtO6YwzXIByxd9yIcWsZovA--~I&ku=FAAgPnjw6bxv.02eaYbqp_45cfXpNB7JdLA8WI00cBJeNWgmPfy1dvlIL2UwORLlgZVqN0TpGT.E3WpYCOJLzldFzmFAIV1Qy.bruLI2v_bphwIVjpQs5CjDzP11Y62VLLrEGcwB4Sny4ylkfHJT2ZeHwO3jUw77yaAzkGfR_Pc4bk-~E;PRF=newChartbetateaser%3D0%252C1683195402248%26t%3DPETR4.SA%252BIBM;cmp=t=1681990355&j=0&u=1---"
                }
            },
        );
        console.log(response);

        const { quoteResponse } = response.data
        return quoteResponse.result || [];
    }
    catch (err) {
        throw new functions.https.HttpsError(err);
    }

});

exports.getHistory = functions.region('southamerica-east1').https.onCall(async (data, ctx) => {
    try {
        const symbols = data.symbols
        const response = await axios.get(
            `https://query1.finance.yahoo.com/v8/finance/spark`,
            {
                params: {
                    symbols: symbols.join(','),
                    range: "1y",
                    interval: "1d",
                    crumb: 'm2gFpu0n8s0'
                },
                headers: {
                    "content-type": "application/json;charset=utf-8",
                    "Cookie": "F=d=tW2oPW49vCPKU19ott7ZUDhgQ0uaezFb40gAG943oiM-;PH=l=pt-BR;Y=v=1&n=3jhnr6emb3uiu&l=mjsb92h5om8cf02k38c2p8d1k18dxpoamhpjiivg/o&p=o2pvvbr00000000&r=12d&intl=br;A1=d=AQABBANDtGMCEJE-i-4764LC1JziIkJv25YFEgEACAIbMmRfZB6kxyMA_eMBAAcIA0O0Y0Jv25YIDwFekaSctB5oArGj6-Et8wkBBwoBQw&S=AQAAAtzKXvRnYjeOHIR0t1skacU;A3=d=AQABBANDtGMCEJE-i-4764LC1JziIkJv25YFEgEACAIbMmRfZB6kxyMA_eMBAAcIA0O0Y0Jv25YIDwFekaSctB5oArGj6-Et8wkBBwoBQw&S=AQAAAtzKXvRnYjeOHIR0t1skacU;B=9dmrf89hr8go3&b=4&d=7lKBHvxtYFjPFHO.rkwd&s=hv&i=AV6RpJy0HmgCsaPr4S3z;GUC=AQEACAJkMhtkX0IfegRv;A1S=d=AQABBANDtGMCEJE-i-4764LC1JziIkJv25YFEgEACAIbMmRfZB6kxyMA_eMBAAcIA0O0Y0Jv25YIDwFekaSctB5oArGj6-Et8wkBBwoBQw&S=AQAAAtzKXvRnYjeOHIR0t1skacU&j=WORLD;ucs=tr=1872072168000;OTH=v=1&d=eyJraWQiOiIwMTY0MGY5MDNhMjRlMWMxZjA5N2ViZGEyZDA5YjE5NmM5ZGUzZWQ5IiwiYWxnIjoiUlMyNTYifQ.eyJjdSI6eyJndWlkIjoiQU5ENjdJU0lWWVNPSE5aSkZLMlhYVkFHRFkiLCJwZXJzaXN0ZW50Ijp0cnVlLCJzaWQiOiJHQUpTVmR6eXVuOVIifX0.VFcVF3OrrYoX8RbQ2e0iHBjxZJ1NIQirzM4BLm9TIFqYpFuvuLJfb1d2JsGvtwsQw5keXFSNjG8y8tVtDcQmeDe5Gl3fXwSfz0fn0f2Q2jdx9fnPyOj2Jpg5_VieVxr1vujGYulPXyfuBRHsnnModUn3mElT2hROVBhlEi1Vbd0;T=af=JnRzPTE2ODE5ODU3NjkmcHM9MUV3SHFwb3VmeWZjWURLSWQ0VWlYQS0t&d=bnMBeWFob28BZwFBTkQ2N0lTSVZZU09ITlpKRksyWFhWQUdEWQFhYwFBTzZyQmVjQQFhbAFsZW9uYXJkbzIxODkBc2MBZGVza3RvcF93ZWIBZnMBOURCTE1fUmtNTk1NAXp6AU1NTk1rQk1RSgFhAVFBRQFsYXQBTU1OTWtCAW51ATA-&kt=EAAtO6YwzXIByxd9yIcWsZovA--~I&ku=FAAgPnjw6bxv.02eaYbqp_45cfXpNB7JdLA8WI00cBJeNWgmPfy1dvlIL2UwORLlgZVqN0TpGT.E3WpYCOJLzldFzmFAIV1Qy.bruLI2v_bphwIVjpQs5CjDzP11Y62VLLrEGcwB4Sny4ylkfHJT2ZeHwO3jUw77yaAzkGfR_Pc4bk-~E;PRF=newChartbetateaser%3D0%252C1683195402248%26t%3DPETR4.SA%252BIBM;cmp=t=1681990355&j=0&u=1---"
                }
            },
        );

        return response.data || {}
    }
    catch (err) {
        throw new functions.https.HttpsError(err);
    }

});
