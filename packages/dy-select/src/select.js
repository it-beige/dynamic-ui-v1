import RequestMixin from '../../mixins/RequestMixin'
import SlotsMixin from '../../mixins/SlotsMixin'
// 供全局使用
let h

const defaultProps = {
  label: 'label',
  value: 'value',
  // 禁用当前项的「方法」
  disabled: null,
  // 分组的属性「如果指定了key就会根据当前Key来渲染分组」
  group: '',
  // 格式化函数
  formatter: null
}

import { renderSlots, isFunction, isArray, debounce } from '../../utils'

export default {
  name: 'DySelect',
  inheritAttrs: false,
  mixins: [SlotsMixin, RequestMixin],
  components: {
    // 懒加载「专门用来渲染el-input提供的slot的无状态组件」
    SlotContent: () => import('../../slotContent')
  },
  props: {
    value: {},
    // optionsProps 备选项映射
    props: {
      type: Object,
      default: () => defaultProps
    },
    // 备选项
    options: {
      type: Array,
      default: () => []
    },
    // 类名
    className: {
      type: [String, Array]
    },
    // 自定义样式
    styleSheet: Object,
    // 自定义elSelect的ref属性
    elSelectRef: {
      type: String,
      default: 'elSelect'
    },
    // 下拉加载方法(支持懒加载)
    loadMoreMethod: Function
    // 支持el-select所有参数
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
  mounted() {
    if (isFunction(this.loadMoreMethod)) {
      this.$nextTick(() => {
        this.handleOptionsScroll()
      })
    }
  },
  methods: {
    // 异步获取数据
    async getAsyncOptions(params) {
      const options = await this.$request({
        ...this.requestOption,
        [this.paramsKey]: Object.assign({}, this[this.paramsKey], params)
      })
      return options || []
    },
    // 懒加载数据
    handleOptionsScroll() {
      const self = this
      const selectWrapDom = self.$refs.elSelect.$el.querySelector(
        '.el-select-dropdown .el-select-dropdown__wrap'
      )
      const fun = function() {
        // 判断滚动到底部
        const condition =
          this.scrollHeight - this.scrollTop <= this.clientHeight
        // 执行下拉加载方法
        if (condition) {
          self.loadMoreMethod(params => {
            self
              .getAsyncOptions(params)
              .then(options => {
                self.options.push(...options)
              })
              .finally(() => {
                self.loading = false
              })
          }, self.pageParams)
        }
      }
      const dFn = debounce(fun, 500)
      selectWrapDom.addEventListener('scroll', dFn)
      this.$once('hook:beforeDestroy', () => {
        selectWrapDom.removeEventListener('scroll', dFn)
      })
    }
  },
  render($createElement) {
    h = $createElement
    const self = this
    const {
      elSelectRef,
      props, // 渲染options的配置
      options
    } = self
    // 配置插槽「渲染el-select提供的slot」
    const slotsVNode = renderSlots(h, self.bindSlots)
    // 渲染options
    let optionsVNode = []
    if (options.length) {
      // 备选项的配置
      const { value, label, disabled, group, formatter } = props
      // 渲染options的方法
      const renderOptionsVNode = (options = []) => {
        return options.map((op, index, ...reset) => {
          return h(
            'el-option',
            {
              attrs: {
                value: op[value],
                label: op[label],
                disabled: isFunction(disabled)
                  ? disabled(op, index, ...reset)
                  : op.disabled
              },
              key: op.key || `el-o-${op[value]}-${index}`
            },
            self.scopedSlots.options
              ? self.scopedSlots.options(op)
              : (labelFormatterNode && labelFormatterNode(op[label], op)) ||
                  null
          )
        })
      }

      // 选项格式化显示
      let labelFormatterNode = null
      if (isFunction(formatter)) {
        labelFormatterNode = function(labelValue, op) {
          return [h('span', formatter(labelValue, op))]
        }
      }

      // 渲染分组options
      if (group) {
        optionsVNode = options.map((op, index, ...reset) => {
          return h(
            'el-option-group',
            {
              attrs: {
                label: op[label],
                disabled: disabled ? disabled(op, index, ...reset) : op.disabled
              },
              key: op.key || `el-g-${label}-${index}`
            },
            isArray(op[group]) ? renderOptionsVNode(op[group]) : null
          )
        })
      } else {
        optionsVNode = renderOptionsVNode(options)
      }
    }
    return h(
      'el-select',
      {
        attrs: {
          ...self.$attrs
        },
        props: {
          ...self.$attrs,
          ...self.$props,
          loading: self.loading
        },
        on: {
          ...self.$listeners
        },
        ref: elSelectRef
      },
      [].concat(optionsVNode, slotsVNode)
    )
  }
}
