$("#theForm").submit(function(e) {
    e.preventDefault();
    var url = `/stream?${$("#theForm").serialize()}`;
    $('.submit-btn').val('Processing..').attr('disabled','disabled');
    $( ".btn-group" ).addClass( "hidden" );
    $(".output").html(`<p class='url'></p>`);
    $.ajax({
           type: "GET",
           url: url,
           success: function(data)
           {
               if(data.success){
                 $('.submit-btn').val('Submit').removeAttr('disabled');
                 $(".output").html(`<p class='url'>${data.message}</p>`);
                 $( ".btn-group" ).removeClass( "hidden" );
               }else{
                 $('.submit-btn').val('Submit').removeAttr('disabled');
                 alert(data.message);
               }
           }
         });

});

$(document).ready(function() {
    $(".clipboard").click(function() {
        copyToClipboard('.url');
    });
});

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
