<template>
  <div>
    <base-dialog :show="!!error" title="Some error occurred" @close="handleError">
      {{ error }}
    </base-dialog>
    <section>
      <base-card>
        <header>
          <h2>Requests Received</h2>
        </header>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul v-else-if="hasRequests && !isLoading">
          <requests-item v-for="request in receivedRequests" :requests="request" :key="request.id"></requests-item>
        </ul>
        <h3 v-else>You haven't received any requests yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import RequestsItem from '../../components/requests/RequestsItem.vue'
export default {
  data() {
    return {
      isLoading: false,
      error: null
    }
  },
  created() {
    this.loadRequests();
  },
  components: { RequestsItem },
  computed: {
    receivedRequests() {
      return this.$store.getters['requests/getRequests']
    },
    hasRequests() {
      return this.$store.getters['requests/hasRequests']
    }
  },
  methods: {
    async loadRequests() {

      this.isLoading = true;
      try {
        await this.$store.dispatch('requests/fetchRequests');
      } catch (err) {
        this.error = err.message || 'something went wrong'
      }

      this.isLoading = false
    },
    handleError() {
      this.error = null
    }
  }
}
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>