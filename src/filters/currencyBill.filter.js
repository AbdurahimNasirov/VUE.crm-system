import store from '../store'

export default async function bill(number, rates) {
    function rateFind(rate) {
        if (rate != undefined) {
            return rate
        } else {
            return 1
        }
    }
    const currentCur = store.getters.info.currentCur
    const currency = store.getters.info.currency
    const base = number / rateFind(rates[currentCur])
    return Math.round(base * rateFind(rates[currency]));
}