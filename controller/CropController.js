let cardCount = 0;
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

    $('#newCropButton').on('click',function (){
        clearAddModal();
    });

    // Handle form submission
    $('#cropForm').on('submit', function (e) {
        cardCount++;
        e.preventDefault(); // Prevent form from actually submitting

        // Retrieve form values
        let cropName = $('#cropName').val();
        let scientificName = $('#crop-scientificName').val();
        let category = $('#crop-Category').val();
        let season = $('#crop-season').val();
        let fieldIds = []; // Initialize an array to store field IDs
        let logIds=["L01","L02"];

        // Collect all field IDs from the main select and additional fields
        $('#crop-FieldId').val() && fieldIds.push($('#crop-FieldId').val()); // Add main select value if not empty
        $('#additionalField select').each(function () {
            fieldIds.push($(this).val()); // Collect each additional select value
        });

        // Remove empty values (if any)
        fieldIds = fieldIds.filter(id => id);

        let cropImage = $('#previewCropImg').attr('src'); // Use the image preview if available

        // Create new card HTML
        let newCard = `
            <div class="col-md-6 col-lg-4 mb-4" id="card${cardCount}">
                <div class="card text-white" style="background-color: #2b2b2b; border: 1px solid gray;">
                    <div class="card-image-container">
                        <img src="${cropImage}" class="card-img-top image-preview" alt="Crop Image">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">Crop Details</h5>
                        <p class="card-cropCode"><strong>Code:</strong> C${Math.floor(Math.random() * 100)}</p>
                        <p class="card-name"><strong>Name:</strong> ${cropName}</p>
                        <p class="card-scientific"><strong>Scientific Name:</strong> ${scientificName}</p>
                        <p class="card-category"><strong>Category:</strong> ${category}</p>
                        <p class="card-season"><strong>Crop Season:</strong> ${season}</p>
                        <p class="card-FieldId"><strong>Field ID:</strong> ${fieldIds.join(', ')}</p>
                        <p class="card-logs"><strong>Logs:</strong> ${logIds.join(', ')}</p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-success flex-grow-1 me-2 update-button" data-card-id="card${cardCount}">Update</button>
                            <button class="btn btn-danger flex-grow-1">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append the new card to the row container
        $('#cropCard').append(newCard);

        // Reset the form
        $('#cropForm')[0].reset();
        $('#previewCrop').addClass('d-none'); // Hide image preview
        $('#newCropModal').modal('hide'); // Hide the modal
    });

    $('#cropImageInput').on('click',function (){
        previewCropImage("#cropImageInput","#previewCropImg");
    });

    $('#updateCropImage').on('click',function (){
        previewCropImage("#updateCropImage","#updatePreview");
    });

// Preview image in modal when file input changes
function previewCropImage(imageInputId,imgPreviewId){
    $(`${imageInputId}`).on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $(`${imgPreviewId}`).attr('src', e.target.result).removeClass('d-none').show(); // Remove d-none and display the image
            };
            reader.readAsDataURL(file);
        } else {
            $(`${imgPreviewId}`).addClass('d-none'); // Hide if no file is selected
        }
    });
}

    // Preview image functionality
    $('#cropImage').on('change', function () {
        const [file] = this.files;
        if (file) {
            $('#previewCrop').removeClass('d-none').attr('src', URL.createObjectURL(file));
        }
    });

    //Add Field
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addFieldButton').on('click', function() {
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
        $('#additionalField').append($fieldContainer);
    });


// Handle update button click
$('#cropCard').on('click', '.update-button', function() {
    const cardId = $(this).data('card-id');
    const cropCard = $(`#${cardId}`);

    // Populate modal with card details for updating
    $('#updateCropName').val(cropCard.find('.card-name').text().replace('Name:', '').trim());
    $('#updateScientificName').val(cropCard.find('.card-scientific').text().replace('Scientific Name: ', '').trim());
    $('#updateCategory').val(cropCard.find('.card-category').text().replace('Category: ', ''));
    $('#updateCropSeason').val(cropCard.find('.card-season').text().replace('Crop Season: ', ''));
    let field = cropCard.find('.card-FieldId').text().replace('Field ID:', '').trim().split(', ').map(item => item.trim());
    let log = cropCard.find('.card-logs').text().replace('Logs:', '').trim().split(', ').map(item => item.trim());
    $('#updatePreview').attr('src', cropCard.find('.image-preview').attr('src')).removeClass('d-none');
    $('#cropImageInput').val(''); // Clear file input for new upload
    $('#updateCropModalButton').data('card-id', cardId); // Set action and card ID
    $('#updateCropModal').modal('show');

    populateDropdownCrop('#updateFieldId', field, ["F01", "F02", "F03", "F04", "F05"]);
    populateDropdownCrop('#updateLogId', log, ["L01", "L02", "L03", "L04", "L05"]);
});

//crop card update
$('#updateCropModalButton').on('click',function (){

    let cropName = $('#updateCropName').val();
    let scientificName = $('#updateScientificName').val();
    let category = $('#updateCategory').val();
    let season = $('#updateCropSeason').val();

    let updatedCropField = [];
    $("#updateFieldId select").each(function() {
        let fieldValue = $(this).val();
        if (fieldValue) {
            updatedCropField.push(fieldValue);
        }
    });

    // Collect values from all Field dropdowns
    $('#additionalFieldInCropUpdate select').each(function () {
        const selectedValue = $(this).val();
        if (selectedValue) updatedCropField.push(selectedValue);
    });

    let updatedCropLogs = [];
    $("#updateLogId select").each(function() {
        let logValue = $(this).val();
        if (logValue) {
            updatedCropLogs.push(logValue);
        }
    });

    // Collect values from all Field dropdowns
    $('#additionalLogInCropUpdate select').each(function () {
        const selectedValue = $(this).val();
        if (selectedValue) updatedCropLogs.push(selectedValue);
    });

    let cropImage = $('#updatePreview').attr('src'); // Use the image preview if available

    // Update existing card details
    const cardId = $(this).data('card-id'); //update button in card
    const cropCard = $(`#${cardId}`);

    cropCard.find('.card-name').text(`Name: ${cropName}`);
    cropCard.find('.card-scientific').text(`Scientific Name: ${scientificName}`);
    cropCard.find('.card-category').text(`Category: ${category}`);
    cropCard.find('.card-season').text(`Crop Season: ${season}`);
    cropCard.find('.card-FieldId').text(`Field ID: ${updatedCropField.join(', ')}`);
    cropCard.find('.card-logs').text(`Logs: ${updatedCropLogs.join(', ')}`);
    cropCard.find('.image-preview').attr('src', cropImage);
    $('#updateCropModal').modal('hide'); // Close modal
});

function populateDropdownCrop(container, selectedValues, options) {
    $(container).empty();
    selectedValues.forEach(value => {
        // Create a wrapper div for each dropdown and the remove button
        const dropdownWrapper = $('<div class="dropdown-wrapper mb-3" style="display: flex; align-items: center;"></div>');

        // Create the dropdown
        const dropdown = $('<select class="form-control me-2"></select>');
        options.forEach(option => {
            dropdown.append(`<option value="${option}" ${option.trim() === value ? 'selected' : ''}>${option}</option>`);
        });

        // Create the remove button
        const removeButton = $('<button type="button" class="btn btn-danger ml-2">Remove</button>');

        // Add click event to remove the dropdown when the button is clicked
        removeButton.click(function() {
            dropdownWrapper.remove();
        });

        // Append dropdown and remove button to the wrapper
        dropdownWrapper.append(dropdown);
        dropdownWrapper.append(removeButton);

        // Append the wrapper to the container
        $(container).append(dropdownWrapper);
    });
}


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

function clearAddModal(){
    $('#cropName, #crop-scientificName, #crop-Category,#crop-season').val(''); // Clear input fields
    $('#previewCropImg').hide().attr('src', ''); // Reset image preview
    $('#cropImageInput').val(''); // Clear file input
    $('#additionalField').empty(); // Clear file input
}

