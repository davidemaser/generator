/**
 * Created by David Maser on 14/06/2017.
 */
import {init} from './src/components/Init';
import {template} from './src/components/Template';
export default template;
new init.core('../data/demo.json', false, [{plugin: 'translator', params: ['fr_FR', 1000]}]);