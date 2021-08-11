import globalConfig from './config'
import { isFunction } from './utils'
import './styles/index.scss'

import DyInput from './dy-input'
import DyCheckbox from './dy-checkbox'
import DySelect from './dy-select'
import DyCascader from './dy-cascader'
import DyTreeSelect from './dy-tree-select'
import DyDatePicker from './dy-date-picker'
import DyTimePicker from './dy-time-picker'
import DyUpload from './dy-upload'
import DyForm from './dy-form'

// 默认全局注册组件列表
const components = [
  DyInput,
  DyCheckbox,
  DySelect,
  DyForm,
  DyCascader,
  DyTreeSelect,
  DyDatePicker,
  DyTimePicker,
  DyUpload
]

const install = function(Vue, options) {
  const {
    baseURI,
    requestHeaders,
    request,
    parseData,
    pageParamsKey,
    cacheAble = true,
    addFormComponent = []
  } = options

  globalConfig.requestHeaders = requestHeaders

  // 判断是否安装，安装过就不继续往下执行
  if (install.installed) return
  install.installed = true

  globalConfig.baseURI = baseURI
  globalConfig.cacheAble = cacheAble

  // 请求接口数据的方法
  if (isFunction(request)) {
    globalConfig.request = request
  }

  // 解析接口返回数据配置
  if (isFunction(parseData)) {
    globalConfig.parseData = parseData
  }

  // 分页配置
  if (pageParamsKey) {
    globalConfig.pageParamsKey = pageParamsKey
  }

  // 允许添加组件
  addFormComponent.forEach(i => globalConfig.addFormComponent(i))
  // 遍历注册所有组件
  components.forEach(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// 全局安装过的组件
const installComponents = components.reduce((acc, c) => {
  acc[c.name] = c
  return acc
}, {})

export default {
  install,
  version: '1.0.0',
  author: 'Beige',
  // 所有组件，必须具有install，才能使用Vue.use()
  ...installComponents
}
