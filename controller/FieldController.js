$(document).ready(function() {

    // add field card(save)
    $('#fieldForm').on('submit', function (e) {
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
        $('#additionalStaff select').each(function () {
            cropIds.push($(this).val()); // Collect each additional select value
        });

        // Collect all staff IDs from the main select and additional fields
        $('#filed-staffId').val() && staffIds.push($('#filed-staffId').val()); // Add main select value if not empty
        $('#additionalCrop select').each(function () {
            staffIds.push($(this).val()); // Collect each additional select value
        });

        // Remove empty values (if any)
        cropIds = cropIds.filter(id => id);
        staffIds = staffIds.filter(id => id);

        let fieldImage1 = $('#preview1').attr('src'); // Use the image preview if available
        let fieldImage2 = $('#preview2').attr('src'); // Use the image preview if available

        // Generate a unique ID for each carousel
        let uniqueCarouselId = `carousel${Math.floor(Math.random() * 100000)}`;

        let newFieldCard = `
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="card text-white" style="background-color: #2b2b2b; border: 1px solid gray;">
            <div id="${uniqueCarouselId}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="${fieldImage1}" class="d-block w-100 fixed-image" alt="Field Image 1">
                    </div>
                    <div class="carousel-item">
                        <img src="${fieldImage2}" class="d-block w-100 fixed-image" alt="Field Image 2">
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
                <p class="card-filedCode"><strong>Code:</strong> C${Math.floor(Math.random() * 100)}</p>
                <p class="card-name"><strong>Name:</strong>${fieldName}</p>
                <p class="card-location"><strong>Location:</strong>${location}</p>
                <p class="card-extent-size"><strong>Extent Size:</strong>${extentSize}</p>
                <p class="card-crop"><strong>Crop:</strong>${cropIds.join(', ')}</p>
                <p class="card-staff"><strong>Staff:</strong>${staffIds.join(', ')}</p>
                <p class="card-log"><strong>Log:</strong>${logIds.join(', ')}</p>
                <div class="d-flex justify-content-between">
                    <button type="button" id="cardUpdateButton" class="btn btn-success flex-grow-1 me-2" data-bs-toggle="modal" data-bs-target="#updateFieldModal">Update</button>
                    <button class="btn btn-danger flex-grow-1" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">Delete</button>
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

    //Add Crop Combo Box
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addFieldCropButton').on('click', function() {
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
    $('#additionalCrop').append($cropContainer);
});

    //Add Staff Combo Box
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addFieldStaffButton').on('click', function() {
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

        // Append the new field container to the additionalStaffField
        $('#additionalStaff').append($staffContainer);
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

// Update Field Card Modal setup
// Update Field Card Modal setup
$(document).on('click', '#cardUpdateButton', function () {
    const card = $(this).closest('.card');
    const fieldCode = card.find('.card-filedCode').text().replace('Code:', '').trim();
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
});

function populateDropdown(container, selectedValues, options) {
    $(container).empty();
    selectedValues.forEach(value => {
        const dropdown = $('<select class="form-control mb-3"></select>');
        options.forEach(option => {
            dropdown.append(`<option value="${option}" ${option.trim() === value ? 'selected' : ''}>${option}</option>`);
        });
        $(container).append(dropdown);
    });
}





