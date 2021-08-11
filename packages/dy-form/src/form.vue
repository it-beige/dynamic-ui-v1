<template>
  <el-form
    :ref="elFormRef"
    :model="model"
    v-bind="$attrs"
    @validate="onValidate"
    :disabled="disabled"
    class="dynamic-form dynamic-form__layout"
  >
    <el-row
      :gutter="space"
      v-bind="calcRowProp"
    >
      <el-col
        v-for="formItem of formItemList"
        :key="formItem.prop"
        v-show="isShowFormItem(formItem)"
        v-bind="clacColSpan(formItem)"
      >
        <dynamic-form-item
          :key="formItem.prop"
          :value="value[formItem.prop] | _formatterItemVal(value, formItem, _getDeepAttr)"
          v-bind="formItem"
          v-on="_listeners"
          @input="(...rest) => bindItemValue(value, formItem, ...rest)"
        />
      </el-col>

      <!-- 预留按钮插槽 -->
      <el-col
        v-if="showBtn"
        :span="24"
      >
        <slot name="form-btn">
          <div class="form-button">
            <el-button
              type="primary"
              @click="$emit('submit')"
            >
              提交
            </el-button>
            <el-button @click="$emit('cancel')">
              取消
            </el-button>
          </div>
        </slot>
      </el-col>
    </el-row>

  </el-form>
</template>

<script>
import DynamicFormItem from './form-item'
import {
  isType,
  noop
} from '../../utils'

export default {
  name: 'DyForm',
  // 解决$listeners透传事件导致双绑问题
  model: {
    event: 'dyInput'
  },
  inheritAttrs: false,
  provide() {
    return {
      formThis: this
    }
  },
  // 当前组件主动抛出的事件
  emits: ['validate', 'submit', 'cancel'],
  filters: {
    /**
     * @description:
     * @param {any} curVal 当前表单的值(如果是深度属性就为空)
     * @param {Object} value form的值
     * @param {Object} item 当前表单配置项
     * @param {Function} _getDeepAttr 格式化item值的方法
     * @return {*}
     */
    _formatterItemVal: (curVal, value, item, _getDeepAttr) => {
      // 提供给用户格式化value的的方法: 如trim、number等作用
      const formater = item.formatter

      if (curVal) {
        return formater ? formater(curVal) : curVal
      }

      // 往下走就是深度属性的情况，需要格式化获取值

      return typeof formater === 'function'
        ? formater(_getDeepAttr(value, item.prop))
        : _getDeepAttr(value, item.prop)
    }
  },
  components: {
    DynamicFormItem
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    formItemList: {
      type: Array,
      default: () => ([])
    },
    // 自定义elForm的ref属性
    elFormRef: {
      type: String,
      default: 'elForm'
    },
    // 对elForm方法进行扩展
    extendFormMethod: {
      type: Object,
      default: () => ({})
    },
    // 表单单元格间距
    space: {
      type: Number,
      default: 20
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 渲染预留的按钮
    showBtn: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {

    }
  },
  computed: {
    // 需要校验的item
    validateItem({ formItemList }) {
      return formItemList.filter(i => i.rules)
    },
    // 传递的form的数据源，用于处理深度属性校验问题
    model({ validateItem, value, isDeepPath, _getDeepAttr }) {
      const _model = { ...value }
      if (!validateItem.length) return _model

      validateItem.forEach(({ prop }) => {
        if (isDeepPath(prop)) {
          _model[prop] = _getDeepAttr(_model, prop, _getDeepAttr)
        }
      })
      return _model
    },
    // 能在dynamic-form监听的事件
    _listeners({ $listeners }) {
      // 支持往下透传的事件
      let supportEvent = ['input', 'change']
      return supportEvent.reduce((_listeners, eventName) => {
        _listeners[eventName] = $listeners[eventName] || (() => { })
        return _listeners
      }, {})
    },
    calcRowProp() {
      return {
        type: 'flex',
      }
    }
  },
  created() {
    this.initFormItemValue()
  },
  methods: {
    /**
     * @description: 初始化value数据
     */
    initFormItemValue() {
      const formModel = { ...this.value }

      for (let item of this.formItemList) {
        // 设置默认值
        const { prop, value } = item

        // 对象有设置值不进行初始化
        if (formModel[prop]) {
          continue;
        }

        // 给formModel设置初始值
        if (['Null', 'Undefined'].includes(isType(value))) {
          // 深度属性的情况
          if (this.isDeepPath(prop)) {
            this._setDeepAttr(
              formModel,
              prop,
              value
            )
          } else {
            formModel[prop] = value
          }
        }
      }
      this.$emit('input', { ...formModel })
    },
    /**
     * @description: 是否是深度属性
     * @param {String} path
     * @return {Boolean}
     */
    isDeepPath(path) {
      return path.indexOf('.') !== -1
    },

    /**
     * @description: 深度获取属性
     * @param {Object} model 表单对象
     * @param {String} deepPath 深度属性
     * @return {any}
     */
    _getDeepAttr(model, deepPath) {
      if (!deepPath) return
      if (this.isDeepPath(deepPath)) {
        const paths = deepPath.split('.')
        let current = model
        let result = null
        for (let i = 0, j = paths.length; i < j; i++) {
          const path = paths[i]
          if (!current) break
          if (i === j - 1) {
            result = current[path]
            break
          }
          current = current[path]
        }
        return result
      } else {
        return model[deepPath]
      }
    },

    /**
     * @description: 设置深度属性
     * @param {Object} model 表单对象
     * @param {String} deepPath 深度属性
     * @param {any} val 要设置的值
     */
    _setDeepAttr(model, deepPath, val) {
      // 路径
      const paths = deepPath.split('.')
      // 目标值，后面这个值会存放符合路径下的所有属性
      const targetVal = {}
      // 陆续查找每个对象的prop
      const pathsNew = paths.concat([])
      let prop
      for (let i = paths.length - 1, j = i; i >= 0; i--) {
        prop = paths[i]
        // 最后一层要设定的值
        if (i === j) {
          targetVal[prop] = val
        } else if (i === 0) {
          // 先获取根属性的值
          const originalVal = model[prop]
          // 第一层需要直接替换的根属性
          // this.$set(model, prop, Object.assign(originalVal, targetVal))
          model[prop] = Object.assign(originalVal, targetVal)
        } else {
          // 更新每一个层级的值(去除存起来的值)
          const curDeppObj = this._getDeepAttr(model, pathsNew.join('.'))
          // 将当前层级的值存储起来
          targetVal[prop] = Object.assign({}, curDeppObj, targetVal)
          // 删除上个路径存储的值
          delete targetVal[paths[i + 1]]
        }

        // 将处理过的路径去除
        pathsNew.pop()
      }
    },

    /**
     * @description: 实现双向绑定
     * @param {Object} model 表单对象
     * @param {Object} item 表单项配置对象(预留参数)
     * @param {String} deepPath 深度属性
     * @param {any} val 当前表单项的值
     * @param {any} val 要设置的值
     */
    bindItemValue(model, item, prop, val) {
      const _model = { ...model }

      // 提供给用户格式化value的的方法: 如trim、number等作用
      const formater = item.formatter || noop

      // 深度属性需要格式化
      if (~prop.indexOf('.')) {
        this._setDeepAttr(_model, prop, formater(val))
      } else {
        _model[prop] = formater(val)
      }

      this.$emit('dyInput', _model)
    },

    // 将formItem配置项和默认值进行混合生产栅格布局
    clacColSpan(formItem) {
      // 默认配置≥992px「pc」
      let {
        span = 8,
        offset = 0,
        xs = { span: 24, offset: 0 }, // 
      } = formItem
      return {
        md: { span, offset },
        xs, // <768px「phone」
        span
      }

    },
    // 控制formItem显示隐藏
    isShowFormItem({ hidden }) {
      if (isType(hidden) === 'Boolean') {
        return !hidden
      }
      return true
    },
    /**
     * @description: 表单整体校验
     */
    validate(callback) {
      return this.$refs[this.elFormRef].validate(callback)
    },
    /**
     * @description: 单个字段校验
     */
    validateField(props, callback) {
      return this.$refs[this.elFormRef].validateField(props, callback)
    },
    /**
     * @description: 清除校验
     */
    clearValidate(props) {
      return this.$refs[this.elFormRef].clearValidate(props)
    },
    /**
     * @description: 表单重置，清除校验
     */
    resetFields() {
      return this.$refs[this.elFormRef].resetFields()
    },

    /**
     * @description: 抛出el-form的validate事件「解决vm.$On动态监听问题」
     * @param {array} arg
     */
    onValidate(...arg) {
      this.$emit('validate', ...arg)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/dynamic-form.scss";
</style>
