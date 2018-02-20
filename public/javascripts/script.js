$("#theForm").submit(function(e) {
    e.preventDefault();
    if(!validateField()) return;
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
                 fetchRecent();
               }else{
                 $('.submit-btn').val('Submit').removeAttr('disabled');
                 alert(data.message);
               }
           }
         });

});

$(document).ready(function() {

    $(".clipboard").tooltip({
      trigger: 'click',
      placement: 'bottom'
    });

    function setTooltip(message) {
      $(".clipboard").tooltip('hide')
        .attr('data-original-title', message)
        .tooltip('show');
    }

    function hideTooltip() {
      setTimeout(function() {
        $(".clipboard").tooltip('hide');
      }, 1000);
    }

    // Clipboard

    var clipboard = new Clipboard(".clipboard");

    clipboard.on('success', function(e) {
      copyToClipboard('.url');
      setTooltip('Copied!');
      hideTooltip();
    });

    clipboard.on('error', function(e) {
      setTooltip('Failed!');
      hideTooltip();
    });

    fetchRecent();

});


var fetchRecent = function() {
  $.ajax({
         type: "GET",
         url: '/stream/recent',
         success: function(data)
         {
            $('.table-body').html('');
             for (var i = 0; i < data.message.length; i++) {
               $('.table-body').append('<tr><td><p>'+data.message[i].remote_url+'</p></td><td><p>'+data.message[i].local_url+'</p></td></tr>');
             }
         }
       });
}



function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

function validateField() {
    var x = document.forms["theForm"]["hlsurl"].value;
    console.log(x);
    if (x == "") {
        alert("HLS url field is required");
        return false;
    }
    return true;
}
