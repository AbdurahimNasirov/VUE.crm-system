import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import info from './info'
import category from './category'
import record from './record'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null,
    rates: [],
    currency: null
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    },
    setRates(s, rates) {
      s.rates = rates
    },
    setCurrency(s, timestamp) {
      s.currency = timestamp
    }
  },
  getters: {
    error: s => s.error,
    getRates: s => s.rates,
    getCurrency: s => s.currency
  },
  actions: {
    async fetchCurrency({ commit }) {
      try {
        const res = await fetch('https://freecurrencyapi.net/api/v2/latest?apikey=1d218040-6c5d-11ec-ae8f-035c8b10fe32');
        const rates = await res.json()
        commit('setRates', rates.data)
        commit('setCurrency', res.query.timestamp)
      } catch (error) {
        commit('setError', error)
      }

    }
  },

  modules: {
    auth,
    info,
    category,
    record
  }
})
