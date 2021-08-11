// 供全局使用
let h
// 支持的类型
const types = ['input', 'text', 'number', 'password', 'email', 'textarea']
// 渲染el-input提供的slot
import { renderSlots } from '../../utils'
import SlotsMixin from '../../mixins/SlotsMixin'
export default {
  name: 'DyInput',
  mixins: [SlotsMixin],
  components: {
    // 懒加载「专门用来渲染el-input提供的slot的无状态组件」
    SlotContent: () => import('../../slotContent')
  },
  inheritAttrs: false,
  props: {
    // 类型
    type: {
      default: 'text',
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
    value: {},
    // 控制是否能被用户缩放
    resize: {
      type: String,
      default: 'none'
    },
    // 是否渲染el-autocomplete组件
    isAutocomplete: {
      type: Boolean,
      default: false
    },
    // 自定义elInput的ref属性
    elInputRef: {
      type: String,
      default: 'elInput'
    }

    // 支持el-input所有参数
  },
  computed: {
    newValue: {
      get({ value }) {
        return value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    // 最终要渲染的组件名称
    componentTag: {
      get({ isAutocomplete, $attrs }) {
        const fetchSuggestions = $attrs['fetch-suggestions']
        // fetchSuggestions 返回输入建议的方法(isAutocomplete为true时必传)
        return isAutocomplete && typeof fetchSuggestions === 'function'
          ? 'el-autocomplete'
          : 'el-input'
      }
    }
  },
  methods: {
    onInputHandle(val) {
      this.newValue = val
    }
  },
  render() {
    h = this.$createElement
    const self = this
    const { onInputHandle, bindSlots, componentTag, elInputRef } = self
    // 配置插槽
    const slotsVNode = renderSlots(h, bindSlots)
    return h(
      componentTag,
      {
        props: {
          type: self.type,
          value: self.newValue,
          resize: self.resize,
          ...self.$attrs
        },
        attrs: {
          ...self.$attrs
        },
        on: {
          input: onInputHandle,
          ...self.$listeners
        },
        ref: elInputRef
      },
      slotsVNode
    )
  }
}
