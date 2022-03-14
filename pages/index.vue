<template>
  <div>
    <div class="mb-3 flex justify-between items-center">
      <!-- logo -->
      <div class="flex justify-center sm:justify-start">
        <img src="/img/basf_logo.svg" class="h-10 sm:h-20  ">
      </div>

      <!--search filter -->
      <div class="sm:w-1/2 flex justify-end">
        <button class="bg-yellow-500 p-3 rounded-3xl  mr-3 flex items-center" @click="modalVisible= true">
          <i class="el-icon-data-line text-2xl mr-3" /> <div>
            <span class="text-white">Population Chart </span> ({{ totalComparison }})
          </div>
        </button>

        <input
          v-model="search"
          class="p-3 rounded-l-3xl w-full sm:w-1/2"
          placeholder="Search Name / Capital"
        >
        <button class="bg-red-500 p-3 rounded-r-3xl w-32" @click="search=''">
          <i class="el-icon-delete" /> <span> Clear</span>
        </button>
      </div>
    </div>

    <!-- modal -->
    <el-dialog
      :visible.sync="modalVisible"
      width="30%"
    >
      <PopulationChart
        :chart-data="{
          labels: populationLabel,
          datasets: [
            {
              axis: 'x',
              label: 'Population',
              backgroundColor: '#2a7ec4',
              data: populationData
            }
          ]
        }"
        :options="{ indexAxis: 'y'}"
      />
    </el-dialog>

    <!-- just simple instruction -->
    <p class="text-xs text-white my-1">
      Instruction: Use checkbox to compare countries population
    </p>
    <!-- table -->
    <div class="rounded-3xl p-3 bg-white">
      <el-table
        id="tableData"
        v-loading="isLoading"
        :data="tableData"
        class="w-full"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          label="Compare"
          width="55"
        />
        <el-table-column

          label="Name"
          sortable
          prop="name.common"
        >
          <template slot-scope="scope">
            <div class="flex items-center">
              <!-- <el-checkbox :key="scope.row.name.common" :value="scope.row.name.common" @change="populationCompare(scope.row.name.common)" /> -->
              <img :src="scope.row.flags.svg" class="h-5 w-7 mx-2">
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
            <!-- <div>{{ scope.row.capital && scope.row.capital.length > 0 ? scope.row.capital.toString() : '' }}</div> -->

            <span v-html="$options.filters.highlight(scope.row.capital.toString(), search)">
              {{ scope.row.capital.toString() }}
            </span>
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
      search: '',
      populationCheckbox: [],
      modalVisible: false,
      populationLabel: [],
      populationData: []
    }
  },

  computed: {
    ...mapState({
      countries: state => state.countries.countries,
      favourites: state => state.countries.favourites,
      isLoading: state => state.countries.isLoading
    }),

    totalComparison() {
      return this.populationCheckbox.length
    },
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
    handleSelectionChange(countries) {
      // add item to population checkbox data
      this.populationCheckbox = countries
      // loop val array to a the data
      this.populationData = countries.map(country => country.population)
      this.populationLabel = countries.map(country => country.name.common)
    },
    searchName(data) {
      return data.name.common.toLowerCase().includes(this.search.toLowerCase())
    },
    searchCapital(data) {
      if (data.capital && data.capital.length > 0) {
        return data.capital.toString().toLowerCase().includes(this.search.toLowerCase())
      }
    }
  }
}

</script>
