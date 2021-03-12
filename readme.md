# Lazyact
This is stupidest reactive framework that I made in my free time

Idea is not having to bother with components or whatever, just add some attributes to your html and have fun having reactive UI
#### How to use
>check [github pages](https://countto25.github.io/Lazyact/) of demo and [its source](https://github.com/CountTo25/Lazyact/blob/main/index.html) to see the goods in the effect

Grab lazyact.js from repo
```html
<script src='lazyact.js'><script>
```
Tag your HTML elements with info on how to populate it

```html
<div
	bind
    source='pagename'
></div>
<div
	bind
    to='html'
    source='randomMessages.hello()'
></div>
<div
	bind
    on='tick'
    to='html'
    template='Time spent watching timer: %value%'
    source='timeSpent'
></div>
```

declare your object or get it from whereever
```javascript
let uiData = {
	pagename: 'Super Serious Company LLC Homepage',
    timeSpent: 0,
    teamMembers: {
    	me: 'CountTo25',
        myCat: 'Captain',
    },
    randomMessages: {
    	hello: () => {
        	let a = ['hi', 'hello', 'hey', 'heyah', 'sup'];
            return a[~~(Math.random()*(a.length-1))];
        }
    }
}
```
Create referencer function
```
let callMeWhatever = function() {return uiData}
```
Create new Lazyact using referencer and base interval timer
```javascript
let lz = new Lazyact(callMeWhatever, 1000);
```
freely modify your source object
```javascript
setInterval(()=>{uiData.timeSpent++}, 1000);
```

???

Enjoy lazy reactive stuff!

## More stuff

#### Bind data to attributes other than html
object that is subject to be lazyactified (wow!) can implement attribute **to** that tells which attribute to bind to. If no **to** specified, it will be bound to html. Or if you've decided to keep **to='html'**
```html
<div bind to='style' source='color()' template='color: %value%'>I'm changing colors!</div>
```
```javascript
uiData.color = ()=>{return '#'+Math.floor(Math.random()*16777215).toString(16)};
```
#### Repeaters
You can iterate trough an object (array coming rather soon, i just wanna sleep and work and then work on this)

```html
<div
	iterate="teamMembers" object
>
  <span>Made by: <span>
  <span repeatable>
    <span
      bind repeat
      to="html"
      source="repeatable.knownas"
     ></span>
     <span
       bind repeat
       to="html"
       source="repeatable.tagline"
       template = " — %value%"
     ></span>
  </span>
  </div>
```

## TODO
Arrays, more documentation
