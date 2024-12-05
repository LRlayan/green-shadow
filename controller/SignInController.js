import {LoadAllSectionData} from "./IndexController.js"

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
            $('#signIn-form')[0].reset();
            loadComponent();
        },
        error: function(xhr, status, error) {
           if (xhr.status === 500){
               Swal.fire({
                   icon: "error",
                   title: "Oops...",
                   text: "Server Error!",
                   // footer: '<a href="#">Why do I have this issue?</a>'
               });
           }else if (xhr.status === 201 || xhr.status === 200){
               Swal.fire({
                   position: "start-bottom",
                   icon: "success",
                   title: "success signIn",
                   showConfirmButton: false,
                   timer: 1500
               });
           }else if (xhr.status === 403){
               Swal.fire({
                   icon: "error",
                   title: "Oops...",
                   text: "Bag Request.Check your email and password!",
                   // footer: '<a href="#">Why do I have this issue?</a>'
               });
           }
        }
    });
    const loadAllData = new LoadAllSectionData();
    loadAllData.loadAllSectionData();
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
