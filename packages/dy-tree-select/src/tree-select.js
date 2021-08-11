import RequestMixin from '../../mixins/RequestMixin'

// 供全局使用
let h
import { renderSlots, isArray, isFunction } from '../../utils'

const defaultProps = {
  label: 'label',
  children: 'children',
  // 禁用当前项的「方法」
  disabled: null
}

export default {
  name: 'DyTreeSelect',
  inheritAttrs: false,
  mixins: [RequestMixin],
  props: {
    value: {},
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 展示数据
    data: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => defaultProps
    },
    // 父子级数据互不关联
    checkStrictly: {
      type: Boolean,
      default: true
    },
    // 是否可以多选节点
    multiple: Boolean,
    // 格式化展示在表单中的数据
    formatter: {
      type: Function,
      default: val => {
        const showText = isArray(val) ? val : [val]
        return showText.join('/')
      }
    },
    // 是否开启过滤树的功能
    filterable: {
      type: Boolean,
      default: false
    },
    // 接受表单输入的过滤值的方法
    filterMethod: Function,
    // 过滤树的方法
    filterNodeMethod: Function,
    // 自定义elTreeSelect的ref属性
    elTreeSelectRef: {
      type: String,
      default: 'elTreeSelect'
    },
    // 自定义elSelect的ref属性
    elSelectRef: {
      type: String,
      default: 'elSelect'
    }
    // 支持el-tree所有参数
  },
  data() {
    return {
      // 选择的节点label值
      label: '',
      // 当前节点数据
      nodeData: null,
      // 选择的节点项
      checkedOptionsData: []
    }
  },
  computed: {
    // 表单显示的值
    selectValue: {
      get({ label }) {
        if (isArray(label)) {
          label = label.map(l => l[this.props.label])
        }
        return this.formatter(label)
      },
      set(newValue) {
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      }
    },
    // 最终绑定的el-select中的filterMethod
    bindFilterMethod({ filterable, filterMethod }) {
      if (!filterable) return
      // 用户自定义接受过滤值的方法
      if (isFunction(filterMethod)) {
        return filterMethod
      }

      return this.defaultFilterMethod
    },
    // 最终绑定el-tree中的filterNodeMethod
    bindFilterNodeMethod({ filterable, filterNodeMethod }) {
      if (!filterable) return

      // 用户自定义过滤树的方法
      if (isFunction(filterNodeMethod)) {
        return filterNodeMethod
      }
      return this.defaultFilterNodeMethod
    }
  },
  watch: {
    requestOption: {
      async handler({ url }) {
        if (!url) return
        try {
          const data = await this.getAsyncOptions()
          this.data.length = 0
          this.data.push(...data)
        } catch (e) {
          console.error(e)
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // 异步获取数据
    async getAsyncOptions(params) {
      const data = await this.$request({
        ...this.requestOption,
        ...this.headers,
        [this.paramsKey]: Object.assign({}, this[this.paramsKey], params)
      })
      return data || []
    },
    // 切换选项
    handleNodeClick(data, node) {
      if (node.disabled || this.multiple) {
        return
      }
      this.nodeData = node.data
      this.label = node.label
      this.selectValue = node.key
      // 收起下拉框
      this.$refs.elSelect.blur()
    },
    // 选择框勾选
    handleNodeCheck(data, { checkedKeys, checkedNodes }) {
      if (!this.multiple) {
        return
      }
      this.selectValue = checkedKeys
      this.label = checkedNodes
    },
    // 动态绑定到select中的prop
    bindSelectProps() {
      if (!this.filterable) {
        return {}
      }
      return {
        filterable: this.filterable,
        filterMethod: this.bindFilterMethod
      }
    },
    // 动态绑定到tree中的prop
    bindTreeProps() {
      if (!this.filterable) {
        return {}
      }
      return {
        filterNodeMethod: this.bindFilterNodeMethod
      }
    },

    /** ********************* 过滤树形方法-start ************************/
    // 默认接受表单输入的过滤值的方法
    defaultFilterMethod(searchText) {
      this.$refs[this.elTreeSelectRef].filter(searchText)
    },
    // 默认过滤树的方法
    defaultFilterNodeMethod(value, data, node) {
      if (!value) return true
      return this.filterChildrenNode(
        value,
        data,
        node,
        this.filterMethodByIndexOf
      )
    },
    // 根据哪个条件过滤
    filterMethodByIndexOf(label, value) {
      return label.indexOf(value) !== -1
    },
    // 如果父节点包含，不要筛选掉子节点
    filterChildrenNode(value, data, node, filterMethodByIndexOf) {
      if (filterMethodByIndexOf(node.label, value)) {
        return true
      }
      // 一级节点没有父级
      if (node.level === 1) return false

      // 往上找到最大父节点结束
      const maxNode = 1
      // 多级节点父级符合条件，不要、过滤子级
      let parentNode = node.parent

      while (parentNode.level > maxNode) {
        if (filterMethodByIndexOf(parentNode.label, value)) {
          parentNode.expanded = false
          return true
        }

        parentNode = parentNode.parent
      }

      // 当前节点的最大父节点都没找到
      return false
    }
    /** ****************** 树形过滤-end ***********************/
  },
  render($createElement) {
    h = $createElement
    const self = this
    const { elTreeSelectRef, elSelectRef, $slots, $listeners, $attrs } = self
    // 配置插槽「渲染el-select提供的slot」
    const slotsVNode = renderSlots(h, $slots)

    // 渲染树
    const treeVNode = h('el-tree', {
      attrs: {
        ...$attrs
      },
      props: {
        ...$attrs,
        data: self.data,
        props: self.props,
        value: self.value,
        nodeKey: self.nodeKey,
        checkStrictly: self.checkStrictly,
        showCheckbox: self.multiple,
        ...self.bindTreeProps()
      },
      on: {
        ...$listeners,
        'node-click': self.handleNodeClick,
        check: self.handleNodeCheck
      },
      ref: elTreeSelectRef
    })

    // 渲染options
    let optionsVNode = []
    optionsVNode = h(
      'el-option',
      {
        attrs: {
          value: self.selectValue
        },
        directives: [
          {
            name: 'show',
            value: true
          }
        ]
      },
      [treeVNode]
    )

    // 渲染select
    return h(
      'el-select',
      {
        attrs: {
          ...$attrs
        },
        props: {
          value: self.selectValue,
          popperClass: 'dy-tree-select-dropdown',
          ...self.bindSelectProps()
        },
        on: {
          ...$listeners
        },
        ref: elSelectRef
      },
      [].concat(slotsVNode, optionsVNode)
    )
  }
}
