export const state = () => ({
    entries: [
        {
            ticker: {
                code: 'EZTC3',
                group: 'Stock',
            },
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            description: 'Trade',
            unitPrice: 18.90,
            quantity: 50,
            tax: 0,
            total: 510.00
        },
        {
            ticker: {
                code: 'EZTC3',
                group: 'Stock',
            },
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            description: 'Trade',
            unitPrice: 18.90,
            quantity: 40,
            tax: 0,
            total: -400
        },
        {
            ticker: {
                code: 'EZTC3',
                group: 'Stock',
            },
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            description: 'Trade',
            unitPrice: 18.90,
            quantity: -20,
            tax: 0,
            total: 400
        },
        {
            ticker: {
                code: 'KLBN11',
                group: 'Stock',
            },
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            description: 'Trade',
            unitPrice: 25.58,
            quantity: 32,
            tax: 0,
            total: 818.56
        },
        {
            ticker: {
                code: 'KLBN11',
                group: 'Stock',
            },
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            description: 'Trade',
            unitPrice: 25.58,
            quantity: 32,
            tax: 0,
            total: 818.56
        }
    ]
})

export const getters = {
    
}

export const mutations = {
    add(state, entry) {
        state.entries.push(entry);
    }
}

export const actions = {
    // async fetchCounter({ state }) {
    //     // make request
    //     const res = { data: 10 };
    //     state.counter = res.data;
    //     return res.data;
    // }
}