<template>
  <el-card>
    <div
      class="header-container"
      slot="header"
    >
      <div class="project-wrapper">
        <span>编辑模式</span>
      </div>
      <div class="new-button">
        <el-button
          @click="handleOperateBtn('cancel')"
          v-show="showOperateBtn('cancel')"
        >
          取消
        </el-button>
        <el-button
          v-show="showOperateBtn('edit')"
          @click="handleOperateBtn('edit')"
          type="primary"
        >
          编辑
        </el-button>
        <el-button
          v-show="showOperateBtn('save')"
          @click="saveHandle"
          type="primary"
        >
          保存
        </el-button>
      </div>
    </div>

    <DynamicTable
      ref="editTableRef"
      :head="tableHead"
      :data.sync="list"
      :total="total"
      :offset="offset"
      :page="page"
      :loading="loading"
      :editable="curOperate === 'edit'"
      :edit-config="{trigger: 'click', mode: 'cell'}"
      :show-number="true"
      :show-selection="true"
      stripe
      border
      height=""
      :select-limit="1"
      :tool-bar="{hidden: true}"
    >
      <!-- 自定义序号 -->
      <template #indexHeader>
        序号
      </template>

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
  </el-card>
</template>

<script>
import table1Mixin from './config/table'
import DataTableMixin from '@/mixins/DataTableMixin'
import {
  isString
} from '@/utils'
import {
  requestUrl
} from '@/config/constant'
import edit from '../example/edit.vue'
export default {
  components: { edit },
  name: 'CkTestEditable',
  mixins: [DataTableMixin, table1Mixin],
  data() {
    return {
      curOperate: 'view',
      opereateBtnsHash: Object.freeze({
        // 查看状态显示的按钮
        view: ['edit'],
        // 编辑状态显示的按钮
        edit: ['cancel', 'save']
      }),
    }
  },
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
    },

    handleOperateBtn(opereate) {
      if (['cancel', 'save'].includes(opereate)) {
        this.curOperate = 'view'
      } else if (opereate === 'edit') {
        this.curOperate = 'edit'
      }
    },

    // 显示按钮
    showOperateBtn(opereate) {
      return this
        .opereateBtnsHash[this.curOperate]
        .includes(opereate)
    },

    formatUrlList(v) {
      v = isString(v) ? [v] : v
      return v.map(i => ({ url: i }))
    },

    saveHandle() {

    }
  }
}
</script>

