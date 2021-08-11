import { isFunction } from '../utils'
import globalConfig from '../config'

export default {
  props: {
    baseURI: {
      type: String,
      default: globalConfig.baseURI
    },
    // 请求头
    headers: {
      type: Object,
      default: () => globalConfig.requestHeaders
    },
    // 请求数据的方法
    request: {
      type: Function,
      default: (...arg) => {
        return globalConfig.request(...arg)
      }
    },
    // 解析数据的方法
    parseData: {
      type: Function,
      default: globalConfig.parseData
    },
    // 获取异步获取的方法
    resolveData: Function,
    // 异步获取配置项与options互斥
    url: String,
    // 请求方式
    method: {
      type: String,
      default: 'GET'
    },
    params: Object,
    data: Object,
    // 分页参数字段名
    pageParamsKey: {
      type: Object,
      default: () => globalConfig.pageParamsKey
    },
    // 分页参数值
    pageParamsValue: {
      type: Object,
      default: () => globalConfig.pageParamsValue
    }
  },
  computed: {
    paramsKey({ method }) {
      return method.toUpperCase() === 'GET' ? 'params' : 'data'
    },
    // 只要这三个参数有一个变动，就会触发重新计算
    requestOption({ method, url, paramsKey }) {
      return {
        url,
        method,
        [paramsKey]: this[paramsKey]
      }
    }
  },
  created() {
    if (this.url) {
      this.pageParams = {}
      this.$set(
        this.pageParams,
        this.pageParamsKey.page,
        this.pageParamsValue.page
      )
      this.$set(
        this.pageParams,
        this.pageParamsKey.size,
        this.pageParamsValue.size
      )
    }
  },

  methods: {
    async $request(reqOptions) {
      // 请求数据的方法
      const request = this.request
      let data

      // 防止接口报错导致出错
      try {
        // 返回解析之后的接口数据
        const res = await request({ ...reqOptions, headers: this.headers })
        data = this.parseData(res)
      } catch (e) {
        console.error(e)
        // 报错不往下走「不去触发配置项中的resolveData」
        return
      }

      // 用户需要获取异步请求的数据情况
      if (isFunction(this.resolveData)) {
        this.resolveData(data)
      }
      return data
    }
  }
}
