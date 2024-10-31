import Staff from "../model/Staff.js";
import {equipmentDetails, staffDetails} from "../db/db.js"

$(document).ready(function() {
    // Function to add a row with sample data
    function addRowToTable(staffData) {
        const $newRow = $('<tr></tr>');

        // Append data fields as cells in the row
        Object.keys(staffData).forEach(key => {
            $newRow.append(`<td>${staffData[key]}</td>`);
        });

        // Set data attributes for easy access during row click
        $newRow.data("staffData", staffData);

        // Add click event to populate update modal when row is clicked
        $newRow.on("click", function () {
            populateUpdateModal($(this).data("staffData"));
        });

        // Append delete button
        const $deleteBtn = $('<button class="btn btn-danger btn-sm">Delete</button>').on("click", function() {
            // Store the row for deletion reference in modal
            $('#confirmStaffDeleteModal').data('rowToDelete', $newRow);
            // Show confirmation modal
            $('#confirmStaffDeleteModal').modal('show');
        });
        $newRow.append($('<td></td>').append($deleteBtn));

        // Append the new row to the table body
        $('#staffDetailsTable').append($newRow);
    }
    // Function to populate the update modal with data from the selected row
    function populateUpdateModal(staffData) {
        $('#firstNameUpdate').val(staffData.firstName);
        $('#lastNameUpdate').val(staffData.lastName);
        $('#joinedDateUpdate').val(staffData.joinedDate);
        $('#dobUpdate').val(staffData.dob);
        $('#addressLine01Update').val(staffData.buildingNo);
        $('#addressLine02Update').val(staffData.lane);
        $('#addressLine03Update').val(staffData.city);
        $('#addressLine04Update').val(staffData.state);
        $('#addressLine05Update').val(staffData.postalCode);
        $('#ContactNoUpdate').val(staffData.contactNo);
        $('#emailStaffUpdate').val(staffData.email);

        // Function to set combo box values, adding options if missing
        function setComboBoxValue(comboBoxId, value) {
            const $comboBox = $(`#${comboBoxId}`);
            if ($comboBox.find(`option[value="${value}"]`).length === 0) {
                // If the value is missing, add it as an option
                $comboBox.append(new Option(value, value));
            }
            $comboBox.val(value); // Set the selected value
        }

        // Set combo box selections and add missing options if needed
        setComboBoxValue('designationUpdate', staffData.designation);
        setComboBoxValue('genderUpdate', staffData.gender);
        setComboBoxValue('roleStaffUpdate', staffData.role);

        // Populate fields with multiple values
        addDynamicFields('updateField', staffData.field.split(','));
        addDynamicFields('updateStaffLogs', staffData.logs.split(','));
        addDynamicFields('updateVehicle', staffData.vehicle.split(','));
        addDynamicFields('updateEquipment', staffData.equipment.split(','));
    }

    // Event to handle confirmation of deletion
    $('#confirmDeleteYes').on("click", function() {
        // Get the stored row and remove it
        $('#confirmStaffDeleteModal').data('rowToDelete').remove();
        // Hide the confirmation modal
        $('#confirmStaffDeleteModal').modal('hide');
    });

    // Event to handle the "No" button click, hiding the modal explicitly
    $('#confirmStaffDeleteModal .btn-secondary').on("click", function() {
        $('#confirmStaffDeleteModal').modal('hide'); // Explicitly hide the modal
    });

// Function to dynamically generate input fields and set values
    function addDynamicFields(containerId, values) {
        const $container = $('#' + containerId);
        $container.empty(); // Clear any existing inputs

        values.forEach((value, index) => {
            // Create a new input for each value
            const $input = $('<input>')
                .addClass('form-control mb-2')
                .attr('type', 'text')
                .attr('placeholder', `Enter value ${index + 1}`)
                .val(value); // Set the existing value

            $container.append($input);
        });
    }

    //save staff member
    $('#addFieldButtonInStaff').on('click',()=>{
        event.preventDefault();
        // Collect form data
        let firstName = $("#firstName").val();
        let lastName = $("#lastName").val();
        let joinedDate = $("#joinedDate").val();
        let designation = $("#designation").val();
        let gender = $("#gender").val();
        let dob = $("#dob").val();
        let addressLine01 = $("#addressLine01").val();
        let addressLine02 = $("#addressLine02").val();
        let addressLine03 = $("#addressLine03").val();
        let addressLine04 = $("#addressLine04").val();
        let addressLine05 = $("#addressLine05").val();
        let contactNo = $("#ContactNo").val();
        let emailStaff = $("#emailStaff").val();
        let roleStaff = $("#roleStaff").val();

        // Collect multiple field values
        let fieldStaff = [];
        $("#additionalStaffField select").each(function() {
            let fieldValue = $(this).val();
            if (fieldValue) {
                fieldStaff.push(fieldValue);
            }
        });

        // Collect multiple staff values
        let staffVehicle = [];
        $("#additionalStaffVehicle select").each(function() {
            let staffValue = $(this).val();
            if (staffValue) {
                staffVehicle.push(staffValue);
            }
        });

        // Collect multiple staff values
        let staffEquipment = [];
        $("#additionalStaffEquipment select").each(function() {
            let staffValue = $(this).val();
            if (staffValue) {
                staffEquipment.push(staffValue);
            }
        });
        let staffLogs = [];
        let staffDetail = new Staff("01",firstName,lastName,joinedDate,designation,gender,dob,addressLine01,addressLine02,addressLine03,addressLine04,addressLine05,contactNo,emailStaff,roleStaff,fieldStaff,staffVehicle,staffLogs,staffEquipment);
        staffDetails.push(staffDetail);
        loadEquipmentTable();
    });

    function loadEquipmentTable(){
        $('#staffDetailsTable').empty();
        staffDetails.map((staff, index) => {
            const row = `
            <tr>
                <td class="code">${staff.code}</td>
                <td class="fName">${staff.firstName}</td>
                <td class="lName">${staff.lastName}</td>
                <td class="designation">${staff.designation}</td>
                <td class="gender">${staff.gender}</td>
                <td class="joinedDate">${staff.joinedDate}</td>
                <td class="dob">${staff.dob}</td>
                <td class="buildingNo">${staff.addressLine01}</td>
                <td class="lane">${staff.addressLine02}</td>
                <td class="city">${staff.addressLine03}</td>
                <td class="state">${staff.addressLine04}</td>
                <td class="postalCode">${staff.addressLine05}</td>
                <td class="contactNo">${staff.contactNo}</td>
                <td class="email">${staff.email}</td>
                <td class="role">${staff.role}</td>
                <td class="fields">${staff.fieldList.join(', ')}</td>
                <td class="logs">${staff.logList.join(', ')}</td>
                <td class="vehicle">${staff.vehicle}</td>
                <td class="equipment">${staff.equipmentList.join(', ')}</td>
                <td><button class="btn btn-danger delete-button" data-index="${index}">Delete</button></td>
            </tr>
        `;
            $('#staffDetailsTable').append(row);
        });
    }

    //update Staff member
    $('#staffDetailsTable').on('click','tr', ()=>{
        let fName = $(this).find(".fName").text();
        let lName = $(this).find(".lName").text();
        let designation = $(this).find(".designation").text().trim();
        let gender = $(this).find(".gender").text().trim();
        let joinedDate = $(this).find(".joinedDate").text();
        let addressLine01 = $(this).find(".buildingNo").text();
        let addressLine02 = $(this).find(".city").text();
        let addressLine03 = $(this).find(".lane").text();
        let addressLine04 = $(this).find(".state").text();
        let addressLine05 = $(this).find(".postalCode").text();
        let contactNo = $(this).find(".contactNo").text();
        let email = $(this).find(".email").text();
        let role = $(this).find(".role").text().trim();
        let fieldsArray = $(this).find(".fields").text().split(",");
        let logs = $(this).find(".logs").text().split(",");
        let vehicleArray = $(this).find(".vehicle").text().split(",");
        let equipmentArray = $(this).find(".equipment").text().split(",");


        $('#firstNameUpdate').val(fName);
        $('#lastNameUpdate').val(lName);
        $('#joinedDateUpdate').val(joinedDate);
        $('#dobUpdate').val(joinedDate);
        $('#addressLine01Update').val(addressLine01);
        $('#addressLine02Update').val(addressLine02);
        $('#addressLine03Update').val(addressLine03);
        $('#addressLine04Update').val(addressLine04);
        $('#addressLine05Update').val(addressLine05);
        $('#ContactNoUpdate').val(contactNo);
        $('#emailStaffUpdate').val(email);

        // Check if the combo box has an option matching the input value
        $('#roleStaffUpdate option').each(function() {
            if ($(this).val() === role) {
                $('#roleStaffUpdate').val(role);
                return false; // Stop loop once a match is found
            }
        });

        $('#designationUpdate option').each(function() {
            if ($(this).val() === designation) {
                $('#designationUpdate').val(designation);
                return false; // Stop loop once a match is found
            }
        });

        $('#genderUpdate option').each(function() {
            if ($(this).val() === gender) {
                $('#genderUpdate').val(gender);
                return false; // Stop loop once a match is found
            }
        });

        // Clear any existing inputs in the modal's dynamic dropdowns
        $('#updateField').empty();
        $('#updateVehicle').empty();
        $('#updateEquipment').empty();

        // Create input fields for each field ID in fieldsArray
        fieldsArray.forEach(field => {
            const fieldContainer = $('<div class="d-flex align-items-center mb-2"></div>');
            const fieldInput = $(`<input type="text" class="form-control me-2" value="${field.trim()}">`);
            const removeButton = $('<button class="btn btn-danger">Remove</button>');

            removeButton.on('click', function () {
                fieldContainer.remove(); // Remove field input and button when "Remove" is clicked
            });

            fieldContainer.append(fieldInput, removeButton);
            $('#updateField').append(fieldContainer);
        });

        // Create input fields for each vehicle ID in vehicleArray
        vehicleArray.forEach(field => {
            const vehicleContainer = $('<div class="d-flex align-items-center mb-2"></div>');
            const vehicleInput = $(`<input type="text" class="form-control me-2" value="${field.trim()}">`);
            const removeButton = $('<button class="btn btn-danger">Remove</button>');

            removeButton.on('click', function () {
                vehicleContainer.remove(); // Remove field input and button when "Remove" is clicked
            });

            vehicleContainer.append(vehicleInput, removeButton);
            $('#updateVehicle').append(vehicleContainer);
        });

        // Create input fields for each equipment ID in equipmentArray
        equipmentArray.forEach(field => {
            const equipmentContainer = $('<div class="d-flex align-items-center mb-2"></div>');
            const equipmentInput = $(`<input type="text" class="form-control me-2" value="${field.trim()}">`);
            const removeButton = $('<button class="btn btn-danger">Remove</button>');

            removeButton.on('click', function () {
                equipmentContainer.remove(); // Remove field input and button when "Remove" is clicked
            });

            equipmentContainer.append(equipmentInput, removeButton);
            $('#updateEquipment').append(equipmentContainer);
        });
    });

    //Add Field
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffFieldButton').on('click', function() {
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
        $('#additionalStaffField').append($fieldContainer);
    });

    //Add Field Update Modal
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffFieldButtonUpdate').on('click', function() {
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
        $('#additionalStaffFieldUpdate').append($fieldContainer);
    });

    //Add Log
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffLogDetailButton').on('click', function() {
        // Create a new div to hold the select and remove button
        const $logsContainer = $('<div class="d-flex align-items-center mt-2"></div>');

        // Create a new select element with options
        const $newSelect = $('<select class="form-control me-2"></select>');
        const optionLogs = ["L01", "L02", "L03", "L04", "L05"];
        optionLogs.forEach(function(optionValue) {
            $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
        });

        // Create a remove button
        const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');

        // Add click event to remove the field
        $removeButton.on('click', function() {
            $logsContainer.remove(); // Remove this container when clicked
        });

        // Append select and remove button to the field container
        $logsContainer.append($newSelect).append($removeButton);

        // Append the new field container to the additionalStaffField
        $('#additionalStaffLog').append($logsContainer);
    });

    //Add Log Update
    $('#addStaffLogsButtonUpdate').on('click', function() {
        // Create a new div to hold the select and remove button
        const $logsContainer = $('<div class="d-flex align-items-center mt-2"></div>');

        // Create a new select element with options
        const $newSelect = $('<select class="form-control me-2"></select>');
        const optionLogs = ["L01", "L02", "L03", "L04", "L05"];
        optionLogs.forEach(function(optionValue) {
            $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
        });

        // Create a remove button
        const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');

        // Add click event to remove the field
        $removeButton.on('click', function() {
            $logsContainer.remove(); // Remove this container when clicked
        });

        // Append select and remove button to the field container
        $logsContainer.append($newSelect).append($removeButton);

        // Append the new field container to the additionalStaffField
        $('#additionalStaffLogsUpdate').append($logsContainer);
    });

    //Add Vehicle
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffVehicleButton').on('click', function() {
        // Create a new div to hold the select and remove button
        const $vehicleContainer = $('<div class="d-flex align-items-center mt-2"></div>');

        // Create a new select element with options
        const $newSelect = $('<select class="form-control me-2"></select>');
        const optionVehicle = ["V01", "V02", "V03", "V04", "V05"];
        optionVehicle.forEach(function(optionValue) {
            $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
        });

        // Create a remove button
        const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');

        // Add click event to remove the field
        $removeButton.on('click', function() {
            $vehicleContainer.remove(); // Remove this container when clicked
        });

        // Append select and remove button to the field container
        $vehicleContainer.append($newSelect).append($removeButton);

        // Append the new field container to the additionalStaffField
        $('#additionalStaffVehicle').append($vehicleContainer);
    });

    //Add Vehicle Update
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffVehicleButtonUpdate').on('click', function() {
        // Create a new div to hold the select and remove button
        const $vehicleContainer = $('<div class="d-flex align-items-center mt-2"></div>');

        // Create a new select element with options
        const $newSelect = $('<select class="form-control me-2"></select>');
        const optionVehicle = ["V01", "V02", "V03", "V04", "V05"];
        optionVehicle.forEach(function(optionValue) {
            $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
        });

        // Create a remove button
        const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');

        // Add click event to remove the field
        $removeButton.on('click', function() {
            $vehicleContainer.remove(); // Remove this container when clicked
        });

        // Append select and remove button to the field container
        $vehicleContainer.append($newSelect).append($removeButton);

        // Append the new field container to the additionalStaffField
        $('#additionalStaffVehicleUpdate').append($vehicleContainer);
    });

    //Add Equipment
    // Predefined counts for each equipment ID
    const equipmentCounts = {
        "L01": 5,
        "L02": 3,
        "L03": 7,
        "L04": 2,
        "L05": 4
    };

    // jQuery to add a new equipment dropdown with a count input and remove button
    $('#addStaffEquipmentButton').on('click', function() {
        // Create a container for the equipment select, count input, and remove button
        const $equipmentContainer = $('<div class="d-flex align-items-center mt-2"></div>');

        // Create the equipment select element
        const $newSelect = $('<select class="form-control me-2"></select>');
        $newSelect.append('<option value="">Select Equipment</option>'); // Default option
        const optionLogs = ["L01", "L02", "L03", "L04", "L05"];
        optionLogs.forEach(function(optionValue) {
            $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
        });

        // Create a quantity input field
        const $quantityInput = $('<input type="number" class="form-control me-2" placeholder="Count" min="1" value="1" readonly>');

        // Update count input based on selected equipment
        $newSelect.on('change', function() {
            const selectedEquipment = $(this).val();
            if (selectedEquipment && equipmentCounts[selectedEquipment]) {
                $quantityInput.val(equipmentCounts[selectedEquipment]);
            } else {
                $quantityInput.val(1); // Default value if none selected
            }
        });

        // Create a remove button
        const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');
        $removeButton.on('click', function() {
            $equipmentContainer.remove(); // Remove this container when clicked
        });

        // Append the select, quantity input, and remove button to the container
        $equipmentContainer.append($newSelect).append($quantityInput).append($removeButton);

        // Append the new equipment container to the additionalStaffEquipment section
        $('#additionalStaffEquipment').append($equipmentContainer);
    });

    //Add Equipment Update Modal
    // Predefined counts for each equipment ID
    const equipmentCountsUpdate = {
        "L01": 5,
        "L02": 3,
        "L03": 7,
        "L04": 2,
        "L05": 4
    };

    // jQuery to add a new equipment dropdown with a count input and remove button
    $('#addStaffEquipmentButtonUpdate').on('click', function() {
        // Create a container for the equipment select, count input, and remove button
        const $equipmentContainer = $('<div class="d-flex align-items-center mt-2"></div>');

        // Create the equipment select element
        const $newSelect = $('<select class="form-control me-2"></select>');
        $newSelect.append('<option value="">Select Equipment</option>'); // Default option
        const optionLogs = ["L01", "L02", "L03", "L04", "L05"];
        optionLogs.forEach(function(optionValue) {
            $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
        });

        // Create a quantity input field
        const $quantityInput = $('<input type="number" class="form-control me-2" placeholder="Count" min="1" value="1" readonly>');

        // Update count input based on selected equipment
        $newSelect.on('change', function() {
            const selectedEquipment = $(this).val();
            if (selectedEquipment && equipmentCountsUpdate[selectedEquipment]) {
                $quantityInput.val(equipmentCountsUpdate[selectedEquipment]);
            } else {
                $quantityInput.val(1); // Default value if none selected
            }
        });

        // Create a remove button
        const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');
        $removeButton.on('click', function() {
            $equipmentContainer.remove(); // Remove this container when clicked
        });

        // Append the select, quantity input, and remove button to the container
        $equipmentContainer.append($newSelect).append($quantityInput).append($removeButton);

        // Append the new equipment container to the additionalStaffEquipment section
        $('#additionalStaffEquipmentUpdate').append($equipmentContainer);
    });
});
