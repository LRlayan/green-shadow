$('#btn-signIn').on('click',async function (e) {
    e.preventDefault();
    const signInUserDTO = {
        email : $('#email').val(),
        password : $('#password').val()
    }
    const data = JSON.stringify(signInUserDTO);
    $.ajax({
        url: "http://localhost:5050/api/v1/auth/signIn",
        type: "POST",
        contentType:"application/json",
        data: data,
        success: async function(response) {
            await localStorage.removeItem('jwtKey')
            await localStorage.setItem('jwtKey', response.token)
            loadComponent();
        },
        error: function(xhr, status, error) {
            console.error("Error: " + error);
            Swal.fire("Data Fetch Error");
            console.error("Response:", xhr.responseText);
        }
    });
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
