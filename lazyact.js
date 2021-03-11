class Lazyact {
	constructor(referencer, refreshRate) {
  	this.dataSourcer = referencer;
    this.source = referencer();
    this.interval = setInterval(
        function () {this.data = this.dataSourcer();}.bind(this),
        refreshRate);

    this.updateHooks = {
      tick: {
        fireable: [],
        worker: null
      },
    }

    this.setupFillers();

    this.updateHooks.tick.worker = setInterval(
     function() {this.updateHooks.tick.fireable.forEach(function(m){m();}.bind(this))}.bind(this),
     refreshRate
   );


  }

  setupFillers() {
    console.log('Binding UI to data...');
    let all = document.querySelectorAll('[bind]:not([repeat])');
    all.forEach(function(element) {
      console.log(element);
      let source = element.getAttribute('source');
      source = source.replace('()', '');
      let on = element.getAttribute('on');
      let changer = null;
      changer = function() {
        let erroredOut = false;
        let chain = source.split('.');
        let pointer = this.source;
        let path = '';
        let prev = this.source;
        chain.forEach((part) => {
            if (part in pointer) {
                prev = pointer;
                pointer = pointer[part];
                path+='.'+part;
                return;
            }
            if (!erroredOut) {
                throw new Error('Cant find '+part+' in '+pointer.name+' @ '+path);
                erroredOut = true;
            }
        });

        if (pointer !== null) {
            let text = pointer.toString();
            if (element.getAttribute('source').includes('()')) {
                let toCall = pointer.bind(prev);
                text = toCall();
            }

            if (element.hasAttribute('template'))
            {
                text = element.getAttribute('template').replace('%value%', text);
            }

            if (element.getAttribute('to') === 'html')
                element.innerHTML = text;
            if (element.getAttribute('to') === 'style')
                element.setAttribute('style', text);

        }

    }
    this.updateHooks[on].fireable.push(changer.bind(this));
}.bind(this));
  }
  setupRepeaters() {
    
  }
}
