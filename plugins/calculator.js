export default ({ app, store }, inject) => {
    inject('calculator', {
        getInvestedThisMonth() {
            
            const currentMonth = new Date().getMonth();
            const entries = store.state.entries.entries.filter(x => {
                const entryMonth = new Date(x.date).getMonth
                return entryMonth === currentMonth
            })

            return entries.reduce((acc, cv) => {
                return acc + cv.total
            }, 0)

        },
    })
}
