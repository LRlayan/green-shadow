$(document).ready(function() {
    // Sample data to insert (you could replace this with real data from an API or form)
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

    // Call the function to add a row with sample data
    addRowToTable(sampleStaffData);

        function addRowToTable(staffData) {
        // Create a new row
        const $newRow = $('<tr></tr>');

        // Append each data field as a cell in the row
        $newRow.append(`<td>${staffData.code}</td>`);
        $newRow.append(`<td>${staffData.firstName}</td>`);
        $newRow.append(`<td>${staffData.lastName}</td>`);
        $newRow.append(`<td>${staffData.designation}</td>`);
        $newRow.append(`<td>${staffData.gender}</td>`);
        $newRow.append(`<td>${staffData.joinedDate}</td>`);
        $newRow.append(`<td>${staffData.dob}</td>`);
        $newRow.append(`<td>${staffData.buildingNo}</td>`);
        $newRow.append(`<td>${staffData.lane}</td>`);
        $newRow.append(`<td>${staffData.city}</td>`);
        $newRow.append(`<td>${staffData.state}</td>`);
        $newRow.append(`<td>${staffData.postalCode}</td>`);
        $newRow.append(`<td>${staffData.contactNo}</td>`);
        $newRow.append(`<td>${staffData.email}</td>`);
        $newRow.append(`<td>${staffData.role}</td>`);
        $newRow.append(`<td>${staffData.field}</td>`);
        $newRow.append(`<td>${staffData.logs}</td>`);
        $newRow.append(`<td>${staffData.vehicle}</td>`);
        $newRow.append(`<td>${staffData.equipment}</td>`);

        // Append the new row to the table body
        $('#staffDetailsTable').append($newRow);
    }


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
