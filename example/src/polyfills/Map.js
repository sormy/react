// primitive Set implementation
(function (globals) {
  globals.Map = class Map {
    __values = []

    size = 0

    set(key, value) {
      var records = this.__values.filter(function (record) {
        return record[0] === key;
      });
      if (records.length > 0) {
        records[0][1] = value;
      } else {
        this.__values.push([key, value]);
        this.size++;
      }
      return this;
    }

    clear() {
      this.__values = [];
      this.size = 0;
    }

    delete(key) {
      var records = this.__values.filter(function (record) {
        return record[0] === key;
      });
      if (records.length > 0) {
        var record = records[0];
        var index = this.__values.indexOf(record);
        this.__values.splice(index, 1);
        this.size--;
        return true;
      } else {
        return false;
      }
    }

    keys() {
      return this.__values.map(function (record) {
        return record[0];
      })
    }

    values() {
      return this.__values.map(function (record) {
        return record[1];
      })
    }

    entries() {
      return this.__values;
    }

    forEach(callback, thisArg) {
      var self = this;
      this.__values.forEach(function (record) {
        callback.call(thisArg || self, record[1], record[0], self)
      })
    }

    has(key) {
      var records = this.__values.filter(function (record) {
        return record[0] === key;
      });
      return records.length > 0;
    }

    // non standard replacement for Map.prototype[@@iterator]()
    get(key) {
      var records = this.__values.filter(function (record) {
        return record[0] === key;
      });
      return records.length > 0 ? records[0] : undefined;
    }
  }
})(window);
