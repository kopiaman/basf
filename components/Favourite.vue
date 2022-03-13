<template>
  <button @click="toggle(name)">
    <i class=" text-2xl" :class="isFavourite? 'el-icon-star-on text-yellow-500' : 'el-icon-star-off' " />
  </button>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'FavouriteComponent',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isFavourite: false
    }
  },
  computed: {
    ...mapState({
      favourites: state => state.countries.favourites
    })
  },
  mounted() {
    // check if this item already in favourite
    if (this.favourites.includes(this.name)) {
      this.isFavourite = true
    }
  },
  methods: {
    toggle(name) {
      this.isFavourite = !this.isFavourite
      // add to local storage to remember if page refreshed
      if (this.isFavourite) {
        this.$store.commit('countries/ADD_favourite', name)
      } else {
        this.$store.commit('countries/REMOVE_favourite', name)
      }
    }
  }
}
</script>

<style lang='scss' scope>

</style>
