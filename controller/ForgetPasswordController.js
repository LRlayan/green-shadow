$(document).ready(function () {
    let otp = null;
    // Forgot Password click event
    $('.forgot-password').on('click', function (e) {
        e.preventDefault();
        moveToForgetPasswordPage();
    });

    // Reset Password click event (transition to OTP page)
    $(document).on('click', '#btn-resetPassword', async function (e) {
        e.preventDefault();
        otp = await getOTP();
        if (otp!=null){
            const userWithKeyDTO = {
                email : $('#forgotEmail').val(),
                code : otp
            }
            const response = sendEmailWithOTP(userWithKeyDTO);
            if (response){
                await Swal.fire({
                    position: "bottom-start",
                    icon: "success",
                    title: "Please check your email.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }else {
                await Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please Try Again!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        }else {
            await Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "resend OTP Code!",
                // footer: '<a href="#">Why do I have this issue?</a>'
            });
        }
        moveToOTPPage();
    });

    // Back to Forgot Password click event (transition back to forgot password page)
    $(document).on('click', '#btn-backToForgotPassword', function () {
        btnBackToForgetPassword();
    });

    // Back to Sign In click event
    $(document).on('click', '#btn-backToSignIn', async function () {
        backToSignIn();
    });

    $(document).on('click', '#dot2', function () {
        moveToOTPPage();
    });

    $(document).on('click', '#dot1', function () {
        btnBackToForgetPassword();
    });
    $(document).on('click', '#dot3', function () {
        moveToChangePasswordPage();
    });

    $(document).on('click', '#btn-verifyOtp', async function (e) {
        e.preventDefault();
        let otpInput = await $('#otp1').val()+$('#otp2').val()+$('#otp3').val()+$('#otp4').val()
        if (otpInput === otp){
            $('#OTP-error').remove();
            moveToChangePasswordPage();
        }else {
            $('#OTP-error').append(`<label style="color: red">Please Valid OTP-Code</label>`)
        }
    });
});

async function sendEmailWithOTP(userWithKeyDTO){
    return new Promise(async (resolve, reject) => {
        try {
            await $.ajax({
                url: "http://localhost:5050/api/v1/auth/sendCode",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(userWithKeyDTO),
                success: function (OTPCode) {
                    console.log("Success Send OTP",OTPCode)
                },
                error: function (xhr, status, error) {
                    alert("Failed to retrieve OTP Code");
                    reject(error);
                }
            });

        } catch (xhr) {
            console.error("Failed to save vehicle:", xhr);
            if (xhr.status === 400) {
                Swal.fire("Error", "Failed to send email: Bad request", "error");
            } else {
                Swal.fire("Error", "Failed to send email: Server error", "error");
            }
        }
    });
}

async function getOTP() {
    try {
        return new Promise(async (resolve, reject) => {
            await $.ajax({
                url: "http://localhost:5050/api/v1/auth/getOTP",
                type: "GET",
                contentType: "application/json",
                success: function (OTPCode) {
                    resolve(OTPCode);
                },
                error: function (xhr, status, error) {
                    alert("Failed to retrieve OTP Code");
                    reject(error);
                }
            });
        });
    } catch (xhr) {
        console.error("Failed to save vehicle:", xhr);
        if (xhr.status === 400) {
            Swal.fire("Error", "Failed to save vehicle: Bad request", "error");
        } else {
            Swal.fire("Error", "Failed to save vehicle: Server error", "error");
        }
    }
}

function moveToChangePasswordPage() {
    // Slide out the OTP page to the left
    $('#otpWrapper').animate({ left: '-100%' }, 400, 'linear', function () {
        $(this).remove(); // Remove the OTP page after animation

        // Add the "Change Password" page content inside the #wrapper
        const changePasswordHTML = `
            <div id="changePasswordWrapper" class="mt-3 mx-2 m-5">
                <form>
                    <div class="text-center mb-3">
                        <label class="fw-bold fs-4 text-white">Change Password</label>
                        <hr class="mt-2 mb-4" style="width: 100%; margin: 0 auto; border: 1px solid #ccc;">
                    </div>
                    <div class="mb-3">
                        <label for="newPassword" class="form-label font-size-md text-white">New Password</label>
                        <input type="password" class="form-control font-size-md" id="newPassword" placeholder="Enter new password">
                    </div>
                    <div class="mb-3">
                        <label for="retypePassword" class="form-label font-size-md text-white">Re-type Password</label>
                        <input type="password" class="form-control font-size-md" id="retypePassword" placeholder="Re-enter new password">
                    </div>
                    <div class="d-flex justify-content-center">
                        <button id="btn-changePassword" type="submit" class="btn btn-success w-50">Change</button>
                    </div>
                </form>
            </div>
        `;

        // Hide the children of #wrapper and append the "Change Password" content
        $('#wrapper').children().hide();
        $('#wrapper').append(changePasswordHTML);

        // Initially position the "Change Password" page outside to the right
        $('#changePasswordWrapper').css({ position: 'relative', left: '100%' });

        // Animate "Change Password" page into view
        $('#changePasswordWrapper').animate({ left: '0%' }, 400, 'linear', function () {
            // Change the active dot (if using step indicators)
            $('#dot3').addClass('active');
            $('#dot1, #dot2').removeClass('active');
        });
    });
}

function backToSignIn() {
    // Slide out the forgot password form
    $('#forgotPassword').animate({ left: '150%' }, 400, 'linear', function () {
        $(this).remove();

        // Show and slide in the login form
        $('#loginForm').show().animate({ left: '100%' }, 400, 'linear');
    });
}

function btnBackToForgetPassword() {
    // Slide out the OTP page to the left
    $('#otpWrapper,#changePasswordWrapper').animate({ right: '100%' }, 400, function () {
        $(this).remove(); // Remove OTP page after animation

        // Show and slide in the Forgot Password form
        $('#wrapper').children().show(); // Show the original forgot password content
        $('#wrapper').animate({ right: '0%' }, 400, 'linear', function() {
            // Once forgot password form is fully in, change the active dot (second dot becomes active)
            $('#dot3,#dot2').removeClass('active');
            $('#dot1').addClass('active');
        });
    });
}

function moveToOTPPage() {
    // Slide out the wrapper div of the forgot password form to the left
    $('#wrapper').animate({ left: '-100%' }, 400, 'linear', function () {
        // Add OTP content inside the #wrapper div
        const otpPageHTML = `
            <div id="otpWrapper" class="mt-3 m-2">
                <form>
                    <div class="text-center mb-3">
                        <label class="fw-bold fs-4 text-white">Enter OTP</label>
                        <hr class="mt-2 mb-4" style="width: 100%; margin: 0 auto; border: 1px solid #ccc;">
                    </div>
                    <div class="mb-4 d-flex justify-content-center">
                        <input type="text" class="form-control otp-input mx-2" maxlength="1" id="otp1" />
                        <input type="text" class="form-control otp-input mx-2" maxlength="1" id="otp2" />
                        <input type="text" class="form-control otp-input mx-2" maxlength="1" id="otp3" />
                        <input type="text" class="form-control otp-input mx-2" maxlength="1" id="otp4" />
                    </div>
                    <div id="OTP-error" class="mb-4 d-flex justify-content-center">
                    </div>
                    <div class="d-flex justify-content-center">
                        <button id="btn-verifyOtp" type="button" class="btn btn-success w-50 mb-3">Verify OTP</button>
                    </div>
                </form>
            </div>
        `;

        // Hide the children elements of the #wrapper div
        $('#wrapper').children().hide();
        // Append OTP page content inside the #wrapper div
        $('#wrapper').append(otpPageHTML);

        // Initially position OTP page outside to the right
        $('#otpWrapper').css({ position: 'relative', left: '100%' });

        // Animate OTP page from the right to left (slide in from right)
        $('#otpWrapper').animate({ left: '0%' }, 400, 'linear', function() {
            // Once OTP page is fully in, change the active dot (third dot becomes active)
            $('#dot2').addClass('active');
            $('#dot3,#dot1').removeClass('active');
        });
    });
}

function moveToForgetPasswordPage() {

    // Hide and slide the login form out
    $('#loginForm').animate({ left: '-120%' }, 400, 'linear', function () {
        $(this).hide();

        // Add and slide in the forgot password form inside the wrapper
        const forgotPasswordHTML = `
                <div id="forgotPassword" class="position-absolute" style="background-color: #1e1e1e; width: 80%; top: 25%; left: 100%;">
                    <div id="wrapper" class="mt-3 m-5 mb-2">
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
                                <button id="btn-resetPassword" type="button" class="btn btn-success w-50">Reset Password</button>
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
        $('#forgotPassword').css({ left: '100%' }).animate({ left: '12%' }, 400, 'linear');
    });
}
