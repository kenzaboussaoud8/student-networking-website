new WOW().init();

$(document).ready(function() {


    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $('.avatar').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $('#action_menu_btn').click(function() {
        $('.action_menu').toggle();
    });



    $(".file-upload").on('change', function() {
        readURL(this);
    });
});

$(document).ready(function() {

});