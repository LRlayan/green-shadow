$('#header-sec').css({display:'none'});

$('#btn-signIn').on('click',function (){
    $('#header-sec').css({display: 'block'})
    $('#signInAndSignUp-sec').css({display: 'none'})
});

$('#btn-logout').on('click',function (){
    $('#header-sec').css({display:'none'})
    $('#signInAndSignUp-sec').css({display:'block'})
});