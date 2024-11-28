$(document).ready(function () {
    // Forgot Password click event
    $('.forgot-password').on('click', function (e) {
        e.preventDefault();

        // Hide and slide the login form out
        $('#loginForm').animate({ left: '-120%' }, 400, function () {
            $(this).hide();

            // Add and slide in the forgot password form
            const forgotPasswordHTML = `
                <div id="forgotPassword" class="position-absolute" style="background-color: #1e1e1e; width: 80%; top: 25%; left: 100%;">
                    <div id="wrapper" class="mt-3 m-5">
                        <form>
                            <div class="text-center mb-3">
                                <label class="fw-bold fs-4 text-white">Forget Password</label>
                                <hr class="mt-2 mb-4" style="width: 100%; margin: 0 auto; border: 1px solid #ccc;">
                            </div>
                            <div class="mb-3">
                                <label for="forgotEmail" class="form-label font-size-md text-white">Email</label>
                                <input type="email" class="form-control font-size-md" id="forgotEmail" placeholder="example@gmail.com">
                            </div>
                            <div class="d-flex justify-content-between gap-2">
                                <button id="btn-resetPassword" type="submit" class="btn btn-success w-50">Reset Password</button>
                                <button id="btn-backToSignIn" type="button" class="btn btn-secondary w-50">Back to Sign In</button>
                            </div>
                        </form>
                    </div> 
                    <!-- Step Indicator (Dots) -->
                    <div id="stepIndicator" class="text-center mt-4">
                        <span class="dot active" id="dot1"></span>
                        <span class="dot" id="dot2"></span>
                        <span class="dot" id="dot3"></span>
                    </div>       
                </div>
            `;

            // Append forgot password form and animate its entry
            $('.login-panel').append(forgotPasswordHTML);
            $('#forgotPassword').css({ left: '100%' }).animate({ left: '12%' }, 400);
        });
    });

    // Back to Sign In click event
    $(document).on('click', '#btn-backToSignIn', function () {
        // Hide and slide out the forgot password form
        $('#forgotPassword').animate({ left: '150%' }, 400, function () {
            $(this).remove();

            // Show and slide in the login form
            $('#loginForm').show().animate({ left: '0' }, 400);
        });
    });
});
