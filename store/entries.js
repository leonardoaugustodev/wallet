export const state = () => ({
    entries: [
        {
            _id: '1000',
            ticker: {
                code: 'EZTC3',
                group: 'Stock',
            },
            date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10),
            description: 'Trade',
            unitPrice: 18.9,
            quantity: 50,
            tax: 0,
            total: 510.0,
        },
        {
            _id: '1001',
            ticker: {
                code: 'EZTC3',
                group: 'Stock',
            },
            date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10),
            description: 'Trade',
            unitPrice: 18.9,
            quantity: 40,
            tax: 0,
            total: -400,
        },
        {
            _id: '1002',
            ticker: {
                code: 'EZTC3',
                group: 'Stock',
            },
            date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10),
            description: 'Trade',
            unitPrice: 18.9,
            quantity: -20,
            tax: 0,
            total: 400,
        },
        {
            _id: '1003',
            ticker: {
                code: 'KLBN11',
                group: 'Stock',
            },
            date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10),
            description: 'Trade',
            unitPrice: 25.58,
            quantity: 32,
            tax: 0,
            total: 818.56,
        },
        {
            _id: '1004',
            ticker: {
                code: 'KLBN11',
                group: 'Stock',
            },
            date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10),
            description: 'Trade',
            unitPrice: 25.58,
            quantity: 32,
            tax: 0,
            total: 818.56,
        },
    ],
})

export const getters = {
    tickers(state) {
        return state.entries.map((e) => e.ticker.code)
    },
}

export const mutations = {
    add(state, entry) {
        state.entries.push(entry)
    },
    update(state, entry) {
        const entryIndex = state.entries.findIndex((e) => e._id === entry._id)
        state.entries.splice(entryIndex, 1, entry)
    },
    delete(state, id) {
        const entryIndex = state.entries.findIndex((e) => e._id === id)
        state.entries.splice(entryIndex, 1)
    },
}

export const actions = {
    // async fetchCounter({ state }) {
    //     // make request
    //     const res = { data: 10 };
    //     state.counter = res.data;
    //     return res.data;
    // }
}
