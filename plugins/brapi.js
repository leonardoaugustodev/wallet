export default ({ app, store }, inject) => {
    inject('brapi', {
        async getQuotes(symbols, range = '1d', interval = '1d', fundamental = true) {
            try{
                const lowerCaseSymbols = Array.isArray(symbols) ? symbols.map(s => s.toLowerCase()) : symbols.toLowerCase()
                const response = await app.$axios.$get(
                    `https://brapi.dev/api/quote/${lowerCaseSymbols}?range=${range}&interval=${interval}&fundamental=${fundamental}`
                );
                return response;
            }
            catch(err){
                console.log(err);
            }
        }
    })
}
