// primitive Set implementation
(function (globals) {
  globals.Set = class Set {
    __values = []

    size = 0

    add(value) {
      if (this.__values.indexOf(value) == -1) {
        this.__values.push(value);
        this.size++;
      }
      return this;
    }

    clear() {
      this.__values = [];
      this.size = 0;
    }

    delete(value) {
      var index = this.__values.indexOf(value);
      if (index !== -1) {
        this.__values.splice(index, 1);
        this.size--;
        return true;
      } else {
        return false;
      }
    }

    values() {
      return this.__values;
    }

    entries() {
      return this.__values.map(function (value) {
        return [value, value];
      });
    }

    forEach(callback, thisArg) {
      var self = this;
      this.__values.forEach(function (value) {
        callback.call(thisArg || self, value, value, self)
      })
    }

    has(value) {
      return this.__values.indexOf(value) !== -1;
    }

    // non standard replacement for Set.prototype[@@iterator]()
    get(index) {
      return this.__values[index];
    }
  }
})(window);
