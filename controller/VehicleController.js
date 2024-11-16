import Vehicle from "../model/Vehicle.js";
import {vehicleDetails} from "../db/db.js"
import {LoadAllStaffMember} from './StaffController.js';
import {LoadCards} from "./CropController.js";

$(document).ready(function () {
    let clickTableRow = 0;
    const loadAllMember = new LoadAllStaffMember();
    const loadAllVehicle = new LoadAllVehicleDetails();

    //save vehicle
    $("#modalSubmitButton").on("click", (e)=> {
        e.preventDefault(); // Prevent form submission

        // Collect form data
        let licensePlateNumber = $("#licensePlateNumber").val();
        let vehicleName = $("#vehicleName").val();
        let category = $("#category").val();
        let fuelType = $("#fuelType").val();
        let status = $("#status").val();
        let remark = $("#remark").val();

        // Collect multiple staff values
        let staffEquipment = [];
        $("#additionalVehicleStaff select").each(function() {
            let staffValue = $(this).val();
            if (staffValue) {
                staffEquipment.push(staffValue);
            }
        });

        let vehicleDTO = {
            licensePlateNumber: licensePlateNumber,
            name: vehicleName,
            category: category,
            fuelType: fuelType,
            status: status,
            remark: remark,
            staffEquipment: staffEquipment
        };

        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $.ajax({
                    url: "http://localhost:5050/api/v1/vehicles",  // Replace with your actual API endpoint
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(vehicleDTO),
                    success: function () {
                        loadAllVehicle.loadVehicleTable().then(vehicleCode => {
                            Swal.fire("Saved!", "", "success");
                        }).catch(error =>{
                            console.error("Error loading field cards:", error);
                        });

                        // Refresh the table with updated data
                        $('#additionalVehicleStaff').empty();
                        $('#vehicle-modal').modal("hide");
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status === 400) {
                            alert("Failed to save vehicle: Bad request");
                        } else {
                            alert("Failed to save vehicle: Server error");
                        }
                    }
                });
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    });

    // Assuming your table rows are in tbody with id "vehicleDetailsTable"
    $('#vehicleDetailsTable').on('click', 'tr', function () {
        $('#additionalVehicleStaffUpdate').empty();
        // Get values from the row
        let vehicleCode = $(this).find(".code").text()
        let licensePlateNumber = $(this).find(".licensePlateNumber").text()
        let vehicleName = $(this).find(".vehicleName").text()
        let category = $(this).find(".category").text()
        let fuelType = $(this).find(".fuelType").text()
        let status = $(this).find(".status").text()
        let remark = $(this).find(".remark").text()

        console.log("vehi code : ",vehicleCode)
        vehicleDetails.push(vehicleCode);
        clickTableRow = $(this).index();

        // Populate the modal fields
        $('#selectedVehicleCode').val(vehicleCode);
        $('#updateLicensePlateNumber').val(licensePlateNumber);
        $('#updateVehicleName').val(vehicleName);
        $('#updateCategoryVehicle').val(category);
        $('#updateFuelType').val(fuelType);
        $('#updateStatus').val(status);
        $('#updateRemark').val(remark);

        let staffMemberArray = $(this).find(".staffMember").text().split(", ");

        const vehicle = new Vehicle(vehicleCode,licensePlateNumber,vehicleName,category,fuelType,status,staffMemberArray,remark);
        loadAllMember.loadAllMembers().then(memberCode => {
            populateDropdownVehicle("#updateStaffVehicle",staffMemberArray,memberCode);
        }).catch(error => {
            console.error("Error loading vehicle :", error);
        })
    });

    // Show delete confirmation modal
    $('#vehicleDetailsTable').on('click', '.delete-button', function () {
        const index = $(this).data('index'); // Get the index of the vehicle to delete
        $('#confirmVehicleDeleteYes').data('index', index); // Store index in the button for later use
        $('#confirmVehicleDeleteModal').modal('show'); // Show the confirmation modal
    });

    // Handle the confirmation of deletion - yes button
    $('#confirmVehicleDeleteYes').on('click', function () {
        const index = $(this).data('index'); // Get the stored index
        vehicleDetails.splice(index, 1); // Remove the vehicle from the array
        loadVehicleTable(); // Refresh the table
        $('#confirmVehicleDeleteModal').modal('hide');
        // Ensure the modal and backdrop are fully removed when hidden (overlay)
        $('#confirmVehicleDeleteModal').on('hidden.bs.modal', function () {
            $('body').removeClass('modal-open'); // Removes the modal-open class from body
            $('.modal-backdrop').remove();       // Removes the leftover backdrop element
        });
    });

    //No button
    $('#confirmVehicleDeleteNo').on('click',()=>{
        $('#confirmVehicleDeleteModal').modal('hide'); // Hide the modal
    });

    // Clear fields when the modal is closed
    $('#vehicle-modal').on('hidden.bs.modal', function () {
        $('#vehicleForm')[0].reset(); // Reset the form fields
    });

    // Handle the form submission for updating vehicle details
    $('#modalSubmitButtonUpdate').on('click', ()=> {

        // Collect form data
        let vehicleCode = $("#selectedVehicleCode").val();
        let licensePlateNumber = $("#updateLicensePlateNumber").val();
        let vehicleName = $("#updateVehicleName").val();
        let category = $("#updateCategoryVehicle").val();
        let fuelType = $("#updateFuelType").val();
        let status = $("#updateStatus").val();
        let staffMember = $("#updateStaffMember").val();
        let remark = $("#updateRemark").val();

        // Collect updated staff values
        let updatedStaffVehicle = [];
        $("#updateStaffVehicle select").each(function() {
            let staffValue = $(this).val();
            if (staffValue) {
                updatedStaffVehicle.push({ memberCode: staffValue });
            }
        });

        // Collect values from all Staff Member dropdowns
        $('#additionalVehicleStaffUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) {
                updatedStaffVehicle.push({ memberCode: selectedValue });
            }
        });

        const vehicleDTO = {
            vehicleCode:vehicleCode,
            licensePlateNumber: licensePlateNumber,
            name: vehicleName,
            category: category,
            fuelType: fuelType,
            status: status,
            staffMembers: updatedStaffVehicle,
            remark: remark
        };

        Swal.fire({
            title: "Do you want to update the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:5050/api/v1/vehicles/${vehicleCode}`, // Use the vehicleId from the clicked row
                    type: 'PUT',
                    contentType: 'application/json', // JSON request
                    data: JSON.stringify(vehicleDTO), // Convert the object to JSON
                    success: function(response) {
                        loadAllVehicle.loadVehicleTable().then(vehicleCode =>{
                            Swal.fire("Saved!", "", "success");
                            resetForm('#additionalVehicleStaffUpdate'); // Reset the form
                        }).catch(error =>{
                            console.error("vehicle code not found:", error);
                        });
                        $('#updateVehicle-modal').modal("hide"); // Hide the modal
                    },
                    error: function(xhr, status, error) {
                        console.error("Error updating vehicle:", error);
                        alert("Failed to update vehicle. Please try again.");
                    }
                });
            } else if (result.isDenied) {
                Swal.fire("Changes are not updated", "", "info");
            }
        });
    });

    function resetForm(additionalField) {
        $('#updateVehicleForm')[0].reset();
        $(`${additionalField}`).empty();
    }

    //Add additional Staff Modal
    $('#addVehicleStaffButton').on('click', function() {
        loadAllMember.loadAllMembers().then(memberCode => {
            console.log(memberCode)
            addDropdownVehicle("#additionalVehicleStaff","#staff-vehicle",memberCode)
        }).catch(error => {
            console.error("Error loading staff member details:", error);
        });
    });

    //Add additional Staff field Update Modal
    $('#addVehicleStaffButtonUpdate').on('click', function() {
        loadAllMember.loadAllMembers().then(memberCode => {
            addDropdownVehicle("#additionalVehicleStaffUpdate", "#staff-vehicleUpdate", memberCode)
        }).catch(error => {
            console.error("Error loading staff member details:", error);
        });
    });

    function addDropdownVehicle(containerId, selectClass, options) {
        const $container = $('<div class="d-flex align-items-center mt-2"></div>');
        const $select = $('<select id="optionSelect" class="form-control me-2"></select>').addClass(selectClass);

        // Populate select options
        options.forEach(option => $select.append(`<option value="${option}">${option}</option>`));

        // Remove button
        const $removeBtn = $('<button class="btn btn-danger">Remove</button>');
        $removeBtn.on('click', function() {
            $container.remove();
        });

        $container.append($select).append($removeBtn);
        $(containerId).append($container);
    }

    function populateDropdownVehicle(container, selectedValues, options) {
        $(container).empty();
        selectedValues.forEach(value => {
            // Create a wrapper div for each dropdown and the remove button
            const dropdownWrapper = $('<div class="dropdown-wrapper mb-3" style="display: flex; align-items: center;"></div>');

            // Create the dropdown
            const dropdown = $('<select class="form-control me-2"></select>');
            options.forEach(option => {
                dropdown.append(`<option value="${option}" ${option.trim() === value ? 'selected' : ''}>${option}</option>`);
            });

            // Create the remove button
            const removeButton = $('<button type="button" class="btn btn-danger ml-2">Remove</button>');

            // Add click event to remove the dropdown when the button is clicked
            removeButton.click(function() {
                dropdownWrapper.remove();
            });

            // Append dropdown and remove button to the wrapper
            dropdownWrapper.append(dropdown);
            dropdownWrapper.append(removeButton);

            // Append the wrapper to the container
            $(container).append(dropdownWrapper);
        });
    }

    $('#vehicle-modal').on('show.bs.modal', function (event) {
        // Get the button that triggered the modal
        var button = $(event.relatedTarget);

        // Check if the data-action is 'add'
        if (button.data('action') === 'add') {
            // Clear the form inputs
            $('#equipmentForm')[0].reset();
            resetForm("#additionalVehicleStaff");
        }
    });
});

export class LoadAllVehicleDetails{

    loadVehicleTable() {
        $('#vehicleDetailsTable').empty();  // Clear existing rows
        const tableBody = $("#vehicleDetailsTable");
        const vehicleCodes = [];  // Array to store vehicle codes

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "http://localhost:5050/api/v1/vehicles",
                type: "GET",
                success: function (vehicles) {  // Assume 'vehicles' is an array of vehicle objects
                    vehicles.forEach(vehicle => {
                        console.log("staff member : ",vehicle.staffMember)
                        const vehicleDetail = new Vehicle(
                            vehicle.vehicleCode,
                            vehicle.licensePlateNumber,
                            vehicle.name,
                            vehicle.category,
                            vehicle.fuelType,
                            vehicle.status,
                            vehicle.staffMember || "N/A",  // Handle nested staff details
                            vehicle.remark
                        );

                        // Add vehicle code to the array
                        vehicleCodes.push(vehicle.vehicleCode);

                        const row = `
                            <tr>
                                <td class="code">${vehicle.vehicleCode}</td>
                                <td class="licensePlateNumber">${vehicleDetail.licensePlateNumber}</td>
                                <td class="vehicleName">${vehicleDetail.vehicleName}</td>
                                <td class="category">${vehicleDetail.category}</td>
                                <td class="fuelType">${vehicleDetail.fuelType}</td>
                                <td class="status">${vehicleDetail.status}</td>
                                <td class="staffMember">${vehicleDetail.staffMember}</td>
                                <td class="remark">${vehicleDetail.remark}</td>
                                <td><button class="btn btn-danger delete-button" data-index="${vehicle.vehicleCode}">Delete</button></td>
                            </tr>
                        `;
                        tableBody.append(row);  // Append each row to the table
                    });

                    // Resolve the promise with the array of vehicle codes
                    resolve(vehicleCodes);
                },
                error: function (xhr, status, error) {
                    alert("Failed to retrieve vehicle data");
                    reject(error);
                }
            });
        });
    }
}
