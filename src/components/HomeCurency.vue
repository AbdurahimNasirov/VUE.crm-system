<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">{{ "CourseCurrency" | localize }}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>{{ "Currencies" | localize }}</th>
              <th>{{ "Course" | localize }}</th>
              <th>{{ "Data" | localize }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cur of currencies" :key="cur">
              <td>{{ cur }}</td>
              <td>{{ currency(cur) }}</td>
              <td>{{ findDate(date) | date("date") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    currencies: ["RUB", "USD", "EUR"],
  }),
  props: ["rates", "date"],
  methods: {
    findDate(date) {
      return new Date(Date.now(date));
    },
    currency(cur) {
      if (cur != "USD") {
        return this.rates[cur].toFixed(3);
      } else {
        return "1";
      }
    },
  },
};
</script>

<style scoped>
.card {
  height: 100%;
}
</style>