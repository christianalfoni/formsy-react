export default {
  arraysDiffer(a, b) {
    if (a.length !== b.length) {
      return true;
    }
    return a.some((item, index) => !this.isSame(item, b[index]));
  },

  objectsDiffer(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return true;
    }
    return Object.keys(a).some((key) => !this.isSame(a[key], b[key]));
  },

  isSame(a, b) {
    if (typeof a !== typeof b) {
      return false;
    }

    if (Array.isArray(a)) {
      return !this.arraysDiffer(a, b);
    } else if (typeof a === 'object' && a !== null && b !== null) {
      return !this.objectsDiffer(a, b);
    }

    return a === b;
  }
};
