import { parseTime, formatThouPercentile } from '@/utils'

// 千分位展示
const formatterThousand = (val = '') => {
  // 支持负数千分
  const v = String(val).replace('-', '') // 去了分号的数
  return v > 999 ? formatThouPercentile(val) : val
}

const config = {
  data() {
    return {
      tableHead: [
        {
          prop: 'number',
          label: '编号',
          align: 'center',
          query: {
            type: 'input'
          }
        },
        {
          prop: 'amount',
          label: '金额',
          align: 'center',
          minWidth: '140',
          query: {
            type: 'input'
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
          prop: 'remarks',
          label: '备注',
          align: 'center',
          showOverflowTooltip: false
        }
      ]
    }
  }
}

export default config
