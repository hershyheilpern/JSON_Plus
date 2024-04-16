const vm = require('vm');

function stringify(obj) {
    let cache = [];
    let str = JSON.stringify(obj, function(key, value) {
        if(typeof value === "function"){
            return "$"+(value.toString())
        }        
        try {
            JSON.stringify(value)
            return value
        } catch (error) {
            console.log("stringify error",error,"value",value)
        }
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return "Circular reference found";
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    },2);
    cache = null; // reset the cache
    return str;
  }

  function parse(str) {
    return JSON.parse(str, unstringify);
  }
  function unstringify(key,value){
    if(typeof value === "string" && value.startsWith("$"+key)){
        return eval_func(key,value)
    }
    return value
}

function eval_func(key,value){
    vm.runInThisContext(value.replace("$"+key,"let temp = function").replaceAll("\n",""))
    console.log("temp",temp)
    return temp
}

exports.stringify = stringify
exports.parse = parse
