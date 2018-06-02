
export const isIE = () => {
  return navigator.msMaxTouchPoints !== void 0;
}

function size(objectOrArray) {
  if (objectOrArray instanceof Array) {
    return objectOrArray.length;
  }
  else {
    return Object.keys(objectOrArray).length;
  }
}

function mergeObjects(source,additional) {
  let res = {};
  for (var s in source) {
    let obj = source[s];
    if (additional[s] !== undefined) {
      obj = Object.assign(obj,additional[s]);
    }
    res[s] = obj;
  }
  return res;
}


function hdtl(array) {
  let hd = array[0];
  let tl = array.splice(1);
  return [hd,tl]
}

function recurseObject(object,fields) {
  let split = hdtl(fields);
  let hd = split[0];
  let tl = split[1];
  if (object[hd] === undefined) {
    return undefined
  }
  else
  {
    if (tl.length === 0) {
      return object[hd]
    }
    else
    {
      let nextObject = object[hd];
      return recurseObject(nextObject,tl)
    }
  }
}

function fieldValue(object,field,def) {
  if (field instanceof Array) {
    let res = recurseObject(object,field);
    if (res === undefined ) {
      return def
    }
    else {
      return res
    }
  }
  else {
    if (object[field] === undefined) {

      return def
    }
    else
    {
      return object[field]
    }
  }
}

function objectToArray(input) {
  if (input instanceof Array) {
    return input
  }
  else
  {
    let res = [];
    for (var f in input) {
      if (input.hasOwnProperty(f)) {
        res.push(input[f])
      }
    }
    return res;
  }
}

function sumField(arrayOrObject,field) {
  let arr = objectToArray(arrayOrObject);
  let res = 0;
  for (var i = 0 ; i < arr.length ; i ++ ) {
    let val = fieldValue(arr[i],field,0);
    res = res + val;
  }
  return res;
}

function countField(arrayOrObject,field) {
  let arr = objectToArray(arrayOrObject);
  let res = 0;
  for (var i = 0 ; i < arr.length ; i ++ ) {
    let val = fieldValue(arr[i],field,-1);
    if (val === -1) {
      res = res + 0;
    }
    else
    {
      res = res + 1;
    }
  }
  return res;
}

function averageField(arrayOrObject,field) {
  let sum = sumField(arrayOrObject,field);
  let cnt = countField(arrayOrObject,field);
  return (cnt === 0) ? 0 : sum / cnt;
}

function usort(array) {
  let res = [];
  for (var i = 0; i < array.length ; i ++ ) {
    if (res.indexOf(array[i]) === -1 ) {
      res.push(array[i]);
    }
  }
  return  res.sort(function(a,b) { return a > b ? 1 : -1});
}

window.usort         = usort;
window.objectToArray = objectToArray;
window.sumField      = sumField;
window.countField    = countField;
window.averageField  = averageField;
window.fieldValue    = fieldValue;
window.hdtl          = hdtl;
window.recurseObject = recurseObject;
window.size          = size;
window.mergeObjects  = mergeObjects;
