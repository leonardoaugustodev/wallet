export default ({ app, store }, inject) => {
    inject('bovespa', {
        async getHistory(symbols) {
            try{
                // const lowerCaseSymbols = Array.isArray(symbols) ? symbols.map(s => s.toLowerCase()) : symbols.toLowerCase()
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
