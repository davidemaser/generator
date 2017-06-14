/**
 * Created by David Maser on 14/06/2017.
 */
export const dialogs = {
  config: {
    animate: {
      activate: true,
      delay: 500
    },
    position: 'front',
    parent: 'body'
  },
  /*
   args format :
   {
   type:'modal',
   title:'string',
   message:'string',
   buttons:{
   yes:{label:'string',action:'function'},
   no:{label:'string',action:'function'},
   close:{label:'string'}
   },
   animate:false
   }
   */
  alert: function (args) {

  },
  confirm: function (args) {
    helpers.removeDomObjects(['gen_modal', 'gen_confirm']);
    let _animate = args.animate !== undefined ? args.animate : this.config.animate.activate;
    let _required = ['yes', 'no'],
      _options = [];
    if (typeof args === 'object') {
      if (args.type !== undefined && args.type === 'alert') {
        let _confirmTitle = args.title,
          _confirmMessage = args.message,
          _confirmButtons = args.buttons,
          _confirm = '<div class="gen_confirm overlay" style="opacity:0">' +
            '<div class="gen_confirm inner">' +
            '<div class="gen_confirm title">{{confirm.title}}</div>' +
            '<div class="gen_confirm message">{{confirm.message}}</div>' +
            '<div class="gen_confirm buttons">{{confirm.buttons}}</div>' +
            '</div>' +
            '</div>';
        _confirm = _confirm.replace('{{confirm.title}}', _confirmTitle).replace('{{confirm.message}}', _confirmMessage).replace('{{confirm.buttons}}', helpers.buildButtons({
          param: _confirmButtons,
          required: _required,
          options: _options
        }));
        $(this.config.parent).prepend(_confirm);
        _animate === true ? $('.gen_confirm').animate({opacity: 1}, this.config.animate.delay) : $('.gen_confirm').attr('style', '');
      }
    }
  },
  modal: function (args) {
    helpers.removeDomObjects(['gen_modal', 'gen_confirm']);
    let _animate = args.animate !== undefined ? args.animate : this.config.animate.activate;
    let _required = ['close'],
      _options = ['yes', 'no'];
    if (typeof args === 'object') {
      if (args.type !== undefined && args.type === 'modal') {
        let _modalTitle = args.title,
          _modalMessage = args.message,
          _modalButtons = args.buttons,
          _modal = '<div class="gen_modal overlay" style="opacity:0">' +
            '<div class="gen_modal inner">' +
            '<div class="gen_modal title">{{modal.title}}</div>' +
            '<div class="gen_modal message">{{modal.message}}</div>' +
            '<div class="gen_modal buttons">{{modal.buttons}}</div>' +
            '</div>' +
            '</div>';
        _modal = _modal.replace('{{modal.title}}', _modalTitle).replace('{{modal.message}}', _modalMessage).replace('{{modal.buttons}}', helpers.buildButtons({
          param: _modalButtons,
          required: _required,
          options: _options
        }));
        $(this.config.parent).prepend(_modal).on('click', 'button[data-action="close"]', function () {
          helpers.removeDomObjects('gen_modal');
        });
        _animate === true ? $('.gen_modal').animate({opacity: 1}, this.config.animate.delay) : $('.gen_modal').attr('style', '');
      }
    }
  }
};