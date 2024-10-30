import Vehicle from "../model/Vehicle.js";
import {vehicleDetails} from "../db/db.js"
$(document).ready(function () {
    let clickTableRow = 0;

    $("#modalSubmitButton").on("click", ()=> {
        event.preventDefault(); // Prevent form submission

        // Collect form data
        let licensePlateNumber = $("#licensePlateNumber").val();
        let vehicleName = $("#vehicleName").val();
        let category = $("#category").val();
        let fuelType = $("#fuelType").val();
        let status = $("#status").val();
        let staffMember = $("#staffMember").val();
        let remark = $("#remark").val();

        let vehicleDetail = new Vehicle(licensePlateNumber,vehicleName,category,fuelType,status,staffMember,remark);
        vehicleDetails.push(vehicleDetail);
        console.log(vehicleDetails.length)
        loadVehicleTable(); // Refresh the table with updated data

        // Reset form and close modal
        this.reset();
        $("#vehicle-modal").modal("hide");
    });


    function loadVehicleTable() {
        $('#vehicleDetailsTable').empty();
        const tableBody = $("#vehicleDetailsTable");
        tableBody.empty();

        vehicleDetails.map(vehicle => {
            const row = `
                <tr>
                    <td class="licensePlateNumber">${vehicle.licensePlateNumber}</td>
                    <td class="vehicleName">${vehicle.vehicleName}</td>
                    <td class="category">${vehicle.category}</td>
                    <td class="fuelType">${vehicle.fuelType}</td>
                    <td class="status">${vehicle.status}</td>
                    <td class="staffMember">${vehicle.staffMember}</td>
                    <td class="remark">${vehicle.remark}</td>
                </tr>
            `;
            tableBody.append(row);
        });
    }

    // Assuming your table rows are in tbody with id "vehicleDetailsTable"
    $('#vehicleDetailsTable').on('click', 'tr', function () {
        // Get values from the row
        let licensePlateNumber = $(this).find(".licensePlateNumber").text()
        let vehicleName = $(this).find(".vehicleName").text()
        let category = $(this).find(".category").text()
        let fuelType = $(this).find(".fuelType").text()
        let status = $(this).find(".status").text()
        let staffMember = $(this).find(".staffMember").text()
        let remark = $(this).find(".remark").text()

        clickTableRow = $(this).index();

        // Populate the modal fields
        $('#updateLicensePlateNumber').val(licensePlateNumber);
        $('#updateVehicleName').val(vehicleName);
        $('#updateCategoryVehicle').val(category);
        $('#updateFuelType').val(fuelType);
        $('#updateStatus').val(status);
        $('#updateStaffMember').val(staffMember);
        $('#updateRemark').val(remark);
    });

    // Clear fields when the modal is closed
    $('#vehicle-modal').on('hidden.bs.modal', function () {
        $('#vehicleForm')[0].reset(); // Reset the form fields
    });

    // Handle the form submission for updating vehicle details
    $('#modalSubmitButtonUpdate').on('click', ()=> {
        // Collect form data
            let licensePlateNumber = $("#updateLicensePlateNumber").val();
            let vehicleName = $("#updateVehicleName").val();
            let category = $("#updateCategoryVehicle").val();
            let fuelType = $("#updateFuelType").val();
            let status = $("#updateStatus").val();
            let staffMember = $("#updateStaffMember").val();
            let remark = $("#updateRemark").val();

        let vehicle = vehicleDetails[clickTableRow];
        vehicle.licensePlateNumber = licensePlateNumber;
        vehicle.vehicleName = vehicleName;
        vehicle.category = category;
        vehicle.fuelType = fuelType;
        vehicle.status = status;
        vehicle.staffMember = staffMember;
        vehicle.remark = remark;
        loadVehicleTable();
    });
});
