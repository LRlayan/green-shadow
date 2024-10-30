$(document).ready(function() {
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
    //Add Equipment
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffEquipmentButton').on('click', function() {
        // Create a new div to hold the select and remove button
        const $equipmentContainer = $('<div class="d-flex align-items-center mt-2"></div>');

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
            $equipmentContainer.remove(); // Remove this container when clicked
        });

        // Append select and remove button to the field container
        $equipmentContainer.append($newSelect).append($removeButton);

        // Append the new field container to the additionalStaffField
        $('#additionalStaffEquipment').append($equipmentContainer);
    });
});
