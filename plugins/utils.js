export default ({ app, store }, inject) => {
    inject('utils', {
        formatCurrency(value) {
            if (!value) value = 0
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value)
        },
        getColor(value) {
            if (value > 0) return 'green'
            else if (value === 0) return 'gray'
            else return 'red'
        },
    })
}
