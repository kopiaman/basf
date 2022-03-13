<template>
  <div>
    <div class="mb-3 flex justify-end">
      <input
        v-model="search"
        class="p-3 rounded-l-3xl w-full sm:w-1/4"
        placeholder="Search Name / Capital"
      >
      <button class="bg-red-500 p-3 rounded-r-3xl w-32" @click="search=''">
        <i class="el-icon-delete" /> <span> Clear</span>
      </button>
    </div>
    <div class="rounded-3xl p-3 bg-white">
      <el-table
        id="tableData"
        :data="tableData"
        class="w-full"
      >
        <el-table-column

          label="Name"
          sortable
          prop="name.common"
        >
          <template slot-scope="scope">
            <div class="flex items-center">
              <img :src="scope.row.flags.svg" class="h-5 w-7 mr-2">
              <!-- <div>{{ scope.row.name.common }}</div> -->
              <span v-html="$options.filters.highlight(scope.row.name.common, search)">{{ scope.row.name.common }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Region"
          prop="region"
          sortable
        />
        <el-table-column
          label="Capital"
          sortable
          prop="capital"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.capital && scope.row.capital.length > 0 ? scope.row.capital[0] : '' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="`Favourites (${totalFavourites})`"
          align="right"
        >
          <template slot-scope="scope">
            <Favourite :name="scope.row.name.common" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'IndexPage',
  filters: {
    highlight(word, query) {
      const check = new RegExp(query, 'ig')
      return word.toString().replace(check, function(matchedText, a, b) {
        return ("<strong class='text-blue-500 bg-blue-100'>" + matchedText + '</strong>')
      })
    }
  },
  data() {
    return {
      search: ''
    }
  },

  computed: {
    ...mapState({
      countries: state => state.countries.countries,
      favourites: state => state.countries.favourites
    }),
    totalFavourites() {
      return this.favourites.length
    },
    tableData() {
      if (this.search !== '') {
        return this.countries.filter(country =>
          this.searchName(country) ||
          this.searchCapital(country)
        )
      }
      return this.countries
    }

  },
  watch: {
    favourites(item) {
      localStorage.setItem('favourites', item)
    }
  },
  created() {
    this.$store.dispatch('countries/FETCH_countries')
  },
  mounted() {
    // check if any favourites in localStorage
    const favouriteStorage = localStorage.getItem('favourites')
    // sync with vuex
    if (favouriteStorage) {
      // convert into array
      const favouritesArray = favouriteStorage.split(',')
      // push to vuex to sync
      this.$store.commit('countries/UPDATE_favourites', favouritesArray)
    }
  },

  methods: {
    searchName(data) {
      return data.name.common.toLowerCase().includes(this.search.toLowerCase())
    },
    searchCapital(data) {
      if (data.capital && data.capital.length > 0) {
        return data.capital[0].toLowerCase().includes(this.search.toLowerCase())
      }
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}

</script>
