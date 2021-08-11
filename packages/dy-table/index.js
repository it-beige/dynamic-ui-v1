import DyTable from './src/table'

DyTable.install = function(Vue) {
  Vue.component(DyTable.name, DyTable)
}

export default DyTable
