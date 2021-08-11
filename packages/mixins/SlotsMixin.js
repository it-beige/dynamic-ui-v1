export default {
  props: {
    // 定义表单项的slots
    slots: {
      type: Object,
      default: () => ({})
    },
    // 定义表单项的scopedSlots
    scopedSlots: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    bindSlots({ $slots, slots }) {
      return { ...$slots, ...slots }
    },
    bindScopedSlots({ $scopedSlots, scopedSlots }) {
      return { ...$scopedSlots, ...scopedSlots }
    }
  }
}
