$('#btn-signUp').on('click',function (e) {
    e.preventDefault();
    let email = $('#signupEmail').val().trim();
    let role = $('#role').val();
    let password = $('#signupPassword').val().trim();
    let confirmPassword = $('#confirmPassword').val().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    $('.error-message').remove();
    let isValid = validation(email,role,password,confirmPassword,emailRegex);
    if (isValid){
        $('#btn-signUp').prop('disabled',!isValid);
    }else {
        $('#btn-signUp').prop('disabled',isValid);
    }
})

function validation(email,role,password,confirmPassword,emailRegex){
    let isValid = true;

    // Validate email
    if (!email) {
        $('#signupEmail').after('<div class="error-message" style="color: red;">Email is required.</div>');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        $('#signupEmail').after('<div class="error-message" style="color: red;">Please enter a valid email address.</div>');
        isValid = false;
    }

    // Validate role
    if (!role) {
        $('#role').after('<div class="error-message" style="color: red;">Role is required.</div>');
        isValid = false;
    }

    // Validate password
    if (!password) {
        $('#signupPassword').after('<div class="error-message" style="color: red;">Password is required.</div>');
        isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
        $('#confirmPassword').after('<div class="error-message" style="color: red;">Please confirm your password.</div>');
        isValid = false;
    } else if (password !== confirmPassword) {
        $('#confirmPassword').after('<div class="error-message" style="color: red;">Passwords do not match.</div>');
        isValid = false;
    }
   return isValid;
}