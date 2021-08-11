## 系列文章

[手把手教你玩转render函数「组件封装-dynamic-form」](https://juejin.cn/post/6986921261297303565)

[手把手教你玩转render函数「组件封装-dynamic-select」](https://juejin.cn/post/6969226302767235108)

[手把手教你玩转render函数「组件封装-dynamic-input」](https://juejin.cn/post/6969226302767235108)

[手把手教你玩转render函数「组件封装-dynamic-checkbox」](https://juejin.cn/post/6969597821280321550)

[手把手教你玩转render函数「组件封装-dynamic-cascader」](https://juejin.cn/post/6970279201790230541)


## 如何使用？

### 全局注册组件

`main.js`

```js
// 引用插件
import './plugins'
```

`plugins.js`

```js
import './element-ui'
import './dynamic-ui'
```

> 这套组件是依赖element-ui封装的，所以前提是需要使用element

`dynamic-ui.js`

```js
import Vue from 'vue'
import dynamicUI from 'dynamic-ui'
import 'dynamic-ui/lib/index.scss'
Vue.use(dynamicUI)
```

注册之后全局Vue构造函数的`_installedPlugins`对象可以知道我们以Vue.use的方式注册了多少插件，通过这个可以看到我们使用当前插件，他给我们全局注册了哪些组件

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/1.png)

实质看我们全局注册过的组件总共有哪些，可以通过`Vue.options.components`看到

`dynamic-ui/index.js`

```js
import globalConfig from '~config'
import { isFunction, isObject } from '~utils'

import DynamicInput from '~dynamic-input'
// ....引入组件


// 所有组件列表
const components = [
  DynamicInput,
  // ...
]

const install = function(Vue, options) {
  
  const {
    // 动态请求数据的基础url
    baseURI,
    // 请求头-「存放需要过接口鉴权的请求头字段如：token, sso, 领域信息等等」
    requestHeaders,
    // 请求数据的方法-「一般都是封装的axios」
    request,
    // 解析接口返回的数据
    parseData,
    // 分页的字段-「pageSize, pageIndex」
    pageParamsKey,
    // 是否支持缓存数据
    cacheAble = true,
    // 需要动态添加的表单项组件
    addFormComponent = []
  } = options

  // 判断是否安装，安装过就不继续往下执行
  globalConfig.requestHeaders = requestHeaders
  if (install.installed) return

  install.installed = true
  globalConfig.baseURI = baseURI
  globalConfig.cacheAble = cacheAble
  if (isFunction(request)) {
    globalConfig.request = request
  }

  if (isFunction(parseData)) {
    globalConfig.parseData = parseData
  }

  if (pageParamsKey) {
    globalConfig.pageParamsKey = pageParamsKey
  }

  // 用户动态添加的组件
  addFormComponent.forEach(i => globalConfig.addFormComponent(i))
  // 遍历注册所有组件
  components.forEach(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// 全局安装过的组件
const installComponents = components.reduce((acc, c) => {
  acc[c.name] = c
  return acc
}, {})

export default {
  install,
  version: '1.0.0',
  author: 'Beige',
  // 向外面暴露我们通过Vue.use注册过多少全局组件
  ...installComponents
}
```

过了一遍这些大致就了解到了使用这个插件提供的配置项，`globalConfig`全局配置对象就是用来存放全局配置对象，如果用户不传就用默认的，那这样我们就可以在注册时候进行配置

```js
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { sysGateway }

Vue.use(dynamicUI, {
  baseURI: VUE_APP_BASE_API,
  // 用我们封装的axios实例，里面设置了-「请求拦截器、响应拦截器等配置」
  request, 
  requestHeaders: {
    // 过jwt鉴权
    'X-Token': getToken(),
    // 过领域鉴权
    'X-territory': sysGateway,
    // ...
  }
})
```

`config.js`

```js
import { addComponent } from '~componentsType'
import ajax from '~/ajax'

const globalConfig = {
  // 请求baseURL 
  baseURI: '',
  // 请求头
  requestHeaders: {},
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
```

经过用户配置之后，`globalConfig`对象有变动的配置项

```js
// 用户传递进来的
globalConfig.baseURI
globalConfig.request
globalConfig.requestHeaders 
```

> 这里通过这个全局配置对象来将默认值和用户配置的进行融合，后面组件需要使用的时候，直接引入config配置文件就行

## 单个组件怎么使用？

之前我们Vue.use的时候哪些全局注册过的注册都可以直接使用

```html
<dynamic-select
  v-model="model"
  v-bind="selectOptions"
  @change="inputMethod"
  @input="changeMethod"
/>

<script>
export default {
  name: 'CkTestSelect',
  data() {
    return {
      model: '',
      selectOptions: {
        url: '/dynamic-select0',
        props: {
          label: 'baseValue',
          value: 'baseKey',
          // 禁用备选项
          disabled: (v, index) => {
            return index % 2 === 0
          },
          // 格式化数据
          formatter: (value) => {
            return `dy-${value}`
          }
        }，
        className: "dynamic-select"
      }
    }
  }
}
</script>
```

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/1.gif)

- 问题一：input/change事件是属于`el-select`的，我还需要在`dynamic-select`这个组件中emit本不就是这个组件的事件嘛？
- 问题二：className的定义是作用于那一层呢？是`dynamic-select`组件上还是`el-select`上呢？
- 问题三：你动态请求的数据，我怎么去获取呢？？
- 问题四：如果某些接口是第三方的，返回的数据格式和全局的不一样我怎么办？
- 问题五：`el-select`提供的内置插槽我怎么用？能允许我自定义嘛？

考虑到篇幅，这里只贴出重要部分代码。

```js
render($createElement) {
  h = $createElement
  const self = this
  // 配置插槽「渲染el-select提供的slot」
  const slotsVNode = renderSlots(h, this.bindSlots)

   return h(
      'el-select',
      {
        attrs: {
          // 将attributes挂到html节点上，
          // 相同于vue options的inheritAttrs为true
          ...self.$attrs
        },
        props: {
          ...self.$attrs,
          ...self.$props,
          loading: self.loading
        },
        on: {
          ...self.$listeners
        }
      },
      // 子内容
      [].concat(optionsVNode, slotsVNode)
      // optionsVNode => options || el-option-group
  )
}
```

> dynamic-select这个组件是用render函数实现具体实现，在这篇[vue高级特性：render函数封装动态select(上）｜小册免费学](https://juejin.cn/post/6950974720015597604)文章有讲过，感兴趣的可以阅读。

### 问题一

通过$listeners可以将事件透传下去，`dynamic-select`并没有抛出任何事件

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/2.gif)

### 问题二

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/3.png)


```html
<dynamic-select  
  :style="{'background-color': '#fff'}"
  :class-name="['dynamic-select']"
>
```

定义在组件上的非prop的attribute都会在编译的时候自动解析到根节点上

### 问题三

```js
{ 
  // ...其他配置项
  resolveData: (data) => {
    console.log(data)
    this.xxx = data
  }
}
```

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/4.png)

变动数组，select也会响应式重新渲染

### 问题四

前面全局配置的也允许局部配置进行覆盖

```js
{
  headers: {
    'sso': getSSo(),
    'Authorization': getAuth()
  },
  parseData: (res) => {
    return res.pageData.data
  },
}

```

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/5.png)

这些配置可以提取成mixin引入，只要组件支持动态请求数据数据都支持这些功能

`RequestMixin.js`

```js
import { isFunction } from '../utils'
import globalConfig from '../config'

export default {
  props: {
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
```

后面只要是支持动态请求数据的直接通过mixin引入这个文件即可

### 问题五

```html
<dynamic-select
  v-model="model"
  v-bind="selectOptions"
  @change="inputMethod"
  @input="inputMethod"
>
  <template #options="item">
    <span style="float: left">{{ item.name }}</span>
    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.baseValue }}</span>
  </template>
  <i
    slot="prefix"
    class="el-input__icon el-icon-search"
  />
  <div slot="empty">dy-暂无数据</div>
</dynamic-select>


<script>
export default {
  name: 'CkTestSelect',
  data() {
    return {
      selectOptions: {
        // ... 
        props: {
          label: 'name',
          value: 'baseValue',
          group: 'children', // 渲染el-options-group
        },
      }
    }
  }
}
<script>
```

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/6.png)

### 接口懒加载 

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/6.gif)

> 只要接口支持分页功能就能实现数据懒加载，上图的意思请求是分页请求的，但是接口是我mock的，没有实现数据的分页功能，都是写死的。实际项目中只要后端配合使用分页就可以实现数据懒加载

对于支持动态请求数据的组件也支持数据懒加载，我们全局配置默认是，这样的

```js
{
  // 分页参数字段名 page size
  pageParamsKey: { page: 'page', size: 'size' },
  // 分页参数值
  pageParamsValue: { page: 1, size: 20 },
}
```
如果某些接口不是这样的key名，在使用组件的时候也可以单独配置

```js
{
  pageParamsKey: {page: 'xxx', size: 'yyy'}
	pageParamsValue: {xxx: 2, yyy: 50}
  loadMoreMethod: (getOptionsData, pageParams) => {
    getOptionsData({
      page: pageParams.page++,
      size: pageParams.size
    })
  }
}
```
- 参数一：动态请求数据的方法，跟el-tree的load方法一个作用
- 参数二：分页对象

**扩展**

```js
render($createElement) {
  h = $createElement
  const self = this
  // 配置插槽「渲染el-select提供的slot」
  const slotsVNode = renderSlots(h, $slots)

   return h(
      'el-select',
      {
        attrs: {
          // 将attributes挂到html节点上，
          // 相同于vue options的inheritAttrs
          ...self.$attrs
        },
        props: {
          ...self.$attrs,
          ...self.$props,
          loading: self.loading
        },
        on: {
          ...self.$listeners
        }
      },
      // 子内容
      [].concat(optionsVNode, slotsVNode)
      // optionsVNode => options || el-option-group
  )
}
```

### 支持动态请求的数据组件

- select
- treeSelect
- checkbox/radio
- table
- cascader/cascader-panel

以上几个组件类型在element基础上进行了扩展，允许用户动态请求数据，统一`prop`这样

|    **参数**     |          **说明**          |  **类型**  | **默认值** |
| :-------------: | :------------------------: | :--------: | :--------: |
|     baseURI     |          基础url           |  `String`  |            |
|     request     |       请求数据的方法       | `Function` | 全局配置的 |
|       url       |       请求数据的接口       |  `String`  |            |
|     method      |          请求方式          |  `String`  |   `GET`    |
|   params/data   |    遵循RESTful-API规范     |  `Object`  |    `{}`    |
|    parseData    |     解析接口获取的数据     | `Function` | 全局配置的 |
|    formatter    | 格式化数据(不影响原有数据) | `Function` |            |
|   resolveData   |     获取数据（响应式)      | `Function` |            |
|  pageParamsKey  |       分页参数字段名       |  `Object`  | 全局配置的 |
| pageParamsValue |        *分页参数值*        |  `Object`  | 全局配置的 |



```js
{
  label: '树形下拉',
  // formModel绑定的属性
  prop: 'treeProp',
  type: 'treeSelect',
  url: 'xxxx',
  params: {
    query: 'all',
  },
  parseData: (item) => {
    return 'dy' + item.name 
  },
  resolveData: (data) => {
    this.xxx = data
  }
  nodeKey: 'dyId',
  props: {
    label: 'name',
    children: 'sublevel'
  },
  multiple: true,
  checkStrictly: false,
  filterable: true,
}
```

**效果图💗**

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/2.gif)

> 注意⚠：resolveData方法返回的是响应式的对象，是为了让用户操作起来更

> 简单的配置下这树形功能就非常的强大了，同样也支持用户自己去配置懒加载数据


```js
{
  lazy: true,
  load: this.loadNode,
}
```

这个时候就不需要去配置动态请求的哪些的配置，由用户自己配置实现接口的懒加载数据请求

## 表单组合怎么使用？

> 对于表单封装这一块，之前写的文章也有讲过一些：

```html
<dynamic-form
  v-model="testFormModel"
  v-bind="testFormConfig"
/>


<script>
export default {
  data() {
    return {
      testFormConfig: {
        formItemList: [
          {
            label: '下拉框',
            // 支持深度属性
            prop: 'deep.selectProp',
            type: 'select',
            /* 多了上面三个 */

            url: 'xxx',
            params: {
              query: 'all'
            },
            props: {
              label: 'name',
              value: 'baseValue',
              group: 'children'
            },
            loadMoreMethod: (getOptionsData, pageParams) => {
              getOptionsData({
                page: pageParams.page++,
                size: pageParams.size
              })
            },
            // 跟绑定在组件上的class一样
            className: ['dynamic-select'],
            // 跟绑定在组件上的style一样
            styleSheet: {'background-color': '#fff'},
          }
        ]
      }
    }
  }
}
</script>
```

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui/7.gif)

- 问题一：事件监听怎么办？难道我要每个事件都写在`dynamic-form`组件上嘛？重复了怎么办？
- 问题二：表单项的插槽怎么办？难道我要每个插槽都写在`dynamic-form`下？
- 问题三：我需要自定义内容怎么办？
- 问题四：我怎么扩展表单？比如再集成一个表单项组件进去
- 问题五：表单项布局怎么办？

### 问题一/问题二

```js
testFormConfig: {
  formItemList: [
    {
      // ...
      listeners: { // 等同于$listeners将对应事件透传下去
        'visible-change': (val) => {
          if (val) {
            console.log('你在选择嘛？', '---> listeners')
          }
        }
      },
      slots: {
         prefix: this.renderPrefix()
      }
    }
  ]
}

// 原始render函数
let renderPrefix = (h) => h('i', { class: ['el-input__icon', 'el-icon-search'] })
// jsx实现，需要配置jsx解析插件
let renderPrefix = () => (<i class='el-input__icon el-icon-search'></i>),
```

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui//8.gif)

**实现思路**

- `form-item.vue`组件将属性透传，
- 里面每个组件引入处理`listener/slots的mixin`

`SlotsMixin`

```js
export default {
  props: {
    // 定义表单项的slots
    slots: {
      type: Object,
      default: () => ({})
    },
    // 定义表单项的scopedSlots
    scopedSlots: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    bindSlots({ $slots, slots }) {
      return { ...$slots, ...slots }
    },
    bindScopedSlots({ $scopedSlots, scopedSlots }) {
      return { ...$scopedSlots, ...scopedSlots }
    }
  }
}
```

### 问题三

如果我有表单需要使用`el-slider`这个组件怎么办？

```html
 <dynamic-form
  v-model="testFormModel"
  v-bind="testFormConfig"
>
  <el-slider
    slot="sliderProp"
    v-model="testFormModel.sliderProp"
  />
</dynamic-form>

<script>
export default {
  data() {
    return {
      testFormConfig: {
        formItemList: [
          {
            label: '自定义内容',
            prop: 'sliderProp',
            type: 'slot',
          }
        ]
      }
    }
  }
}
</script>
```

**实现思路**

- `form-item.vue`注入form组件中的实例，通过`$scopedSlots`可以获取到用户定义在`dynamic-form`里面的内容
- 通过`$scopedSlots[prop]`调用就能获取到渲染的`VNode`，写一个共公处理插槽的方法来渲染插槽

```html
<!-- 自定义表单项 -->
<slot-content
  class="slot-box"
  v-if="isRenderSlot({type, realProp})"
  v-bind="_attrs"
  :render="generateSlotRender(_attrs)"
/>

<script>
export default {
  name: 'DynamicFormItem',
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
</script>
```

### 问题四

全局动态添加

```js
import DynamicTable from '~dynamic-ui/DynamicTable/src/index.vue'
Vue.component(DynamicTable.name, DynamicTable)

Vue.use(dynamicUI, {
  addFormComponent: [
    {
      type: 'table',
      name: DynamicTable.name
    }
  ]
})
```

使用

```js
{
  label: '扩展组件',
  prop: 'tableProp',
   // 对应动态添加提供过的type
  type: 'table',
  // ...其他prop都是往DynamicTable组件里面传的
}
```

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui//10.gif)

### 问题五

表单使用`el-row/el-col`进行包裹，所以这些属性是可以直接定义在每个表单的。

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui//10.png)

以及el-form提供的`label-position`可以改变表单域标签的位置

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui//11.png)

## 扩展

在表单之外封装了类似于章节定位功能，

- 配合侧边栏，校验失败右侧对应label标红
- 点击右侧label视图自动滚动到对应表单项，并激活表单项

![](https://cdn.jsdelivr.net/gh/it-beige/picture/05-Vue/2-dynamic-ui//12.gif)

> 封装带来的好处就是标准、方便，随之带来的肯定是受限，也就意味着它并不能定制化，这个在第一篇文章的开头就有说过，不过这种配置项方式，思维再扩散，比如抽象几个公共方法，由后端生产的api文档来生成对应的配置项，再或者设计成表单设计器，这些我觉得都值得探讨~



## 往期文章

[【建议追更】以模块化的思想来搭建中后台项目](https://juejin.cn/post/6894412199700201485)

[【以模块化的思想开发中后台项目】第一章](https://juejin.cn/post/6913092522814210061)

[【前端体系】从一道面试题谈谈对EventLoop的理解](https://juejin.im/post/6868849475008331783) (更新了四道进阶题的解析)

[【前端体系】从地基开始打造一座万丈高楼](https://juejin.im/post/6867784542338416648)

[【前端体系】正则在开发中的应用场景可不只是规则校验](https://juejin.im/post/6867784542338416648)

[「函数式编程的实用场景 | 掘金技术征文-双节特别篇」](https://juejin.im/post/6878941871259779085)

[【建议收藏】css晦涩难懂的点都在这啦](https://juejin.cn/post/6888102016007176200)



