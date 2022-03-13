<template>
  <div>
    <div class="mb-3 flex justify-end">
      <input
        v-model="search"
        class="p-3 rounded-3xl w-full sm:w-1/2"
        placeholder="Search Name / Capital"
      >
    </div>
    <el-table
      :data="tableData"
      class="rounded-3xl p-3"
    >
      <el-table-column
        label="Name"
      >
        <template slot-scope="scope">
          <div class="flex items-center">
            <img :src="scope.row.flags.svg" class="h-3 mr-2">
            <div>{{ scope.row.name.common }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="Region"
        prop="region"
      />
      <el-table-column
        label="Capital"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.capital && scope.row.capital.length > 0 ? scope.row.capital[0] : '' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
      >
        <template slot-scope="scope">
          <el-button
            size=""
            type="primary"
            @click="handleDelete(scope.$index, scope.row)"
          >
            Favourite
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'IndexPage',
  data() {
    return {
      search: ''
    }
  },
  computed: {
    ...mapState({
      countries: state => state.countries.countries
    }),
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
  created() {
    this.$store.dispatch('countries/FETCH_countries')
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
