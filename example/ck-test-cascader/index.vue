<template>
  <div class="app-container test-component">
    <!-- cascader -->
    <el-card
      slot="left"
      shadow="never"
      header="cascader"
    >
      <dy-cascader
        v-model="cascaderVal"
        :url="cascaderUrl"
        :disabled="isDisabledCascaderVal"
        :props="cascaderProps"
        :data="cascaderParams"
        method="post"
      >

        <!-- <template slot-scope="{ node, data }">
          <span>{{ data.label }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template> -->
      </dy-cascader>
    </el-card>

    <!-- cascaderPanel -->
    <el-card
      slot="left"
      shadow="never"
      header="cascaderPanel"
    >
      <dy-cascader
        v-model="cascaderPanelVal"
        type="el-cascader-panel"
        :props="cascaderPanelProps"
      >
        <template v-slot="{ node, data }">
          <span>{{ data.label }}</span>
          <span>自定义内容</span>
        </template>
      </dy-cascader>
    </el-card>

  </div>
</template>

<script>
// import dynamicCascader from '@/components/common/dy-cascader'
export default {
  name: 'CkTestCascader',
  components: {
    // 'dy-cascader': dynamicCascader
  },
  data() {
    return {
      cascaderVal: [],
      cascaderUrl: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/dy-cascader',
      cascaderPanelVal: [],
    }
  },
  mounted() {

  },
  computed: {
    isDisabledCascaderVal({ cascaderVal }) {
      return cascaderVal.length > 10
    },
    cascaderProps({ cascaderVal }) {
      return {
        expandTrigger: cascaderVal.length ? 'click' : 'hover',
        multiple: true
      }
    },
    cascaderParams({ cascaderVal }) {
      return { selectData: cascaderVal }
    },
    cascaderPanelProps({ cascaderPanelVal }) {
      let id = 0
      return {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          const val = cascaderPanelVal.length + 1
          setTimeout(() => {
            const nodes = Array.from({ length: level + 1 })
              .map(() => ({
                value: ++id,
                label: `选项${id}`,
                leaf: level >= 2
              }))
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes)
          }, 1000 * val)
        }
      }
    },


  },

}
</script>

<style scoped lang="scss"></style>
