This is stupidest reactive framework that I made in my free time


Basic usage
```javascript
let _obj = {
	counter: 0,
}

let lz = new Lazyact(function(){return _obj}, 1000);

setInterval(() => {_obj.counter++}, 50);

```
