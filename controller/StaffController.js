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

    // Sample data for demonstration
    const sampleStaffData = {
        code: "S001",
        firstName: "John",
        lastName: "Doe",
        designation: "Manager",
        gender: "Male",
        joinedDate: "2023-01-10",
        dob: "1990-05-15",
        buildingNo: "123",
        lane: "Greenway",
        city: "Springfield",
        state: "IL",
        postalCode: "62704",
        contactNo: "123-456-7890",
        email: "john.doe@example.com",
        role: "Admin",
        field: "F02,F01",
        logs: "L01,L02,L03",
        vehicle: "Truck,Car",
        equipment: "Shovel,Plough"
    };

    // Add the sample row
    addRowToTable(sampleStaffData);

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
    $(document).ready(function() {
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
    });
});
