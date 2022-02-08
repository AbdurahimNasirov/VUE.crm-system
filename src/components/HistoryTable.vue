<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{ "Amount" | localize }}</th>
        <th>{{ "Data" | localize }}</th>
        <th>{{ "Category" | localize }}</th>
        <th>{{ "Type" | localize }}</th>
        <th>{{ "Open" | localize }}</th>
        <th>Delete</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, idx) of resRecords" :key="record.id" :id="record.id">
        <td>{{ idx + 1 }}</td>
        <!-- recAmount[idx].amount -->
        <td>{{ record.amount | currency(info.currency) }}</td>
        <td>{{ record.date | date("datetime") }}</td>
        <td>{{ record.categoryName }}</td>
        <td>
          <span
            class="white-text badge center-align"
            :class="[record.typeClass]"
            >{{ record.type | localize }}</span
          >
        </td>
        <td>
          <button
            v-tooltip.noloc="tooltip"
            class="btn-small btn"
            @click="$router.push('/detail/' + record.id)"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
        <td>
          <button
            v-tooltip="'delete'"
            class="btn-small btn"
            @click="deleteBtn(record.id)"
          >
            <i class="material-icons delete">delete</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import localizeFilter from "@/filters/localize.filter";
import currenccyBillFilter from "@/filters/currencyBill.filter";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    records: {
      type: Array,
      reqiured: true,
    },
  },
  data: () => ({
    tooltip: localizeFilter("SeeRecord"),
    resRecords: null,
    recAmount: [],
  }),
  computed: {
    ...mapGetters(["info", "getRates"]),
  },
  methods: {
    ...mapActions(["deleteRecord", "fetchRecordById", "updateInfo"]),
    async deleteBtn(id) {
      let amount = null;
      let bill = null;
      try {
        this.deleteRecord(id);
        this.resRecords.filter(async (rec) => {
          if (rec.id === id) {
            amount = Math.floor(
              (rec.amount /
                this.rateFind(this.getRates[this.info.currency])) *
                this.rateFind(this.getRates[this.info.currentCur])
            );
          }
          if (rec.type === "income") {
            bill = this.info.bill -= amount;
            await this.updateInfo({
              bill: bill,
            });
          } else if (rec.type === "outcome") {
            bill = this.info.bill += amount;
            await this.updateInfo({
              bill: bill,
            });
          }
        });
      } catch (error) {
        throw e
      }
    },
    rateFind(rate) {
      if (rate != undefined) {
        return rate;
      } else {
        return 1;
      }
    },
  },
  async mounted() {
    if (!this.getRates) 
      await this.$store.dispatch("fetchCurrency");
    this.resRecords = this.records;
    this.resRecords.forEach(async (rec) => {
      this.recAmount.push({
        amount: await currenccyBillFilter(rec.amount, this.getRates),
      });
    });
  },
  watch: {
    records() {
      this.resRecords = this.records;
    },
  },
};
</script>
<style scoped>
span {
  padding-bottom: 24px;
}
</style>