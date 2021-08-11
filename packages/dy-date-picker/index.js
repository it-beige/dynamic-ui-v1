import DyDatePicker from './src/date-picker'
DyDatePicker.install = vue => {
  vue.component(DyDatePicker.name, DatePicker)
}
export default DyDatePicker
