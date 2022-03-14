export const state = () => ({
  countries: [],
  favourites: [],
  isLoading: false
})

export const mutations = {
  UPDATE_isLoading(state, payload) {
    state.isLoading = payload
  },
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
  async FETCH_countries({ commit }) {
    try {
      commit('UPDATE_isLoading', true)
      const res = await this.$axios.$get('https://restcountries.com/v3.1/region/asia', {
        params: {
          fields: 'name,region,flags,capital,population'
        }
      })
      commit('UPDATE_countries', res)
    } catch (error) {
      throw new Error(error.message)
    } finally {
      commit('UPDATE_isLoading', false)
    }
  }
}
