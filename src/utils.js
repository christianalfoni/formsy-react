var csrfTokenSelector = typeof document != 'undefined' ? document.querySelector('meta[name="csrf-token"]') : null;

var toURLEncoded = function (element, key, list) {
  var list = list || [];
  if (typeof (element) == 'object') {
    for (var idx in element)
      toURLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
  } else {
    list.push(key + '=' + encodeURIComponent(element));
  }
  return list.join('&');
};

var request = function (method, url, data, contentType, headers) {

  var contentType = contentType === 'urlencoded' ? 'application/' + contentType.replace('urlencoded', 'x-www-form-urlencoded') : 'application/json';
  data = contentType === 'application/json' ? JSON.stringify(data) : toURLEncoded(data);

  return new Promise(function (resolve, reject) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', contentType);

      if (!!csrfTokenSelector && !!csrfTokenSelector.content) {
        xhr.setRequestHeader('X-CSRF-Token', csrfTokenSelector.content);
      }

      // Add passed headers
      Object.keys(headers).forEach(function (header) {
        xhr.setRequestHeader(header, headers[header]);
      });

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

          try {
            var response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(response);
            } else {
              reject(response);
            }
          } catch (e) {
            reject(e);
          }

        }
      };
      xhr.send(data);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  arraysDiffer: function (arrayA, arrayB) {
    var isDifferent = false;
    if (arrayA.length !== arrayB.length) {
      isDifferent = true;
    } else {
      arrayA.forEach(function (item, index) {
        if (item !== arrayB[index]) {
          isDifferent = true;
        }
      });
    }
    return isDifferent;
  },
  ajax: {
    post: request.bind(null, 'POST'),
    put: request.bind(null, 'PUT')
  }
};
