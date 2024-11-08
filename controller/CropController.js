let cardCount = 0;

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
                            <button class="btn btn-danger flex-grow-1 delete-button" data-bs-toggle="modal" data-card-id="card${cardCount}" data-bs-target="#confirmCropDeleteModal">Delete</button>
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

// Function to add dynamic field dropdown in the add modal
$('#addFieldButton').on('click', function() {
    addDropdownUpdate('#additionalField', '#crop-FieldId', ["F01", "F02", "F03", "F04", "F05"]);
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

// Handle update button click
$('#cropCard').on('click', '.update-button', function() {
    const cardId = $(this).data('card-id');
    const cropCard = $(`#${cardId}`);
    console.log("cardId :" , cardId);

    // Populate modal with card details for updating
    $('#updateCropName').val(cropCard.find('.card-name').text().replace('Name:', '').trim());
    $('#updateScientificName').val(cropCard.find('.card-scientific').text().replace('Scientific Name: ', '').trim());
    $('#updateCategory').val(cropCard.find('.card-category').text().replace('Category: ', ''));
    $('#updateCropSeason').val(cropCard.find('.card-season').text().replace('Crop Season: ', ''));
    let field = cropCard.find('.card-FieldId').text().replace('Field ID:', '').trim().split(', ').map(item => item.trim());
    let log = cropCard.find('.card-logs').text().replace('Logs:', '').trim().split(', ').map(item => item.trim());
    $('#updatePreview').attr('src', cropCard.find('.image-preview').attr('src')).removeClass('d-none');
    $('#cropImageInput').val(''); // Clear file input for new upload
    $('#updateFieldModalButton').data('card-id', cardId); // Set action and card ID
    $('#updateCropModal').modal('show');

    populateDropdownCrop('#updateFieldId', field, ["F01", "F02", "F03", "F04", "F05"]);
    populateDropdownCrop('#updateLogId', log, ["L01", "L02", "L03", "L04", "L05"]);
});

// Function to add dynamic field dropdown in the update modal
$('#addFieldBtnInCropUpdate').on('click', function() {
    addDropdownUpdate('#additionalFieldInCropUpdate', '#fieldInCropUpdate', ["F01", "F02", "F03", "F04", "F05"]);
});

// Function to add dynamic Log dropdown in the update modal
$('#addLogsBtnInCropUpdate').on('click', function() {
    addDropdownUpdate('#additionalLogInCropUpdate', '#logInCropUpdate', ["L01", "L02", "L03", "L04", "L05"]);
});

//add additional combo box in update modal
function addDropdownUpdate(containerId, selectClass, options) {
    const $container = $('<div class="d-flex align-items-center mt-2"></div>');
    const $select = $('<select id="optionSelect" class="form-control me-2 text-white" style="background-color:#2B2B2B"></select>').addClass(selectClass);

    // Populate select options
    options.forEach(option => $select.append(`<option value="${option}" class="text-white">${option}</option>`));

    // Remove button
    const $removeBtn = $('<button class="btn btn-danger">Remove</button>');
    $removeBtn.on('click', function() {
        $container.remove();
    });

    $container.append($select).append($removeBtn);
    $(containerId).append($container);
}

//crop card update
$('#updateFieldModalButton').on('click',function (){

    let cropName = $('#updateCropName').val();
    let scientificName = $('#updateScientificName').val();
    let category = $('#updateCategory').val();
    let season = $('#updateCropSeason').val();
    console.log("name " ,cropName)
    console.log("sname " ,scientificName)
    console.log("category " ,category)
    console.log("season " ,season)

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
    console.log("field " ,updatedCropField)
    console.log("log " ,updatedCropLogs)

    let cropImage = $('#updatePreview').attr('src'); // Use the image preview if available

    // Update existing card details
    const cardId = $(this).data('card-id'); //update button in card
    const cropCard = $(`#${cardId}`);
    console.log("card id ",cardId)

    cropCard.find('.card-name').text(`Name: ${cropName}`);
    cropCard.find('.card-scientific').text(`Scientific Name: ${scientificName}`);
    cropCard.find('.card-category').text(`Category: ${category}`);
    cropCard.find('.card-season').text(`Crop Season: ${season}`);
    cropCard.find('.card-FieldId').text(`Field ID: ${updatedCropField.join(', ')}`);
    cropCard.find('.card-logs').text(`Logs: ${updatedCropLogs.join(', ')}`);
    cropCard.find('.image-preview').attr('src', cropImage);

    $('#updateCropForm')[0].reset();
    $('#previewCrop').addClass('d-none');
    $('#additionalLogInCropUpdate').empty();
    $('#additionalFieldInCropUpdate').empty();
    $('#updateCropModal').modal('hide');
});

function populateDropdownCrop(container, selectedValues, options) {
    $(container).empty();
    selectedValues.forEach(value => {
        // Create a wrapper div for each dropdown and the remove button
        const dropdownWrapper = $('<div class="dropdown-wrapper mb-3" style="display: flex; align-items: center;"></div>');

        // Create the dropdown
        const dropdown = $('<select class="form-control me-2 text-white" style="background-color:#2B2B2B"></select>');
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

// Show the confirmation modal and set the card ID to delete
$(document).ready(function() {
    $(document).on('click', '.delete-button', function () {
        // Get the card ID from the delete button and set it on the confirm delete button
        const cardId = $(this).data('card-id');
        $('#confirmCropDeleteButton').data('card-id', cardId);
        $('#confirmCropDeleteModal').modal('show');
    });

    // Handle the confirmation of the delete action
    $('#confirmCropDeleteButton').on('click', function () {
        const cardId = $(this).data('card-id');
        removeFieldCard(cardId);

        // Hide the modal after deleting
        $('#confirmCropDeleteModal').modal('hide');
    });

    // Ensure the modal and backdrop are fully removed when hidden (overlay)
    $('#confirmCropDeleteModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open'); // Removes the modal-open class from body
        $('.modal-backdrop').remove();       // Removes the leftover backdrop element
    });

    function removeFieldCard(id) {
        $('#' + id).remove();
    }
});

function clearAddModal(){
    $('#cropName, #crop-scientificName, #crop-Category,#crop-season').val(''); // Clear input fields
    $('#previewCropImg').hide().attr('src', ''); // Reset image preview
    $('#cropImageInput').val(''); // Clear file input
    $('#additionalField').empty(); // Clear file input
}

