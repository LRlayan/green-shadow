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
