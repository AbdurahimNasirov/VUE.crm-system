<template>
  <div>
    <div class="page-title">
      <h3>{{ "HistoryRec" | localize }}</h3>
    </div>

    <!-- <div class="history-chart">
      <canvas></canvas>
    </div> -->

    <Loader v-if="loading" />
    <p class="center" v-else-if="!table.length">
      {{ "HaveRec" | localize }}.
      <router-link to="/record">{{ "AddFirst" | localize }}</router-link>
    </p>
    <section v-else>
      <form action="">
        <div class="input-field">
          <select
            ref="select"
            v-model="filter"
            @change="filterCategories($event)"
          >
            <option
              v-for="fltr of filterTypes"
              :key="fltr.id"
              :value="fltr.type.toLowerCase()"
            >
              {{ fltr.type.toLowerCase() | localize }}
            </option>
          </select>
          <label>{{ "SelectFilter" | localize }}</label>
        </div>
      </form>
      <HistoryTable :records="table" :key="locale" />
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/HistoryTable.vue";
import { mapGetters,mapActions } from "vuex";
export default {
  name: "history",
  metaInfo() {
    return {
      title: this.$title("Menu_History"),
    };
  },

  computed: {
    ...mapGetters(["getRecords", "getCategories"]),
    locale() {
      return this.$store.getters.info.locale;
    },

    table() {
      return this.getRecords.filter((rec) => {
        if (this.filter === "all") return true;
        return rec.type === this.filter;
      });
    },
  },
  data: () => ({
    loading: true,
    records: [],
    select: null,
    filter: "all",
    rates: null,
    filterTypes: [
      {
        type: "All",
        id: 1,
      },
      {
        type: "Income",
        id: 2,
      },
      {
        type: "Outcome",
        id: 3,
      },
    ],
  }),
  async mounted() {

    if (!this.getCategories.length) await this.fetchCategories()
    if (!this.getRecords.length) await this.fetchRecords()
    this.loading = false;
    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select);
      M.updateTextFields();
    }, 0);
  },
  methods: {
    ...mapActions(["fetchCategories", "fetchRecords"]),
    filterCategories(e) {
      this.filter = e.target.value 
    },
  },
  components: {
    HistoryTable,
  },
};
</script>

<style scoped>
.selectFilter {
  display: block;
  width: 30%;
}
</style>