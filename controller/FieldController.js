let fieldCode = 0;
let cardCount = 0;

$(document).ready(function() {

    // add field card(save)
    $('#fieldForm').on('submit', function (e) {
        cardCount++;
        e.preventDefault(); // Prevent form from actually submitting

        // Retrieve form values
        let fieldName = $('#fieldName').val();
        let location = $('#fieldLocation').val();
        let extentSize = $('#extentSize').val();
        let cropIds = []; // Initialize an array to store crop IDs
        let staffIds = []; // Initialize an array to store staff IDs
        let logIds = ["L01","L02"]; // Initialize an array to store log IDs

        // Collect all crop IDs from the main select and additional fields
        $('#filed-cropId').val() && cropIds.push($('#filed-cropId').val()); // Add main select value if not empty
        $('#additionalCrop select').each(function () {
            cropIds.push($(this).val()); // Collect each additional select value
        });

        // Collect all staff IDs from the main select and additional fields
        $('#filed-staffId').val() && staffIds.push($('#filed-staffId').val()); // Add main select value if not empty
        $('#additionalStaff select').each(function () {
            staffIds.push($(this).val()); // Collect each additional select value
        });

        // Remove empty values (if any)
        cropIds = cropIds.filter(id => id);
        staffIds = staffIds.filter(id => id);

        // Use the image preview if available
        let fieldImage1 = $('#preview1').attr('src');
        let fieldImage2 = $('#preview2').attr('src');

        // Generate a unique ID for each carousel and card
        let uniqueCarouselId = `carousel${Math.floor(Math.random() * 100000)}`;
        let uniqueId = Math.floor(Math.random() * 100);
        let uniqueCardId = `card${uniqueId}`;

        let newFieldCard = `
        <div id="${cardCount}" class="col-md-6 col-lg-4 mb-4">
            <div class="card text-white" style="background-color: #2b2b2b; border: 1px solid gray;">
                <div id="${uniqueCarouselId}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div id="img1" class="carousel-item active">
                            <img src="${fieldImage1}" id="image1" class="d-block w-100 fixed-image image-preview" alt="Field Image 1">
                        </div>
                        <div id="img2" class="carousel-item">
                            <img src="${fieldImage2}" id="image2" class="d-block w-100 fixed-image image-preview" alt="Field Image 2">
                        </div>            
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#${uniqueCarouselId}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#${uniqueCarouselId}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
                <div class="card-body">
                    <h5 class="card-title">Field Details</h5>
                    <p class="card-filedCode"><strong>Code:</strong> C${uniqueId}</p>
                    <p class="card-name"><strong>Name:</strong> ${fieldName}</p>
                    <p class="card-location"><strong>Location:</strong> ${location}</p>
                    <p class="card-extent-size"><strong>Extent Size:</strong> ${extentSize}</p>
                    <p class="card-crop"><strong>Crop:</strong> ${cropIds.join(', ')}</p>
                    <p class="card-staff"><strong>Staff:</strong> ${staffIds.join(', ')}</p>
                    <p class="card-log"><strong>Log:</strong> ${logIds.join(', ')}</p>
                    <div class="d-flex justify-content-between">
                        <button type="button" id="cardUpdateButton" class="btn btn-success flex-grow-1 me-2 update-button"  data-card-id="card${cardCount}">Update</button>
                        <button type="button" class="btn btn-danger flex-grow-1 delete-button delete-button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-card-id="card${cardCount}">Delete</button>
                    </div>
                </div>                            
            </div> 
        </div>       
        `;

        // Append the new card to the row container
        $('#fieldCard').append(newFieldCard);

        // Reset the form
        $('#fieldForm')[0].reset();
        $('#preview1').addClass('d-none'); // Hide image preview
        $('#preview2').addClass('d-none'); // Hide image preview
        $('#newFieldModal').modal('hide'); // Hide the modal
    });

    // Preview image functionality
    $('#fieldImage2').on('change', function () {
        const [file] = this.files;
        if (file) {
            $('#preview2').removeClass('d-none').attr('src', URL.createObjectURL(file));
        }
    });

    // Add Additional Crop Combo box
    $('#addFieldCropButton').on('click', function() {
        addDropdown('#additionalCrop', 'filed-cropId', ["C01", "C02", "C03", "C04", "C05"]);
    });

    // Add Additional Staff Combo box
    $('#addFieldStaffButton').on('click', function() {
        addDropdown('#additionalStaff', 'filed-staffId', ["S01", "S02", "S03", "S04", "S05"]);
    });
    clearFieldForm();
});

// Update Field Card Modal setup
$(document).on('click', '#cardUpdateButton', function () {
    const card = $(this).closest('.card');
    fieldCode = card.find('.card-filedCode').text().replace('Code:', '').trim();
    const fieldName = card.find('.card-name').text().replace('Name:', '').trim();
    const location = card.find('.card-location').text().replace('Location:', '').trim();
    const extentSize = card.find('.card-extent-size').text().replace('Extent Size:', '').trim();
    const crop = card.find('.card-crop').text().replace('Crop:', '').trim().split(', ').map(item => item.trim());
    const staff = card.find('.card-staff').text().replace('Staff:', '').trim().split(', ').map(item => item.trim());
    const logs = card.find('.card-log').text().replace('Log:', '').trim().split(', ').map(item => item.trim());

    $('#updateFieldCode').val(fieldCode);
    $('#updateFieldName').val(fieldName);
    $('#updateFieldLocation').val(location);
    $('#updateExtentSize').val(extentSize);

    // Populate dropdowns with multiple selections
    populateDropdown('#updateFieldCropId', crop, ["C01", "C02", "C03", "C04", "C05"]);
    populateDropdown('#updateStaffCrop', staff, ["S01", "S02", "S03", "S04", "S05"]);
    populateDropdown('#updateLogCrop', logs, ["L01", "L02", "L03", "L04", "L05"]);

    // Function to add dynamic Crop dropdown in the update modal
    $('#addFieldCropButtonUpdate').on('click', function() {
        addDropdown('#additionalFieldCropUpdate', 'fieldCropUpdate', ["C01", "C02", "C03", "C04", "C05"]);
    });

    // Function to add dynamic Staff dropdown in the update modal
    $('#addFieldStaffButtonUpdate').on('click', function() {
        addDropdown('#additionalStaffCropUpdate', 'staffCropUpdate', ["S01", "S02", "S03", "S04", "S05"]);
    });

    // Function to add dynamic Log dropdown in the update modal
    $('#addFieldLogButtonUpdate').on('click', function() {
        addDropdown('#additionalLogCropUpdate', 'logCropUpdate', ["L01", "L02", "L03", "L04", "L05"]);
    });
});

function populateDropdown(container, selectedValues, options) {
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

//update field card
$("#updateFieldButton").on("click", function() {
    // Get updated values from the modal inputs
    let updatedFieldName = $("#updateFieldName").val();
    let updatedLocation = $("#updateFieldLocation").val();
    let updatedExtentSize = $("#updateExtentSize").val();

    let updatedFieldCrop = [];
    $("#updateFieldCropId select").each(function() {
        let cropValue = $(this).val();
        if (cropValue) {
            updatedFieldCrop.push(cropValue);
        }
    });

    // Collect values from all Field dropdowns
    $('#additionalFieldCropUpdate select').each(function () {
        const selectedValue = $(this).val();
        if (selectedValue) updatedFieldCrop.push(selectedValue);
    });

    let updatedFieldStaff = [];
    $("#updateStaffCrop select").each(function() {
        let staffValue = $(this).val();
        if (staffValue) {
            updatedFieldStaff.push(staffValue);
        }
    });

    // Collect values from all Field dropdowns
    $('#additionalStaffCropUpdate select').each(function () {
        const selectedValue = $(this).val();
        if (selectedValue) updatedFieldStaff.push(selectedValue);
    });

    let updatedFieldLogs = [];
    $("#updateLogCrop select").each(function() {
        let staffValue = $(this).val();
        if (staffValue) {
            updatedFieldLogs.push(staffValue);
        }
    });

    // Collect values from all Field dropdowns
    $('#additionalLogCropUpdate select').each(function () {
        const selectedValue = $(this).val();
        if (selectedValue) updatedFieldLogs.push(selectedValue);
    });

    let updatedCrops = updatedFieldCrop.join(', ');
    let updatedStaff = updatedFieldStaff.join(', ');
    let updatedLogs = updatedFieldLogs.join(', ');

    let fieldImage1 = $('#updatePreview1').attr('src');
    let fieldImage2 = $('#updatePreview2').attr('src');

    $('.card-name').html(`<strong>Name:</strong> ${updatedFieldName}`);
    $('.card-location').html(`<strong>Location:</strong> ${updatedLocation}`);
    $('.card-extent-size').html(`<strong>Extent Size:</strong> ${updatedExtentSize}`);
    $('.card-crop').html(`<strong>Crop:</strong> ${updatedCrops}`);
    $('.card-staff').html(`<strong>Staff:</strong> ${updatedStaff}`);
    $('.card-log').html(`<strong>Log:</strong> ${updatedLogs}`);

    let img1 = $('#img1 img').attr('id');
    let img2 = $('#img2 img').attr('id');

    $("#" + img1).attr('src', fieldImage1);
    $("#" + img2).attr('src', fieldImage2);

    clearUpdateFieldForm();
    // Close the modal after updating
    $("#updateFieldModal").modal("hide");
});

//add a dropdown with predefined options and a remove button
function addDropdown(containerId, selectClass, options) {
    const $container = $('<div class="d-flex align-items-center mt-2"></div>');
    const $select = $('<select id="optionSelect" class="form-control me-2"></select>').addClass(selectClass);

    // Populate select options
    options.forEach(option => $select.append(`<option value="${option}">${option}</option>`));

    // Remove button
    const $removeBtn = $('<button class="btn btn-danger">Remove</button>');
    $removeBtn.on('click', function() {
        $container.remove();
    });

    $container.append($select).append($removeBtn);
    $(containerId).append($container);
}

//delete Field card
$(document).ready(function() {
    // Show the confirmation modal and set the card ID to delete
    $(document).on('click', '.delete-button', function() {
        const cardId = $(this).data('id');
        $('#confirmDeleteButton').data('id', cardId);
        $('#confirmDeleteModal').modal('show');
    });

    // Handle the confirmation of the delete action
    $('#confirmDeleteButton').on('click', function() {
        const cardId = $(this).data('id');
        removeFieldCard(cardId);
        $('#confirmDeleteModal').modal('hide');
    });

    function removeFieldCard(id) {
        $('#' + id).remove();
    }
});

// Function to clear the update field form
function clearUpdateFieldForm() {
    // Clear text inputs
    $('#updateFieldName').val('');
    $('#updateFieldLocation').val('');
    $('#updateExtentSize').val('');

    // Reset dropdowns to the first option
    $('#fieldCropUpdate').prop('selectedIndex', 0);
    $('#staffCropUpdate').prop('selectedIndex', 0);
    $('#logCropUpdate').prop('selectedIndex', 0);

    // Clear additional dynamic dropdowns if they exist
    $('#additionalFieldCropUpdate').empty();
    $('#additionalStaffCropUpdate').empty();
    $('#additionalLogCropUpdate').empty();
}

function clearFieldForm() {
    $('#fieldName').val('');
    $('#fieldLocation').val('');
    $('#extentSize').val('');
    $('#filed-staffId').prop('selectedIndex', 0);
    $('#filed-cropId').prop('selectedIndex', 0);
    $('#additionalStaff').empty();
    $('#additionalCrop').empty();
    $('#fieldImage1').val('');
    $('#fieldImage2').val('');
    $('#preview1').addClass('d-none').attr('src', '');
    $('#preview2').addClass('d-none').attr('src', '');
}
