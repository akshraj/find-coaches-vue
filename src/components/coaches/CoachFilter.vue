<template>
  <base-card>
    <h2>Find your coach</h2>
    <span class="filter-option">
      <input type="checkbox" id="frontend" checked @change="setFilter" />
      <label for="frontend">Frontend</label>
    </span>
    <span class="filter-option">
      <input type="checkbox" id="backend" @change="setFilter" checked />
      <label for="backend">Backend</label>
    </span>
    <span class="filter-option">
      <input type="checkbox" id="career" @change="setFilter" checked />
      <label for="career">Career</label>
    </span>
  </base-card>
</template>

<script>
export default {
  data() {
    return {
      filters: {
        frontend: true,
        backend: true,
        career: true,
      }
    }
  },
  emits: ['change-filter'],
  methods: {
    setFilter(e) {
      const inputId = e.target.id;
      const isActive = e.target.checked;

      const updateFilters = {
        ...this.filters,
        [inputId]: isActive
      };
      this.filters = updateFilters;

      this.$emit('change-filter', updateFilters)
    }
  }
}
</script>

<style scoped>
h2 {
  margin: 0.5rem 0;
}

.filter-option {
  margin-right: 1rem;
}

.filter-option label,
.filter-option input {
  vertical-align: middle;
}

.filter-option label {
  margin-left: 0.25rem;
}

.filter-option.active label {
  font-weight: bold;
}
</style>