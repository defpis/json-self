### JSON.parse & JSON.stringify's implementation

```typescript
import jsonSelf from "./src";

console.log(jsonSelf.parse('{"a":1}')); // { a: 1 }
console.log(jsonSelf.stringify({ a: 1 })); // {"a":1}
```
