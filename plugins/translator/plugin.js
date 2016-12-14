/**
 * Created by David Maser on 14/12/16.
 */
var translator = {
    id : 'translator',
    config:{
        cache:'local'
    },
    words:{},
    setup:function(args){
        /*
        load arguments and params into the config
        object before calling the init function
         */
        var _expects = ['observe','languages','root','params'];
        if(typeof args == 'object'){
            if (Array.isArray(args) == true) {
                Object.assign(args[0],args[1]);
                for (var k in args) {
                    if (args[k]['activate'] == true && args[k]['plugin'] == this.id) {
                        for (var e in args[k]) {
                            if (args[k].hasOwnProperty(e)) {
                                if ($.inArray(e, _expects) > -1) {
                                    this.config[e] = args[k][e];
                                }
                            }
                        }
                    }
                }
            }
        }
        $.when(this).done(function(){
            translator.init();
        });
    },
    init:function(){
        /*
        the configuration is all set up so we can start
        doing the actual core of this function
         */
        translator.loadLibrary();
    },
    loadLibrary:function(lang){
        var _lang = lang || translator.config.params[0];
        var _urlString = translator.config.root+_lang+'/language.json';
        function saveWords(words){
            var _tempObject = {};
           $.each(words,function(key,value){
               _tempObject[key] = value;
           });
            translator.words[_lang] = _tempObject;
        }
        $.ajax({
            url:_urlString,
            success:function(data){
                saveWords(data.w);
            },error:function(){
                console.log('Language library does not exist. Make sure '+_lang+'/language.json exists in the plugin root.');
            }
        });
    }
} || {};