/**
 * Created by David Maser on 14/12/16.
 */
var parser = {
        id : 'parser',
        config:{
            cache:'local'
        },
        setup:function(args){
            /*
             load arguments and params into the config
             object before calling the init function
             */
            $.when(this).done(function(){
                parser.init();
            });
        },
        init:function(){
            /*
             the configuration is all set up so we can start
             doing the actual core of this function
             */
        }
} || {};