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
});

function loadEquipmentTable(){
    $('#equipmentDetailsTable').empty();
    equipmentDetails.map((equipment,index) => {
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

// Assuming your table rows are in tbody with id "vehicleDetailsTable"
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
$('#updateEquipmentButton').on('click', () => {
    let equipmentName = $("#equipmentName").val();
    let equipmentType = $("#equipmentType").val();
    let equipmentStatus = $("#equipmentStatus").val();
    let count = $("#count").val();

    // Collect multiple updated staff values
    let updatedStaffEquipment = [];
    $("#additionalEquipmentStaff select").each(function () {
        let staffValue = $(this).val();
        if (staffValue) {
            updatedStaffEquipment.push(staffValue);
        }
    });

    // Collect multiple updated field values
    let updatedFieldEquipment = [];
    $("#additionalEquipmentField select").each(function () {
        let fieldValue = $(this).val();
        if (fieldValue) {
            updatedFieldEquipment.push(fieldValue);
        }
    });

    // Update the equipment object with new values
    let equipment = equipmentDetails[clickTableRow];
    equipment.name = equipmentName;
    equipment.type = equipmentType;
    equipment.status = equipmentStatus;
    equipment.count = count;
    equipment.assignStaff = updatedStaffEquipment;
    equipment.assignField = updatedFieldEquipment;

    // Reload the table to reflect updated data
    loadEquipmentTable();
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