import DyEditable from './src/editable'
import DyEditableColumn from './src/editable-column'
DyEditable.install = vue => {
  vue.component(DyEditable.componentName, DyEditable)
  vue.component(DyEditableColumn.componentName, DyEditableColumn)
}
export default DyEditable
