/**
 * Created by David Maser on 15/06/2017.
 */
export const index ={
  tempData:{},
  init:function(id){
    /*
     function builds an index of all generator objects on the page
     */
    $.each($('[generator-id]'),function(){
      this.tempData[$(this).attr('generator-id')] = $(this).attr('generator-type');
    });
  }
};