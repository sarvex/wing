class C4 {
    x:num;
//  ^ "x" is not initialized
} // class with field and no init

class C5 {} // class with argument and no init
new C5(1);
//     ^ Expected 0 arguments but got 1 when instantiating C5