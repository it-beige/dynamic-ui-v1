<template>
  <div class="app-container test-component">
    <card-panel header="jl-table">
      <table1 />
    </card-panel>
    <card-panel header="dy-table">
      <table2 />
    </card-panel>
  </div>
</template>

<script>
import table1 from './comp/table1.vue'
import table2 from './comp/table2.vue'
export default {
  name: 'CkTestTable',
  components: {
    table1,
    table2
  },
  data() {
    return {

    }
  },
  computed: {

  }
}

</script>

