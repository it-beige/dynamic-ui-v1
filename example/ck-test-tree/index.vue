<template>
  <div class="app-container test-component">
    <card-panel
      style="height: 500px"
      header="dy-ui"
    >
      <dy-tree-select
        v-model="model2"
        v-bind="dyOptions2"
        @change="inputMethod"
        @input="inputMethod"
      />
    </card-panel>

    <card-panel
      style="height: 500px"
      header="dy-ui-高级使用"
    >
      <dy-tree-select
        v-model="model3"
        v-bind="dyOptions3"
        @change="inputMethod"
        @input="inputMethod"
      />
    </card-panel>

    <card-panel
      style="height: 500px"
      header="jl-ui"
    >
      <jl-tree-select
        v-model="model1"
        v-bind="jlOptions1"
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
      </jl-tree-select>
    </card-panel>

    <el-tooltip placement="top">
      <div slot="content">多行信息<br>第二行信息</div>
      <el-button>Top center</el-button>
    </el-tooltip>

  </div>
</template>

<script>
export default {
  name: 'CkTestTree',
  data() {
    return {
      model1: '',
      model2: '',
      model3: '',
      jlOptions1: {
        multiple: true,
        url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/dynamic-tree',
        params: {
          query: 'all'
        },
        renderGroup: true,
        props: {
          // 禁用备选项
          disabled: (v, index) => {
            return index % 2 === 0
          },
          formatter: (value) => {
            return `dy-${value}`
          },
          group: 'children'
        },
        loadMoreMethod: (getOptionsData, pageParams) => {
          getOptionsData({
            page: pageParams.page++,
            size: pageParams.size
          })
          console.log(pageParams) // sy-log
        }
      },
      dyOptions2: {
        url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/dynamic-tree2',
        multiple: true,
        checkStrictly: false,
        params: {
          query: 'all'
        },
        filterable: true,
      },
      dyOptions3: {
        multiple: true,
        checkStrictly: true,
        nodeKey: 'dyId',
        props: {
          label: 'name',
          children: 'sublevel'
        },
        lazy: true,
        load: this.loadNode,
        params: {
          query: 'all'
        },
        filterable: true,
      }
    }
  },
  methods: {
    changeTestVal(val) {
      console.log(val, '-->change')
    },
    inputMethod(val) {
      console.log(val, '-->input')
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region' }]);
      }
      if (node.level > 1) return resolve([]);

      setTimeout(() => {
        const data = [{
          name: 'leaf',
          leaf: true
        }, {
          name: 'zone'
        }];

        resolve(data);
      }, 500);
    }
  }

}
</script>

