<template>
  <div class="app-container test-component">
    <card-panel header="基本使用">
      <dy-form
        :ref="baseFormConfig.ref"
        v-model="formModel"
        v-bind="baseFormConfig"
        :disabled="disabledForm"
        @input="handleInput"
      />
    </card-panel>

    <card-panel header="高级使用">
      <dy-form
        :ref="seniorFormConfig2.ref"
        v-model="formModel"
        v-bind="seniorFormConfig2"
        :disabled="disabledForm"
      />
    </card-panel>

    <card-panel header="自定义">
      <dy-form
        :ref="baseFormConfig3.ref"
        v-model="formModel"
        v-bind="baseFormConfig3"
        :disabled="disabledForm"
        @submit="save"
      />
    </card-panel>

    <!-- <card-panel
      header="测试"
      style="height: 500px"
    >
      <dy-form
        v-model="testFormModel"
        v-bind="testFormConfig"
      >

        <el-slider
          slot="sliderProp"
          v-model="testFormModel.sliderProp"
        />

      </dy-form>
    </card-panel> -->

    <SectionAnchorContainer
      :section-config="sectionConfig"
      :form-refs="formRefArr"
    />
  </div>
</template>

<script>
import CardPanel from '@/components/CardPanel/CardPanel.vue'
import SectionAnchorContainer from '../ck-test-drag-resize'

export default {
  name: 'CkTestForm',
  components: {
    CardPanel,
    SectionAnchorContainer
  },
  data() {
    return {
      formRefArr: [],
      formModel: {
        // 深度属性一定要初始化根属性对象
        deep: {

        }
      },

      testFormModel: {
        deep: {

        }
      },

      // input2-动态数据
      restaurants: [],

      disabledForm: false,
      testFormConfig: {
        formItemList: [
          {
            label: '下拉框',
            prop: 'deep.selectProp',
            type: 'select',
            url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/dynamic-select1',
            params: {
              query: 'all'
            },
            renderGroup: true,
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
            listeners: { // 等同于$listeners将对应事件透传下去
              'visible-change': (val) => {
                if (val) {
                  console.log('你在选择嘛？', '---> listeners')
                }
              }
            },
            slots: {
              // prefix: (<i class='el-input__icon el-icon-search'></i>)
              prefix: (h) => (h('i', { class: ['el-input__icon', 'el-icon-search'] }))
            },
            className: 'dynamic-select'
          },
          {
            label: '自定义内容',
            prop: 'sliderProp',
            type: 'slot',
            rules: [
              { required: true, trigger: ['blur', 'change'] }
            ]
          }
        ]
      },
      // 基本使用
      baseFormConfig: {
        formItemList: [
          {
            label: 'input',
            prop: 'input',
            type: 'input',
            className: ['dynamic-input', 'my-input'],
            rules: [
              { required: true, message: '不能为空', trigger: ['change', 'blur'] }
            ]
          },
          {
            label: 'select',
            prop: 'select',
            type: 'select',
            options: [
              { label: '北歌', value: 'author' },
              { label: '前端自学驿站', value: 'publishNumber' }
            ],
            rules: [
              { required: true, message: '不能为空', trigger: ['change', 'blur'] }
            ]
          },
          {
            label: 'treeSelect',
            prop: 'treeSelect',
            type: 'treeSelect',
            data: [{
              label: '一级 1',
              children: [{
                label: '二级 1-1',
                children: [{
                  label: '三级 1-1-1'
                }]
              }]
            }, {
              label: '一级 2',
              children: [{
                label: '二级 2-1',
                children: [{
                  label: '三级 2-1-1'
                }]
              }, {
                label: '二级 2-2',
                children: [{
                  label: '三级 2-2-1'
                }]
              }]
            }, {
              label: '一级 3',
              children: [{
                label: '二级 3-1',
                children: [{
                  label: '三级 3-1-1'
                }]
              }, {
                label: '二级 3-2',
                children: [{
                  label: '三级 3-2-1'
                }]
              }]
            }]
          },
          {
            label: 'daterange',
            prop: 'openingDate',
            type: 'date',
            subtype: 'daterange',
            format: 'yyyy 年 MM 月 dd 日',
            valueFormat: 'timestamp'
          },
          {
            label: 'datetimerange',
            prop: 'datetimerange',
            type: 'date',
            subtype: 'datetimerange'
          },
          {
            label: 'time',
            prop: 'time',
            type: 'time'
          },
          {
            label: 'switch',
            prop: 'switch',
            type: 'switch',
            'active-color': '#13ce66',
            'inactive-color': '#ff4949',
            span: 24
          },
          {
            label: 'upload',
            prop: 'name',
            type: 'upload',
            action: 'ck/creator-service/file/upload',
            headers: {
              'X-Ldp-Token':
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjbGllbnR0eXBlIjoiIiwiYXVkIjoiY3JlYXRvciIsInN1YiI6ImFkbWluIiwiY2xpZW50aWQiOiI5em9tMXNlaTU2Z2h1aXJ4IiwiaXNzIjoidWFhIiwicmVhbG1jb2RlIjoiY3JlYXRvciIsImV4cCI6MTYyNjkzNTk0NSwidXNlcmlkIjoiYWRtaW4iLCJpYXQiOjE2MjY5MjE1NDUsImp0aSI6ImQ0YzliMGJjLWEwYzMtNDVjYS05NWE3LTYzMGZmY2IzYWVlMCJ9.hXZ29H_aZ9K_MAd_ba1oI86gKJAIxwxSdgEvcmc3cUwfGNmFp20wZpq5yOigFi4vdS2wO3rL2h9l_ipipDir3zhdyEi8NIxmAppZptsFTtFJ4AxTdoBVmORZYwY85fEmdUuap7IUdZ485zG9QkeOVVrWtaIPZG-Ga8bTUzNISeE',
              'X-Realm': 'creator'
            },
            name: 'uploadFile',
            listType: 'text',
            span: 24
          },

          {
            label: 'textarea',
            prop: 'textarea',
            type: 'textarea',
            maxlength: 400,
            'show-word-limit': true,
            'auto-size': { minRows: 3, maxRows: 4 },
            span: 24
          }
        ],
        labelWidth: '100px',
        ref: 'baseForm1'
      },

      // 高级使用(深度属性)
      seniorFormConfig2: {
        'label-position': 'top',
        formItemList: [
          {
            label: 'input2',
            prop: 'deep.input2',
            type: 'input',
            span: 12,
            // 渲染el-autocomplete
            isAutocomplete: true,
            // 属性方式自定义input prefix内容
            'prefix-icon': 'el-icon-search',
            'fetch-suggestions': this.querySearch,
            className: ['dynamic-autocomplete'],
            clearable: true,
            // 定义在表单项的事件
            listeners: {
              select: this.selectAutoComplete
            },
            rules: [
              { required: true, message: '不能为空', trigger: ['change', 'blur'] }
            ]
          },
          {
            label: 'select2',
            prop: 'deep.select2',
            type: 'select',
            span: 12,
            url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/dynamic-select0',
            props: {
              label: 'baseValue',
              value: 'baseKey'
            },
            resolveData: this.getDeepSelect2Data,
            rules: [
              { required: true, message: '不能为空', trigger: ['change', 'blur'] }
            ]
          },
          {
            label: 'textarea2',
            prop: 'deep.textarea2',
            type: 'textarea',
            maxlength: 400,
            span: 24,
            'show-word-limit': true,
            'auto-size': { minRows: 3, maxRows: 4 }
          },
          // {
          //   label: 'daterange2',
          //   prop: 'deep.openingDate2',
          //   type: 'date',
          //   subtype: 'daterange',
          //   format: 'yyyy 年 MM 月 dd 日',
          //   valueFormat: 'timestamp',
          //   'unlink-panels': true,
          //   'picker-options': this.usePickerOptions()
          // },
          // {
          //   label: 'datetimerange2',
          //   prop: 'deep.datetimerange2',
          //   type: 'date',
          //   subtype: 'datetimerange'
          // },
          // {
          //   label: 'time2',
          //   prop: 'deep.time2',
          //   type: 'time'
          // },
          {
            label: 'switch2',
            prop: 'deep.switch2',
            type: 'switch',
            'active-value': '1',
            'inactive-value': '0',
            'active-color': '#13ce66',
            'inactive-color': '#ff4949'
          },
          {
            label: 'upload2',
            prop: 'deep.name2',
            type: 'upload',
            action: 'ck/creator-service/file/upload',
            headers: {
              'X-Ldp-Token':
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJjbGllbnR0eXBlIjoiIiwiYXVkIjoiY3JlYXRvciIsInN1YiI6ImFkbWluIiwiY2xpZW50aWQiOiI5em9tMXNlaTU2Z2h1aXJ4IiwiaXNzIjoidWFhIiwicmVhbG1jb2RlIjoiY3JlYXRvciIsImV4cCI6MTYyNjkzNTk0NSwidXNlcmlkIjoiYWRtaW4iLCJpYXQiOjE2MjY5MjE1NDUsImp0aSI6ImQ0YzliMGJjLWEwYzMtNDVjYS05NWE3LTYzMGZmY2IzYWVlMCJ9.hXZ29H_aZ9K_MAd_ba1oI86gKJAIxwxSdgEvcmc3cUwfGNmFp20wZpq5yOigFi4vdS2wO3rL2h9l_ipipDir3zhdyEi8NIxmAppZptsFTtFJ4AxTdoBVmORZYwY85fEmdUuap7IUdZ485zG9QkeOVVrWtaIPZG-Ga8bTUzNISeE',
              'X-Realm': 'creator'
            },
            name: 'uploadFile',
            listType: 'picture'
          },
          {
            label: 'treeSelect2',
            prop: 'deep.treeSelect2',
            type: 'treeSelect',
            url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/dynamic-tree',
            multiple: true,
            checkStrictly: false,
            params: {
              query: 'all'
            },
            filterable: true
          }
        ],

        labelWidth: '100px',
        'show-btn': false,
        'show-cancel-btn': false,
        ref: 'baseForm2'
      },

      // 自定义内容
      baseFormConfig3: {
        formItemList: [
          {
            label: 'input3',
            prop: 'input3',
            type: 'input',
            slots: this.renderInput3Slots(),
            rules: [
              { required: true, message: '不能为空', trigger: ['change', 'blur'] }
            ]
          },
          {
            label: 'select3',
            prop: 'select3',
            type: 'select',
            options: [
              { label: '北歌', value: 'author' },
              { label: '前端自学驿站', value: 'publishNumber' }
            ],
            slots: this.renderSelect3Slots(),
            rules: [
              { required: true, message: '不能为空', trigger: ['change', 'blur'] }
            ]
          },
          {
            label: '扩展组件',
            prop: 'table',
            type: 'table',
            placeholder: '请选择',
            multiple: false,
            props: {
              label: 'proName',
              value: 'id'
            },
            url: 'http://mengxuegu.com:7300/mock/6074eb6a56076a4a764847d5/book-components/projectList',
            tableColumn: [
              {
                label: '项目名称',
                prop: 'proName',
                align: 'center',
                query: {
                  type: 'input'
                }
              },
              {
                label: '项目地址',
                prop: 'proAddress',
                align: 'center',
                query: {
                  type: 'input'
                }
              }
            ],
            rules: [
              { required: true, message: '不能为空', trigger: ['change', 'blur'] }
            ]
          }
        ],

        labelWidth: '100px',
        'show-btn': true,
        ref: 'baseForm3'
      }
    }
  },
  computed: {
    searchProp: {
      get({ testFormConfig }) {
        return testFormConfig.formItemList[0].params.query
      },
      set(val) {
        this.testFormConfig.formItemList[0].params.query = val
      }
    },
    sectionConfig() {
      const {
        baseFormConfig,
        seniorFormConfig2,
        baseFormConfig3
      } = this

      const sections = [
        {
          title: '基本使用',
          section: baseFormConfig.formItemList
        },
        {
          title: '高级使用',
          section: seniorFormConfig2.formItemList
        },
        {
          title: '自定义',
          section: baseFormConfig3.formItemList
        }
      ]

      return sections
    }
  },
  created() {
    this.restaurants = this.loadAll()

    // 只监听一次mounted事件
    this.$once('hook:mounted', () => {
      console.log(1111)
      this.formRefArr = [
        this.$refs.baseForm1,
        this.$refs.baseForm2,
        this.$refs.baseForm3
      ]
    })
  },
  methods: {
    save() {
      Promise.all(this.formRefArr.map(i => i.validate()))
        .then(res => {
          console.log('====================================')
          console.log(res)
          console.log('====================================')
        })
    },

    /** ********************************* seniorFormConfig2-表单配置项-start ****************************************/
    querySearch(queryString, resolve) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      resolve(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return [
        { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
        { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' },
        { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113' },
        { 'value': '泷千家(天山西路店)', 'address': '天山西路438号' },
        { 'value': '胖仙女纸杯蛋糕（上海凌空店）', 'address': '上海市长宁区金钟路968号1幢18号楼一层商铺18-101' },
        { 'value': '贡茶', 'address': '上海市长宁区金钟路633号' },
        { 'value': '豪大大香鸡排超级奶爸', 'address': '上海市嘉定区曹安公路曹安路1685号' },
        { 'value': '茶芝兰（奶茶，手抓饼）', 'address': '上海市普陀区同普路1435号' },
        { 'value': '十二泷町', 'address': '上海市北翟路1444弄81号B幢-107' }
      ]
    },
    selectAutoComplete(val) {
      console.log(val, 'select --> deep.input2')
    },
    getDeepSelect2Data(options) {
      console.log(options, '---->deep.select2')
    },

    // daterage2-快捷选项
    usePickerOptions() {
      return {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    },
    renderInput3Slots() {
      return {
        prepend: (<span>http://</span>),
        append: (<span>.com</span>),
        prefix: (<i class='el-input__icon el-icon-search'></i>),
        suffix: (<i class='el-input__icon el-icon-edit'></i>)
      }
    },
    renderSelect3Slots() {
      return {
        prefix: (<i class='el-input__icon el-icon-search'></i>),
        defalut: (
          <div ></div>
        )
      }
    },
    /** ********************************* seniorFormConfig2-表单配置项-end ****************************************/

    handleInput(...arg) {
      console.log(arg)
    }
  }

}
</script>

<style scoped lang="scss"></style>
