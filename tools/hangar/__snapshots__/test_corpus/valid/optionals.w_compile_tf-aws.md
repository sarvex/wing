# [optionals.w](../../../../../examples/tests/valid/optionals.w) | compile | tf-aws

## Name.Struct.js
```js
module.exports = function(stdStruct) {
  class Name {
    static jsonSchema() {
      return {
        id: "/Name",
        type: "object",
        properties: {
          first: { type: "string" },
          last: { type: "string" },
        },
        required: [
          "first",
        ],
        $defs: {
        }
      }
    }
    static fromJson(obj) {
      return stdStruct._validate(obj, this.jsonSchema())
    }
    static _toInflightType(context) {
      return `require("./Name.Struct.js")(${ context._lift(stdStruct) })`;
    }
  }
  return Name;
};

```

## Payload.Struct.js
```js
module.exports = function(stdStruct) {
  class Payload {
    static jsonSchema() {
      return {
        id: "/Payload",
        type: "object",
        properties: {
          a: { type: "string" },
          b: { type: "object", patternProperties: { ".*": { type: "string" } } },
          c: { "$ref": "#/$defs/cloud" },
        },
        required: [
          "a",
        ],
        $defs: {
          "cloud": { type: "object", "properties": require("./cloud.Struct.js")().jsonSchema().properties },
        }
      }
    }
    static fromJson(obj) {
      return stdStruct._validate(obj, this.jsonSchema())
    }
    static _toInflightType(context) {
      return `require("./Payload.Struct.js")(${ context._lift(stdStruct) })`;
    }
  }
  return Payload;
};

```

## inflight.$Closure1-1.js
```js
module.exports = function({ $__payloadWithBucket_c_____null_, $__payloadWithoutOptions_b_____null_, $payloadWithBucket_c }) {
  class $Closure1 {
    constructor({  }) {
      const $obj = (...args) => this.handle(...args);
      Object.setPrototypeOf($obj, this);
      return $obj;
    }
    async handle() {
      {((cond) => {if (!cond) throw new Error("assertion failed: payloadWithoutOptions.b? == false")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })($__payloadWithoutOptions_b_____null_,false)))};
      if ($__payloadWithBucket_c_____null_) {
        (await $payloadWithBucket_c?.put?.("x.txt","something"));
      }
    }
  }
  return $Closure1;
}

```

## inflight.Node-1.js
```js
module.exports = function({  }) {
  class Node {
    constructor({  }) {
    }
  }
  return Node;
}

```

## inflight.Sub-1.js
```js
module.exports = function({ $Super }) {
  class Sub extends $Super {
    constructor({  }) {
      super({  });
    }
  }
  return Sub;
}

```

## inflight.Sub1-1.js
```js
module.exports = function({ $Super }) {
  class Sub1 extends $Super {
    constructor({  }) {
      super({  });
    }
  }
  return Sub1;
}

```

## inflight.Super-1.js
```js
module.exports = function({  }) {
  class Super {
    constructor({  }) {
    }
  }
  return Super;
}

```

## main.tf.json
```json
{
  "//": {
    "metadata": {
      "backend": "local",
      "stackName": "root",
      "version": "0.17.0"
    },
    "outputs": {
      "root": {
        "Default": {
          "cloud.TestRunner": {
            "TestFunctionArns": "WING_TEST_RUNNER_FUNCTION_ARNS"
          }
        }
      }
    }
  },
  "output": {
    "WING_TEST_RUNNER_FUNCTION_ARNS": {
      "value": "[[\"root/Default/Default/test:t\",\"${aws_lambda_function.testt_Handler_FF112F5E.arn}\"]]"
    }
  },
  "provider": {
    "aws": [
      {}
    ]
  },
  "resource": {
    "aws_iam_role": {
      "testt_Handler_IamRole_BF49E95A": {
        "//": {
          "metadata": {
            "path": "root/Default/Default/test:t/Handler/IamRole",
            "uniqueId": "testt_Handler_IamRole_BF49E95A"
          }
        },
        "assume_role_policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Action\":\"sts:AssumeRole\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Effect\":\"Allow\"}]}"
      }
    },
    "aws_iam_role_policy": {
      "testt_Handler_IamRolePolicy_F429CB90": {
        "//": {
          "metadata": {
            "path": "root/Default/Default/test:t/Handler/IamRolePolicy",
            "uniqueId": "testt_Handler_IamRolePolicy_F429CB90"
          }
        },
        "policy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Action\":[\"s3:PutObject*\",\"s3:Abort*\"],\"Resource\":[\"${aws_s3_bucket.orangebucket.arn}\",\"${aws_s3_bucket.orangebucket.arn}/*\"],\"Effect\":\"Allow\"}]}",
        "role": "${aws_iam_role.testt_Handler_IamRole_BF49E95A.name}"
      }
    },
    "aws_iam_role_policy_attachment": {
      "testt_Handler_IamRolePolicyAttachment_16BB0DB0": {
        "//": {
          "metadata": {
            "path": "root/Default/Default/test:t/Handler/IamRolePolicyAttachment",
            "uniqueId": "testt_Handler_IamRolePolicyAttachment_16BB0DB0"
          }
        },
        "policy_arn": "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        "role": "${aws_iam_role.testt_Handler_IamRole_BF49E95A.name}"
      }
    },
    "aws_lambda_function": {
      "testt_Handler_FF112F5E": {
        "//": {
          "metadata": {
            "path": "root/Default/Default/test:t/Handler/Default",
            "uniqueId": "testt_Handler_FF112F5E"
          }
        },
        "architectures": [
          "arm64"
        ],
        "environment": {
          "variables": {
            "BUCKET_NAME_c1491ba5": "${aws_s3_bucket.orangebucket.bucket}",
            "WING_FUNCTION_NAME": "Handler-c83c24f9",
            "WING_TARGET": "tf-aws"
          }
        },
        "function_name": "Handler-c83c24f9",
        "handler": "index.handler",
        "publish": true,
        "role": "${aws_iam_role.testt_Handler_IamRole_BF49E95A.arn}",
        "runtime": "nodejs18.x",
        "s3_bucket": "${aws_s3_bucket.Code.bucket}",
        "s3_key": "${aws_s3_object.testt_Handler_S3Object_572CA425.key}",
        "timeout": 30,
        "vpc_config": {
          "security_group_ids": [],
          "subnet_ids": []
        }
      }
    },
    "aws_s3_bucket": {
      "Code": {
        "//": {
          "metadata": {
            "path": "root/Default/Code",
            "uniqueId": "Code"
          }
        },
        "bucket_prefix": "code-c84a50b1-"
      },
      "orangebucket": {
        "//": {
          "metadata": {
            "path": "root/Default/Default/orange bucket/Default",
            "uniqueId": "orangebucket"
          }
        },
        "bucket_prefix": "orange-bucket-c8ecc927-",
        "force_destroy": false
      }
    },
    "aws_s3_bucket_server_side_encryption_configuration": {
      "orangebucket_Encryption_F338E6D4": {
        "//": {
          "metadata": {
            "path": "root/Default/Default/orange bucket/Encryption",
            "uniqueId": "orangebucket_Encryption_F338E6D4"
          }
        },
        "bucket": "${aws_s3_bucket.orangebucket.bucket}",
        "rule": [
          {
            "apply_server_side_encryption_by_default": {
              "sse_algorithm": "AES256"
            }
          }
        ]
      }
    },
    "aws_s3_object": {
      "testt_Handler_S3Object_572CA425": {
        "//": {
          "metadata": {
            "path": "root/Default/Default/test:t/Handler/S3Object",
            "uniqueId": "testt_Handler_S3Object_572CA425"
          }
        },
        "bucket": "${aws_s3_bucket.Code.bucket}",
        "key": "<ASSET_KEY>",
        "source": "<ASSET_SOURCE>"
      }
    }
  }
}
```

## preflight.js
```js
const $stdlib = require('@winglang/sdk');
const $plugins = ((s) => !s ? [] : s.split(';'))(process.env.WING_PLUGIN_PATHS);
const $outdir = process.env.WING_SYNTH_DIR ?? ".";
const $wing_is_test = process.env.WING_IS_TEST === "true";
const std = $stdlib.std;
const cloud = $stdlib.cloud;
class $Root extends $stdlib.std.Resource {
  constructor(scope, id) {
    super(scope, id);
    class Super extends $stdlib.std.Resource {
      constructor(scope, id, ) {
        super(scope, id);
        this.name = "Super";
      }
      static _toInflightType(context) {
        return `
          require("./inflight.Super-1.js")({
          })
        `;
      }
      _toInflight() {
        return `
          (await (async () => {
            const SuperClient = ${Super._toInflightType(this)};
            const client = new SuperClient({
            });
            if (client.$inflight_init) { await client.$inflight_init(); }
            return client;
          })())
        `;
      }
      _getInflightOps() {
        return ["$inflight_init"];
      }
    }
    class Sub extends Super {
      constructor(scope, id, ) {
        super(scope, id);
        this.name = "Sub";
      }
      static _toInflightType(context) {
        return `
          require("./inflight.Sub-1.js")({
            $Super: ${context._lift(Super)},
          })
        `;
      }
      _toInflight() {
        return `
          (await (async () => {
            const SubClient = ${Sub._toInflightType(this)};
            const client = new SubClient({
            });
            if (client.$inflight_init) { await client.$inflight_init(); }
            return client;
          })())
        `;
      }
      _getInflightOps() {
        return ["$inflight_init"];
      }
    }
    class Sub1 extends Super {
      constructor(scope, id, ) {
        super(scope, id);
        this.name = "Sub";
      }
      static _toInflightType(context) {
        return `
          require("./inflight.Sub1-1.js")({
            $Super: ${context._lift(Super)},
          })
        `;
      }
      _toInflight() {
        return `
          (await (async () => {
            const Sub1Client = ${Sub1._toInflightType(this)};
            const client = new Sub1Client({
            });
            if (client.$inflight_init) { await client.$inflight_init(); }
            return client;
          })())
        `;
      }
      _getInflightOps() {
        return ["$inflight_init"];
      }
    }
    class Node extends $stdlib.std.Resource {
      constructor(scope, id, value, left, right) {
        super(scope, id);
        this.value = value;
        this.left = left;
        this.right = right;
      }
      static _toInflightType(context) {
        return `
          require("./inflight.Node-1.js")({
          })
        `;
      }
      _toInflight() {
        return `
          (await (async () => {
            const NodeClient = ${Node._toInflightType(this)};
            const client = new NodeClient({
            });
            if (client.$inflight_init) { await client.$inflight_init(); }
            return client;
          })())
        `;
      }
      _getInflightOps() {
        return ["$inflight_init"];
      }
    }
    class $Closure1 extends $stdlib.std.Resource {
      constructor(scope, id, ) {
        super(scope, id);
        (std.Node.of(this)).hidden = true;
      }
      static _toInflightType(context) {
        return `
          require("./inflight.$Closure1-1.js")({
            $__payloadWithBucket_c_____null_: ${context._lift(((payloadWithBucket.c) != null))},
            $__payloadWithoutOptions_b_____null_: ${context._lift(((payloadWithoutOptions.b) != null))},
            $payloadWithBucket_c: ${context._lift(payloadWithBucket.c)},
          })
        `;
      }
      _toInflight() {
        return `
          (await (async () => {
            const $Closure1Client = ${$Closure1._toInflightType(this)};
            const client = new $Closure1Client({
            });
            if (client.$inflight_init) { await client.$inflight_init(); }
            return client;
          })())
        `;
      }
      _getInflightOps() {
        return ["handle", "$inflight_init"];
      }
      _registerBind(host, ops) {
        if (ops.includes("handle")) {
          $Closure1._registerBindObject(((payloadWithBucket.c) != null), host, []);
          $Closure1._registerBindObject(((payloadWithoutOptions.b) != null), host, []);
          $Closure1._registerBindObject(payloadWithBucket.c, host, ["put"]);
        }
        super._registerBind(host, ops);
      }
    }
    const x = 4;
    {((cond) => {if (!cond) throw new Error("assertion failed: x? == true")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(((x) != null),true)))};
    {((cond) => {if (!cond) throw new Error("assertion failed: !x? == false")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })((!((x) != null)),false)))};
    {((cond) => {if (!cond) throw new Error("assertion failed: x ?? 5 == 4")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })((x ?? 5),4)))};
    const y = (x ?? 5);
    {((cond) => {if (!cond) throw new Error("assertion failed: y == 4")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(y,4)))};
    const optionalSup = new Super(this,"Super");
    const s = (optionalSup ?? new Sub(this,"Sub"));
    {((cond) => {if (!cond) throw new Error("assertion failed: s.name == \"Super\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(s.name,"Super")))};
    const Name = require("./Name.Struct.js")($stdlib.std.Struct);
    let name = ({"first": "John","last": "Doe"});
    {
      const $if_let_value = name;
      if ($if_let_value != undefined) {
        const n = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: n.first == \"John\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(n.first,"John")))};
      }
    }
    name = undefined;
    {
      const $if_let_value = name;
      if ($if_let_value != undefined) {
        const n = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: false")})(false)};
      }
      else {
        {((cond) => {if (!cond) throw new Error("assertion failed: true")})(true)};
      }
    }
    const tryParseName = ((fullName) => {
      const parts = (fullName.split(" "));
      if ((parts.length < 1)) {
        return undefined;
      }
      return ({"first": (parts.at(0)),"last": (parts.at(1))});
    });
    const json_obj = ({"ghost": "spooky"});
    let something_else = false;
    {
      const $if_let_value = ((arg) => { return (typeof arg === "boolean") ? JSON.parse(JSON.stringify(arg)) : undefined })(json_obj);
      if ($if_let_value != undefined) {
        const y = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: y == true || y == false")})(((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(y,true)) || (((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(y,false))))};
      }
      else {
        const $elif_let_value0 = ((arg) => { return (typeof arg === "number") ? JSON.parse(JSON.stringify(arg)) : undefined })(json_obj);
        if ($elif_let_value0 != undefined) {
          const y = $elif_let_value0;
          {((cond) => {if (!cond) throw new Error("assertion failed: y + 0 == y")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })((y + 0),y)))};
        }
        else {
          const $elif_let_value1 = ((arg) => { return (typeof arg === "string") ? JSON.parse(JSON.stringify(arg)) : undefined })(json_obj);
          if ($elif_let_value1 != undefined) {
            const y = $elif_let_value1;
            {((cond) => {if (!cond) throw new Error("assertion failed: y.length >= 0")})((y.length >= 0))};
          }
          else {
            something_else = true;
          }
        }
      }
    }
    {((cond) => {if (!cond) throw new Error("assertion failed: something_else")})(something_else)};
    const a = 1;
    {
      const $if_let_value = a;
      if ($if_let_value != undefined) {
        let z = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: z == 1")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(z,1)))};
        z = 2;
        {((cond) => {if (!cond) throw new Error("assertion failed: z == 2")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(z,2)))};
      }
    }
    const b = 1;
    {
      const $if_let_value = b;
      if ($if_let_value != undefined) {
        const z = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: z == 1")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(z,1)))};
      }
    }
    {
      const $if_let_value = (tryParseName("Good Name"));
      if ($if_let_value != undefined) {
        const parsedName = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: parsedName.first == \"Good\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(parsedName.first,"Good")))};
        {
          const $if_let_value = parsedName.last;
          if ($if_let_value != undefined) {
            const lastName = $if_let_value;
            {((cond) => {if (!cond) throw new Error("assertion failed: lastName == \"Name\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(lastName,"Name")))};
          }
          else {
            {((cond) => {if (!cond) throw new Error("assertion failed: false")})(false)};
          }
        }
      }
    }
    {
      const $if_let_value = (tryParseName("BadName"));
      if ($if_let_value != undefined) {
        const parsedName = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: parsedName.first == \"BadName\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(parsedName.first,"BadName")))};
        {
          const $if_let_value = parsedName.last;
          if ($if_let_value != undefined) {
            const lastName = $if_let_value;
            {((cond) => {if (!cond) throw new Error("assertion failed: false")})(false)};
          }
        }
      }
    }
    const falsy = false;
    {
      const $if_let_value = falsy;
      if ($if_let_value != undefined) {
        const f = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: f == false")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(f,false)))};
      }
      else {
        {((cond) => {if (!cond) throw new Error("assertion failed: false")})(false)};
      }
    }
    const shadow = "root";
    {
      const $if_let_value = shadow;
      if ($if_let_value != undefined) {
        const shadow = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: shadow == \"root\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(shadow,"root")))};
        const shadow1 = "nested";
        {
          const $if_let_value = shadow1;
          if ($if_let_value != undefined) {
            const shadow1 = $if_let_value;
            {((cond) => {if (!cond) throw new Error("assertion failed: shadow1 == \"nested\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(shadow1,"nested")))};
          }
          else {
            {((cond) => {if (!cond) throw new Error("assertion failed: false")})(false)};
          }
        }
      }
    }
    const fun = ((a) => {
      {
        const $if_let_value = a;
        if ($if_let_value != undefined) {
          const y = $if_let_value;
          return y;
        }
        else {
          return "default";
        }
      }
    });
    {((cond) => {if (!cond) throw new Error("assertion failed: fun(\"hello\") == \"hello\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })((fun("hello")),"hello")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: fun(nil) == \"default\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })((fun(undefined)),"default")))};
    const tree = new Node(this,"eight",8,new Node(this,"three",3,new Node(this,"one",1,undefined,undefined),new Node(this,"six",6,undefined,undefined)),new Node(this,"ten",10,undefined,new Node(this,"fourteen",14,new Node(this,"thirteen",13,undefined,undefined),undefined)));
    const thirteen = tree.right?.right?.left?.value;
    const notThere = tree.right?.right?.right;
    {((cond) => {if (!cond) throw new Error("assertion failed: thirteen == 13")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(thirteen,13)))};
    {((cond) => {if (!cond) throw new Error("assertion failed: notThere == nil")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(notThere,undefined)))};
    {
      const $if_let_value = tree.left?.left;
      if ($if_let_value != undefined) {
        const o = $if_let_value;
        {((cond) => {if (!cond) throw new Error("assertion failed: o.value == 1")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(o.value,1)))};
      }
    }
    const Payload = require("./Payload.Struct.js")($stdlib.std.Struct);
    const payloadWithoutOptions = ({"a": "a"});
    const payloadWithBucket = ({"a": "a","c": this.node.root.newAbstract("@winglang/sdk.cloud.Bucket",this,"orange bucket")});
    this.node.root.new("@winglang/sdk.std.Test",std.Test,this,"test:t",new $Closure1(this,"$Closure1"));
  }
}
const $App = $stdlib.core.App.for(process.env.WING_TARGET);
new $App({ outdir: $outdir, name: "optionals", rootConstruct: $Root, plugins: $plugins, isTestEnvironment: $wing_is_test, entrypointDir: process.env['WING_SOURCE_DIR'], rootId: process.env['WING_ROOT_ID'] }).synth();

```

