# GENERATOR

Generator is a templating framework engine built with jQuery that adopts a flexible approach to template based web components and data drive web elements. The script can build an entire page structure from a JSON file or build specific components "a la carte". Generator can attach external scripts to specific template objects and load them when and if they are needed. The script is fully extendable, so new templates can be injected on the fly or added to the code itself. Generator can also be extended by creating plugins that are loaded into the core at runtime. 

###Use

Assuming you are using jQuery, add the script to your page (in the head if you are building the core structure of your page or before the closing body tag if you are using it to generate components)

```<script src="src/generator.min.js"></script>```

If you'd like to use a packaged version of generator that includes the latest jQuery library, use:

```<script src="src/generator_package.js"></script>```

The non minified, non packaged version of the script is in the src folder of the project. 

You can initialize the script with generator.init.core(). If you do so, remove the initialization call at the bottom of the main script. 

#####Grunt

This project uses Grunt to minify (uglify) and concatenate the package file. There is also a jshint task and a watcher task that runs when grunt is launched. 

If you don't have Node.js installed : https://nodejs.org/en/

- Get Grunt : ```$npm install grunt```
- Get Grunt CLI (optional) : ```$npm install grunt-cli```
- Install required dependencies : ```$npm install```
- Launch Grunt : ```$grunt``` or ```$grunt --force``` to skip failed tasks. 

###Templates

The core function has a few built in templates to play around with. These can be found in the generator.template object. See below for a list of parameters used by generator. 

#####Attaching Events

Each template object can have events attached to it. The events are bound to the objects unique generator id that is created when generator executes. Events are passed to the script as an object and when the template object is created, each event will be attached to that object and the handler registered. Events use the '$.on' directive. To add custom events to a template object after it is loaded, you can call it by it's ID or generator ID ```$(THE_ID).event(function(){})```. Events are unregistered when the template object is removed from the DOM. You can use the helper function destroyEventHandlers() to removed attached events ```generator.helpers.destroyEventHandlers('[generator-id="object-1"]','click')```

#####Assigning Parents

Each template object can be assigned a parent object. Defining a parent will append the template object to the parent and inherit all styles and events from the parent. If no parent is assigned, the template object will be appended to the document body. If a parent is removed from the DOM tree, all it's children will be removed as well. You can call the switchParent() helper function to assign a child a new parent before removing that parent. ```generator.helpers.switchParent('item_to_move','new_parent')```

#####Assigning Children

DOM elements or template objects can be assigned children. These children can inherit the parent's attributes all while residing outside of the parent. The child does not have to be within the parent's node tree (although the function allows you to append or prepend the child to the parent). This is very useful when creating trigger items on a page or for delegating activity. You can call the adoptChidren helper function. ```generator.helpers.adoptChidren('parent',['child1','child2','child2'])```

###Extending templates

You can extend the existing templates by injecting a template object on the fly or by loading them from an external JSON file. Generator has an 'extend' function that injects user built templates into the core object, allowing these new templates to be used by the function. Extensions can be bypassed by passing a boolean in the generator.init call (i.e : ```generator.init.core(src,false)```)

Extensions use the following schema. Generator uses two sorts of templates; direct code and nested. The difference between the two is the presence of child nodes. Take for example a button and a list. A button has no inherent child nodes whereas a list is comprised of a ul or ol tag and one or many li tags. A list is a nested template object. Nested template objects can call their child into a specific position of their code (see example below)

Example Code :

```
select:{
    parent:"<select {{gen.id}} {{gen.type}} {{core.class}} {{object.parent.disabled}} {{core.attributes}} {{gen.style}}>{{@inject:[%each.child%]}}</select>",
    child : "<option {{gen.id}} {{gen.type}} {{core.value}}>{{object.child.content}}</option>"
}
```
In the example above, the parent UL tag has it's own core and generator parameters and also an ```@inject``` tag. This inject tag places the child or children into that position. 

###Generator Markup Tags

-> Double braces

These tags (hereon in referred to as generator tags) are the building blocks of generator template tags. They are essentially placeholders for inline elements such as class, id, attributes, styles, values, etc... Not all template objects inherit the same template tags. Below is a list of currently supported generator tags.

- gen.id [string-generated]: builds a unique id for EACH generator object
- gen.type [string-generated] : displays the generator object type (useful for styling and scripted animations)
- gen.styles [object-array-user] : allows inline style to be injected into the html object
- gen.button [string-user] : used by the dialog.modal and dialog.confirm functions, this is a placeholder for button html. 
- core.class [string-user] : allows you to pass a class to the html object. To add multiple classes to an object, format as you would in html (i.e foo bar class)
- core.id [string-user]: allows you to pass a unique ID to the html object
- core.attributes [object-array-user] : allows you to pass attributes in the html object
- object.parent.content [string-user] : injects content (as html) from the parent attribute of a nested template into the tag
- object.child.content [object-array-user] : injects content (as html) from the child attribute(s) of a nested template into the tag
- modal [string-user] : placeholder used by the dialog.modal function.
- confirm [string-user] : placeholder used by the dialog.confirm function.

-> Directives

Directives let you pass instructions to the code, telling it what to do in a specific context or with other code. Directives all start with @ (at symbol)

- include : like it's name implies, it 'includes' code from another template object or it's child. The include directive does not iterate so it is not adapted to arrays or objects. For this, use inject. Include requires one parameter which is the name of the template object (i.e. include:form.select)
- inject : this directive injects a snippet of code into the template object. It is different from the include directive as the code it injects will be evaluated and parsed. 
- remove : the remove directive will remove specific content from the template. This allows you to prototype template objects. In the directive, wrap strings in quotations or they will be treated as an object (i.e. remove:"&lt;p&gt;Foo&lt;/p&gt;" will perform a string replace on all matching content. remove:&lt;p&gt; will remove all paragraph tags)

-> Iterative directives

Iterative directives tell the inject function what to do with multiple instances of an object. A template itself can have a parent and a child. It can not (in the code) have multiple children but when the data is parsed, each child node will be iterated and injected into place. Iterative directives are wrapped with square brackets and a the percent symbol

- each : iterates through each object that has the same identifier. If a template object has an array called URL, we can collect all array items with [%each:URL%]
- each.child : iterates through each child of the parent object. Works only on nested template objects. 
- first : returns the first item in an array (i.e. [%first.URL%])
- last : returns the last item in an array (i.e. [%last.URL%])
- nth(1) : returns the nth (numeric 0 based) item in an array (i.e. [%nth(4).URL%])
- unique : returns only unique items in an array on a first come first served basis. 
- unique.child : a mix of the each.child directive and the unique directive

-> Conditions

- if : {{if:[condition]}}{{~if}}
- else : {{else}}
- elsif : {{elsif:[condition]}}
- unless : {{unless:[condition]}}{{~unless}}
- except : {{except:[condition]}}

-> JSON Data

- ajax : places an ajax call to collect JSON data from a specified source, object and node. If no output is defined, data will be stocked in the ajax.dataHolder object. [@ajax:{src=assets/file,root=object_root,node=node_name}]. Ajax functions can be added to other iterative directives (i.e. {{@inject:[%each.child%],ajax:[{src='assets/file',root='object_root',node='node_name'}]}}). When this markup is detected in your code, the ajax.process.content function is executed and the returned string or object is output. If an iterative directive is detected and the returned object is an array, each array item will be output.

###Plugins

Plugins can be scripted as separate JavaScript modules and imported into generator before the core function loads. This allows the user to apply filters or transformations to template objects without modifying the core object. Plugins can be loaded during initialization by calling the generator.init parameter. The parameter syntax allows the user to specify which plugin to load and pass parameters to the plugin. Two parameters are used: the plugin name (and unique identifier) and an array of parameters to pass to the plugin. The syntax is as follows :

```{plugin:'plugin_name',params:['string',numeric,{object:'value'}]}```

If you want to load multiple plugins at once, wrap them in an array [{}].

To include a plugin, add it to the generator.plugin array with all core parameters. Core parameters will be passed when the plugin is initialized. Refer to the following syntax.

```
plugin_name:{
	activate:true,
	root:'path_to_the_plugin_folder,
	format:'file_format'
}
```

Among the parameters listed in the code snippet above, only activate (boolean) is required. If no root is defined, the default path will be used (plugins/plugin_name/). The format parameter allows you to define what file format is expected by the function. 

Plugins all reside under the plugins/ folder in the project root. The folder must be the same name as the plugin itself (i.e. for a plugin named 'material', you should see a folder named material/). NOTE : All plugins use the same file name plugin.js

#####Writing plugins

To get started, create a folder under the plugins/ folder with the name of your plugin. In this folder, all you will need is a plugin.js file. This file will contain all the functions and methods of your plugin. The plugin code must follow the following syntax rules.

```
var plugin_name = {
    id : 'plugin_name',
    config:{},
    setup:function(args){},
    init:function(){}
}
```

You can add any other function within the core object and call it with ```plugin_name.function``` or ```this.function``` or nest functions within your core functions. 

When the plugin is called by generator, the plugin.js file will be included via an ajax request. Once the file is loaded, generator will execute the setup function and pass the arguments defined by the user. All arguments and parameters will be added to the config object. Once that is done, the init function is called. All initial calls should be done in the init function. If you don't want your script to execute any functions when the plugin is loaded, leave the init function empty.

###Utility Functions

Generator has some handy utility functions that handle everything from data loading and manipulation to dialog creation to local storage manipulation. These functions allow you to add functionality to template objects using objects scripted in the core. Generator's ajax object allows you to load, parse and modify JSON data in a semantic, objected oriented format. A list of utility objects can be found below.

- ajax [generator.ajax] : loads, stores and manipulates JSON data.

Clean and parse function. Loads external JSON file and stores the data in an ajax data object. Data is parsed and unwanted elements removed. Object is returned by the function and/or stored to the ajax data object. ```generator.ajax.cleanAndParse(path:string, parse:boolean, remove:object, callback:function)``` 

- dialogs [generator.dialogs] : creates modal or confirmation dialogs. 
- storage [generator.storage] : creates, reads and removes local storage objects.
- scripts [generator.scripts] : loads external javascript files and executes user defined functions.
- errors [generator.errors] : alerts and reports errors in the core execution. 

NOTE: Utility functions are a work in progress and will continue to be extended during the lifetime of the Generator project.

#####Helpers

Helpers are core objects that execute functions to add or manipulate other generator objects.  

NOTE: Helper functions are a work in progress and will continue to be extended during the lifetime of the Generator project.

###Aliases

Some core generator functions/methods can be called using their alias. This will allow you to write less code to call a generator object. Below is a list of aliases.

- $g = ge => generator
- ajax = a => generator.ajax
- build => generator.build
- load => generator.ajax.process.load
- save => generator.ajax.process.save
- dialogs = d => generator.dialogs
- errors = e => generator.errors
- extend => generator.extend
- helpers = h => generator.helpers
- run => generator.init
- storage = s => generator.storage
- scripts => generator.scripts
- config = c => generator.config

###Author and License 

Generator is built and maintained by David Maser under GNU GENERAL PUBLIC LICENSE.
