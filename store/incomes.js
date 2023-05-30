export const state = () => ({
    incomes: [],
})

export const getters = {
    getAmountByTicker: (state) => (tickerCode) => {
        return state.incomes.reduce((acc, cv) => {
            if (cv.ticker.code !== tickerCode) return acc
            return acc + parseFloat(cv.amount)
        }, 0)
    },
    summarizeByTicker: (state) => (maxDate = new Date(), minDate) => {

        const incomes = state.incomes.filter(x => {
            return (new Date(x.date) <= new Date(maxDate)) && (minDate ? (new Date(x.date) >= new Date(minDate)) : true)
        }) || []

        return incomes.reduce((acc, income) => {
            let reduced = acc[income.ticker.code]

            if (!reduced) {
                reduced = 0
            }

            reduced += Number(income?.amount || 0)
            acc[income.ticker.code] = reduced

            return acc
        }, {})
    },
    summarizeAmountByMonth: (state) => {
        function subtractMonths(date, months) {
            date.setMonth(date.getMonth() - months)
            return date
        }

        const initialSummary = [...Array(12).keys()].map((i) => {
            const currentMonthDate = subtractMonths(new Date(), i)
            const date = `${currentMonthDate.getFullYear()}-${currentMonthDate.getMonth() + 1
                }`
            return {
                date,
                amount: 0,
            }
        })

        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1)
        startDate.setDate(1);
        const filteredIncomes = state.incomes.filter(x => new Date(x.date) >= startDate)

        const result = filteredIncomes.reduce((acc, cv) => {

            const currentDate = `${new Date(cv.date).getFullYear()}-${new Date(cv.date).getMonth() + 1
                }`
            let existingReduce = acc.find((x) => x.date === currentDate);

            if (!existingReduce) {
                acc.push({
                    date: currentDate,
                    amount: 0,
                })
                existingReduce = acc.find((x) => x.date === currentDate)
            }
            existingReduce.amount += parseFloat(cv.amount)

            return acc
        }, initialSummary)

        return result.reverse()
    },
    summarizeLast12Months: (state) => {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1)
        startDate.setDate(1);

        const filteredIncomes = state.incomes.filter(x => new Date(x.date) > startDate)
        const result = filteredIncomes.reduce((acc, cv) => {
            return acc + parseFloat(cv.amount)
        }, 0)

        return result;
    }
}

export const mutations = {
    index(state, incomes) {
        state.incomes = incomes
    },
    create(state, income) {
        state.incomes.push(income)
    },
    update(state, income) {
        const incomeIndex = state.incomes.findIndex((e) => e._id === income._id)
        state.incomes.splice(incomeIndex, 1, income)
    },
    delete(state, id) {
        const incomeIndex = state.incomes.findIndex((e) => e._id === id)
        state.incomes.splice(incomeIndex, 1)
    },
}

export const actions = {
    async index({ commit, rootGetters }) {
        const userUID = await rootGetters['users/getUserUID']
        const ref = this.$fire.firestore.collection('incomes').where("_userUID", "==", userUID)
        try {
            const snapshot = await ref.get()
            const incomes = []
            snapshot.forEach((doc) => incomes.push(doc.data()))
            commit('index', incomes)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async create({ commit, dispatch, rootGetters, rootState }, income) {
        try {

            await dispatch('wallet/index', {}, { root: true });

            const ref = this.$fire.firestore.collection('incomes').doc()
            income._id = ref.id
            income._userUID = rootGetters['users/getUserUID']
            income._createdAt =
                this.$fireModule.firestore.FieldValue.serverTimestamp()
            income._updatedAt =
                this.$fireModule.firestore.FieldValue.serverTimestamp()

            income.unitDividend = Number(
                (income?.amount || 0) / (income?.quantity || 1)
            )

            const ticketFromWallet = rootState.wallet.wallet.find(w => w.ticker.code === income.ticker.code)
            income.unitPrice = Number(ticketFromWallet?.paidValue || 0)
            income.yield = Number(
                (income.unitDividend || 0) / (income.unitPrice || 1)
            )

            const ticker = rootGetters['ticker/getTickerByCode'](income.ticker.code)
            income.ticker = structuredClone(ticker)

            await ref.set(income)
            commit('create', income)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async update({ commit }, income) {
        const ref = this.$fire.firestore.collection('incomes').doc(income._id)
        try {
            income._updatedAt =
                this.$fireModule.firestore.FieldValue.serverTimestamp()

            income.unitDividend = Number(
                (income?.amount || 0) / (income?.quantity || 1)
            )
            income.unitPrice = 1
            income.yield = Number(
                (income.unitDividend || 0) / (income.unitPrice || 1)
            )

            await ref.update(income)
            commit('update', income)
        } catch (e) {
            return Promise.reject(e)
        }
    },
    async delete({ commit }, incomeId) {
        const ref = this.$fire.firestore.collection('incomes').doc(incomeId)
        try {
            await ref.delete()
            commit('delete', incomeId)
        } catch (e) {
            return Promise.reject(e)
        }
    },
}
