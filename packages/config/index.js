import { addComponent } from '../componentsType'
import ajax from '../utils/ajax'

const globalConfig = {
  // 请求baseURL VUE_APP_BASE_API
  baseURI: '',
  // 请求头
  requestHeaders: {
    'X-Ldp-Token':
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjbGllbnR0eXBlIjoiIiwiYXVkIjoiY3JlYXRvciIsInN1YiI6ImFkbWluIiwiY2xpZW50aWQiOiI5em9tMXNlaTU2Z2h1aXJ4IiwiaXNzIjoidWFhIiwicmVhbG1jb2RlIjoiY3JlYXRvciIsImV4cCI6MTYyNzAyNDkyNywidXNlcmlkIjoiYWRtaW4iLCJpYXQiOjE2MjcwMTA1MjcsImp0aSI6Ijg1YmQxODE0LTM5MDctNDAwYy05YmRmLWJlOGE1YmZlZDY2NCJ9.AmL8ByON28qjc6VT7vg6pI3Ive-e9MXLaOp1IpXRt3it2wmISTZ6Wb8wAl0UExOzfk27oIhB6FheTctMN2XJy8N1efDGdKZlX1FwVCZiwYkbko8_EtyGsi8J4e013Ic4cjw0-Zis1qw5DFZ_rpUi0xkWVc7PNpH7qn00Gu6Nb7I',
    'X-Realm': 'creator'
  },
  // 是否开启缓存
  cacheAble: true,
  // 请求函数
  request: ajax,
  // 解析接口返回数据函数
  parseData: ({ data, pageData }) => {
    return pageData || data
  },
  // 分页参数字段名 page size
  pageParamsKey: { page: 'page', size: 'size' },
  // 分页参数值
  pageParamsValue: { page: 1, size: 20 },
  // 添加自定义组件
  addFormComponent: function({ type, name }) {
    addComponent({ type, name })
  }
}

export default globalConfig
