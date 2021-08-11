import DyEditableColumn from '../dy-editable/src/editable-column'
DyEditableColumn.install = vue => {
  vue.component(DyEditableColumn.componentName, DyEditableColumn)
}
export default DyEditableColumn
