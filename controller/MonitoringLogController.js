// Function to add field Ids
$('#addLogFieldButton').on('click', function() {
    const filedInput = $('#log-FieldId');
    const fieldValue = filedInput.val().trim();
    if (fieldValue) {
        const filedListDiv = $('#logFieldList');
        const filedElement = $('<div></div>').text(fieldValue);
        filedListDiv.append(filedElement);
        filedInput.val(''); // Clear the input field
    }
});

// Function to add crops Ids
$('#addLogCropButton').on('click', function() {
    const cropInput = $('#log-cropId');
    const cropValue = cropInput.val().trim();
    if (cropValue) {
        const cropListDiv = $('#logCropList');
        const cropElement = $('<div></div>').text(cropValue);
        cropListDiv.append(cropElement);
        cropInput.val(''); // Clear the input field
    }
});

// Function to add staff Ids
$('#addLogStaffButton').on('click', function() {
    const staffInput = $('#log-staffId');
    const staffValue = staffInput.val().trim();
    if (staffValue) {
        const staffListDiv = $('#logStaffList');
        const staffElement = $('<div></div>').text(staffValue);
        staffListDiv.append(staffElement);
        staffInput.val(''); // Clear the input field
    }
});

// Update button click
$('.card .btn-success').on('click', function() {
    // Get the card's current data
    const card = $(this).closest('.card');
    const logDate = card.find('.card-log-date').text().replace('Log Date:', '').trim();
    const logDetails = card.find('.card-log-details').text().replace('Log Details:', '').trim();
    const field = card.find('.card-log-fields').text().replace('Field:', '').trim();
    const crop = card.find('.card-log-crop').text().replace('Crop:', '').trim();
    const staff = card.find('.card-log-staff').text().replace('Staff:', '').trim();

    // Set data in modal fields
    $('#updateLogDate').val(logDate);
    $('#updateLog-details').val(logDetails);

    // Set field, crop and staff values
    const fieldArray = field.split(',');
    const cropArray = crop.split(',');
    const staffArray = staff.split(',');

    $('#updateLogFieldId').empty(); // Clear existing values in field input
    $('#updateLogCropId').empty(); // Clear existing values in crop input
    $('#updateLogStaffId').empty(); // Clear existing values in staff input

    fieldArray.forEach(filedItem => {
        $('#updateLogFieldId').append(`<input type="text" class="form-control mb-2" value="${filedItem.trim()}">`);
    });

    cropArray.forEach(cropItem => {
        $('#updateLogCropId').append(`<input type="text" class="form-control mb-2" value="${cropItem.trim()}">`);
    });

    staffArray.forEach(staffItem => {
        $('#updateLogStaffId').append(`<input type="text" class="form-control mb-2" value="${staffItem.trim()}">`);
    });


    // Show the update modal
    const updateModal = new bootstrap.Modal($('#updateMonitoringLogModal')[0]);
    updateModal.show();
});

// Submit update form
$('#updateLogForm').on('submit', function(event) {
    event.preventDefault();
    // Perform update logic, close modal, etc.

    // Close the modal after processing
    const updateModal = bootstrap.Modal.getInstance($('#updateMonitoringLogModal')[0]);
    updateModal.hide();
});
