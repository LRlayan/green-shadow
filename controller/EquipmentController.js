import Equipment from "../model/Equipment.js";
import {equipmentDetails} from "../db/db.js"

let clickTableRow = 0;

//Add Field Modal
$('#addFieldButtonEquipment').on('click', function() {
    addDropdownEquipment("#additionalEquipmentField","#field-equipment",["F01", "F02", "F03", "F04", "F05"])
});

//Add Staff Modal
$('#addStaffButton').on('click', function() {
    addDropdownEquipment("#additionalEquipmentStaff","#staff-equipment",["S01", "S02", "S03", "S04", "S05"])
});

//save equipment
$('#addEquipmentButton').on('click',()=>{
    event.preventDefault();

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
            staffEquipment.push(staffValue);
        }
    });

    // Collect multiple field values
    let fieldEquipment = [];
    $("#additionalEquipmentField select").each(function() {
        let fieldValue = $(this).val();
        if (fieldValue) {
            fieldEquipment.push(fieldValue);
        }
    });

    let equipmentDetail = new Equipment(equipmentName,equipmentType,equipmentStatus,count,staffEquipment,fieldEquipment);
    equipmentDetails.push(equipmentDetail);
    loadEquipmentTable();
    clearEquipmentModalFields("#equipmentName","#equipmentType","#equipmentStatus","#count","#initialStaff select","#initialEquipment select","#additionalEquipmentStaff","#additionalEquipmentField");
});

function loadEquipmentTable(){
    $('#equipmentDetailsTable').empty();
    equipmentDetails.map((equipment, index) => {
        const row = `
            <tr>
                <td class="code">${equipment.code}</td>
                <td class="name">${equipment.name}</td>
                <td class="vehicleType">${equipment.type}</td>
                <td class="status">${equipment.status}</td>
                <td class="count">${equipment.count}</td>
                <td class="staffMember">${equipment.assignStaff.join(', ')}</td>
                <td class="fields">${equipment.assignField.join(', ')}</td>
                <td><button class="btn btn-danger delete-button" data-index="${index}">Delete</button></td>
            </tr>
        `;
        $('#equipmentDetailsTable').append(row);
    });
}

// set values for update modal
$('#equipmentDetailsTable').on('click', 'tr', function () {
    // Clear any existing inputs in the modal's dynamic dropdowns
    $('#additionalStaffEquUpdate').empty();
    $('#additionalFieldEquipmentUpdate').empty();

    // Get values from the selected row
    let name = $(this).find(".name").text();
    let type = $(this).find(".vehicleType").text();
    let status = $(this).find(".status").text();
    let count = $(this).find(".count").text();

    clickTableRow = $(this).index();

    // Split multiple values in "staffMember" and "fields" columns
    let staffMemberArray = $(this).find(".staffMember").text().split(", "); // Assuming comma-separated
    let fieldsArray = $(this).find(".fields").text().split(", "); // Assuming comma-separated

    // Populate the modal fields with values from the row
    $('#equipmentNameUpdate').val(name);
    $('#equipmentTypeUpdate').val(type);
    $('#equipmentStatusUpdate').val(status);
    $('#countUpdate').val(count);

    populateDropdownEquipment("#updateEquipmentFieldId",fieldsArray,["F01", "F02", "F03", "F04", "F05"]);
    populateDropdownEquipment("#updateStaffEquipment",staffMemberArray,["S01", "S02", "S03", "S04", "S05"]);
});

// Update equipment
$('#EquipmentButtonUpdate').on('click', () => {
    // Get updated values from modal inputs
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

    // Update the selected equipment object with the new values
    let equipment = equipmentDetails[clickTableRow];
    equipment.name = equipmentName;
    equipment.type = equipmentType;
    equipment.status = equipmentStatus;
    equipment.count = count;
    equipment.assignStaff = updatedStaffEquipment;
    equipment.assignField = updatedFieldEquipment;

    // Reload the equipment table to reflect updated data
    loadEquipmentTable();
    clearEquipmentModalFields("#equipmentNameUpdate","#equipmentTypeUpdate","#equipmentStatusUpdate","#countUpdate","#initialFieldEquipmentUpdate select","#initialStaffEquUpdate select","#additionalStaffEquUpdate","#additionalFieldEquipmentUpdate");

    // Close the modal after updating
    $('#updateEquipment-modal').modal('hide');
});

//Add Field Update Modal
$('#addFieldButtonUpdate').on('click', function() {
    addDropdownEquipment("#additionalFieldEquipmentUpdate","#equipment-fieldUpdate",["F01", "F02", "F03", "F04", "F05"])
});

//Add Staff Update Modal
$('#addStaffButtonUpdate').on('click', function() {
    addDropdownEquipment("#additionalStaffEquUpdate","#equ-staffUpdate",["S01", "S02", "S03", "S04", "S05"])
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
    const index = $(this).data('index'); // Get the stored index
    equipmentDetails.splice(index, 1); // Remove the vehicle from the array
    loadEquipmentTable(); // Refresh the table
    $('#confirmEquipmentDeleteModal').modal('hide'); // Hide the modal

    // Ensure the modal and backdrop are fully removed when hidden (overlay)
    $('#confirmEquipmentDeleteModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open'); // Removes the modal-open class from body
        $('.modal-backdrop').remove();       // Removes the leftover backdrop element
    });
});

//No button
$('#confirmEquDeleteNo').on('click',()=>{
    $('#confirmEquipmentDeleteModal').modal('hide'); // Hide the modal
});

// Listen for the modal to be shown
$('#equipment-modal').on('show.bs.modal', function (event) {
    // Get the button that triggered the modal
    var button = $(event.relatedTarget);

    // Check if the data-action is 'add'
    if (button.data('action') === 'add') {
        // Clear the form inputs
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

function populateDropdownEquipment(container, selectedValues, options) {
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