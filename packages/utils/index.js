/**
 * @description: 解决$attrs并不会自动将kebab-case转换为camelCase的问题
 * @param {Object} $attrs
 * @param {String} name
 * @return {*} camelCase风格的name
 */
export function getAttrsName($attrs, name) {
  if ($attrs[name]) return $attrs[name]

  const replaceKebabReg = /-+([A-z])/g
  const camelCaseName = name.replace(replaceKebabReg, (execStr, $1) => {
    return $1.toUpperCase()
  })
  return $attrs[camelCaseName]
}

/**
 * @description: 判断数据类型
 * @param {any} val
 * @return {Sting} isType(fun) => 'Function'
 */
export function isType(val) {
  const typeStr = Object.prototype.toString.call(val)
  return typeStr.substring(8, typeStr.length - 1)
}

export const isObject = v => isType(v) === 'Object'
export const isFunction = v => isType(v) === 'Function'
export const isArray = v => isType(v) === 'Array'
export const isBoolean = v => isType(v) === 'Boolean'
export const isString = v => isType(v) === 'String'
export const isNumber = v => isType(v) === 'Number'

/**
 * @description: 空函数
 * @param {val} 用于透传值
 */
export const noop = val => val

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @description: 用于渲染插槽
 * @param {Function} $createElement
 * @param {Object} $slots
 */
export function renderSlots(h, $slots) {
  const slots = Object.keys($slots).map(slotName => {
    const s = $slots[slotName]
    return h('slot-content', {
      props: {
        render: () => (isFunction(s) ? s(h) : s)
      },
      slot: slotName,
      key: slotName
    })
  })

  return slots
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    const later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
