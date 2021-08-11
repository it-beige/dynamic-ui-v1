<template>
  <div class="dy-upload-box">
    <el-checkbox-group v-model="fileList" />
    <el-upload
      :ref="setRefFn()"
      class="upload"
      :class="{
        'upload-disabled': bindAttrs.disabled,
        'upload-exceed': isExceed
      }"
      v-bind="bindAttrs"
      v-on="onEvents"
      :action="getUploadUrl(bindAttrs.url || bindAttrs.action)"
      :show-file-list="showFileListCompute"
      :file-list="fileList"
      :list-type="listType"
      :headers="uploadHeaders"
      :auto-upload="autoUpload"
      :on-success="handleSuccess"
      :on-change="handleChange"
      :on-error="handleError"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-progress="handleProgress"
      :before-remove="beforeRemove"
    >
      <template v-if="!this.isExceed">
        <!-- text -->
        <el-button
          size="small"
          type="default"
          icon="el-icon-upload2"
          v-if="listType === 'text'"
        >点击上传</el-button>

        <!-- picture -->
        <div v-if="listType === 'picture'">
          <i
            slot="trigger"
            class="el-icon-plus"
          > </i>
          <template
            v-if="$scopedSlots.tip"
            slot="tip"
          >
            <slot name="tip"></slot>
          </template>
        </div>
      </template>

      <!-- picture-card---start-->
      <template v-if="listType === 'picture-card'">
        <!-- 上传图标 -->
        <i
          slot="default"
          class="el-icon-plus"
        ></i>
      </template>
      <!-- 缩略图 -->
      <div
        v-if="listType === 'picture-card'"
        class="file__card"
        slot="file"
        slot-scope="{ file }"
      >
        <el-image
          ref="elImage"
          v-if="isAssetTypeAnImage(file)"
          style="width: 100%; height: 100%;"
          :src="getPreviewUrl(file)"
          :preview-src-list="[getPreviewUrl(file)]"
          fit="cover"
        >
        </el-image>

        <!-- 遮罩层 -->
        <span class="el-upload-list__item-actions">
          <!-- 预览图标 -->
          <span
            @click="() => $refs.elImage.showViewer = true"
            class="el-upload-list__item-preview"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <!-- 删除图标 -->
          <span
            v-if="!bindAttrs.disabled"
            class="el-upload-list__item-delete"
            @click="removeFile(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>

        <!-- 上传失败的图标 -->
        <span
          v-if="!bindAttrs.disabled"
          class="file-list__item-delete"
          @click.stop="removeFile(file)"
        >
          <i class="el-icon-error del-btn__icon"></i>
        </span>
      </div>
      <!-- picture-card---end-->

    </el-upload>

    <template v-if="listType === 'text'">
      <div
        class="file-list"
        v-for="(item, index) of fileList"
        :key="index"
      >
        <el-link
          @click="handlePreview(item)"
          target="_blank"
        >
          {{ item.name }}
        </el-link>
        <i
          class="el-icon-error del-btn__icon"
          @click="removeFile(item)"
          v-if="!bindAttrs.disabled"
        />
      </div>
      <div
        class="progress-box"
        v-show="currentFileName"
      >
        <div>
          {{ currentFileName }}
        </div>
        <div>
          <el-progress
            :percentage="progress"
            :color="customColors"
          />
        </div>
      </div>
    </template>

    <template v-if="preivewElImage">
      <el-image
        v-if="fileList.length"
        :style="bindImageStyle"
        :src="getPreviewUrl(fileList && fileList[0])"
        :preview-src-list="fileList.map(file => getPreviewUrl(file))"
        fit="cover"
      >
      </el-image>
    </template>
  </div>
</template>

<script>
import UploadMixins from "../../mixins/UploadMixins";
import {
  isObject,
  isType
} from '../../utils'

export default {
  name: "DyUpload",
  componentName: "DyUpload",
  inheritAttrs: false,
  mixins: [UploadMixins],
  props: {
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 获取文件预览的url
    previewUrl: Function,
    // 附件列表展示模式
    listType: {
      type: String,
      default: "text",
      validator(val) {
        if (["text", "picture", "picture-card"].includes(val)) {
          return true;
        } else {
          throw new Error(
            `【listType】可选值为【text, picture, picture-card】${val}与预期值不符`
          );
        }
      }
    },
    // 标识字段
    keyField: {
      type: String,
      default: "id"
    },
    // 外界自定义el-upload的ref
    setRefFn: {
      type: Function,
      default: () => {
        return "elUpload";
      }
    },
    // 是否显示文件列表
    showFileList: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fileList: [],
      progress: 0, // 上传进度
      currentFileName: null, // 上传文件名称
      // 进度条颜色
      customColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 }
      ]
    };
  },
  computed: {
    // 超出限制数量
    isExceed() {
      if (!this.bindAttrs.limit) {
        return false;
      }
      return this.bindAttrs.limit <= this.fileList.length;
    },
    // 如果是text类型不使用upload自带的文件列表渲染方式
    showFileListCompute({ listType }) {
      return listType !== 'text'
    },
    // 如果disabled为true且listtype为['picture', 'picture-card']渲染el-iamge
    preivewElImage({ listType, disabled }) {
      return ['picture', 'picture-card'].includes(listType) && disabled
    }
  },
  watch: {
    fileList: {
      handler(val) {
        this.$emit("input", val);
        this.$emit("change", val);
      },
      deep: true
    },
    value: {
      handler(val) {
        if (!['Object', 'Array'].includes(isType(val))) {
          console.error('dynamic-upload: value必须是Array|Object')
        }
        this.fileList = isObject(val) ? [val] : val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 上传附件
    submit() {
      this.$refs.elUpload.submit();
    },
    // 取消上传
    abort() {
      this.$refs.elUpload.abort();
    },
    // 清空文件
    clearFiles() {
      this.$refs.elUpload.clearFiles();
    },
    handleRemove(file) {
      let fileId = file[this.keyField];
      if (!fileId && file.response) {
        fileId = file.response.data;
        if (file.response.data[this.keyField]) {
          fileId = file.response.data[this.keyField];
        } a
      } else if (!fileId) {
        fileId = file.uid;
      }
      const index = this.fileList.findIndex(
        i => i[this.keyField] === fileId || i.uid === fileId
      );
      if (index !== -1) {
        this.fileList.splice(index, 1);
      }
    },
    removeFile(file) {
      this.beforeRemove(file).then(() => {
        this.handleRemove(file);
      });
    },
    handleChange(file, fileList) {
      if (this.bindAttrs.onChange) {
        this.$emit("change", { file, fileList });
      }
    },
    handlePreview(file) {
      if (this.bindAttrs.onPreview) {
        this.bindAttrs.onPreview(file);
        return;
      }
      window.open(this.getPreviewUrl(file), "_blank");
    },
    // 默认预览方法
    getPreviewUrl(file) {
      if (!isObject(file)) {
        console.error('file必须是一个对象！')
        return ''
      }
      if (this.previewUrl && typeof this.previewUrl === "function") {
        return this.previewUrl(file);
      } else if (file.url) {
        return file.url;
      } else if (file.raw) {
        return window.URL.createObjectURL(new Blob([file.raw]));
      } else {
        return "";
      }
    },
    beforeRemove(file) {
      if (this.bindAttrs.beforeRemove) {
        return this.bindAttrs.beforeRemove(file);
      }
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess(response, file, fileList) {
      if (this.bindAttrs.onSuccess) {
        this.bindAttrs.onSuccess(response, file, fileList, this);
      } else {
        this.progress = 100;
        let fileInfo = response.data || response;
        if (this.parseData && typeof this.parseData === "function") {
          fileInfo = this.parseData({ response, file, fileList });
        }
        const index = this.fileList.findIndex(
          i => i[this.keyField] === fileInfo[this.keyField]
        );
        if (index === -1) {
          this.fileList.push(fileInfo);
        }
      }

      this.currentFileName = null;
      this.progress = 0;
    },
    handleError() {
      this.currentFileName = null;
      this.progress = 0;
      if (this.bindAttrs.onError) {
        this.bindAttrs.onError(this);
        return;
      }
      this.$message.error("文件上传失败");
    },
    handleProgress(event, file, fileList) {
      if (this.bindAttrs.onProgress) {
        this.bindAttrs.onProgress(event, file, fileList, this);
        return;
      }
      if (this.progress === 0) {
        this.currentFileName = file && file.name;
      }
      let progress = event.percent.toFixed(1);
      if (progress >= 99.9) {
        progress = 99.9;
      }
      this.progress = parseFloat(progress);
    },
    isAssetTypeAnImage({ name, src, type }) {
      if (type && type.startsWith("image")) {
        return true;
      }
      let ext;
      if (name) {
        const index = name.lastIndexOf(".");
        ext = name.substr(index + 1);
      } else if (src) {
        const index = src.lastIndexOf(".");
        if (index !== -1) {
          ext = src.substr(index + 1);
        }
      }
      if (!ext) {
        return false;
      }
      return (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff",
          "heic"
        ].indexOf(ext.toLowerCase()) !== -1
      );
    }
  }
};
</script>
