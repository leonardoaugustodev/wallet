export default ({ app, store }, inject) => {
    inject('utils', {
        formatCurrency(value) {
            if (!value) value = 0
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value)
        },
        formatPercentage(value) {
            if (!value) value = 0
            return `${(value * 100).toFixed(2)}%` 
        },
        getColor(value) {
            value = parseFloat(value)
            if (value > 0) return 'green'
            else if (value === 0) return 'gray'
            else return 'red'
        },
    })
}
