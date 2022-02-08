<template>
  <div>
    <div class="page-title">
      <h3>{{ "ProfileTitle" | localize }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="name"
          :class="{ invalid: $v.name.$dirty && !$v.name.required }"
        />
        <label for="description">{{ "Name" | localize }}</label>
        <small
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
          >{{ "MESSAGE_enterName" | localize }}</small
        >
      </div>
      <div class="input-field">
        <select ref="select" v-model="rate">
          <option v-for="cur of currencies" :key="cur.id" :value="cur.id">
            {{ cur.currency }}
          </option>
        </select>
        <label>Выберите валюту</label>
      </div>
      <div class="switch">
        <label>
          Engish
          <input type="checkbox" v-model="isRuLocale" />
          <span class="lever"></span>
          Русский
        </label>
      </div>
      <button class="btn waves-effect waves-light" type="submit">
        {{ "Update" | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import currenccyBillFilter from "@/filters/currencyBill.filter";
import { mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
export default {
  metaInfo() {
    return {
      title: this.$title("ProfileTitle"),
    };
  },
  computed: {
    ...mapGetters(["info", "getRates", "getRecords", "getCategories"]),
  },
  data: () => ({
    name: "",
    isRuLocale: true,
    currencies: [
      { currency: "RUB", id: 1 },
      { currency: "USD", id: 2 },
      { currency: "EUR", id: 3 },
    ],
    rate: null,
    currency: null,
    currentCur: null,
    select: null,
    bill: null,
    updCat: [],
    updRec: [],
  }),
  async mounted() {
    if (!Object.keys(this.getRates).length) await this.fetchCurrency();
    if (!this.getCategories.length) await this.fetchCategories();
    if (!this.getRecords.length) await this.fetchRecords();
    this.currency = this.info.currency;
    this.name = this.info.name;
    this.isRuLocale = this.info.locale === "ru-RU";
    this.currentCur = this.info.currency;
    this.bill = this.info.bill;
    this.currencies.forEach((cur) => {
      if (cur.currency === this.currency) {
        this.rate = cur.id;
      }
    });
    this.updCat = [];
    setTimeout(() => {
      M.updateTextFields();
    }, 0);
    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select);
      M.updateTextFields();
    }, 0);
  },
  validations: {
    name: { required },
  },

  methods: {
    ...mapActions([
      "updateInfo",
      "fetchCategories",
      "fetchCurrency",
      "fetchRecords",
      "updateCategory",
      "updateRecord",
    ]),
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.bill = await currenccyBillFilter(this.bill, this.getRates);
      this.currentCur = this.info.currency;
      this.currency = this.currencies[this.rate - 1].currency;

      try {
        await this.updateInfo({
          bill: this.bill,
          name: this.name,
          locale: this.isRuLocale ? "ru-RU" : "en-US",
          currentCur: this.currentCur,
          currency: this.currency,
        });
        this.updCat = [];
        this.getCategories.forEach(async (cat) => {
          this.updCat.push({
            id: cat.id,
            title: cat.title,
            limit: await currenccyBillFilter(cat.limit, this.getRates),
          });
        });
        setTimeout(() => {
          this.updCat.forEach(async (cat) => {
            await this.updateCategory(cat);
          });
        }, 0);
        this.updRec = [];
        this.getRecords.forEach(async (rec) => {
          this.updRec.push({
            categoryId: rec.categoryId,
            amount: await currenccyBillFilter(await rec.amount, this.getRates),
            description: rec.description,
            type: rec.type,
            date: rec.date,
            id: rec.id,
            typeClass: rec.typeClass,
            categoryName: rec.categoryName
          });
        });
        setTimeout(() => {
          this.updRec.forEach(async (rec) => {
            await this.updateRecord(rec);
          });
        }, 0);
      } catch (e) {
        e;
      }
    },
  },
};
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
button:focus {
  background: #26a69a;
}
</style>