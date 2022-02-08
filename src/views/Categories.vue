<template>
  <div>
    <div class="page-title">
      <h3>{{ "Menu_Categories" | localize }}</h3>
    </div>
    <section>
      <Loader v-if="loading" />
      <div class="row" v-else>
        <CategoryCreate @created="addNewCategory" />
        <CategoryEdit
          v-if="getCategories.length"
          :categories="getCategories"
          :key="getCategories.length + updateCount"
          @updated="updateCategories"
        />
        <p v-else class="center">{{ "NoCategories" | localize }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import CategoryCreate from "@/components/CategoryCreate.vue";
import CategoryEdit from "@/components/CategoryEdit.vue";
import Loader from "../app/Loader.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  metaInfo() {
    return {
      title: this.$title("Menu_Categories"),
    };
  },
  name: "Category",
  computed: {
    ...mapGetters(["getCategories"])
  },
  data() {
    return {
      categories: [],
      loading: true,
      updateCount: 0,
    };
  },
  async mounted() {
   if (!this.getCategories.length) await this.fetchCategories()
    this.loading = false;
  },
  methods: {
    ...mapActions(["fetchCategories"]),
    addNewCategory(category) {
      this.getCategories.push(category);
    },
    updateCategories(category) {
      const idx = this.getCategories.findIndex((c) => c.id === category.id);
      this.getCategories[idx].title = category.title;
      this.getCategories[idx].limit = category.limit;
      this.updateCount++;
    },
  },
  components: {
    CategoryCreate,
    CategoryEdit,
  },
};
Loader;
</script>