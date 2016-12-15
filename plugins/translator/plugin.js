/**
 * Created by David Maser on 14/12/16.
 */
var translator = {
    id : 'translator',
    config:{
        cache:'local'
    },
    handle:'',
    words:{},
    tempKey : '',
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
        $.when(translator.loadLibrary()).done(function(){
            translator.swapWords();
        })
    },
    loadLibrary:function(lang){
        var _lang = lang || translator.config.params[0];
        var _urlString = translator.config.root+_lang+'/language.json';
        translator.handle = _lang;
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
    },
    getTranslationFromLibrary:function(word,lang){
        var _library = translator.words[lang];
        function cycleLibrary(){
            $.each(translator.words[lang],function(key,value){
                var _searchWord = key.toLowerCase();
                if(_searchWord == word){
                    translator.tempKey =  _library[key];
                }
            })
        }
        $.when(cycleLibrary()).done(function(){
            return false;
        })
    },
    swapWords:function(){
        var _targetClass = translator.config.observe;
        $('.'+_targetClass).each(function(){
            var _activeObject = $(this);
            var _currentWord = $(this).html().toLowerCase();
            $.when(translator.getTranslationFromLibrary(_currentWord,translator.handle)).done(function(){
                translator.tempKey !== undefined ? $(_activeObject).html(translator.tempKey) : '';
            });
        });
    }
} || {};