<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">{{ "Currency" | localize }}</span>

        <p v-for="(cur, idx) of currencies" :key="idx" class="currency-line">
          <span>{{ amounts[cur] | currency(cur) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["rates"],
  data: () => ({
    currencies: ["RUB", "USD", "EUR"],
    amounts: {},
  }),
  computed: {
    ...mapGetters(["info"]),
  },
  async mounted() {
    this.currencies.forEach((cur) => {
      this.$set(this.amounts, cur ,this.currencyRates(cur) )
    });
  },
  methods: {
    currencyRates(cur) {
      let base =
        this.info.bill /
        this.getCurrency(this.rates[this.info.currentCur]);
      let billRate = Math.floor(
        base * this.getCurrency(this.rates[cur])
      );
      return billRate;
    },
    getCurrency(currency) {
      if (currency != undefined) {
        return currency;
      } else {
        return 1;
      }
    }
  },
};
</script>
<style scoped>
.card {
  height: 100%;
}
</style>