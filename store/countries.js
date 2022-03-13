export const state = () => ({
  countries: []
})

export const mutations = {
  UPDATE_countries(state, payload) {
    state.countries = payload
  }
}

export const actions = {
  async FETCH_countries(context) {
    try {
      const res = await this.$axios.$get('https://restcountries.com/v3.1/all', {
        params: {
          fields: 'name,region,flags,capital'
        }
      })
      // console.log(res)
      context.commit('UPDATE_countries', res)
    } catch (error) {
      // console.log(error)
      // throw new Error(error.message)
    }
  }
}
