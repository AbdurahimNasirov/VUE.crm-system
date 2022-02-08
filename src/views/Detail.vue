<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{
          "Menu_History" | localize
        }}</router-link>
        <a @click.prevent class="breadcrumb">
          {{ record.type === "income" ? "income" : "outcome" | localize }}</a
        >
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div
            class="card"
            :class="{
              red: record.type === 'outcome',
              green: record.type === 'income',
            }"
          >
            <div class="card-content white-text">
              <p>{{ "Description" | localize }}: {{ record.description }}</p>
              <strong
                >{{ "Amount" | localize }}:
                {{ record.amount | currency(info.currency) }}</strong
              >
              <p>{{ "Category" | localize }}: {{ record.categoryName }}</p>
              <small>{{ record.date | date("datetime") }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>
      {{ "RecordWith" | localize }} id={{ $route.params.id }}
      {{ "Undefined" | localize }}
    </p>
  </div>
</template>
<script>
import currenccyBillFilter from "@/filters/currencyBill.filter";
import { mapGetters, mapActions } from "vuex";

export default {
  metaInfo() {
    return {
      title: this.$title("DetailTitle"),
    };
  },
  name: "detail",
  data: () => ({
    record: null,
    loading: true,
    rates: null,
  }),
  computed: {
    ...mapGetters(["info", "getRecords", "getCategories"]),
  },
  async mounted() {
    const id = this.$route.params.id;
    if (!this.getRecords.some((rec) => rec.id === id))
      await this.fetchRecordById(id);
    const record = this.getRecords.find((rec) => rec.id === id);
    if (!this.getCategories.some((cat) => cat.id === record.categoryId))
      await this.fetchCategoryById(record.categoryId);
    const category = this.getCategories.find(
      (cat) => cat.id === record.categoryId
    );
    this.record = {
      ...record,
      categoryName: category.title,
    };
    this.loading = false;
  },
  methods: {
    ...mapActions(["fetchRecordById", "fetchCategoryById"])
  }
};
</script>