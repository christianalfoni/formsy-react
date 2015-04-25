module.exports = {
  arraysDiffer: function (a, b) {
    var isDifferent = false;
    if (a.length !== b.length) {
      isDifferent = true;
    } else {
      a.forEach(function (item, index) {
        if (!this.isSame(item, b[index])) {
          isDifferent = true;
        }
      }, this);
    }
    return isDifferent;
  },
  objectsDiffer: function (a, b) {
    var isDifferent = false;
    if (Object.keys(a).length !== Object.keys(b).length) {
      isDifferent = true;
    } else {
      Object.keys(a).forEach(function (key) {
        if (!this.isSame(a[key], b[key])) {
          isDifferent = true;
        }
      }, this);
    }
    return isDifferent;   
  },
  isSame: function (a, b) {
    
    if (a !== b) {
      return false;
    }

    if (Array.isArray(a)) {
      return !this.arraysDiffer(a, b);
    } else if (typeof a === 'object' && a !== null) {
      return !this.objectsDiffer(a, b);
    }

    return true;
  }
};
