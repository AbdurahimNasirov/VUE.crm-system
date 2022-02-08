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
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{'SignIn' | authLocale(locale)}}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{'NoAccount' | authLocale(locale)}}?
        <router-link to="/register">{{'Register' | authLocale(locale)}}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { email, required, minLength } from "vuelidate/lib/validators";
import messages from "@/utils/messages";
import { mapActions } from "vuex";

export default {
  metaInfo() {
    return {
      title: this.$title("Login"),
    };
  },
  name: "Login",
  data: () => ({
    email: "",
    password: "",
    locale: null,
  }),
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(6) },
  },
  mounted() {
    if(localStorage.getItem('locale')) { 
      this.locale = localStorage.getItem('locale')
    }
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message]);
    }
  },
  methods: {
    ...mapActions(["login"]),
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const formData = {
        email: this.email,
        password: this.password,
      };
      try {
        await this.login(formData);
        this.$router.push("/");
      } catch (e) {}
    },
  },
};
</script>