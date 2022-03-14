export const state = () => ({
  countries: [],
  favourites: []
})

export const mutations = {
  UPDATE_countries(state, payload) {
    state.countries = payload
  },
  UPDATE_favourites(state, payload) {
    state.favourites = payload
  },
  ADD_favourite(state, payload) {
    state.favourites.push(payload)
  },
  REMOVE_favourite(state, payload) {
    state.favourites = state.favourites.filter(item => item !== payload)
  }
}

export const actions = {
  async FETCH_countries(context) {
    try {
      const res = await this.$axios.$get('https://restcountries.com/v3.1/all', {
        params: {
          fields: 'name,region,flags,capital,population'
        }
      })
      context.commit('UPDATE_countries', res)
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
