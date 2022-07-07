export default {
  async registerData(context, data) {
    const userId = context.rootGetters.userId;
    const coachData = {
      firstName: data.first,
      lastName: data.last,
      hourlyRate: data.rate,
      areas: data.areas,
      description: data.desc
    }

    const token = context.rootGetters.token;
    console.log(context.rootGetters);

    const response = await fetch(`https://vue-http-demo-4fa49-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`, {
      method: 'PUT',
      body: JSON.stringify(coachData)
    });


    const responseData = await response.json();

    if (!response.ok) {
      //error...
    }

    context.commit('registerCoach', {
      ...responseData,
      id: userId
    })
  },
  async loadCoaches(context, payload) {
    console.log(context.rootGetters)
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    const response = await fetch(`https://vue-http-demo-4fa49-default-rtdb.firebaseio.com/coaches.json`);

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch!');
      throw error;
    }

    const coaches = [];
    for (const key in responseData) {
      const coach = {
        id: key,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas,
        description: responseData[key].description
      }
      coaches.push(coach);
    }
    context.commit('setCoaches', coaches);
    context.commit('setFetchTimestamp');
  }

}