/**
 * Created by David Maser on 14/12/16.
 *
 * This script's main purpose is to layout
 * GSL format pages in a standard html format
 * after parsing directives and instructions
 * See page.gsl for more information about the
 * markup and semantics
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
        },
        getGslTags:function(){
            $(Array.prototype.slice.call(document.all)).filter(function () {
                return /^gsl-/i.test(this.nodeName);
            }).each(function(){
                var _node = this.nodeName.toLowerCase();
                var _type = _node.split('-')[1];
                console.log(_type);
            });
        }
} || {};