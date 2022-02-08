<template>
  <div class="fixed-action-btn">
    <router-link
      class="btn-floating btn-large blue"
      to="/record"
      data-position="top"
      v-tooltip.noloc="tooltip"
    >
      <i class="large material-icons">add</i>
    </router-link>
  </div>
</template>

<script>
import localizeFilter from "@/filters/localize.filter";

export default {
  data: () => ({
    tooltip: localizeFilter("AddNewRecord"),
  }),
};
</script>