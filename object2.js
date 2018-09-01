// array object
var f1 = function(){
    return 1;
}
var f2 = function(){
    return 2;
}

var a = [f1, f2];
console.log(a[0]() + a[1]());

var o = { func1:f1, func2:f2 };
console.log(o.func1() + o.func2());
