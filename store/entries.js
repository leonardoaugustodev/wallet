export const state = () => ({
    entries: [],
})

export const getters = {
    getTickerCodes(state) {
        const tickerCodes = state.entries.map((e) => e.ticker.code)
        const unique = tickerCodes.filter((v, i, a) => a.indexOf(v) === i);
        return unique
    },
    getEntryByTicker: (state) => (tickerCode) => {
        return state.entries.find((e) => e.ticker.code === tickerCode)
    },
    getStocksCodeByType: (state) => (type) => {
        return state.entries
            .filter((s) => s.ticker.group === type)
            .map((e) => e.ticker.code)
    },
    getLast10Entries: (state) => {
        return [...state.entries].sort((a,b) => {
            if(new Date(a.date) > new Date(b.date)) return -1
            else return 1
        }).slice(0,10);
    },
    summarizeByTicker: (state) => (filterOnDate = new Date()) => {

        const entries = state.entries.filter((e) => new Date(e.date) <= new Date(filterOnDate)) || []

        return entries.reduce((acc, entry) => {
            let reduced = acc[entry.ticker.code]

            if (!reduced) {
                reduced = {
                    ...entry,
                    quantity: 0,
                    price: 0,
                    total: 0,
                }
            }

            reduced.quantity += Number(entry?.quantity || 0)
            reduced.total += Number(entry?.total || 0)
            reduced.price = Number(reduced.total / reduced.quantity)

            acc[entry.ticker.code] = reduced

            return acc
        }, {})
    },
    summarizeByType: (state) => {
        return state.entries.reduce((acc, entry) => {
            let reduced = acc[entry.ticker.group]

            if (!reduced) {
                reduced = {
                    quantity: 0,
                    price: 0,
                    total: 0,
                }
            }

            reduced.quantity += Number(entry?.quantity || 0)
            reduced.total += Number(entry?.total || 0)
            reduced.price = Number(reduced.total / reduced.quantity)

            acc[entry.ticker.group] = reduced

            return acc
        }, {})
    },
    summarizeInvestedThisMonth(state) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const entries = state.entries.filter(x => {
            const entryMonth = new Date(x.date).getMonth()
            const entryYear = new Date(x.date).getFullYear()
            return entryMonth === currentMonth && entryYear === currentYear
        })

        return entries.reduce((acc, cv) => {
            return acc + cv.total
        }, 0)
    },
    summarizeInvestedTotal(state) {
        return state.entries.reduce((acc, cv) => {
            return acc + cv.total
        }, 0)
    },
    summarizeInvestedByMonth: (state) => {
        function subtractMonths(date, months) {
            date.setMonth(date.getMonth() - months)
            return date
        }

        const initialSummary = [...Array(12).keys()].map((i) => {
            const currentMonthDate = subtractMonths(new Date(), i)
            const date = `${currentMonthDate.getFullYear()}-${
                currentMonthDate.getMonth() + 1
            }`
            return {
                date,
                total: 0,
            }
        })

        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1)
        startDate.setDate(1);
        const filteredEntries = state.entries.filter(x => new Date(x.date) >= startDate)

        const result = filteredEntries.reduce((acc, cv) => {
            const currentDate = `${new Date(cv.date).getFullYear()}-${
                new Date(cv.date).getMonth() + 1
            }`
            let existingReduce = acc.find((x) => x.date === currentDate)

            if (!existingReduce) {
                acc.push({
                    date: currentDate,
                    total: 0,
                })
                existingReduce = acc.find((x) => x.date === currentDate)
            }

            existingReduce.total += parseFloat(cv.total)
            return acc
        }, initialSummary)

        return result.reverse()
    },
    // summarizeAggregateInvestedByMonth: (state) => {
    //     function subtractMonths(date, months) {
    //         date.setMonth(date.getMonth() - months)
    //         return date
    //     }

    //     const initialSummary = [...Array(12).keys()].map((i) => {
    //         const currentMonthDate = subtractMonths(new Date(), i)
    //         const date = `${currentMonthDate.getFullYear()}-${
    //             currentMonthDate.getMonth() + 1
    //         }`
    //         return {
    //             date,
    //             total: getters.summarizeInvestedDueDate(currentMonthDate) || 0,
    //         }
    //     })

    //     const result = state.entries.reduce((acc, cv) => {
    //         const currentDate = `${new Date(cv.date).getFullYear()}-${
    //             new Date(cv.date).getMonth() + 1
    //         }`

    //         let existingReduce = acc.find((x) => x.date === currentDate)

    //         if (!existingReduce) {
    //             acc.push({
    //                 date: currentDate,
    //                 total: 0,
    //             })
    //             existingReduce = acc.find((x) => x.date === currentDate)
    //         }

    //         existingReduce.total += parseFloat(cv.total)
    //         return acc
    //     }, initialSummary)

    //     return result.reverse()
    // },
    summarizeInvestedDueDate: (state) => (dueDate) => {
        const entries = state.entries.filter(x => new Date(x.date) <= dueDate)
        return entries.reduce((acc,cv) => acc + cv.total)
    }
}

export const mutations = {
    index(state, entries) {
        state.entries = entries
    },
    create(state, entry) {
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
    async index({ commit, rootGetters }) {
        const userUID = await rootGetters['users/getUserUID']
        const ref = this.$fire.firestore.collection('entries').where("_userUID", "==", userUID )
        try {
            const snapshot = await ref.get()
            const entries = []
            snapshot.forEach((doc) => entries.push(doc.data()))
            commit('index', entries)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async create({ commit, dispatch, rootGetters }, entry) {
        try {
            const ref = this.$fire.firestore.collection('entries').doc()

            entry._id = ref.id
            entry._userUID = rootGetters['users/getUserUID']
            entry._createdAt =
                this.$fireModule.firestore.FieldValue.serverTimestamp()
            entry._updatedAt =
                this.$fireModule.firestore.FieldValue.serverTimestamp()
            entry.total = entry?.unitPrice * entry?.quantity

            await ref.set(entry)
            commit('create', entry)
            dispatch('ticker/create', { ...entry.ticker }, { root: true })
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async update({ commit }, entry) {
        const ref = this.$fire.firestore.collection('entries').doc(entry._id)
        try {
            entry._updatedAt =
                this.$fireModule.firestore.FieldValue.serverTimestamp()
            await ref.update(entry)
            commit('update', entry)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async delete({ commit }, entryId) {
        const ref = this.$fire.firestore.collection('entries').doc(entryId)
        try {
            await ref.delete()
            commit('delete', entryId)

            this.$notifier.showMessage({
                content: 'The record was deleted succesfully!',
                color: 'info',
            })
        } catch (e) {
            return Promise.reject(e)
        }
    },
}
