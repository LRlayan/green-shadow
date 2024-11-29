import Vehicle from "../model/Vehicle.js";
import {LoadAllStaffMember} from './StaffController.js';

const token = localStorage.getItem('jwtKey');
$(document).ready(function () {
    let clickTableRow = 0;
    let clickNewComboBoxBtn = 0;

    const loadAllMember = new LoadAllStaffMember();
    const loadAllVehicle = new LoadAllVehicleDetails();

    //SAVE VEHICLE
    $("#modalSubmitButton").on("click", async function (e) {
        e.preventDefault();
        clickNewComboBoxBtn = 0;

        // Collect form data
        let licensePlateNumber = $("#licensePlateNumber").val();
        let vehicleName = $("#vehicleName").val();
        let category = $("#category").val();
        let fuelType = $("#fuelType").val();
        let status = $("#status").val();
        let remark = $("#remark").val();

        let staffEquipment = collectSelectedValues('#additionalVehicleStaff select');

        let vehicleDTO = {
            vehicleCode:"1",
            licensePlateNumber: licensePlateNumber,
            name: vehicleName,
            category: category,
            fuelType: fuelType,
            status: status,
            remark: remark,
            memberCode: staffEquipment[0]
        };

        console.log("VEICLE DTO OBJ ON FRONT END  :  "+ vehicleDTO.vehicleCode , vehicleDTO.memberCode)

        const result = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        });

        if (result.isConfirmed) {
            try {
                await $.ajax({
                    url: "http://localhost:5050/api/v1/vehicles",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(vehicleDTO),
                    headers:{
                        "Authorization": "Bearer " + token
                    }
                });
                await loadAllVehicle.loadVehicleTable();
                Swal.fire("Saved!", "", "success");

                $('#additionalVehicleStaff').empty();
                $('#vehicle-modal').modal("hide");
            } catch (xhr) {
                console.error("Failed to save vehicle:", xhr);
                if (xhr.status === 400) {
                    Swal.fire("Error", "Failed to save vehicle: Bad request", "error");
                } else {
                    Swal.fire("Error", "Failed to save vehicle: Server error", "error");
                }
            }
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });

    // SET DATA VEHICLE UPDATE MODAL
    $('#vehicleDetailsTable').on('click', 'tr', function () {
        clickNewComboBoxBtn = 1;
        $('#additionalVehicleStaffUpdate').empty();
        let vehicleCode = $(this).find(".code").text();
        let licensePlateNumber = $(this).find(".licensePlateNumber").text();
        let vehicleName = $(this).find(".vehicleName").text();
        let category = $(this).find(".category").text().trim();
        let fuelType = $(this).find(".fuelType").text().trim();
        let status = $(this).find(".status").text().trim();
        let remark = $(this).find(".remark").text();

        clickTableRow = $(this).index();

        $('#selectedVehicleCode').val(vehicleCode);
        $('#updateLicensePlateNumber').val(licensePlateNumber);
        $('#updateVehicleName').val(vehicleName);
        $('#updateCategoryVehicle').val(category);
        $('#fuelTypeUpdate').val(fuelType);
        $('#statusUpdate').val(status);
        $('#updateRemark').val(remark);

        let staffMemberArray = $(this).find(".staffMember").text().split(", ");

        const vehicle = new Vehicle(vehicleCode,licensePlateNumber,vehicleName,category,fuelType,status,staffMemberArray,remark);
        loadAllMember.loadAllMembers().then(memberCode => {
            populateDropdownVehicle("#updateStaffVehicle",staffMemberArray,memberCode);
        }).catch(error => {
            console.error("Error loading vehicle :", error);
        })
    });

    // SHOW DELETE CONFIRMATION MODAL
    $('#vehicleDetailsTable').on('click', '.delete-button', function () {
        const index = $(this).data('index');
        $('#confirmVehicleDeleteYes').data('index', index);
        $('#confirmVehicleDeleteModal').modal('show');
    });

    // DELETE VEHICLE
    $('#confirmVehicleDeleteYes').on('click', async function () {
        const index = $(this).data('index'); // Get the stored index
        try {
            await $.ajax({
                url: `http://localhost:5050/api/v1/vehicles/${index}`,
                type: 'DELETE',
            });
            await loadAllVehicle.loadVehicleTable();

            Swal.fire('Deleted!', 'The vehicle has been deleted.', 'success');
        } catch (xhr) {
            console.error("Error deleting vehicle:", xhr);
            if (xhr.status === 404) {
                Swal.fire('Error', 'Vehicle not found!', 'error');
            } else if (xhr.status === 400) {
                Swal.fire('Error', 'Invalid vehicle ID!', 'error');
            } else {
                Swal.fire('Error', 'Failed to delete vehicle. Please try again.', 'error');
            }
        } finally {
            $('#confirmVehicleDeleteModal').modal('hide');
            clearOverlayOfModal();
        }
    });

    //Delete modal No button
    $('#confirmVehicleDeleteNo,#close-btn-delete').on('click',()=>{
        $('#confirmVehicleDeleteModal').modal('hide'); // Hide the modal
        clearOverlayOfModal();
    });

    // Clear fields when the modal is closed
    $('#vehicle-modal,#updateVehicle-modal').on('hidden.bs.modal', function () {
        $('#vehicleForm')[0].reset();
        $('#updateVehicleForm')[0].reset();
        $('#additionalVehicleStaffUpdate').empty();
    });

    // UPDATE VEHICLE DETAILS
    $('#modalSubmitButtonUpdate').on('click', async function (){
        let vehicleCode = $("#selectedVehicleCode").val();
        let licensePlateNumber = $("#updateLicensePlateNumber").val();
        let vehicleName = $("#updateVehicleName").val();
        let category = $("#updateCategoryVehicle").val();
        let fuelType = $("#fuelTypeUpdate").val();
        let status = $("#statusUpdate").val();
        let remark = $("#updateRemark").val();

        let updatedStaffVehicle = collectSelectedValues('#updateStaffVehicle select','#additionalVehicleStaffUpdate select');

        const vehicleDTO = {
            vehicleCode:vehicleCode,
            licensePlateNumber: licensePlateNumber,
            name: vehicleName,
            category: category,
            fuelType: fuelType,
            status: status,
            memberCode: updatedStaffVehicle,
            remark: remark
        };

        try {
            const result = await Swal.fire({
                title: "Do you want to update the changes?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Update",
                denyButtonText: `Don't update`
            });

            if (result.isConfirmed) {
                await $.ajax({
                    url: `http://localhost:5050/api/v1/vehicles/${vehicleCode}`,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(vehicleDTO)
                });
                await loadAllVehicle.loadVehicleTable();

                clickNewComboBoxBtn = 0;
                resetForm('#additionalVehicleStaffUpdate');
                $('#updateVehicle-modal').modal("hide");

                Swal.fire("Updated!", "The vehicle details have been updated.", "success");
            } else if (result.isDenied) {
                Swal.fire("Changes are not updated", "", "info");
            }
        } catch (error) {
            console.error("Error updating vehicle:", error);
            Swal.fire("Error", "Failed to update vehicle. Please try again.", "error");
        }
    });

    function resetForm(additionalField) {
        $('#updateVehicleForm')[0].reset();
        $(`${additionalField}`).empty();
    }

    //Add additional Staff Modal
    $('#addVehicleStaffButton').on('click', function() {
        clickNewComboBoxBtn++;
        if (clickNewComboBoxBtn == 1) {
            loadAllMember.loadAllMembers().then(memberCode => {
                addDropdownVehicle("#additionalVehicleStaff", "#staff-vehicle", memberCode)
            }).catch(error => {
                console.error("Error loading staff member details:", error);
            });
        }
    });

    //Add additional Staff field Update Modal
    $('#addVehicleStaffButtonUpdate').on('click', function() {
        clickNewComboBoxBtn++;
        if (clickNewComboBoxBtn == 1){
            loadAllMember.loadAllMembers().then(memberCode => {
                addDropdownVehicle("#additionalVehicleStaffUpdate", "#staff-vehicleUpdate", memberCode)
            }).catch(error => {
                console.error("Error loading staff member details:", error);
            });
        }
    });

    function addDropdownVehicle(containerId, selectClass, options) {
        const $container = $('<div class="d-flex align-items-center mt-2"></div>');
        const $select = $('<select id="optionSelect" class="form-control me-2"></select>').addClass(selectClass);

        // Populate select options
        options.forEach(option => $select.append(`<option value="${option}">${option}</option>`));

        // Remove button
        const $removeBtn = $('<button class="btn btn-danger">Remove</button>');
        $removeBtn.on('click', function() {
            clickNewComboBoxBtn = 0;
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
            const removeButton = $('<button id="btn-remove" type="button" class="btn btn-danger ml-2">Remove</button>');

            // Add click event to remove the dropdown when the button is clicked
            removeButton.click(function() {
                clickNewComboBoxBtn = 0;
                dropdownWrapper.remove();
            });
            dropdownWrapper.append(dropdown);
            dropdownWrapper.append(removeButton);
            $(container).append(dropdownWrapper);
        });
    }

    $('#vehicle-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        if (button.data('action') === 'add') {
            $('#equipmentForm')[0].reset();
            resetForm("#additionalVehicleStaff");
        }
    });

    $('#closeModal, .btn-close , #close-btnUpdate').on('click',function (){
        clickNewComboBoxBtn = 0;
    });

    function clearOverlayOfModal(){
        // Ensure the modal and backdrop are fully removed when hidden (overlay)
        $('#confirmVehicleDeleteModal').on('hidden.bs.modal', function () {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        });
    }
});

function collectSelectedValues(...selectors) {
    let values = [];
    selectors.forEach(selector => {
        $(selector).each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) values.push(selectedValue);
        });
    });
    return values;
}

export class LoadAllVehicleDetails{
    loadVehicleTable() {
        $('#vehicleDetailsTable').empty();
        const tableBody = $("#vehicleDetailsTable");
        const vehicleCodes = [];

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "http://localhost:5050/api/v1/vehicles",
                type: "GET",
                headers:{
                    "Authorization": "Bearer " + token
                },
                success: function (vehicles) {
                    $("#vehicleDetailsTable").empty();
                    vehicles.forEach(vehicle => {
                        const vehicleDetail = new Vehicle(
                            vehicle.vehicleCode,
                            vehicle.licensePlateNumber,
                            vehicle.name,
                            vehicle.category,
                            vehicle.fuelType,
                            vehicle.status,
                            vehicle.memberCode || "N/A",
                            vehicle.remark
                        );
                        vehicleCodes.push(vehicle.vehicleCode);
                        const row = `
                            <tr>
                                <td class="code">${vehicle.vehicleCode}</td>
                                <td class="licensePlateNumber">${vehicleDetail.licensePlateNumber}</td>
                                <td class="vehicleName">${vehicleDetail.vehicleName}</td>
                                <td class="category">${vehicleDetail.category}</td>
                                <td class="fuelType">${vehicleDetail.fuelType}</td>
                                <td class="status">${vehicleDetail.status}</td>
                                <td class="staffMember">${vehicleDetail.staffMember || "No Member"}</td>
                                <td class="remark">${vehicleDetail.remark}</td>
                                <td><button class="btn btn-danger delete-button" data-index="${vehicle.vehicleCode}">Delete</button></td>
                            </tr>
                        `;
                        tableBody.append(row);
                    });
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
