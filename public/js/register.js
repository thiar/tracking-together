$(function() {
    function readImage(input) {
        if ( input.files && input.files[0] ) {
            var FR= new FileReader();
            FR.onload = function(e) {
                 $('#img').attr( "src", e.target.result );
                 
                 $('#imgData').val( e.target.result );

            };       
            FR.readAsDataURL( input.files[0] );
        }
    }

    $("#avatar").change(function(){
        readImage( this );
    })
})