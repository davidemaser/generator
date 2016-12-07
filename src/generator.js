/**
 * Created by David Maser.
 */
var generator = {
    dom : document,
    accept : ['button','div','section','ul','li','nav','form','radio','checkbox','footer','header'],
    build:function(obj){
        function testParentType(s){
            if(s.indexOf('.')>-1){
                return 'c'; // c for class
            }else if(s.indexOf('#')>-1){
                return 'i'; // i for ID
            }else{
                return 't'; // t for tag
            }
        }
        if(typeof obj == 'object') {
            var _core = obj.core;
            for (var i in _core) {
                var _valid = generator.accept.includes(_core[i].type);
                var _structure = generator.dom.createElement(_core[i].type);
                _structure.innerHTML = _core[i].content;
                _structure.className = _core[i].class !== '' && _core[i].class !== undefined ? _core[i].class : null;
                _structure.id = _core[i].id !== '' && _core[i].id !== undefined ? _core[i].id : null;
                _structure.disabled = _core[i].disabled !== '' && _core[i].disabled !== undefined && _core[i].disabled == true ? true : null;
                if (_core[i].attributes !== '' && _core[i].attributes !== undefined && typeof _core[i].attributes == 'object') {
                    Object.keys(_core[i].attributes).forEach(function (key) {
                        if (_core[i].attributes[key] !== '' && _core[i].attributes[key] !== undefined) {
                            _structure.setAttribute(key, _core[i].attributes[key]);
                        }
                    })
                }
                if (_core[i].style !== '' && _core[i].style !== undefined && typeof _core[i].style == 'object') {
                    var _styleString = '';
                    Object.keys(_core[i].style).forEach(function (key) {
                        if (_core[i].style !== '' && _core[i].style !== undefined) {
                            _styleString += key + ':' + _core[i].style[key]+';';
                        }
                    });
                    _structure.setAttribute("style", _styleString);
                }
                Object.keys(_core[i].events).forEach(function (key) {
                    _structure.addEventListener(key, function () {
                        eval(_core[i].events[key])
                    })
                });
                if(_valid == true){
                    switch (testParentType(_core[i].parent)) {
                        case 'c':
                            generator.dom.getElementsByClassName(_core[i].parent).appendChild(_structure);
                            break;
                        case 'i':
                            generator.dom.getElementById(_core[i].parent).appendChild(_structure);
                            break;
                        case 't':
                            generator.dom.getElementsByTagName(_core[i].parent)[0].appendChild(_structure);
                            break;
                    }
                }
            }
        }
    },
    init:function(src) {
        if(src == 'object'){
            generator.build(src)
        }else{
            var data = new XMLHttpRequest();
            data.overrideMimeType("application/json");
            data.open('GET', src, true); // Replace 'my_data' with the path to your file
            data.onreadystatechange = function () {
                if (data.readyState == 4 && data.status == 200) {
                    generator.build(JSON.parse(data.responseText));
               }
            };
            data.send(null);

        }
    }
};
new generator.init('data/demo.json'); // method using external JSON
/*new generator.build(
{
    "core": [{
    "type": "button",
    "class":"boo",
    "id":"casas",
    "disabled":false,
    "attributes":{
        "data-href":"",
        "data-prop":""
    },
    "content":"Click Me",
    "style":{
        "background":"#fff",
        "border-right":"1px solid #000"
    },
    "events":{
        "click":"console.log('this')"
    },
    "parent":"body"
},{
        "type": "button",
        "class":"boo",
        "id":"casas",
        "disabled":false,
        "attributes":{
            "data-href":"",
            "data-prop":""
        },
        "content":"Don't Click Me",
        "style":{
            "background":"#fff",
            "border-right":"1px solid #000"
        },
        "events":{
            "click":"console.log('sdfsdfsdf')"
        },
        "parent":"body"
    }]
});*/