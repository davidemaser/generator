/**
 * Created by David Maser on 14/06/2017.
 */
export const plugins = [
  {
    translator: {
      activate: true,
      observe: 'tr',
      languages: ['en_EN', 'fr_FR'],
      root: 'plugins/translator/',
      format: 'json'
    }
  },
  {
    parser: {
      activate: true,
      observe: 'gsl',
      root: 'plugins/parser/',
      format: 'json'
    }
  }
  ];