import SlotContent from '../slotContent'
import globalConfig from '../config'

export default {
  inheritAttrs: false,
  components: { SlotContent },
  inject: {
    formThis: { default: {}}
  },
  props: {
    value: {
      type: [Array, Object]
    },
    disabled: Boolean,
    // 事件
    listeners: {
      type: Object,
      default() {
        return {}
      }
    },
    // 格式化函数
    valueFormat: Function,
    // 类名
    className: {
      type: [String, Array]
    },
    // 自定义样式
    customStyle: Object,
    // 解析上传成功接口返回的数据
    parseData: Function
  },
  computed: {
    onEvents() {
      return Object.assign({}, this.defaultOn, this.listeners)
    },
    bindAttrs() {
      let disabled = this.disabled || this.$attrs.disabled
      if (typeof disabled === 'function') {
        disabled = disabled(this.value, this.formThis.model)
      }
      if (!disabled && this.formThis) {
        disabled = this.formThis.disabled
      }
      return Object.assign({}, this.$attrs, {
        disabled: disabled,
        min: this.min || this.$attrs.min,
        max: this.max || this.$attrs.max
      })
    },
    uploadHeaders() {
      return Object.assign(
        {},
        globalConfig.requestHeaders,
        this.bindAttrs.headers
      )
    }
  },
  data() {
    return {
      // 默认事件
      defaultOn: {
        input: this.handleChange
      }
    }
  },
  methods: {
    // 变化处理
    handleChange(value) {
      this.$emit('input', value)
    },
    // 获取上传url
    getUploadUrl(url) {
      if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(url)) {
        return globalConfig.baseURI + url
      }
      return url
    }
  }
}
