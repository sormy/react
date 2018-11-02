function uniq(array) {
  if (typeof Set !== "undefined") {
    return new Set(array)
  } else {
    var hash = {};
    for (var index = 0; index < array.length; index++) {
      hash[array[index]] = true;
    }
    var result = [];
    for (var value in hash) {
      if (hash.hasOwnProperty(value)) {
        result.push(value);
      }
    }
    return result;
  }
}
