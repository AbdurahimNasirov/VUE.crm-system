<template>
  <div>
    <div class="page-title">
      <h3>{{ "Menu_Planing" | localize }}</h3>
      <h4>{{ bill | currency(info.currency) }}</h4>
    </div>

    <Loader v-if="loading" />
    <p class="center" v-else-if="!categories.length">
      {{ "NoCategories" | localize }}
      <router-link to="./categories">{{
        "AddCategories" | localize
      }}</router-link>
    </p>
    <section>
      <div v-for="(cat, idx) of categories" :key="idx">
        <p>
          <strong>{{ cat.title }}:</strong>
          <!--  categorySpend[idx].amount -->
          {{ cat.spend | currency(info.currency) }}
          {{ "from" | localize }}
          <!-- categoryLimit[idx].amount -->
          {{ cat.limit | currency(info.currency) }}
        </p>
        <!-- tooltip[idx].amount -->
        <div class="progress" v-tooltip.noloc="cat.tooltip">
          <div
            class="determinate"
            :class="[cat.progressColor]"
            :style="{ width: cat.progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import currenccyBillFilter from "@/filters/currencyBill.filter";
import localizeFilter from "@/filters/localize.filter";
import currencyFilter from "@/filters/currency.filter";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "planing",
  metaInfo() {
    return {
      title: this.$title("Menu_Planing"),
    };
  },
  data: () => ({
    loading: true,
    categories: [],
    rates: null,
    bill: null,
    tooltip: [],
    categorySpend: [],
    categoryLimit: [],
  }),
  computed: {
    ...mapGetters(["info", "getRates", "getRecords", "getCategories"]),
  },
  async mounted() {
    if (!Object.keys(this.getRates).length) await this.fetchCurrency();
    if (!this.getCategories.length) await this.fetchCategories()
    if (!this.getRecords.length) await this.fetchRecords()
    this.categories = this.getCategories.map((cat) => {
      const spend = this.getRecords
        .filter((r) => r.categoryId === cat.id)
        .filter((r) => r.type === "outcome")
        .reduce((total, record) => {
          return (total += +record.amount);
        }, 0);
      const percent = (100 * spend) / cat.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor =
        percent < 60 ? "green" : percent < 100 ? "yellow" : "red";
      const tooltipValue = cat.limit - spend;
      const tooltip = `${
        tooltipValue < 0 ? localizeFilter("Excess") : localizeFilter("Left")
      } ${currencyFilter(Math.abs(tooltipValue))}`;
      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip,
      };
    });
    this.bill = this.info.bill;
    this.bill = await currenccyBillFilter(this.bill, this.getRates);

    this.loading = false;
    this.categories.forEach(async (cat) => {
      this.curAmount(this.categorySpend, cat.spend);
    });
    this.categories.forEach(async (cat) => {
      this.curAmount(this.categoryLimit, cat.limit);
    });
    this.categories.forEach(async (cat) => {
      this.curAmount(this.tooltip, cat.tooltipValue);
      cat.tooltipValue = this.tooltip.amount;
    });
  },
  methods: {
    ...mapActions(["fetchCurrency", "fetchRecords", "fetchCategories"]),
    async curAmount(category, type) {
      category.push({
        amount: await currenccyBillFilter(type, this.getRates),
      });
    },
  },
};
</script>