/**
 * Created by David Maser on 14/06/2017.
 */
export const template = {
  form: {
    button: "<button {{core.id}} {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}} {{gen.style}}>{{object.parent.content}}</button>",
    checkbox: "<label for=\"{{object.parent.id}}\"><input {{core.id}} type=\"checkbox\" {{gen.id}} {{gen.type}} {{core.class}} {{object.parent.disabled}} {{core.attributes}}>{{object.parent.content}}</label>",
    radiobutton: "<input type=\"radiobutton\" {{gen.id}} {{core.class}} {{core.attributes}}>",
    input: "<input type=\"text\" {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}} />",
    textarea: "<textarea {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}>{{object.parent.content}}</textarea>",
    select: {
      parent: "<select {{gen.id}} {{gen.type}} {{core.class}} {{object.parent.disabled}} {{core.attributes}} {{gen.style}}>{{@inject:[%each.child%]}}</select>",
      child: "<option {{gen.id}} {{gen.type}} {{core.value}} {{core.class}}>{{object.child.content}}</option>"

    }
  },
  layout: {
    header: "<header {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}>{{@include:layout.nav}}</header>",
    footer: "<footer {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}></footer>",
    nav: "<nav {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}}></nav>",
    list: {
      parent: "<ul {{gen.id}} {{gen.type}} {{core.class}} {{core.attributes}} {{gen.style}}>{{@inject:[%each.child%]}}</ul>",
      child: "<li {{gen.id}} {{gen.type}} {{core.class}}>{{object.child.content}}</li>"

    }
  }
};