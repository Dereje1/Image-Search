// client-side js
// run by the browser each time your view template is loaded
$('#urlSubmitForm').submit(function (e) {
        e.preventDefault();
        //use place holdr if no val
        let fullInput = (!$("#usr").val()) ? $("#usr").attr('placeholder').split(",") : $("#usr").val().split(",")
        let query = fullInput[0]
        //assign default ofset if none given
        let offset = fullInput.length > 1 && (!isNaN(parseInt(fullInput[1]))) ? "?offset=" + fullInput[1] : "?offset=1"
        //open query in new tab
        let apiLink = window.location.href+"images/"+query+offset
        let win = window.open(apiLink, '_blank');
        win.focus();
});
