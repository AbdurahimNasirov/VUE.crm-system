<template>
  <div>
    <Loader v-if="loading" />
    <div class="app-main-layout" v-else>
      <Navbar @click="open()" />
      <Sidebar v-model="isOpen" :key="locale" />
      <main class="app-content" :class="{ full: !isOpen }">
        <div class="app-page">
          <router-view />
        </div>
      </main>

      <BtnAddNewRec :key="locale"/>
    </div>
  </div>
</template>

<script>
import Navbar from "@/app/Navbar";
import Sidebar from "@/app/Sidebar";
import messages from "@/utils/messages.js";
import Loader from "../app/Loader.vue";
import BtnAddNewRec from '@/components/BtnAddNewRec.vue'
import { mapGetters, mapActions } from "vuex";
export default {
  name: "main-layout",
  data: () => ({
    isOpen: null,
    loading: true,
  }),
  async mounted() {
    if (!this.$store.getters.info.bill || !this.$store.getters.info.name) {
      await this.$store.dispatch("fetchInfo");
    }
    // this.locale = localizeFilter("AddNewRecord");
    this.isOpen = this.info.isOpen;
    this.loading = false;
  },
  components: {
    Navbar,
    Sidebar,
    Loader,
    BtnAddNewRec
  },
  methods: {
    ...mapActions(["updateInfo"]),
    async open() {
      try {
        this.isOpen = !this.isOpen;
        await this.updateInfo({
          isOpen: this.isOpen,
        });
      } catch (error) {
        throw e;
      }
    },
  },
  computed: {
    ...mapGetters(["info"]),
    error() {
      return this.$store.getters.error;
    },
    locale() {
      return this.$store.getters.info.locale;
    },
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || messages[fbError.code]);
    },
  },
};
</script>