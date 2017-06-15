/**
 * Created by David Maser on 15/06/2017.
 */
import {template} from './Template';
export let generator = {
  accept: {
    object: ['object', 'button', 'div', 'section', 'ul', 'li', 'list', 'nav', 'form', 'radio', 'select', 'checkbox', 'footer', 'header', 'textarea'],
    component: ['box', 'banner', 'gutter', 'card', 'gallery', 'hero'],
    widget: ['clock'],
    extensions: []
  },
  component: {
    banner: {
      parent: "<section {{core.id}} {{gen.id}} {{gen.type}} {{core.class}}>{{@inject:[%each.child%]}}</section>",
      child: "<div {{gen.id}} {{gen.type}} {{core.class}}>{{object.child.content}}</div>"
    },
    gutter: "",
    card: "",
    badge: ""
  },
  core: {},
  extensions: {},
  nomenclature: {
    generator: "generator-id=\"{{type}}-{{unit}}\"",
    template: "template",
    component: "component",
    widget: "widget",
    extension: "extension",
    data: "data"
  }
};