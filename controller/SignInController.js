
$('#btn-signIn').on('click',async function (e) {
    e.preventDefault();

    const signInUserDTO = {
        email : $('#email').val(),
        password : $('#password').val()
    }
    console.log(signInUserDTO.email)
    console.log(signInUserDTO.password)
    try{
        await $.ajax({
           url: "http://localhost:5050//api/v1/auth/signIn",
           type: "POST",
           contentType: "application/json",
           data: JSON.stringify(signInUserDTO),
        });
        loadComponent();
        Swal.fire("Login", "", "success");
    }catch (xhr){
        console.error("Failed to SignIn:", xhr);
        if (xhr.status === 400) {
            Swal.fire("Error", "Failed to SignIn: Bad request", "error");
        } else {
            Swal.fire("Error", "Failed to SignIn: Server error", "error");
        }
    }
});

$("#togglePassword").on("click", function () {
    const passwordField = $("#password");
    const icon = $(this).find("i");

    if (passwordField.attr("type") === "password") {
        passwordField.attr("type", "text");
        icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        passwordField.attr("type", "password");
        icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
});

function loadComponent() {
    $('#sections-wrapper').css({display:'block'});
    $('#header-sec').css({display: 'block'});
    $('#dashboard-sec').css({display:'block'});
    $('#signInAndSignUp-sec').css({display: 'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
}
