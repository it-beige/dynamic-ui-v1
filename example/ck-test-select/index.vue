<template>
  <div class="app-container test-component">
    <!-- <card-panel header="普通使用">
      <dy-select
        v-model="model"
        v-bind="selectOptions"
        :style="{'background-color': '#fff'}"
        :class="['dy-select']"
        @change="inputMethod"
        @input="changeMethod"
      />

    </card-panel> -->

    <!-- <card-panel header="高级使用">
      <dy-select
        v-model="model2"
        v-bind="selectOptions2"
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
      </dy-select>

    </card-panel> -->

    <card-panel header="高级使用">
      <dy-select
        v-model="model3"
        v-bind="selectOptions3"
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
      </dy-select>
    </card-panel>
  </div>
</template>

<script>
/* eslint-disable */
// import dynamicInput from '@/components/common/dynamic-input'
export default {
  name: 'CkTestSelect',
  components: {
    // 'dynamic-input': dynamicInput
  },
  data() {
    return {
      model: '',
      model2: '',
      model3: '',
      selectOptions: {
        url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/dy-select3',
        props: {
          label: 'baseValue',
          value: 'baseKey',
          // 禁用备选项
          disabled: (v, index) => {
            return index % 2 === 0
          },
          formatter: (value) => {
            return `dy-${value}`
          }

        },
        resolveData: (data) => {
          console.log(data)
        },
        headers: {
          'sso': 'sso-xxxxx',
          'Authorization': 'auth-xxxx'
        },
        parseData: (res) => {
          return res.pageData.data
        },


      },
      selectOptions2: {
        url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/dy-select1',
        params: {
          query: 'all'
        },
        props: {
          label: 'name',
          value: 'baseValue',
          group: 'children',
        },

      },
      selectOptions3: {
        url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/dy-select1',
        params: {
          query: 'all'
        },
        renderGroup: true,
        props: {
          label: 'name',
          value: 'baseValue',
          group: 'children',
        },
        loadMoreMethod: (getOptionsData, pageParams) => {
          getOptionsData({
            page: pageParams.page++,
            size: pageParams.size
          })
        },
        class: 'dy-select'
      }

    }
  },
  methods: {
    log(item) {
      console.log(item) // sy-log
    },
    changeTestVal(val) {
      console.log(val, '-->change')
    },
    inputMethod(val) {
      console.log(val, '-->input')
    },
    changeMethod(val) {
      console.log(val, '-->change')
    }
  }
}
</script>

<style scoped lang="scss"></style>
