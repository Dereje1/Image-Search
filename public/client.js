// client-side js
// run by the browser each time your view template is loaded
$('#urlSubmitForm').submit(function (e) {
        e.preventDefault();
        let fullInput = (!$("#usr").val()) ? $("#usr").attr('placeholder').split(",") : $("#usr").val().split(",")
        let query = fullInput[0]
        let offset = fullInput.length > 1 && (!isNaN(parseInt(fullInput[1]))) ? "?offset=" + fullInput[1] : "?offset=1"
        let apiLink = window.location.href+"images/"+query+offset
        let win = window.open(apiLink, '_blank');
        win.focus();
});
