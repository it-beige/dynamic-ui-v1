// 供全局使用
let h

export default {
  name: 'DyTimePicker',
  // $attrs中的成员不显示在dom上
  inheritAttrs: false,
  props: {
    // 自定义elTimePicker的ref属性
    elTimePickerRef: {
      type: String,
      default: 'elTimePicker'
    },
    // 类型
    type: {
      default: 'time',
      validator: typeVal => {
        return typeVal === 'time'
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
    return h('el-time-picker', {
      props: {
        value: self.newValue,
        ...self.$props,
        ...self.$attrs
      },
      staticClass: 'dynamic-time-picker',
      on: {
        input: self.onChangeHandle,
        ...self.$listeners
      },
      ref: self.elTimePickerRef
    })
  }
}
