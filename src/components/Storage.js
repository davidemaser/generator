/**
 * Created by David Maser on 15/06/2017.
 */
import {config} from './Config';
export const storage = {
  /*
   args format
   {
   id:'', //required
   index:'',
   data:'json',
   prefix:true, //required
   parse:false
   }
   */
  supported: function () {
    return typeof(Storage) !== 'undefined';
  },
  load: function (args) {
    if (this.supported() === true) {
      let _lsItem = args.prefix === true ? config.storage.prefix + args.id : args.id;
      return localStorage.getItem(_lsItem);
    }
  },
  save: function (args) {
    if (this.supported() === true) {
      let _lsItem = args.prefix === true ? config.storage.prefix + args.id : args.id;
      localStorage.setItem(_lsItem, args.data);
    }
  },
  purge: function (args) {
    if (this.supported() === true) {
      let _lsItem = args.prefix === true ? config.storage.prefix + args.id : args.id;
      localStorage.removeItem(_lsItem);
    }
  }
}