//Array tests
let arr1: Array<num> = [1, "2", 3];
let arr2 = Array<num> {1, 2, 3};
let arr3 = Array<str>["hello"];
let arr4: Array<num> = arr3;
arr1.someRandomMethod();

let arr5: Array<num> = [1, 2, 3];
let val: num = arr5.tryAt(0);
//             ^^^^^^^^^^^^^ Expected type to be "num", but got "num?" instead

//Map tests
let m1: Map<num> = {"a" => 1, "b" => "2", "c" => 3};
let m2: Map<num> = ["a" => 1, "b" => "2", "c" => 3];
let m3 = Map<str>{"h" => "h"};
let m4: Map<num> = m3;
m1.someRandomMethod();

//Set tests
let s1: Set<num> = {1, "2", 3};
let s2 = Set<num> [1, "2", 3];
let s3: Set<num> = [1, "2", 3];
let s4 = Set<num>{1,2};
let s5: Set<str> = s4;
s1.someRandomMethod();

let a: Array<str> = MutArray<str>[];
//                  ^^^^^^^^^^^^^^^ Expected type to be "Array<str>", but got "MutArray<str>" instead
