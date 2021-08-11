# 如何使用？

```js
import Vue from 'vue'
import dynamicUI from 'dynamic-ui'
import 'dynamic-ui/lib/index.css'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'

Vue.use(dynamicUI, {
  baseURI: process.env.VUE_APP_BASE_API,
  requestHeaders: {
    'Authorization': getToken()
  },
  request,
})
```
