<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">{{'TitleSign' | authLocale(locale)}}</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="email"
          :class="{
            invalid:
              ($v.email.$dirty && !$v.email.required) ||
              ($v.email.$dirty && !$v.email.email),
          }"
        />
        <label for="email">Email</label>
        <small
          class="helper-text invalid"
          v-if="$v.email.$dirty && !$v.email.required"
          >{{'MESSAGE_CR_Email' | authLocale(locale)}}</small
        >
        <small
          class="helper-text invalid"
          v-else-if="$v.email.$dirty && !$v.email.email"
          >{{'MESSAGE_Email' | authLocale(locale)}}</small
        >
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model.trim="password"
          :class="{
            invalid:
              ($v.password.$dirty && !$v.password.required) ||
              ($v.password.$dirty && !$v.password.minLength),
          }"
        />
        <label for="password">{{'Password' | authLocale(locale)}}</label>
        <small
          v-if="$v.password.$dirty && !$v.password.required"
          class="helper-text invalid"
          >{{'MESSAGE_Password' | authLocale(locale)}}</small
        >
        <small
          v-else-if="$v.password.$dirty && !$v.password.minLength"
          class="helper-text invalid"
          >{{'MESSAGE_CR_Password' | authLocale(locale)}}
          {{ this.$v.password.$params.minLength.min }} {{'nowSymbol' | authLocale(locale)}}
          {{ password.length }}</small
        >
      </div>
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="name"
          :class="{ invalid: $v.name.$dirty && !$v.name.required }"
        />
        <label for="name">{{ "Name" | authLocale(locale)}}</label>
        <small
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
          >{{ "MESSAGE_Name" | authLocale(locale)}}</small
        >
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="agree" />
          <span>{{ "Rules" | authLocale(locale)}}</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{ "Register" | authLocale(locale) }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ "HaveAccount" | authLocale(locale) }}
        <router-link to="/login">{{ "SignIn" | authLocale(locale) }}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import { email, required, minLength } from "vuelidate/lib/validators";
export default {
  metaInfo() {
    return {
      title: this.$title("Register"),
    };
  },
  name: "register",
  data: () => ({
    email: "",
    password: "",
    name: "",
    agree: false,
    locale: null,
  }),
  mounted() {
    if (localStorage.getItem("locale")) {
      this.locale = localStorage.getItem("locale");
    }
  },
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(6) },
    name: { required },
    agree: { checked: (v) => v },
  },
  methods: {
    ...mapActions(["register"]),
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const formData = {
        email: this.email,
        password: this.password,
        name: this.name,
      };
      try {
        await this.register(formData);
        this.$router.push("/");
      } catch (e) {}
    },
  },
};
</script>