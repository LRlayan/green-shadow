// Function to add field Ids
$('#addCropFieldButton').on('click', function() {
    const cropInput = $('#crop-FieldId');
    const cropValue = cropInput.val().trim();
    if (cropValue) {
        const cropListDiv = $('#fieldList');
        const cropElement = $('<div></div>').text(cropValue);
        cropListDiv.append(cropElement);
        cropInput.val(''); // Clear the input field
    }
});

// Update button click
$('.card .btn-success').on('click', function() {
    // Get the card's current data
    const card = $(this).closest('.card');
    const cropName = card.find('.card-name').text().replace('Name:', '').trim();
    const scientificName = card.find('.card-scientific').text().replace('Scientific Name:', '').trim();
    const category = card.find('.card-category').text().replace('Category:', '').trim();
    const season = card.find('.card-season').text().replace('Crop Season:', '').trim();
    const field = card.find('.card-FieldId').text().replace('Field ID:', '').trim();
    const log = card.find('.card-LogId').text().replace('Log ID:', '').trim();

    // Set data in modal fields
    $('#updateCropName').val(cropName);
    $('#updateScientificName').val(scientificName);
    $('#updateCategory').val(category);
    $('#updateCropSeason').val(season);

    // Set crop and staff values
    const fieldArray = field.split(',');
    const logArray = log.split(',');

    $('#updateFieldId').empty(); // Clear existing values in crop input
    $('#updateLogId').empty(); // Clear existing values in staff input

    fieldArray.forEach(filedItem => {
        $('#updateFieldId').append(`<input type="text" class="form-control mb-2" value="${filedItem.trim()}">`);
    });

    logArray.forEach(logItem => {
        $('#updateLogId').append(`<input type="text" class="form-control mb-2" value="${logItem.trim()}">`);
    });


    // Show the update modal
    const updateModal = new bootstrap.Modal($('#updateCropModal')[0]);
    updateModal.show();
});

// Submit update form
$('#updateCropForm').on('submit', function(event) {
    event.preventDefault();
    // Perform update logic, close modal, etc.

    // Close the modal after processing
    const updateModal = bootstrap.Modal.getInstance($('#updateCropModal')[0]);
    updateModal.hide();
});

//delete crop card
let cardToDelete; // Variable to store the card to be deleted

// Show confirmation modal when the delete button is clicked
$('.card .btn-danger').on('click', function() {
    cardToDelete = $(this).closest('.card'); // Store the card element to be deleted
    const confirmModal = new bootstrap.Modal($('#confirmCropDeleteModal')[0]);
    confirmModal.show();
});

// Delete the card if "Yes" is clicked in the confirmation modal
$('#confirmCropDeleteButton').on('click', function() {
    if (cardToDelete) {
        cardToDelete.remove(); // Remove the card element from the DOM
        cardToDelete = null; // Reset the variable
    }
    $('#confirmCropDeleteModal').modal('hide'); // Hide the confirmation modal
});

