import Vehicle from "../model/Vehicle";
import {vehicleDetails} from "../db/DB.js"
$(document).ready(function () {
// const $vehicleModal = $('#vehicle-modal');
// const $modalTitle = $('#modalTitle');
// const $modalSubmitButton = $('#modalSubmitButton');

// $vehicleModal.on('show.bs.modal', function (event) {
//     const button = $(event.relatedTarget); // Button that triggered the modal
//     const action = button.data('action'); // Get action from data attribute
//
//     if (action === 'update') {
//         $modalTitle.text('Update Vehicle');
//         $modalSubmitButton.text('Update Vehicle');
//         $modalSubmitButton.removeClass('btn-primary').addClass('btn-success');
//     } else {
//         $modalTitle.text('Add Vehicle');
//         $modalSubmitButton.text('Add Vehicle');
//         $modalSubmitButton.removeClass('btn-primary').addClass('btn-success');
//     }
// });

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
        $('#licensePlateNumber').val(licensePlateNumber);
        $('#vehicleName').val(vehicleName);
        $('#category').val(category);
        $('#fuelType').val(fuelType);
        $('#status').val(status);
        $('#staffMember').val(staffMember);
        $('#remark').val(remark);
    });

    // Clear fields when the modal is closed
    $('#vehicle-modal').on('hidden.bs.modal', function () {
        $('#vehicleForm')[0].reset(); // Reset the form fields
    });

    // Handle the form submission for updating vehicle details
    $('#vehicleForm').on('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const updateVehicleDetailsDTO = {
            licensePlateNumber: $("#licensePlateNumber").val(),
            vehicleName: $("#vehicleName").val(),
            category: $("#category").val(),
            fuelType: $("#fuelType").val(),
            status: $("#status").val(),
            staffMember: $("#staffMember").val(),
            remark: $("#remark").val()
        };
        vehicleDetailsArray.push(updateVehicleDetailsDTO);
        loadVehicleTable();
    });
});
