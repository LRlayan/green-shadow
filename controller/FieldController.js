function previewImage(inputId, previewId) {
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
    // Add a new staff input field when the "Add member" button is clicked
    $('#addFieldStaffButton').on('click', function() {
        // Create a new input field for an additional staff member entry
        const newLogInput = $('<div class="input-group mt-2"><input type="text" class="form-control" placeholder="Enter staff member"><button type="button" class="btn btn-danger removeLogButton">Remove</button></div>');

        // Append the new input field to the additionalLogs container
        $('#additionalStaff').append(newLogInput);
    });

    // Remove a log input field when the "Remove" button is clicked
    $('#additionalStaff').on('click', '.removeLogButton', function() {
        $(this).closest('.input-group').remove(); // Remove the parent input group
    });

    // Add a new crop input field when the "Add crop" button is clicked
    $('#addFieldCropButton').on('click', function() {
        // Create a new input field for an additional crop entry
        const newLogInput = $('<div class="input-group mt-2"><input type="text" class="form-control" placeholder="Enter crop details"><button type="button" class="btn btn-danger removeLogButton">Remove</button></div>');

        // Append the new input field to the additionalLogs container
        $('#additionalCrop').append(newLogInput);
    });

    // Remove a log input field when the "Remove" button is clicked
    $('#additionalCrop').on('click', '.removeLogButton', function() {
        $(this).closest('.input-group').remove(); // Remove the parent input group
    });

    //update modal ----------------------------------------------------------------------------------------
    $('.card .btn-success').on('click', function() {
        // Get the card's current data
        const card = $(this).closest('.card');
        const fieldCode = card.find('.card-filedCode').text().replace('Code:', '').trim();
        const fieldName = card.find('.card-name').text().replace('Name:', '').trim();
        const location = card.find('.card-location').text().replace('Location:', '').trim();
        const extentSize = card.find('.card-extent-size').text().replace('Extent Size:', '').trim();
        const crop = card.find('.card-crop').text().replace('Crop:', '').trim();
        const staff = card.find('.card-staff').text().replace('Staff:', '').trim();
        const log = card.find('.card-log').text().replace('Log:', '').trim();

        // Set data in modal fields
        $('#updateFieldCode').val(fieldCode);
        $('#updateFieldName').val(fieldName);
        $('#updateFieldLocation').val(location);
        $('#updateExtentSize').val(extentSize);

        // Set crop and staff values
        const cropArray = crop.split(',');
        const staffArray = staff.split(',');
        const logArray = log.split(',');

        $('#updateCrop').empty(); // Clear existing values in crop input
        $('#updateStaff').empty(); // Clear existing values in staff input
        $('#updateLogs').empty(); // Clear existing values in staff input

        cropArray.forEach(cropItem => {
            $('#updateCrop').append(`<input type="text" class="form-control mb-2" value="${cropItem.trim()}">`);
        });

        staffArray.forEach(staffItem => {
            $('#updateStaff').append(`<input type="text" class="form-control mb-2" value="${staffItem.trim()}">`);
        });

        logArray.forEach(logsItem => {
            $('#updateLogs').append(`<input type="text" class="form-control mb-2" value="${logsItem.trim()}">`);
        });

        // Show the update modal
        const updateModal = new bootstrap.Modal($('#updateFieldModal')[0]);
        updateModal.show();
    });

    // Submit update form
    $('#updateFieldForm').on('submit', function(event) {
        event.preventDefault();
        // Perform update logic, close modal, etc.
    });

    // delete modal ----------------------------------------------------------------------------------------
    let cardToDelete; // Variable to store the card to be deleted

    // Show confirmation modal when the delete button is clicked
    $('.card .btn-danger').on('click', function() {
        cardToDelete = $(this).closest('.card'); // Store the card element to be deleted
        const confirmModal = new bootstrap.Modal($('#confirmDeleteModal')[0]);
        confirmModal.show();
    });

    // Delete the card if "Yes" is clicked in the confirmation modal
    $('#confirmDeleteButton').on('click', function() {
        if (cardToDelete) {
            cardToDelete.remove(); // Remove the card element from the DOM
            cardToDelete = null; // Reset the variable
        }
        $('#confirmDeleteModal').modal('hide'); // Hide the confirmation modal
    });
});



