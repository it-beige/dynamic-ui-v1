// api-import
import { requestUrl, dictTypeCode } from '@/config/constant'

// utils-import
import { parseTime, formatThouPercentile } from '@/utils'

// mixin-import
import DictInitMixin from '@/mixins/DictInitMixin'
import { isObject, isType } from '@/utils'

// 千分位展示
const formatterThousand = (val = '') => {
  // 支持负数千分
  const v = String(val).replace('-', '') // 去了分号的数
  return v > 999 ? formatThouPercentile(val) : val
}

const config = {
  mixins: [DictInitMixin],
  data() {
    return {
      tableHead: [
        {
          prop: 'number',
          label: '编号',
          align: 'center',
          query: {
            type: 'input'
          },
          'edit-render': {
            type: 'visible'
          }
        },
        {
          prop: 'amount',
          label: '金额',
          align: 'center',
          minWidth: '140',
          className: ['a-cls', 'b-cls'],
          query: {
            type: 'input'
          },
          editRender: {
            name: 'ElInput'
          },
          formatter: (val, row, col) => {
            if (!val) return ''
            if (col && col.property === 'amount' && row) {
              return formatterThousand(val)
            }
          }
        },
        {
          prop: 'date',
          label: '日期',
          align: 'center',
          editRender: {
            name: 'ElDatePicker'
          },
          formatter: (val, row, col) => {
            if (!val) return ''
            if (col && col.property === 'date' && row) {
              return parseTime(val)
            }
          }
        },
        {
          prop: 'urlList',
          label: '图片',
          align: 'center'
        },
        {
          prop: 'billStatus',
          label: '状态',
          align: 'center',
          formatter: (val, row, col) => {
            if (!val) return ''
            if (col && col.property === 'billStatus' && row) {
              return this.tableCellFormatter(
                val,
                this.dictMap[dictTypeCode.DEPOSIT_STATUS]
              )
            }
          }
        },
        {
          prop: 'remarks',
          label: '备注',
          align: 'center',
          showOverflowTooltip: false
        },
        {
          prop: 'deepAttr.atr',
          label: '深度属性',
          align: 'center'
        }
      ]
    }
  },
  created() {
    this.dataDictInit(requestUrl.dictItemListUrl, [dictTypeCode.DEPOSIT_STATUS])
      .then(dictMap => {
        // this.tableHead.forEach(i => {
        //   if (i.prop === 'visitStatus') {
        //     i.query.options = dictMap[dictTypeCode.DEPOSIT_STATUS] || []
        //   }
        // })
      })
      .catch(e => {
        console.error(e)
      })
  }
}

export default config
