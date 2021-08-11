/* form-item.vue的配置项 */

// 支持的输入框类型
const inputType = ['input', 'text', 'password', 'email', 'textarea', 'number']
// 支持的下拉框类型
const selectType = ['select']
// 支持的日期类型
const dateType = ['date', 'datetime', 'datetimerange']
// 支持的时间类型
const timeType = ['time']
// 支持的树形类型
const treeType = ['treeSelect', 'treeDialog']
/* 集成的表单项组件 */
const customType = ['upload']

export { inputType, selectType, dateType, customType, timeType, treeType }
