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