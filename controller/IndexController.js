$('#signInAndSignUp-sec').css({display: 'block'})
$('#header-sec').css({display:'none'});
$('#dashboard-sec').css({display:'none'});
$('#field-sec').css({display:'none'});
$('#crops-sec').css({display:'none'});
$('#staff-sec').css({display:'none'});
$('#monitoring-log-sec').css({display:'none'});
$('#vehicle-sec').css({display:'none'});
$('#equipment-sec').css({display:'none'});
$('#sections-wrapper').css({display:'none'});

$('#btn-signIn').on('click',function (){
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
});

$('#btn-logout').on('click',function (){
    $('#signInAndSignUp-sec').css({display:'block'})
    $('#sections-wrapper').css({display:'none'});
    $('#header-sec').css({display:'none'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#dashboard').on('click',function (){
    $('#dashboard-sec').css({display:'block'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#field').on('click',function (){
    $('#field-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#crops').on('click',function (){
    $('#crops-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#staff').on('click',function (){
    $('#staff-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#log').on('click',function (){
    $('#monitoring-log-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#vehicle').on('click',function (){
    $('#vehicle-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'})
    $('#equipment-sec').css({display:'none'});
});

$('#equipment').on('click',function (){
    $('#equipment-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
});

// $(document).ready(function () {
//     // Store all sections except header in an array for easy access
//     const sections = [
//         '#dashboard-sec', '#field-sec', '#crops-sec',
//         '#staff-sec', '#monitoring-log-sec', '#vehicle-sec', '#equipment-sec'
//     ];
//
//     // Function to hide all sections and show only the target section
//     function showSection(target) {
//         // Hide all sections except header
//         $(sections.join(', ')).css({ display: 'none' });
//         // Show the target section
//         $(target).css({ display: 'block' });
//     }
//
//     // Initialize by showing only the Sign In section
//     $('#signInAndSignUp-sec').css({ display: 'block' });
//     $('#sections-wrapper').css({ display: 'none' });
//     showSection('#signInAndSignUp-sec');
//
//     // Sign In button click event
//     $('#btn-signIn').on('click', function () {
//         $('#sections-wrapper').css({ display: 'block' });
//         $('#signInAndSignUp-sec').css({ display: 'none' });
//         $('#header-sec').css({ display: 'block' }); // Ensure header is visible after sign-in
//         showSection('#dashboard-sec');
//     });
//
//     // Logout button click event
//     $('#btn-logout').on('click', function () {
//         $('#signInAndSignUp-sec').css({ display: 'block' });
//         $('#sections-wrapper').css({ display: 'none' });
//         $('#header-sec').css({ display: 'none' }); // Hide header on logout
//         showSection('#signInAndSignUp-sec');
//     });
//
//     // Sidebar navigation button events
//     $('#dashboard').on('click', function () {
//         showSection('#dashboard-sec');
//     });
//     $('#field').on('click', function () {
//         showSection('#field-sec');
//     });
//     $('#crops').on('click', function () {
//         showSection('#crops-sec');
//     });
//     $('#staff').on('click', function () {
//         showSection('#staff-sec');
//     });
//     $('#log').on('click', function () {
//         showSection('#monitoring-log-sec');
//     });
//     $('#vehicle').on('click', function () {
//         showSection('#vehicle-sec');
//     });
//     $('#equipment').on('click', function () {
//         showSection('#equipment-sec');
//     });
// });

