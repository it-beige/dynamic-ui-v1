import DyTableColumn from '../dy-table/src/table-column'

DyTableColumn.install = function(Vue) {
  Vue.component(DyTableColumn.name, DyTableColumn)
}

export default DyTableColumn
