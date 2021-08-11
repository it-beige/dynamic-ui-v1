<template>
  <div>
    <DynamicTable
      ref="editTableRef"
      :head="tableHead"
      :data.sync="list"
      :total="total"
      :offset="offset"
      :page="page"
      :loading="loading"
      :show-number="true"
      :show-selection="true"
      stripe
      border
      height=""
      show-add
      :select-limit="1"
      :tool-bar="{hidden: true}"
    >

      <template #urlList="{row}">
        <el-image
          style="height: 80px"
          :src="Array.isArray(row.urlList) ? row.urlList[0] : row.urlList"
          :preview-src-list="[].concat(row.urlList)"
        />
      </template>

      <template #remarks="{row}">
        <el-popover
          v-if="row.remarks"
          placement="top"
          width="160"
          trigger="hover"
          :visible-arrow="false"
          popper-class="custom-popover"
        >
          <p>{{ row.remarks }}</p>
          <span slot="reference">{{ (row.remarks).substr(0, 6) + '...' }}</span>
        </el-popover>
        <span v-else>暂无评价</span>
      </template>

    </DynamicTable>
  </div>
</template>

<script>
import table1Mixin from '../config/table2'
import DataTableMixin from '@/mixins/DataTableMixin'

import {
  requestUrl
} from '@/config/constant'


export default {
  name: 'Table2',
  mixins: [DataTableMixin, table1Mixin],
  created() {
    this.dataTableInit()
  },
  methods: {
    // 列表调用前参数处理
    dataTableBeforeInit() {
      this._url = requestUrl.table1ListUrl
      const params = {
        current: this.page,
        size: this.offset
      }
      this._params = Object.assign(params, this._query)
      return true
    }
  }
}
</script>
