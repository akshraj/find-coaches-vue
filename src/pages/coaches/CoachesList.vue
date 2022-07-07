<template>
  <div>
    <base-dialog :show="!!error" title="An error occured!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <coach-filter @change-filter="setFilters"></coach-filter>
    </section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
          <base-button v-if="!isLoggedIn" to="/auth?redirect=register" link>Login to Register as Coach</base-button>
          <base-button v-if="!isCoach && !isLoading && isLoggedIn" link to="/register">Register as a coach</base-button>
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <coach-item v-for="coach in getCoaches" :key="coach.id" :coach="coach">{{ coach.firstName }}</coach-item>
        </ul>
        <h3 v-else>No coaches found</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue'
import CoachFilter from '../../components/coaches/CoachFilter.vue'

export default {
  components: {
    CoachItem,
    CoachFilter
  },
  data() {
    return {
      activeFilters: {
        frontend: true,
        backend: true,
        career: true
      },
      isLoading: false,
      error: null
    }
  },
  created() {
    this.loadCoaches();
  },
  computed: {
    getCoaches: function () {
      const coaches = this.$store.getters['coaches/coaches'].filter(coach => {
        if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
          return true
        }
        if (this.activeFilters.backend && coach.areas.includes('backend')) {
          return true
        }
        if (this.activeFilters.career && coach.areas.includes('career')) {
          return true
        }
        return false;
      })
      return coaches;
    },
    hasCoaches: function () {
      return !this.isLoading && this.$store.getters['coaches/hasCoaches']
    },
    isCoach() {
      return this.$store.getters['coaches/isCoach']
    },
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters
    },
    loadCoaches: async function (refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('coaches/loadCoaches', { forceRefresh: refresh })
      } catch (err) {
        this.error = err.message || 'Something went wrong!'
      }
      this.isLoading = false
    },
    handleError: function () {
      this.error = null
    }
  },
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>