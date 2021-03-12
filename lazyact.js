class Lazyact {
	constructor(referencer, refreshRate) {
  	this.dataSourcer = referencer;
    this.source = referencer();
    this.interval = setInterval(
      function () {this.data = this.dataSourcer();}.bind(this),
      refreshRate
    );

    this.updateHooks = {
      tick: {
        fireable: [],
        worker: null
      },
    }

    this.setupFillers();
    this.setupRepeaters();

    this.updateHooks.tick.worker = setInterval(
     this.tick.bind(this),
     refreshRate
   );
   this.tick();
  }

  tick() {
    this.updateHooks.tick.fireable.forEach(function(m){m();})
  }

  setupFillers() {
    let all = document.querySelectorAll('[bind]:not([repeat])');
    all.forEach(function(element) {
      let source = element.getAttribute('source');
      source = source.replace('()', '');
      let on = element.hasAttribute('on') ? element.getAttribute('on') : 'tick';
      let changer = null;
      changer = function() {
        let chain = source.split('.');
        let pointer = this.source;
        let path = 'source';
        let prev = this.source;
        chain.forEach((part) => {
            if (part in pointer) {
                prev = pointer;
                pointer = pointer[part];
                path+='.'+part;
                return;
            }
        });

        if (pointer !== this.source) {
            let text = pointer.toString();
            if (element.getAttribute('source').includes('()')) {
                let toCall = pointer.bind(prev);
                text = toCall();
            }

            if (element.hasAttribute('template'))
            {
                text = element.getAttribute('template').replace('%value%', text);
            }

            if (element.getAttribute('to') === 'html' || !element.hasAttribute('to'))
                element.innerHTML = text;
            element.setAttribute(element.getAttribute('to'), text);
        }
      }
    this.updateHooks[on].fireable.push(changer.bind(this));
    }.bind(this));
  }

  setupRepeaters() {
    let repeaters = document.querySelectorAll('[iterate]');
    repeaters.forEach(function(repeater) {
        let _virtual = repeater.cloneNode(true);
        let datasource = this.source;

        let on = repeater.hasAttribute('on') ? repeater.getAttribute('on') : 'tick';
        let source = repeater.getAttribute('iterate').replace('()', '');

        let changer = null;

        changer = function() {
            let chain = source.split('.');
            let pointer = this.source;
            let path = 'source';
            let prev = this.source;

            chain.forEach((part) => {
                if (part in pointer) {
                    prev = pointer;
                    pointer = pointer[part];
                    path+='.'+part;
                    return;
                }
            });

            if (pointer !== this.source) {
                let repeat = pointer;
                if (repeater.getAttribute('iterate').includes('()')) {
                    let toCall = pointer.bind(prev);
                    repeat = toCall();
                }

                if (repeater.hasAttribute('object')) {
                    for (const [key, value] of Object.entries(repeat)) {
                        let workWith = null;
                        let source = '';
                        if (repeater.querySelector('[repeatable][repeated="'+key+'"]')) {
                            workWith = repeater.querySelector('[repeatable][repeated="'+key+'"]')
                        }

                        if (!workWith) {
                            workWith = repeater.querySelector('[repeatable]:not([repeated])').cloneNode(true);
                            repeater.appendChild(workWith);
                            workWith.setAttribute('repeated', key);
                        }
                        workWith.querySelectorAll('[bind]').forEach(function(bindable) {
                            if (!bindable.hasAttribute('bind')) {
                                return;
                            }
                            let chn = bindable.getAttribute('source').replace('repeatable.', '').split('.');
                            let pnt = value;
                            let pth = 'repeatable';
                            let prv = value
                            chn.forEach(part => {
                                if (part in pnt) {
                                    prv = pnt;
                                    pnt = pnt[part];
                                    pth+='.'+part;
                                    return;
                                }
                            })

                            if (pnt !== value) {
                                let txt = pnt.toString();
                                if (bindable.getAttribute('source').includes('()')) {
                                    let toCall = pnt.bind(prev);
                                    txt = toCall();
                                }

                                if (bindable.hasAttribute('template'))
                                {
                                    txt = bindable.getAttribute('template').replace('%value%', txt);
                                }
                                if (bindable.getAttribute('to') === 'html' || !bindable.hasAttribute('to'))
                                    bindable.innerHTML = txt;
                                bindable.setAttribute(bindable.getAttribute('to'), txt);
                            }
                        })
                    }
                }

                if (repeater.hasAttribute('array')) {

                }
                /*
                if (repeater.hasAttribute('template'))
                {
                    text = repeater.getAttribute('template').replace('%value%', text);
                }

                if (repeater.getAttribute('to') === 'html' || !repeater.hasAttribute('to'))
                  repeater.innerHtml = text;

                if (repeater.getAttribute('to') === 'style')
                  repeater.setAttribute('style', text);
                */
            }
        }
        this.updateHooks[on].fireable.push(changer.bind(this));
    }.bind(this));
  }
}
