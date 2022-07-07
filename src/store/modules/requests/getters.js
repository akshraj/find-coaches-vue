export default {
  getRequests(state, _, _2, rootGetters) {
    const coachId = rootGetters.userId;
    return state.requests.filter(req => req.coachId === coachId);
  },
  hasRequests(_, getters) {
    return getters.getRequests && getters.getRequests.length > 0
  }
}