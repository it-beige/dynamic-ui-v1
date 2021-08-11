import RequestMixin from '../../mixins/RequestMixin'

// 供全局使用
let h
// 支持的类型
const types = ['el-cascader', 'el-cascader-panel']

import { renderSlots } from '../../utils'

export default {
  name: 'DyCascader',
  inheritAttrs: false,
  mixins: [RequestMixin],
  components: {
    // 懒加载「专门用来渲染el-cascader提供的slot的无状态组件」
    SlotContent: () => import('../../slotContent')
  },
  props: {
    // 类型
    type: {
      default: 'el-cascader',
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
    // 备选项
    options: {
      type: Array,
      default: () => []
    },
    // 格式化选项数据
    formatter: Function,
    // 自定义elCascader的ref属性
    elCascaderRef: {
      type: String,
      default: 'elCascader'
    }
    // 支持el-cascader/el-cascader-panel所有参数
  },
  watch: {
    requestOption: {
      async handler({ url }) {
        if (!url) return
        try {
          const options = await this.getAsyncOptions()
          this.options.length = 0
          this.options.push(...options)
        } catch (e) {
          console.error(e)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 异步获取数据
    async getAsyncOptions() {
      const options = await this.$request({
        ...this.requestOption,
        ...this.headers
      })
      return options || []
    }
  },
  render() {
    h = this.$createElement
    const self = this
    const { elCascaderRef, $slots, $scopedSlots, type, options } = self
    // 配置插槽「渲染el-select提供的slot」
    const slotsVNode = renderSlots(h, $slots)

    const cascaderVNode = h(
      type,
      {
        props: {
          value: this.newValue,
          options,
          ...this.$attrs
        },
        on: {
          ...this.$listeners
        },
        scopedSlots: {
          default(props) {
            if ($scopedSlots.default) {
              return $scopedSlots.default(props)
            }
          }
        },
        ref: elCascaderRef
      },
      [].concat(slotsVNode)
    )

    return cascaderVNode
  }
}
