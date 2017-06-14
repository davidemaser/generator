/**
 * Created by David Maser on 14/06/2017.
 */
export const config = {
  ajax:{
    limit:25,
      timeout:5000,
  default:'GET',
      callback:null
  },
  extensions: {
    src: {
      root: 'data/extensions/index.json',
        exists: false
    },
    enable: true
  },
  helpers: {
    scope: 'global',
      extend: false
  },
  scripts: {
    root: 'lib/src/',
      extension: {
      format: 'js',
        append: true
    },
    onload: false,
      cache: true
  },
  storage: {
    allow: true,
      type: 'local',
      persist: true,
      flush: 'function',
      prefix:'GEN-'
  }
}