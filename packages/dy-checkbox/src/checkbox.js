// 供全局使用
let h
// 支持的类型
const types = ['checkbox', 'radio']

import { isObject } from '../../utils'
import RequestMixin from '../../mixins/RequestMixin'

export default {
  name: 'DyCheckbox',
  inheritAttrs: false,
  mixins: [RequestMixin],
  props: {
    // 类型
    type: {
      default: 'checkbox',
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
    value: {
      type: [String, Number, Boolean, Array],
      default: ''
    },
    // 组合的备选项
    options: Array,
    // 格式化数据
    formatter: Function,
    // 自定义elCheckbox的ref属性
    elCheckboxRef: {
      type: String,
      default: 'elCheckbox'
    }
    // 支持el-radio/checkbox/checkbox-group所有参数
  },
  data() {
    return {
      newOptions: []
    }
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

    // 是否渲染组合
    group({ options, url }) {
      return options || url ? 'group' : ''
    },
    // 最终要渲染的组件名称
    componentTag: {
      get({ type, group, $attrs, isRenderButton }) {
        const tag = `el-${type}`
        if (group) {
          return `${tag}-${group}`
        }
        return `${tag}${isRenderButton($attrs.button)}`
      }
    }
  },
  watch: {
    // 异步获取数据
    group: {
      async handler(group) {
        if (!this.isAsyncOptions({ group, url: this.url })) {
          return
        }

        this.newOptions = await this.getAsyncOptions()
      },
      immediate: true
    },
    requestOption: {
      async handler() {
        const isAsync = this.isAsyncOptions({
          group: this.group,
          url: this.url
        })
        if (!isAsync) {
          return
        }
        this.newOptions = await this.getAsyncOptions()
      },
      deep: true
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.options) {
        this.newOptions = this.options
      }
    },
    onChangeHandle(val) {
      this.newValue = val
    },
    // 是否渲染按钮类型
    isRenderButton(button) {
      return button ? '-button' : ''
    },
    // 渲染optionVNode
    renderOptionsVNode(tag, newOptions) {
      let item = {}
      return newOptions.map(o => {
        if (!isObject(o)) {
          item.label = o
        } else {
          // 提供给用户formatter方法来格式化选项
          item = (this.formatter && this.formatter(o)) || o
        }

        return h(
          tag,
          {
            props: {
              ...item
            }
          },
          item.text || item.label
        )
      })
    },
    // 渲染默认插槽内容
    renderSlots($slots) {
      return Object.values($slots).map(s => $slots[s])
    },
    // 异步获取数据
    async getAsyncOptions() {
      try {
        const { $request, parseData, requestOption } = this
        const options = await $request(requestOption)
        return options || []
      } catch (e) {
        console.error(e)
      }
    },
    // 必须是组合且提供了options-url才会被认定异步获取数据
    isAsyncOptions({ group, url }) {
      return group && url
    }
  },
  render() {
    h = this.$createElement
    const self = this
    const {
      group,
      type,
      $attrs,
      $slots,
      componentTag,
      onChangeHandle,
      isRenderButton,
      elCheckboxRef
    } = self

    // 子内容
    const childrenContent = []

    // 组合选项
    if (group && self.newOptions.length) {
      // 组合子选项VNode
      const optionsVNodes = self.renderOptionsVNode(
        `el-${type}${isRenderButton($attrs.button)}`,
        self.newOptions
      )
      childrenContent.push(...optionsVNodes)
    } else {
      childrenContent.push(...($slots.default || []))
    }

    return h(
      componentTag,
      {
        props: {
          value: self.newValue,
          ...self.$attrs
        },
        on: {
          input: onChangeHandle,
          ...self.$listeners
        },
        ref: elCheckboxRef
      },
      childrenContent
    )
  }
}
