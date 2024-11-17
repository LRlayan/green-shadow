import Equipment from "../model/Equipment.js";
import {equipmentDetails, staffEquipmentCount} from "../db/db.js"
import {LoadAllStaffMember} from "./StaffController.js";
import {LoadFieldCard} from './FieldController.js';

let clickTableRow = 0;

//Add Field Modal
$('#addFieldButtonEquipment').on('click', function() {
    const loadAllField = new LoadFieldCard();
    loadAllField.loadAllFieldCard().then(fieldCode => {
        addDropdownEquipment("#additionalEquipmentField","#field-equipment",fieldCode)
    }).catch(error => {
        console.log('Not loading equipment ',error)
    });
});

//Add Staff Modal
$('#addStaffButton').on('click', function() {
    const loadAllMembers = new LoadAllStaffMember();
    loadAllMembers.loadAllMembers().then(memberCode => {
        addDropdownEquipment("#additionalEquipmentStaff","#staff-equipment",memberCode)
    }).catch(error => {
        console.log("Not loading member ",error)
    });
});

//save equipment
$('#addEquipmentButton').on('click',(e)=>{
    e.preventDefault();

    // Collect form data
    let equipmentName = $("#equipmentName").val();
    let equipmentType = $("#equipmentType").val();
    let equipmentStatus = $("#equipmentStatus").val();
    let count = $("#count").val();

    // Collect multiple staff values
    let staffEquipment = [];
    $("#additionalEquipmentStaff select").each(function() {
        let staffValue = $(this).val();
        if (staffValue) {
            const staff = {
                memberCode:staffValue
            }
            staffEquipment.push(staff);
        }
    });

    // Collect multiple field values
    let fieldEquipment = [];
    $("#additionalEquipmentField select").each(function() {
        let fieldValue = $(this).val();
        if (fieldValue) {
            const field = {
                fieldCode:fieldValue
            }
            fieldEquipment.push(field);
        }
    });

    let equipmentDTO = {
        name:equipmentName,
        type:equipmentType,
        status:equipmentStatus,
        availableCount:count,
        staffEquipmentDetailsList:[],
        fieldList:fieldEquipment
    }

    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                url: "http://localhost:5050/api/v1/equipment",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(equipmentDTO),
                success: function () {
                    const loadAllEquipment = new LoadAllEquipment();
                    loadAllEquipment.loadAllEquDetails().then(equ =>{
                        Swal.fire("Saved!", "", "success");
                    });
                    clearEquipmentModalFields("#equipmentName","#equipmentType","#equipmentStatus","#count","#initialStaff select","#initialEquipment select","#additionalEquipmentStaff","#additionalEquipmentField");
                    $("#equipment-modal").modal('hide');
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 400) {
                        alert("Failed to save equipment: Bad request");
                    } else {
                        alert("Failed to save equipment: Server error");
                    }
                }
            });
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
});

// set values for update modal
$('#equipmentDetailsTable').on('click', 'tr', function () {
    // Clear any existing inputs in the modal's dynamic dropdowns
    $('#additionalStaffEquUpdate').empty();
    $('#additionalFieldEquipmentUpdate').empty();

    // Get values from the selected row
    let code = $(this).find(".code").text();
    let name = $(this).find(".name").text();
    let type = $(this).find(".vehicleType").text();
    let status = $(this).find(".status").text();
    let count = $(this).find(".count").text();

    clickTableRow = $(this).index();

    // Split multiple values in "staffMember" and "fields" columns
    let staffMemberArray = $(this).find(".staffMember").text().split(", "); // Assuming comma-separated
    let fieldsArray = $(this).find(".fields").text().split(", "); // Assuming comma-separated

    // Populate the modal fields with values from the row
    $('#selectedEquipmentCode').val(code);
    $('#equipmentNameUpdate').val(name);
    $('#equipmentTypeUpdate').val(type);
    $('#equipmentStatusUpdate').val(status);
    $('#countUpdate').val(count);

    loadAllField.loadAllFieldCard().then(fieldCode => {
        populateDropdownEquipment("#updateEquipmentFieldId",fieldsArray,fieldCode);
    }).catch(error => {
        console.log("Not loading field codes ",error)
    });

    const loadAllMembers = new LoadAllStaffMember();
    loadAllMembers.loadAllMembers().then(memberCode => {
        populateDropdownEquipment("#updateStaffEquipment",staffMemberArray,memberCode);
    }).catch(error => {
        console.log("Not loading member codes ",error)
    });
});

// Update equipment
$('#EquipmentButtonUpdate').on('click', () => {
    // Get updated values from modal inputs
    let equCode = $("#selectedEquipmentCode").val();
    let equipmentName = $("#equipmentNameUpdate").val();
    let equipmentType = $("#equipmentTypeUpdate").val();
    let equipmentStatus = $("#equipmentStatusUpdate").val();
    let count = $("#countUpdate").val();

    // Collect updated staff values
    let updatedStaffEquipment = [];
    $("#updateStaffEquipment select").each(function() {
        let staffValue = $(this).val();
        if (staffValue) {
            updatedStaffEquipment.push(staffValue);
        }
    });

    // Collect updated field values
    let updatedFieldEquipment = [];
    $("#updateEquipmentFieldId select").each(function() {
        let fieldValue = $(this).val();
        if (fieldValue) {
            updatedFieldEquipment.push(fieldValue);
        }
    });

    // Collect values from all Field dropdowns
    $('#additionalFieldEquipmentUpdate select').each(function () {
        const selectedValue = $(this).val();
        if (selectedValue) updatedFieldEquipment.push(selectedValue);
    });

    // Collect values from all Staff Member dropdowns
    $('#additionalStaffEquUpdate select').each(function () {
        const selectedValue = $(this).val();
        if (selectedValue) updatedStaffEquipment.push(selectedValue);
    });

    const equipmentDTO = {
        equipmentCode:equCode,
        name:equipmentName,
        type:equipmentType,
        status:equipmentStatus,
        availableCount: parseInt(count),
        staffEquipmentDetailsList:[],
        fieldList:[]
    }
    console.log("ecu code " , equCode)

    Swal.fire({
        title: "Do you want to update the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Update",
        denyButtonText: `Don't update`
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            $.ajax({
                url: `http://localhost:5050/api/v1/equipment/${equCode}`, // Use the vehicleId from the clicked row
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(equipmentDTO),
                success: function(response) {
                    $('#updateEquipment-modal').modal('hide');
                    const loadAllEquipment = new LoadAllEquipment();
                    loadAllEquipment.loadAllEquDetails().then(equCodes =>{
                        clearEquipmentModalFields("#equipmentNameUpdate","#equipmentTypeUpdate","#equipmentStatusUpdate","#countUpdate","#initialFieldEquipmentUpdate select","#initialStaffEquUpdate select","#additionalStaffEquUpdate","#additionalFieldEquipmentUpdate");
                        Swal.fire("Updated!", "", "success");
                    }).catch(error =>{
                        console.error("equipment code not found:", error);
                    });
                },
                error: function(xhr, status, error) {
                    console.error("Error updating equipment:", error);
                    alert("Failed to update equipment. Please try again.");
                }
            });
        } else if (result.isDenied) {
            Swal.fire("Changes are not updated", "", "info");
        }
    });
});

//Add additional Field Update Modal
$('#addFieldButtonUpdate').on('click', function() {
    loadAllField.loadAllFieldCard().then(fieldCode => {
        addDropdownEquipment("#additionalFieldEquipmentUpdate", "#equipment-fieldUpdate", fieldCode)
    }).catch(error => {
        console.log("Not loading field codes ",error)
    });
});

//Add additional Staff field Update Modal
$('#addStaffButtonUpdate').on('click', function() {
    const loadAllMembers = new LoadAllStaffMember();
    loadAllMembers.loadAllMembers().then(memberCode => {
        addDropdownEquipment("#additionalStaffEquUpdate", "#equ-staffUpdate", memberCode)
    }).catch(error => {
        console.log("Not loading member codes ",error)
    });
});

//delete Equipment
// Show delete confirmation modal
$('#equipmentDetailsTable').on('click', '.delete-button', function () {
    const index = $(this).data('index');
    $('#confirmEquDeleteYes').data('index', index);
    $('#confirmEquipmentDeleteModal').modal('show');
});

// Handle the confirmation of deletion - yes button
$('#confirmEquDeleteYes').on('click', function () {
    const index = $(this).data('index');

    $.ajax({
        url: `http://localhost:5050/api/v1/equipment/${index}`,
        type: 'DELETE',
        success: function () {
            const loadAllEquipment = new LoadAllEquipment();
            loadAllEquipment.loadAllEquDetails();
            Swal.fire('Deleted!', 'The equipment has been deleted.', 'success');
        },
        error: function (xhr, status, error) {
            console.error("Error deleting equipment:", error);
            if (xhr.status === 404) {
                Swal.fire('Error', 'Equipment not found!', 'error');
            } else if (xhr.status === 400) {
                Swal.fire('Error', 'Invalid equipment ID!', 'error');
            } else {
                Swal.fire('Error', 'Failed to delete equipment. Please try again.', 'error');
            }
        }
    });

    $('#confirmEquipmentDeleteModal').modal('hide');

    // Ensure the modal and backdrop are fully removed when hidden (overlay)
    $('#confirmEquipmentDeleteModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    });
});

//No button
$('#confirmEquDeleteNo').on('click',()=>{
    $('#confirmEquipmentDeleteModal').modal('hide');
});

// Listen for the modal to be shown
$('#equipment-modal').on('show.bs.modal', function (event) {
    // Get the button that triggered the modal
    var button = $(event.relatedTarget);

    if (button.data('action') === 'add') {
        $('#equipmentForm')[0].reset();
        resetForm("#additionalEquipmentStaff", "#additionalEquipmentField");
    }
});

function resetForm(additionalInput1,additionalInput2){
    $('#equipmentForm')[0].reset();
    $(`${additionalInput1}`).empty();
    $(`${additionalInput2}`).empty();
}

function addDropdownEquipment(containerId, selectClass, options) {
    const $container = $('<div class="d-flex align-items-center mt-2"></div>');
    const $select = $('<select id="optionSelect" class="form-control me-2 text-white" style="background-color:#2B2B2B"></select>').addClass(selectClass);

    // Populate select options
    options.forEach(option => $select.append(`<option class="text-white" style="background-color:#2B2B2B" value="${option}">${option}</option>`));

    // Remove button
    const $removeBtn = $('<button class="btn btn-danger">Remove</button>');
    $removeBtn.on('click', function() {
        $container.remove();
    });

    $container.append($select).append($removeBtn);
    $(containerId).append($container);
}

function populateDropdownEquipment(container, selectedValues, options) {
    $(container).empty();
    selectedValues.forEach(value => {
        // Create a wrapper div for each dropdown and the remove button
        const dropdownWrapper = $('<div class="dropdown-wrapper mb-3" style="display: flex; align-items: center;"></div>');

        // Create the dropdown
        const dropdown = $('<select class="form-control me-2 text-white" style="background-color:#2B2B2B"></select>');
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

// Function to clear the equipment modal input fields
function clearEquipmentModalFields(equipmentName,equipmentType,equipmentStatus,count,initialStaff,initialEquipment,additionalEquipmentStaff,additionalEquipmentField) {
    $(`${equipmentName}`).val('');
    $(`${equipmentType}`).val('');
    $(`${equipmentStatus}`).val('');
    $(`${count}`).val('');
    $(`${initialStaff} select`).val(''); // Clear initial dropdowns
    $(`${initialEquipment} select`).val('');
    $(`${additionalEquipmentStaff}`).empty(); // Remove dynamic staff dropdowns
    $(`${additionalEquipmentField}`).empty(); // Remove dynamic field dropdowns
}

export class LoadAllEquipment{
    loadAllEquDetails(){
        $('#equipmentDetailsTable').empty();
        const tableBody = $("#equipmentDetailsTable");

        const equipmentCodes = [];

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "http://localhost:5050/api/v1/equipment",
                type: "GET",
                success: function (equipment) {  // Assume 'vehicles' is an array of vehicle objects
                    equipment.forEach(equ => {
                        const equDetail = new Equipment(
                            equ.name,
                            equ.type,
                            equ.status,
                            equ.availableCount,
                            equ.field ? equipment.field.fieldCode : "N/A",  // Handle nested staff details
                            equ.staff ? equipment.staff.memberCode : "N/A"
                        );
                        // Add vehicle code to the array
                        equipmentCodes.push(equ.equipmentCode);

                        const row = `
                            <tr>
                                <td class="code">${equ.equipmentCode}</td>
                                <td class="name">${equDetail.name}</td>
                                <td class="vehicleType">${equDetail.type}</td>
                                <td class="status">${equDetail.status}</td>
                                <td class="count">${equDetail.count}</td>
                                <td class="staffMember">${equDetail.assignStaff}</td>
                                <td class="fields">${equDetail.assignField}</td>
                                <td><button class="btn btn-danger delete-button" data-index="${equ.equipmentCode}">Delete</button></td>
                            </tr>
                        `;
                        tableBody.append(row);  // Append each row to the table
                    });

                    $('#equipmentDetailsTable tr').each(function () {
                        const equipmentCode = $(this).find('.code').text(); // Get the code value
                        const count = parseInt($(this).find('.count').text()); // Get the count value (convert to integer)
                        if (equipmentCode && !isNaN(count)) { // Ensure valid values
                            equipmentDetails.push({ equipmentCode, count }); // Add to the array
                        }
                    });
                    // Resolve the promise with the array of vehicle codes
                    resolve(equipmentCodes);
                },
                error: function (xhr, status, error) {
                    alert("Failed to retrieve vehicle data");
                    reject(error);
                }
            });
        });
    }
}