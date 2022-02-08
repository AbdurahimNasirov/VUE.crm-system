<template>
  <div>
    <div class="page-title">
      <h3>{{ "HomeTitle" | localize }}</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <Loader v-if="loading" />

    <div class="row" v-else>
      <HomeBill :rates="getRates" />
      <HomeCurency :date="getCurrency" :rates="getRates" />
    </div>
  </div>
</template>

<script>
import HomeBill from "@/components/HomeBill";
import HomeCurency from "@/components/HomeCurency";
import Loader from "../app/Loader.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  metaInfo() {
    return {
      title: this.$title("Menu_Bill"),
    };
  },
  name: "home",
  computed: {
    ...mapGetters(["getRates", "getCurrency"]),
  },
  data() {
    return {
      loading: true,
      currency: null,
    };
  },
  async mounted() {
    this.amounts = [];
    if (!Object.keys(this.getRates).length) await this.fetchCurrency();
    this.loading = false;
  },
  components: {
    HomeBill,
    HomeCurency,
    Loader,
  },
  methods: {
    ...mapActions(["fetchCurrency"]),
    async refresh() {
      this.loading = true;
      await this.fetchCurrency();
      this.loading = false;
    },
  },
};
</script>
