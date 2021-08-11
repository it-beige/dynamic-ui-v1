<template>
  <div class="sestion-anchor-box">
    <!-- 展开面板箭头 -->
    <transition name="arrow-fade">
      <div
        class="spread-arrow-icon"
        @click="handleClickArrow(true)"
        v-show="!isShowSectionWrapp"
      ></div>
    </transition>
    <transition name="slide-fade">
      <div
        class="section-wrapper"
        :style="wrapperStyleSheet"
        v-show="isShowSectionWrapp"
      >
        <!-- 隐藏面板箭头 -->
        <div
          class="zoom-arrow-icon"
          @click="handleClickArrow(false)"
          v-if="isShowSectionWrapp"
        ></div>
        <div
          class="section-content"
          @click="handleClickAnchor"
        >
          <!-- 轨道线 -->
          <div class="anchor-track"></div>

          <!-- 锚点列表 -->
          <div class="anchor-content">
            <template v-for="({title, section}, level) of sectionConfig">
              <!-- 章节标题 -->
              <div
                :key="title"
                :data-anchor="level + 1"
                :class="['section-ttile', 'section-node', {'anchor-node-active': level === 0 && !curClickSecNode}]"
              >
                {{ title }}
              </div>

              <!-- 章节节点 -->
              <template v-for="(s, index) of section">
                <div
                  :key="s.label"
                  v-if="!s.hidden"
                  :data-anchor="(level + 1) + '.' + (index + 1)"
                  :data-prop="s.prop"
                  :class="['section-node', 'sub-section-node']"
                >
                  <span
                    v-if="isErrorBadge"
                    :class="['label', {'error': formItemHash[s.prop] && formItemHash[s.prop].isError}]"
                  >
                    {{s.label}}
                  </span>
                  <template v-else>
                    {{title}}
                  </template>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </transition>

  </div>

</template>

<script>
export default {
  name: 'ckTestDragResize',
  props: {
    // 章节配置
    sectionConfig: {
      type: Array,
      require: true,
    },
    formRefs: {
      type: Array,
      require: true,
    },
    // 容器高度
    height: {
      type: Number,
      default: 400,
    },
    // 是否开启表单校验失败标识对应的节点label 
    isErrorBadge: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 当前点击的节点元素
      curClickSecNode: null,
      // 上次点击的节点元素
      lastClickSecNode: null,
      // 所有表单元素
      formItemEles: [],
      // 所有表单配置项及表单元素整合
      formItemHash: {},
      // 是否显示面板
      isShowSectionWrapp: true,
    }
  },
  computed: {
    // 限定容器高度
    wrapperStyleSheet({ height }) {
      return {
        height: height + 'px'
      }
    },
  },
  watch: {
    formRefs(formEls) {
      let {
        formItemEles,
        formItemHash,
      } = this.getAllFormItemEles(formEls)
      this.formItemEles = formItemEles
      this.formItemHash = formItemHash

      // 如果用户需要标识校验，监听form
      if (this.isErrorBadge) {
        formEls.forEach(fVm => {
          fVm.$on('validate', (prop, isValid) => {
            let curFormItem = this.formItemHash[prop]
            if (!curFormItem) return
            curFormItem.isError = !isValid
          })

        })

      }

    }
  },
  mounted() {
    console.log(this, '-');
  },
  beforeDestroy() {
    // 移除所有在form组件实例定义的事件
    this.formRefs.forEach(eve => {
      eve.$off()
    })
  },
  methods: {
    /**
     * @description: 获取form下的所有表单元素
     * @param {Array} formEls 所有form组件实例
     */
    getAllFormItemEles(formEls = []) {
      let formItemEles = []
      let formItemHash = {}
      for (let f of formEls) {
        // 获取form下的所有表单元素
        let eles = this.toArray(f.$el.elements)
        // 存储所有表单项
        formItemEles = [
          ...formItemEles,
          ...eles
        ]

        // 设置表单配置项对应的表单元素
        formItemHash = {
          ...formItemHash,
          ...this.setFormItemHash(f, eles)
        }
      }

      return {
        formItemEles,
        formItemHash,
      }

    },

    /**
     * @description: 设置表单配置项对应的表单元素
     * @param {Object} formEl 当前form组件实例
     * @param {Array} eles 当前form组件下的所有表单项元素
     * @return {*}
     */
    setFormItemHash(formEl, eles) {
      return formEl.formItemList.reduce((obj, f) => {
        obj[f.prop] = this.setFormItemElByProp(f, eles)
        return obj
      }, {})
    },

    /**
     * @description: 根据prop来递归向上找到el-form-item确定当前元素对应的表单项
     * @param {*}
     * @return {*}
     */
    setFormItemElByProp(f, eles) {
      for (let e of eles) {
        let n = this.getElFormItem(e)
        if (n.dataset.prop === f.prop) {
          /* 
            ...f => 不去改变表单配置项, 避免重新渲染表单组件
          */
          const ret = {
            ...f,
            ref: e
          }
          if (this.isErrorBadge) {
            // 用于校验标识对应label
            ret.isError = false
          }
          return ret
        }

      }

    },

    /**
     * @description: 递归向上找el-form-item
     * @param {HTMLElement} e
     */
    getElFormItem(e) {
      let pEle = e.parentElement
      if (!this.hasClass(pEle, 'el-form-item')) {
        return this.getElFormItem(pEle)
      }
      return pEle
    },

    // 点击锚点列表
    handleClickAnchor(e) {
      // 基于e.path「事件捕获路径」对所有章节节点事件进行事件委托
      // 是否点击的是章节
      const secEle = this.getSectionNode(e.path || (e.composedPath && e.composedPath()))
      if (!secEle) {
        return;
      }
      this.lastClickSecNode = this.curClickSecNode
      this.curClickSecNode = secEle

      this.addClass(this.curClickSecNode, 'anchor-node-active')
      // 清除上一个节点的激活样式
      if (this.lastClickSecNode) {
        this.removeClass(this.lastClickSecNode, 'anchor-node-active')
      }

      // 根据prop找到当前点击的章节对应的表单项元素
      const curFormItemEle = this.formItemHash[this.curClickSecNode.dataset.prop]
      // 兜底-防止配置项有误导致出错
      if (!curFormItemEle) {
        console.error(`${curFormItemEle}配置项有误！`)
      }

      // 延迟执行-平滑滚动至该章节
      setTimeout(() => {
        curFormItemEle.ref.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
        curFormItemEle.ref.focus()
      })
    },


    // 获取点击的章节节点
    getSectionNode(paths, level = 0) {
      // 往上找三级，超过之后不找了
      if (level >= 3) {
        return;
      }

      // 最底下的元素
      let underEle = paths[0]
      // 如果有section-node就说明是章节元素
      if (this.hasClass(underEle, 'section-node')) {
        return underEle
      }
      return this.getSectionNode(paths.slice(1), ++level)
    },

    handleClickArrow(v) {
      this.isShowSectionWrapp = v
    },


    /**
     * Check if an element has a class
     * @param {HTMLElement} elm
     * @param {string} cls
     * @returns {boolean}
     */
    hasClass(ele, cls) {
      return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    },

    /**
     * Add class to element
     * @param {HTMLElement} elm
     * @param {string} cls
     */
    addClass(ele, cls) {
      if (!this.hasClass(ele, cls)) ele.className += ' ' + cls
    },

    /**
     * Remove class from element
     * @param {HTMLElement} elm
     * @param {string} cls
     */
    removeClass(ele, cls) {
      if (this.hasClass(ele, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
        ele.className = ele.className.replace(reg, ' ')
      }
    },

    /**
     * @description: 类数组转换
     * @param {likeArray} likeArray
     * @param {Number} startIndex
     */
    toArray(likeArray, startIndex = 0) {
      let l = likeArray.length - startIndex
      let realArr = new Array(l)
      while (l--) {   // 4 + 2
        realArr[l] = likeArray[l + startIndex]
      }
      return realArr
    }
  },
}
</script>
<style scoped lang="scss">
@media screen and (max-width: 800px) {
  .sestion-anchor-box {
    display: none;
  }
}

/* 箭头的过滤动画 */
.arrow-fade-enter-active {
  transition: all 0.9s ease;
}

.arrow-fade-leave-active {
  transform: rotate(180deg);
}

.arrow-fade-enter,
.arrow-fade-leave-to {
  transform: rotate(180deg);
  opacity: 0;
}

/* 面板的过滤动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

// 容器
.sestion-anchor-box {
  .spread-arrow-icon {
    width: 30px;
    height: 40px;
    position: absolute;
    width: 0px;
    height: 0px;
    border: 14px solid transparent;
    border-left-color: #38f;
    background: transparent;
    border-radius: 0;
    top: 50%;
    left: -20px;
    cursor: pointer;
    transform: translateY(-50%) rotate(180deg);
  }

  position: fixed;
  z-index: 999;
  width: auto;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background-color: #fff;
  box-shadow: -1px 0 2px 0.5px rgb(0 127 255 / 20%);

  .section-wrapper {
    position: relative;
    margin-left: 20px;
    box-sizing: border-box;
    margin: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
    line-height: 1.5;
    list-style: none;
    padding: 0 0 0 2px;
    overflow-y: scroll;

    .zoom-arrow-icon {
      width: 30px;
      height: 40px;
      position: fixed;
      width: 0px;
      height: 0px;
      border: 14px solid transparent;
      border-left-color: #38f;
      background: transparent;
      border-radius: 0;
      top: 50%;
      left: -2px;
      cursor: pointer;
      transform: translateY(-50%);
    }

    /* 隐藏滚动条------------start */

    /* ::-webkit-scrollbar ,兼容chrome和safari浏览器 */
    &::-webkit-scrollbar {
      display: none;
    }

    /* 兼容火狐 */
    scrollbar-width: none;

    /* 兼容IE10+ */
    -ms-overflow-style: none;

    /* 隐藏滚动条------------end */

    .section-content {
      margin-left: 20px;
      position: relative;
      padding-left: 10px;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -4px;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        border: 1px solid #ccc;
        background: #fff;
      }
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: -4px;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        border: 1px solid #ccc;
        background: #fff;
      }

      // 轨道线
      .anchor-track {
        position: absolute;
        left: 1px;
        top: 10px;
        bottom: 2px;
        width: 1px;
        background: #e8e8e8;
      }

      // 锚点列表
      .anchor-content {
        padding: 20px 0;

        // 当前激活的锚点样式
        .anchor-node-active {
          color: #38f;
          // 新增三角
          &::after {
            content: "";
            position: absolute;
            left: -9px;
            top: 0px;
            width: 0px;
            height: 0px;
            border: 8px solid transparent;
            border-left-color: #38f;
            background: transparent;
            border-radius: 0;
          }
        }

        // 章节节点
        .section-node {
          position: relative;
          margin: 8px 0;
          cursor: pointer;
          &::before {
            content: attr(data-anchor);
            margin-left: 6px;
            margin-right: 6px;
          }
          &:first-child {
            margin-top: 0;
          }
          &:last-child {
            margin-bottom: 0;
          }
          .label {
            position: relative;
            display: inline-block;
          }
          .label.error::before {
            content: "";
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: red;
            right: -5px;
            top: 2px;
          }
        }

        .sub-section-node {
          padding-left: 22px;
        }
      }
    }
  }
}
</style>

