<template>
  <el-form-item
    :rules="rules"
    :label="label"
    :prop="prop"
    :data-prop="prop"
  >
    <!-- 自定义label -->
    <template
      v-if="formThis.$scopedSlots[realProp + 'Label']"
      #label
    >
      <slot-content
        v-bind="_attrs"
        :render="formThis.$scopedSlots[realProp + 'Label']"
      />
    </template>

    <!-- 自定义error -->
    <template
      v-if="formThis.$scopedSlots[realProp + 'Error']"
      #error="{error}"
    >
      <slot-content
        v-bind="{..._attrs, error}"
        :render="formThis.$scopedSlots[realProp + 'Error']"
      />
    </template>

    <component
      v-if="!['slot'].includes(type)"
      :is="getComponentName(type)"
      v-bind="bindAttrs"
      v-on="onEvent"
      :slots="slots"
      :scopedSlots="scopedSlots"
      :class="className"
      :style="styleSheet"
    >
    </component>

    <!-- 自定义表单项 -->
    <slot-content
      class="slot-box"
      v-if="isRenderSlot({type, realProp})"
      v-bind="_attrs"
      :render="generateSlotRender(_attrs)"
    />
  </el-form-item>
</template>

<script>

import {
  inputType,
  selectType,
  dateType,
  timeType,
  customType,
} from '../../config/form-item.js'

import {
  getComponentName
} from '../../componentsType'


export default {
  name: 'DyFormItem',
  inheritAttrs: false,
  inject: {
    formThis: {
      default: {}
    }
  },
  components: {
    'slot-content': {
      props: {
        value: {},
        render: {
          type: Function,
          required: true
        }
      },
      render($createElement) {
        return this.render({
          ...this.$attrs,
          value: this.value,
          $createElement
        })
      }
    }
  },
  props: {
    label: String,
    type: {
      type: String,
      require: true,
      validator: (type) => {
        // 允许用户自定义内容 
        if (type === 'slot') {
          return true;
        }

        const comp = getComponentName(type)
        if (!comp) {
          return false
        }
        return true
      }
    },
    prop: {
      type: String,
      require: true
    },
    rules: {
      type: [Array, Object]
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 定义在表单项的class
    className: [Array, Object, String],
    // 定义在表单项的style
    styleSheet: [Array, Object, String],
    // 定义表单项的event
    listeners: {
      type: Object,
      default: () => ({})
    },
    // 定义表单项的slots
    slots: {
      type: Object,
      default: () => ({}),
    },
    // 定义表单项的scopedSlots
    scopedSlots: {
      type: Object,
      default: () => ({}),
    }
  },

  data() {
    return {
      inputType: Object.freeze(inputType),
      selectType: Object.freeze(selectType),
      dateType: Object.freeze(dateType),
      timeType: Object.freeze(timeType),
      customType: Object.freeze(customType)
    }
  },
  computed: {
    // 传递给外界使用的所有参数
    _attrs({ value, label, rules, realProp, $attrs }) {
      return {
        value,
        label,
        rules,
        realProp,
        ...$attrs
      }
    },

    // 绑定到组件上的attribute, 根据类型个别属性做特殊处理
    bindAttrs({ $attrs, $props }) {
      const _bindAttrs = {
        ...$attrs,
        ...$props,
        disabled: $props.disabled || this.formThis.disabled,
        placeholder: this.formatterPlaceHolder
      }

      // 时间类型可以选择子类型处理
      if ($attrs.subtype) {
        _bindAttrs.type = $attrs.subtype
        delete _bindAttrs.subtype
      }

      return _bindAttrs
    },
    // 对于深度属性做特殊处理 data.val => dataVal
    realProp({ prop }) {
      return prop.replace(/\.([^.]+)+?/g, (...arg) => {
        const [, execProp] = arg
        return execProp[0].toUpperCase() + execProp.substr(1)
      })
    },
    // 格式化后的placeholder
    formatterPlaceHolder({ placeholder, type, label = '' }) {
      // 如果整个表单项禁用, placeholder不显示
      if (this.formThis.disabled) {
        return ''
      }

      // 使用用户配置的
      if (placeholder) return placeholder
      let {
        inputType,
        selectType,
        dateType,
      } = this

      if (inputType.includes(type)) {
        return `请输入${label}`
      } else if ([...selectType, ...dateType, ...timeType].includes(type)) {
        return `请选择${label}`
      }
    },
    // 整合配置项中的listeners，最终向下透传的事件 
    onEvent({ $listeners, prop, listeners }) {
      // 添加字段表示具体那个表单项抛出事件
      const _listeners = {
        input: (value) => $listeners['input'](prop, value),
        change: (value) => $listeners['change'](prop, value)
      }
      // 配置项中的事件优先级大于在dynamic-form中监听的事件
      return { ..._listeners, ...listeners }
    }
  },
  methods: {
    // 根据type获取组件
    getComponentName,

    /**
     * @description: 是否渲染自定义内容
     * @param {String} type
     */
    isRenderSlot({ type, realProp }) {
      if (type !== 'slot') {
        return false
      }
      /*
        支持两种渲染方式
          1. template模板的方式
          2. 在配置项中写render函数的方式
      */
      return [
        typeof this.formThis.$scopedSlots[realProp],
        typeof this.$attrs.render
      ].includes('function')
    },
    // 渲染自定内容的render函数 在配置项中写render函数的方式 > template的方式
    generateSlotRender() {
      // normalizeScopedSlot
      return ({ value, $createElement }) => {
        // 给插槽传递参数
        const slotScope = { ...this._attrs, value, $createElement }
        const renderSlot = this._attrs.render || this.formThis.$scopedSlots[this.realProp]
        return renderSlot(slotScope)
      }
    }
  }

}
</script>
