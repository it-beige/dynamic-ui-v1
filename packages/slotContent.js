// 用于处理插槽
export default {
  name: 'SlotContent',
  functional: true,

  render: (h, ctx) => {
    return ctx.props.render(h, ctx.props.data)
  }
}
