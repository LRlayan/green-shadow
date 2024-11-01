export function previewLogImage(inputId, previewId) {
    const input = $(`#${inputId}`)[0];
    const preview = $(`#${previewId}`);

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.attr('src', e.target.result);
            preview.removeClass('d-none'); // Show the image preview
        };

        reader.readAsDataURL(input.files[0]); // Convert the image file to base64
    }
}

$(document).ready(function() {
    // Handle form submission
    $('#addLogButton').on('click', function (e) {
        e.preventDefault(); // Prevent form from actually submitting

        // Retrieve form values
        let logDate = $('#logDate').val();
        let details = $('#log-details').val();
        let fieldIds = []; // Sample field IDs
        let cropIds = []; // Array to store crop IDs
        let staffIds = []; // Array to store staff IDs

        // Collect all crop IDs from main and additional selects
        $('#log-filedId').val() && fieldIds.push($('#log-filedId').val());
        $('#additionalLogField select').each(function () {
            fieldIds.push($(this).val()); // Add each non-empty additional select value
        });

        // Collect all staff IDs from main and additional selects
        $('#log-cropId').val() && cropIds.push($('#log-cropId').val());
        $('#additionalLogCrop select').each(function () {
            cropIds.push($(this).val());
        });

        // Collect all staff IDs from main and additional selects
        $('#log-staffId').val() && staffIds.push($('#log-staffId').val());
        $('#additionalLogStaff select').each(function () {
            staffIds.push($(this).val());
        });

        // Clean up arrays to remove any empty values
        fieldIds = fieldIds.filter(id => id);
        cropIds = cropIds.filter(id => id);
        staffIds = staffIds.filter(id => id);

        let logImage = $('#previewCropLog').attr('src'); // Preview image 1

        let newLogCard = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card text-white" style="background-color: #2b2b2b; border: 1px solid gray;">
                            <div class="card-image-container">
                                <img src="${logImage}" class="card-img-top" alt="log Image">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Log Details</h5>
                                <p class="card-log-code"><strong>Log Code:</strong>C${Math.floor(Math.random() * 100)}</p>
                                <p class="card-log-date"><strong>Log Date:</strong>${logDate}</p>
                                <p class="card-log-details"><strong>Log Details:</strong>${details}</p>
                                <p class="card-log-fields"><strong>Field:</strong>${fieldIds.join(', ')}</p>
                                <p class="card-log-crop"><strong>Crop:</strong>${cropIds.join(', ')}</p>
                                <p class="card-log-staff"><strong>Staff:</strong>${staffIds.join(', ')}</p>
                                <div class="d-flex justify-content-between">
                                    <button class="btn btn-success flex-grow-1 me-2">Update</button>
                                    <button class="btn btn-danger flex-grow-1">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
    `;

        // Append the new card to the row container
        $('#logCard').append(newLogCard);

        // Reset the form and previews
        $('#logForm')[0].reset();
        $('#previewCropLog').addClass('d-none');
        $('#newMonitoringLogModal').modal('hide');
    });

    // Preview image functionality
    $('#logCropImage').on('change', function () {
        const [file] = this.files;
        if (file) {
            $('#previewCropLog').removeClass('d-none').attr('src', URL.createObjectURL(file));
        }
    });

    //Add Crop Combo Box
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addLogCropButton').on('click', function() {
        // Create a new div to hold the select and remove button
        const $cropContainer = $('<div class="d-flex align-items-center mt-2"></div>');

        // Create a new select element with options
        const $newSelect = $('<select class="form-control me-2"></select>');
        const options = ["C01", "C02", "C03", "C04", "C05"];
        options.forEach(function(optionValue) {
            $newSelect.append(`<option value="${optionValue}">${optionValue}</option>`);
        });

        // Create a remove button
        const $removeButton = $('<button type="button" class="btn btn-danger">Remove</button>');

        // Add click event to remove the field
        $removeButton.on('click', function() {
            $cropContainer.remove(); // Remove this container when clicked
        });

        // Append select and remove button to the field container
        $cropContainer.append($newSelect).append($removeButton);

        // Append the new field container to the additionalStaffField
        $('#additionalLogCrop').append($cropContainer);
    });

    //Add Field Combo Box
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addLogFieldButton').on('click', function() {
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

        // Append the new field container to the additionalLogField
        $('#additionalLogField').append($fieldContainer);
    });

    //Add staff Combo Box
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addLogStaffButton').on('click', function() {
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

        // Append the new field container to the additionalLogField
        $('#additionalLogStaff').append($staffContainer);
    });

// Update button click ----------------------------------------------------------------------------------------
//     $('.card .btn-success').on('click', function () {
//         // Get the card's current data
//         const card = $(this).closest('.card');
//         const logCode = card.find('.card-log-code').text().replace('Log Code:', '').trim();
//         const logDate = card.find('.card-log-date').text().replace('Log Date:', '').trim();
//         const logDetails = card.find('.card-log-details').text().replace('Log Details:', '').trim();
//         const field = card.find('.card-log-fields').text().replace('Field:', '').trim();
//         const crop = card.find('.card-log-crop').text().replace('Crop:', '').trim();
//         const staff = card.find('.card-log-staff').text().replace('Staff:', '').trim();
//
//         // Set data in modal fields
//         $('#updateLogCode').val(logCode);
//         $('#updateLogDate').val(logDate);
//         $('#updateLog-details').val(logDetails);
//
//         // Set field, crop and staff values
//         const fieldArray = field.split(',');
//         const cropArray = crop.split(',');
//         const staffArray = staff.split(',');
//
//         $('#updateLogFieldId').empty(); // Clear existing values in field input
//         $('#updateLogCropId').empty(); // Clear existing values in crop input
//         $('#updateLogStaffId').empty(); // Clear existing values in staff input
//
//         fieldArray.forEach(filedItem => {
//             $('#updateLogFieldId').append(`<input type="text" class="form-control mb-2" value="${filedItem.trim()}">`);
//         });
//
//         cropArray.forEach(cropItem => {
//             $('#updateLogCropId').append(`<input type="text" class="form-control mb-2" value="${cropItem.trim()}">`);
//         });
//
//         staffArray.forEach(staffItem => {
//             $('#updateLogStaffId').append(`<input type="text" class="form-control mb-2" value="${staffItem.trim()}">`);
//         });
//
//
//         // Show the update modal
//         const updateModal = new bootstrap.Modal($('#updateMonitoringLogModal')[0]);
//         updateModal.show();
//     });

// // Submit update form
//     $('#updateLogForm').on('submit', function (event) {
//         event.preventDefault();
//         // Perform update logic, close modal, etc.
//
//         // Close the modal after processing
//         const updateModal = bootstrap.Modal.getInstance($('#updateMonitoringLogModal')[0]);
//         updateModal.hide();
//     });

    //delete modal ----------------------------------------------------------------------------------------
    let cardToDelete; // Variable to store the card to be deleted

    // Show confirmation modal when the delete button is clicked
    $('.card .btn-danger').on('click', function() {
        cardToDelete = $(this).closest('.card'); // Store the card element to be deleted
        const confirmModal = new bootstrap.Modal($('#confirmLogDeleteModal')[0]);
        confirmModal.show();
    });

    // Delete the card if "Yes" is clicked in the confirmation modal
    $('#confirmLogDeleteButton').on('click', function() {
        if (cardToDelete) {
            cardToDelete.remove(); // Remove the card element from the DOM
            cardToDelete = null; // Reset the variable
        }
        $('#confirmLogDeleteModal').modal('hide'); // Hide the confirmation modal
    });
});