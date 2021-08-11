const componentNames = {
  input: 'DyInput',
  text: 'DyInput',
  textarea: 'DyInput',
  password: 'DyInput',
  number: 'DyInput',
  radio: 'DyCheckbox',
  checkbox: 'DyCheckbox',
  select: 'DySelect',
  treeSelect: 'DyTreeSelect',
  slider: 'DySlider',
  upload: 'DyUpload',
  cascader: 'DyCascader',
  switch: 'ElSwitch',
  inputNumber: 'ElInputNumber',
  time: 'DyTimePicker',
  date: 'DyDatePicker',
  datetime: 'DyDatePicker',
  datetimerange: 'DyDatePicker',
  daterange: 'DyDatePicker',
  year: 'DyDatePicker',
  month: 'DyDatePicker',
  week: 'DyDatePicker',
  rate: 'ElRate',
  colorPicker: 'ElColorPicker ',
  transfer: 'ElTransfer'
}

export function addComponent({ type, name }) {
  if (!type) {
    // eslint-disable-next-line
    console.error(`注册表单组件类型不能为空`)
    return
  }
  componentNames[type] = name
}

export function getComponentName(type) {
  if (!type) {
    // eslint-disable-next-line
    console.error(`${type}-类型不能为空`)
    return
  }
  if (!componentNames[type]) {
    // eslint-disable-next-line
    console.error(`表单组件不支持的类型：${type}`)
    return
  }
  return componentNames[type]
}
