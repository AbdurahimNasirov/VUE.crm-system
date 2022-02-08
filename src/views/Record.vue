<template>
  <div>
    <div class="page-title">
      <h3>{{ "Menu_NewRecord" | localize }}</h3>
    </div>

    <Loader v-if="loading" />
    <p class="center" v-else-if="!getCategories.length">
      {{ "NoCategories" | localize }}
      <router-link to="./categories">{{
        "AddCategories" | localize
      }}</router-link>
    </p>

    <form class="form" v-else @submit.prevent="handleSubmit">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c in getCategories" :key="c.id" :value="c.id">
            {{ c.title }}
          </option>
        </select>
        <label>{{ "SelectCategory" | localize }}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ "income" | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{ "outcome" | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <select ref="selectCur" v-model="rate">
          <option v-for="cur of currencies" :key="cur.id" :value="cur.id">
            {{ cur.currency }}
          </option>
        </select>
        <label>Выберите валюту</label>
      </div>
      <div class="input-field">
        <input
          type="text"
          name="amount"
          id="amount"
          v-model="amount"
          @input="formatNum($event)"
          :class="{
            invalid: $v.amount.$dirt && !$v.amount.required,
          }"
        />
        <label for="amount">{{ "Amount" | localize }}</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.required"
          class="helper-text invalid"
          >{{ "MinVal" | localize }} 1
        </span>
        <span v-if="maxLength" class="helper-text invalid"
          >Maximalni velichena 999 999
        </span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.required,
          }"
        />
        <label for="description">{{ "Description" | localize }}</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
          >{{ "EnterDescp" | localize }}
        </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ "Create" | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import currenccyBillFilter from "@/filters/currencyBill.filter";
import localizeFilter from "@/filters/localize.filter";
import { required } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Record",
  metaInfo() {
    return {
      title: this.$title("Menu_NewRecord"),
    };
  },
  computed: {
    ...mapGetters(["info", "getCategories", "getRates"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }
      return this.info.bill >= this.billAmount;
    },
  },
  data() {
    return {
      loading: true,
      categories: [],
      category: null,
      type: "outcome",
      amount: 1,
      rates: null,
      select: null,
      description: "",
      maxLength: false,
      reqAmount: null,
      currencies: [
        { currency: "RUB", id: 1 },
        { currency: "USD", id: 2 },
        { currency: "EUR", id: 3 },
      ],
      rate: null,
      selectCur: null,
      curAmount: null,
      billAmount: null,
    };
  },
  async mounted() {
    if (!Object.keys(this.getRates).length) await this.fetchCurrency();
    if (!this.getCategories.length) await this.fetchCategories()

    this.loading = false;
    if (this.getCategories.length) {
      this.category = this.getCategories[0].id;
    }
    this.currencies.forEach((cur) => {
      if (cur.currency === this.info.currency) {
        this.rate = cur.id;
      }
    });
    setTimeout(() => {
      this.selectCur = M.FormSelect.init(this.$refs.selectCur);
      M.updateTextFields();
    }, 0);
    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select);
      M.updateTextFields();
    }, 0);
    this.curAmount = this.currencies[this.rate - 1].currency;
  },

  validations: {
    amount: { required },
    description: { required },
  },
  methods: {
    ...mapActions(["fetchCurrency", "fetchCategories", "createRecord"]),
    formatNum(e) {
      if (
        e.target.value[e.target.value.length - 1] === " " ||
        !isNaN(e.target.value[e.target.value.length - 1])
      ) {
        if (e.target.value.length >= 8) {
          let words = e.target.value;
          let nums = "";
          let wordArr = words.split("");
          wordArr.forEach((e, i) => {
            if (i != 7) {
              nums += e;
            }
          });
          this.amount = nums;
          this.maxLength = true;
        } else if (e.target.value.length < 8) {
          this.amount = this.numberWithSpaces(e.target.value);
          this.maxLength = false;
        }
      } else {
        let arr = e.target.value.split(
          e.target.value[e.target.value.length - 1]
        );
        this.amount = arr[0];
      }
    },
    toNum(num) {
      return Number(num.split(" ").join(""));
    },
    numberWithSpaces(nr) {
      let strNum = nr.toString().split(" ").join("");
      return strNum.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    rateFind(rate) {
      if (rate != undefined) {
        return rate;
      } else {
        return 1;
      }
    },
    async handleSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.reqAmount = await currenccyBillFilter(
        this.toNum(this.amount),
        this.getRates
      );
      this.curAmount = this.currencies[this.rate - 1].currency;
      this.reqAmount = Math.round(
        (this.toNum(this.amount) /
          (await this.rateFind(this.getRates[this.curAmount]))) *
          this.rateFind(this.getRates[this.info.currency])
      );
      let forBill = Math.round(
        (this.toNum(this.amount) /
          (await this.rateFind(this.getRates[this.curAmount]))) *
          this.rateFind(this.getRates[this.info.currentCur])
      );
      this.billAmount = forBill;
      if (this.canCreateRecord) {
        try {
          await this.createRecord({
            categoryId: this.category,
            amount: this.reqAmount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON(),
          });
          const bill =
            this.type === "income"
              ? this.info.bill + this.billAmount
              : this.info.bill - this.billAmount;
          await this.$store.dispatch("updateInfo", { bill });
          this.$message(localizeFilter("Success"));
          this.$v.$reset();
          this.amount = 1;
          this.description = "";
        } catch (e) {}
      } else {
        this.$message(
          `${localizeFilter("Enough")} (${this.billAmount - this.info.bill})`
        );
      }
    },
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },

  // components: {
  //   TheMask,
  // },
};
</script>