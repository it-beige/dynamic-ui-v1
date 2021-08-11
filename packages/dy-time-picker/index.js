import TimePicker from './src/time-picker'
TimePicker.install = vue => {
  vue.component(TimePicker.name, TimePicker)
}
export default TimePicker
