export default function ajax({
  method = 'GET',
  url,
  data = {},
  params = {},
  headers = {}
}) {
  headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return new Promise((resolve, reject) => {
    let xhr = null
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest()
    } else {
      // eslint-disable-next-line no-undef
      xhr = new ActiveObject('Microsoft.XMLHTTP')
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(xhr.status)
        }
      }
    }
    if (method.toUpperCase() === 'POST') {
      headers['Content-Type'] = 'application/json;charset=utf-8'
      data = JSON.stringify(data)
      xhr.open(method.toUpperCase(), url, true)
    } else {
      let query = ''
      for (const key in params) {
        query +=
          '&' + encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      }
      if (Object.keys(data).length) {
        query = ''
        for (const key in data) {
          query +=
            '&' + encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
        }
      }
      query = query.substring(1)
      if (query) {
        url = url + '?' + query
      }
      xhr.open(method.toUpperCase(), url, true)
    }
    for (const item in headers) {
      // eslint-disable-next-line no-prototype-builtins
      if (headers.hasOwnProperty(item) && headers[item] !== null) {
        xhr.setRequestHeader(item, headers[item])
      }
    }
    xhr.send(data)
    return xhr
  })
}
