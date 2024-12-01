import { LoadCards } from './CropController.js';
import {LoadFieldCard} from './FieldController.js';
import {LoadAllVehicleDetails} from './VehicleController.js';
import {LoadAllEquipment} from './EquipmentController.js';
import {LoadAllStaffMember} from './StaffController.js';
import {LoadAllLogs} from "./MonitoringLogController.js";

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

$('#btn-logout').on('click',function (){
    Swal.fire({
        title: "Do you want to logout?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            const logOut = new LogOut();
            logOut.logOutTheSystem();
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
});

$('#dashboard').on('click',function (){
    $('#main-label').text('Dashboard');
    $('#dashboard-sec').css({display:'block'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#field').on('click',function (){
    const loadFieldCard = new LoadFieldCard();
    loadFieldCard.loadAllFieldCard();
    $('#main-label').text('Field Manage');
    $('#field-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#crops').on('click',function (){
    const loadCropCard = new LoadCards();
    loadCropCard.loadAllCropCard();
    $('#main-label').text('Crop Manage');
    $('#crops-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#staff').on('click',function (){
    const allStaffMember = new LoadAllStaffMember();
    allStaffMember.loadAllMembers();
    $('#main-label').text('Staff Manage');
    $('#staff-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#log').on('click',function (){
    const loadAllLogs = new LoadAllLogs();
    loadAllLogs.loadAllLogsDetails();
    $('#main-label').text('Logs Services');
    $('#monitoring-log-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
    $('#equipment-sec').css({display:'none'});
});

$('#vehicle').on('click',function (){
    const loadAllVehicle = new LoadAllVehicleDetails();
    loadAllVehicle.loadVehicleTable();
    $('#main-label').text('Vehicle Manage');
    $('#vehicle-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'})
    $('#equipment-sec').css({display:'none'});
});

$('#equipment').on('click',function (){
    const loadAllEquipment = new LoadAllEquipment();
    loadAllEquipment.loadAllEquDetails();
    $('#main-label').text('Equipment Manage');
    $('#equipment-sec').css({display:'block'});
    $('#dashboard-sec').css({display:'none'});
    $('#field-sec').css({display:'none'});
    $('#crops-sec').css({display:'none'});
    $('#staff-sec').css({display:'none'});
    $('#monitoring-log-sec').css({display:'none'});
    $('#vehicle-sec').css({display:'none'});
});

export class CurrentDate {
    getCurrentFormattedDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

export class LogOut {
    logOutTheSystem(){
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
    }
}

export class SessionExpired{
    logOut() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "The Session expired?",
            text: "You will have to log in to the system again.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, SignIn!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("jwtToken");
                const logOut1 = new LogOut();
                logOut1.logOutTheSystem();
            }
        });
    }
}

export class HandlingErrors {
    handleError(status) {
        switch (status) {
            case 400:
                Swal.fire("Bad Request", "The request was invalid. Please check your input and try again.", "error");
                break;
            case 401:
                Swal.fire("Unauthorized", "You are not authorized to perform this action.", "warning");
                break;
            case 403:
                const sessionExpired = new SessionExpired();
                sessionExpired.logOut();
                break;
            case 404:
                Swal.fire("Not Found", "The requested resource could not be found.", "info");
                break;
            case 500:
                Swal.fire("Server Error", "An error occurred on the server. Please try again later.", "error");
                break;
            default:
                Swal.fire("Error", "An unexpected error occurred. Please try again.", "error");
                break;
        }
    }
}
