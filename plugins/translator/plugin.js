/**
 * Created by David Maser on 14/12/16.
 */
var translator = {
    config:{},
    init:function(args){
        var _expects = ['observe','languages','root'];
        if(typeof args == 'object'){
            if(args['activate'] == true) {
                for (var e in args) {
                    if (args.hasOwnProperty(e)) {
                        if($.inArray(e,_expects) > -1){
                            this.config[e] = args[e];
                        }
                    }
                }
            }
        }
    }
} || {};