// 供全局使用
let h
// 支持的类型
const types = [
  'datetimerange',
  'daterange',
  'dates',
  'date',
  'year',
  'month',
  'week'
]
export default {
  name: 'DyDatePicker',
  // $attrs中的成员不显示在dom上
  inheritAttrs: false,
  props: {
    // 自定义elDatePicker的ref属性
    elDatePickerRef: {
      type: String,
      default: 'elDatePicker'
    },
    // 类型
    type: {
      default: 'date',
      validator: typeVal => {
        if (types.includes(typeVal)) {
          return true
        } else {
          console.error(`只支持[${types.toString()}]类型`)
          return false
        }
      }
    },
    // 绑定值
    value: {}
    // 支持el-date-picker所有props
  },
  computed: {
    newValue: {
      get({ value }) {
        return value
      },
      set(value) {
        this.$emit('change', value)
      }
    },
    // 扩展$attrs，对一些配置项做默认值处理
    extendAttrs({ $attrs, type }) {
      let _extendAttrs = {}
      if (['daterange', 'datetimerange'].includes(type)) {
        _extendAttrs = {
          'range-separator': '至',
          'start-placeholder': '开始日期',
          'end-placeholder': '结束日期'
        }
      }

      return { ..._extendAttrs, ...$attrs }
    }
  },
  methods: {
    onChangeHandle(val) {
      this.newValue = val
    }
  },
  render($createElement) {
    h = $createElement
    const self = this
    const { onChangeHandle, extendAttrs } = this
    return h('el-date-picker', {
      props: {
        value: self.newValue,
        ...extendAttrs,
        ...self.$props
      },
      staticClass: 'dynamic-date-picker',
      on: {
        input: onChangeHandle,
        ...self.$listeners
      },
      ref: self.elDatePickerRef
    })
  }
}
