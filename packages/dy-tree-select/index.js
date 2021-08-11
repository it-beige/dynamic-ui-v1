import DyTreeSelect from './src/tree-select'
DyTreeSelect.install = vue => {
  vue.component(DyTreeSelect.name, TreeSelect)
}
export default DyTreeSelect
