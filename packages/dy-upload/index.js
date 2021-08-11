import DyUpload from './src/upload'
DyUpload.install = vue => {
  vue.component(DyUpload.componentName, DyUpload)
}
export default DyUpload
