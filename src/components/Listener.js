/**
 * Created by David Maser on 14/06/2017.
 */
export const listener = {
  mutate: function (args) {
    /*
     args format
     {
     target:'',
     class:'',
     delay:1000,
     config:{
     attributes:true,
     childList:true,
     characterData:true
     }
     }
     */
    let target = document.querySelectorAll(args.target);
    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        let newNodes = mutation.addedNodes; // DOM NodeList
        if (newNodes !== null) { // If there are new nodes added
          let $nodes = $(newNodes); // jQuery set
          $nodes.each(function () {
            let $node = $(this);
            if ($node.hasClass(args.class)) {
              console.log(args.class + ' mutation has been observed');
            }
          });
        }
      });
    });
    observer.observe(target, args.config);
    args.delay !== undefined && args.delay !== null ?
      window.setTimeout(function () {
        observer.disconnect();
      }, args.delay) : false;
  },
  init: function (args) {
    /*
     args format
     {
     event:'click',
     element:'',
     function:'',
     timer:5000 //optional after this value, event will be killed
     }
     */
    if (typeof args === 'object') {
      if (Array.isArray(args) === true) {
        for (let a in args) {
          console.log(args[a]);
          $(args[a].element).on(args[a].event, function () {
            eval(args[a].function);
            if (args[a].timer !== undefined && args[a].timer !== null) {
              window.setTimeout(function () {
                generator.listener.kill({event: args[a].event, element: args[a].element});
              }, args[a].timer);
            }
          });
        }
      } else {
        $(args.element).on(args.event, function () {
          eval(args.function);
        });
        if (args.timer !== undefined && args.timer !== null) {
          window.setTimeout(function () {
            generator.listener.kill({event: args.event, element: args.element});
          }, args.timer);
        }
      }
    }
  },
  kill: function (args) {
    if (typeof args === 'object') {
      if (Array.isArray(args) === true) {
        for (let a in args) {
          if (args[a].timer !== undefined && args[a].timer !== null) {
            window.setTimeout(function () {
              $(args[a].element).off(args[a].event);
            }, args[a].timer);
          } else {
            $(args[a].element).off(args[a].event);
          }
        }
      } else {
        if (args.timer !== undefined && args.timer !== null) {
          window.setTimeout(function () {
            $(args.element).off(args.event);
            console.warn(args.event + ' event killed');
          }, args.timer);
        } else {
          $(args.element).off(args.event);
          console.warn(args.event + ' event killed');
        }
      }
    }
  }
};