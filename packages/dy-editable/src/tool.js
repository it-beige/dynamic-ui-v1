import XEUtils from 'xe-utils'

const browse = XEUtils.browse()
const UtilHandle = {
  browse,
  addClass(cell, clss) {
    const classList = cell.className.split(' ')
    clss.forEach(name => {
      if (classList.indexOf(name) === -1) {
        classList.push(name)
      }
    })
    cell.className = classList.join(' ')
  },
  hasClass(cell, cls) {
    return cell && cell.className && cell.className.split && cell.className.split(' ').indexOf(cls) > -1
  },
  removeClass(cell, clss) {
    const classList = []
    cell.className.split(' ').forEach(name => {
      if (clss.indexOf(name) === -1) {
        classList.push(name)
      }
    })
    cell.className = classList.join(' ')
  },
  getCsvUrl(opts, content) {
    if (window.Blob && window.URL && window.URL.createObjectURL && !browse.safari) {
      return URL.createObjectURL(new Blob([content], { type: 'text/csv' }))
    }
    return `data:attachment/csv;charset=utf-8,${encodeURIComponent(content)}`
  },
  getCsvLabelData(columns, oData, tableElem) {
    const trElemList = tableElem.querySelectorAll('.el-table__body-wrapper .el-table__row')
    return Array.from(trElemList).map((trElem, rowIndex) => {
      const item = {}
      const row = oData[rowIndex]
      columns.forEach(column => {
        const cell = trElem.querySelector(`.${column.id}`)
        item[column.id] = cell ? cell.innerText.trim() : (row ? XEUtils.get(row, column.property) : '')
      })
      return item
    })
  },
  getCsvData(opts, oData, oColumns, tableElem) {
    const isOriginal = opts.original
    let columns = opts.columns ? opts.columns : oColumns
    if (opts.columnFilterMethod) {
      columns = columns.filter(opts.columnFilterMethod)
    }
    let datas = opts.data ? opts.data : (isOriginal ? oData : UtilHandle.getCsvLabelData(columns, oData, tableElem))
    if (opts.dataFilterMethod) {
      datas = datas.filter(opts.dataFilterMethod)
    }
    return { columns, datas }
  },
  getCsvContent(opts, oData, oColumns, tableElem) {
    const isOriginal = opts.original
    const { columns, datas } = UtilHandle.getCsvData(opts, oData, oColumns, tableElem)
    let content = '\ufeff'
    if (opts.isHeader) {
      content += columns.map(column => column.label).join(',') + '\n'
    }
    datas.forEach((record, rowIndex) => {
      if (isOriginal) {
        content += columns.map(column => {
          if (column.type === 'index') {
            return `"${column.index ? column.index(rowIndex) : rowIndex + 1}"`
          }
          return `"${XEUtils.get(record, column.property) || ''}"`
        }).join(',') + '\n'
      } else {
        content += columns.map(column => `"${record[column.id]}"`).join(',') + '\n'
      }
    })
    return content
  },
  downloadCsc(opts, content) {
    if (!opts.download) {
      return Promise.resolve(content)
    }
    if (navigator.msSaveBlob && window.Blob) {
      navigator.msSaveBlob(new Blob([content], { type: 'text/csv' }), opts.filename)
    } else if (browse['-ms']) {
      var win = window.top.open('about:blank', '_blank')
      win.document.charset = 'utf-8'
      win.document.write(content)
      win.document.close()
      win.document.execCommand('SaveAs', opts.filename)
      win.close()
    } else {
      var linkElem = document.createElement('a')
      linkElem.target = '_blank'
      linkElem.download = opts.filename
      linkElem.href = UtilHandle.getCsvUrl(opts, content)
      document.body.appendChild(linkElem)
      linkElem.click()
      document.body.removeChild(linkElem)
    }
  }
}

export default UtilHandle
