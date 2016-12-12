# GENERATOR

Generator is a templating engine built with jQuery that adopts a flexible approach to template based web components. The script can build an entire page structure from a JSON file or build specific components "a la carte". It is fully extendable, so new templates can be injected on the fly or added to the code itself. 

###Use

Assuming you are using jQuery, add the script to your page (in the head if you are building the core structure of your page or before the closing body tag if you are using it to generate components)

```<script src="src/generator.js"></script>```

You can initialize the script with generator.init(). If you do so, remove the initialization call at the bottom of the main script. 

###Templates

The core function has a few built in templates to play around with. These can be found in the generator.template object. See below for a list of parameters used by generator. 

###Extending templates

You can extend the existing templates by injecting a template object on the fly or by loading them from an external JSON file. Generator has an 'extend' function that injects user built templates into the core object, allowing these new templates to be used by the function. Extensions can be bypassed by passing a boolean in the generator.init call (i.e : ```generator.init:function(src,false)```)

Extensions use the following schema. Generator uses two sorts of templates; direct code and nested. The difference between the two is the presence of child nodes. Take for example a button and a list. A button has no inherent child nodes whereas a list is comprised of a ul or ol tag and one or many li tags. A list is a nested template object. Nested template objects can call their child into a specific position of their code (see example below)

Example Code :

```
select:{
    parent:"<select {{gen.id}} {{gen.type}} {{core.class}} {{object.parent.disabled}} {{core.attributes}} {{gen.style}}>{{@inject:[%each.child%]}</select>",
    child : "<option {{gen.id}} {{gen.type}} {{core.value}}>{{object.child.content}}</option>"
}
```
In the example above, the parent UL tag has it's own core and generator parameters and also an ```@inject``` tag. This inject tag places the child or children into that position. 

###Generator Markup Tags

-> Double braces

These tags (from hereon in we'll call them generator tags) are the building blocks of generator template tags. They are essentially placeholders for inline elements such as class, id, attributes, styles, values, etc... Not all template objects inherit the same template tags. Below is a list of currently supported generator tags.

- gen.id [string-generated]: builds a unique id for EACH generator object
- gen.type [string-generated] : displays the generator object type (useful for styling and scripted animations)
- gen.styles [object-array-user] : allows inline style to be injected into the html object
- core.class [string-user] : allows you to pass a class to the html object. To add multiple classes to an object, format as you would in html (i.e foo bar class)
- core.id [string-user]: allows you to pass a unique ID to the html object
- core.attributes [object-array-user] : allows you to pass attributes in the html object
- object.parent.content [string-user] : injects content (as html) from the parent attribute of a nested template into the tag
- object.child.content [object-array-user] : injects content (as html) from the child attribute(s) of a nested template into the tag

-> Directives

Directives let you pass instructions to the code, telling it what to do in a specific context or with other code. Directives all start with @ (at symbol)

- include : like it's name implies, it 'includes' code from another template object or it's child. The include directive does not iterate so it is not adapted to arrays or objects. For this, use inject. Include requires one parameter which is the name of the template object (i.e. include:form.select)
- inject : this directive injects a snippet of code into the template object. It is different from the include directive as the code it injects will be evaluated and parsed. 
- remove : the remove directive will remove specific content from the template. This allows you to prototype template objects. In the directive, wrap strings in quotations or they will be treated as an object (i.e. remove:"<p>Foo</p>" will perform a string replace on all matching content. remove:<p> will remove all paragraph tags)

-> Iterative directives

Iterative directives tell the inject function what to do with multiple instances of an object. A template itself can have a parent and a child. It can not (in the code) have multiple children but when the data is parsed, each child node will be iterated and injected into place. Iterative directives are wrapped with square brackets and a the percent symbol

- each : iterates through each object that has the same identifier. If a template object has an array called URL, we can collect all array items with [%each:URL%]
- each.child : iterates through each child of the parent object. Works only on nested template objects. 
- first : returns the first item in an array (i.e. [%first.URL%])
- last : returns the last item in an array (i.e. [%last.URL%])
- nth(1) : returns the nth (numeric 0 based) item in an array (i.e. [%nth(4).URL%])
- unique : returns only unique items in an array on a first come first served basis. 
- unique.child : a mix of the each.child directive and the unique directive

###Author and License 

Generator is built and maintained by David Maser under GNU GENERAL PUBLIC LICENSE.