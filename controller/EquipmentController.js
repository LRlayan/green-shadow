import Equipment from "../model/Equipment.js";
import {equipmentDetails} from "../db/db.js"

let clickTableRow = 0;

//Add Field
// jQuery to add a new dropdown with predefined options and a remove button
$('#addFieldButtonEquipment').on('click', function() {
    // Create a new div to hold the select and remove button
    const $fieldContainer = $('<div class="d-flex align-items-center mt-2"></div>');

    // Create a new select element with options
    const $newSelect = $('<select class="form-control me-2"></select>');
    const options = ["F01", "F02", "F03", "F04", "F05"];
    options.forEach(function(optionValue) {
        $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
    });

    // Create a remove button
    const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');

    // Add click event to remove the field
    $removeButton.on('click', function() {
        $fieldContainer.remove(); // Remove this container when clicked
    });

    // Append select and remove button to the field container
    $fieldContainer.append($newSelect).append($removeButton);

    // Append the new field container to the additionalStaffField
    $('#additionalEquipmentField').append($fieldContainer);
});

//Add Staff
// jQuery to add a new dropdown with predefined options and a remove button
$('#addStaffButton').on('click', function() {
    // Create a new div to hold the select and remove button
    const $fieldContainer = $('<div class="d-flex align-items-center mt-2"></div>');

    // Create a new select element with options
    const $newSelect = $('<select class="form-control me-2"></select>');
    const options = ["S01", "S02", "S03", "S04", "S05"];
    options.forEach(function(optionValue) {
        $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
    });

    // Create a remove button
    const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');

    // Add click event to remove the field
    $removeButton.on('click', function() {
        $fieldContainer.remove(); // Remove this container when clicked
    });

    // Append select and remove button to the field container
    $fieldContainer.append($newSelect).append($removeButton);

    // Append the new field container to the additionalStaffField
    $('#additionalEquipmentStaff').append($fieldContainer);
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

// Assuming your table rows are in tbody with id "EquipmentDetailsTable"
$('#equipmentDetailsTable').on('click', 'tr', function () {
    // Get values from the selected row
    let name = $(this).find(".name").text();
    let type = $(this).find(".vehicleType").text();
    let status = $(this).find(".status").text();
    let count = $(this).find(".count").text();

    // Split multiple values in "staffMember" and "fields" columns
    let staffMemberArray = $(this).find(".staffMember").text().split(","); // Assuming comma-separated
    let fieldsArray = $(this).find(".fields").text().split(","); // Assuming comma-separated

    // Populate the modal fields with values from the row
    $('#equipmentNameUpdate').val(name);
    $('#equipmentTypeUpdate').val(type);
    $('#equipmentStatusUpdate').val(status);
    $('#countUpdate').val(count);

    // Clear any existing inputs in the modal's dynamic dropdowns
    $('#updateEquipmentFieldId').empty();
    $('#updateStaffEquipment').empty();

    // Create input fields for each field ID in fieldsArray
    fieldsArray.forEach(field => {
        const fieldContainer = $('<div class="d-flex align-items-center mb-2"></div>');
        const fieldInput = $(`<input type="text" class="form-control me-2" value="${field.trim()}">`);
        const removeButton = $('<button class="btn btn-danger">Remove</button>');

        removeButton.on('click', function () {
            fieldContainer.remove(); // Remove field input and button when "Remove" is clicked
        });

        fieldContainer.append(fieldInput, removeButton);
        $('#updateEquipmentFieldId').append(fieldContainer);
    });

    // Create input fields for each staff member in staffMemberArray
    staffMemberArray.forEach(staff => {
        const staffContainer = $('<div class="d-flex align-items-center mb-2"></div>');
        const staffInput = $(`<input type="text" class="form-control me-2" value="${staff.trim()}">`);
        const removeButton = $('<button class="btn btn-danger">Remove</button>');

        removeButton.on('click', function () {
            staffContainer.remove(); // Remove staff input and button when "Remove" is clicked
        });

        staffContainer.append(staffInput, removeButton);
        $('#updateStaffEquipment').append(staffContainer);
    });
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
    $("#updateStaffEquipment input").each(function() {
        let staffValue = $(this).val();
        if (staffValue) {
            updatedStaffEquipment.push(staffValue);
        }
    });

    // Collect updated field values
    let updatedFieldEquipment = [];
    $("#updateEquipmentFieldId input").each(function() {
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
// jQuery to add a new dropdown with predefined options and a remove button
$('#addFieldButtonUpdate').on('click', function() {
    // Create a new div to hold the select and remove button
    const $fieldContainer = $('<div class="d-flex align-items-center mt-2"></div>');

    // Create a new select element with options
    const $newSelect = $('<select class="form-control me-2"></select>');
    const options = ["F01", "F02", "F03", "F04", "F05"];
    options.forEach(function(optionValue) {
        $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
    });

    // Create a remove button
    const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');

    // Add click event to remove the field
    $removeButton.on('click', function() {
        $fieldContainer.remove(); // Remove this container when clicked
    });

    // Append select and remove button to the field container
    $fieldContainer.append($newSelect).append($removeButton);

    // Append the new field container to the additionalStaffField
    $('#additionalFieldEquipmentUpdate').append($fieldContainer);
});

//Add Staff Update Modal
$('#addStaffButtonUpdate').on('click', function() {
    // Create a new div to hold the select and remove button
    const $staffContainer = $('<div class="d-flex align-items-center mt-2"></div>');

    // Create a new select element with options
    const $newSelect = $('<select class="form-control me-2"></select>');
    const options = ["S01", "S02", "S03", "S04", "S05"];
    options.forEach(function(optionValue) {
        $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
    });

    // Create a remove button
    const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');

    // Add click event to remove the field
    $removeButton.on('click', function() {
        $staffContainer.remove(); // Remove this container when clicked
    });

    // Append select and remove button to the field container
    $staffContainer.append($newSelect).append($removeButton);

    // Append the new field container to the additionalStaffField
    $('#additionalStaffEquUpdate').append($staffContainer);
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
});

//No button
$('#confirmEquDeleteNo').on('click',()=>{
    $('#confirmEquipmentDeleteModal').modal('hide'); // Hide the modal
});

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