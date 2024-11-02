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
                    <button type="button" class="btn btn-danger flex-grow-1 delete-button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-id="1">Delete</button>
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
});

// Update Field Card Modal setup
$(document).on('click', '#cardUpdateButton', function () {
    const card = $(this).closest('.card');
    const fieldCode = card.find('.card-filedCode').text().replace('Code:', '').trim();
    const fieldName = card.find('.card-name').text().replace('Name:', '').trim();
    const location = card.find('.card-location').text().replace('Location:', '').trim();
    const extentSize = card.find('.card-extent-size').text().replace('Extent Size:', '').trim();
    const staff = card.find('.card-crop').text().replace('Crop:', '').trim().split(', ').map(item => item.trim());
    const crop = card.find('.card-staff').text().replace('Staff:', '').trim().split(', ').map(item => item.trim());
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
        const dropdown = $('<select class="form-control mb-3"></select>');
        options.forEach(option => {
            dropdown.append(`<option value="${option}" ${option.trim() === value ? 'selected' : ''}>${option}</option>`);
        });
        $(container).append(dropdown);
    });
}

// Handle form submission for updating field card
// $('#updateFieldForm').on('submit', function (e) {
//     e.preventDefault(); // Prevent form submission
//
//     // Get values from the form fields
//     const fieldCode = $('.card-filedCode').text();
//     const fieldName = $('#updateFieldName').val();
//     const location = $('#updateFieldLocation').val();
//     const extentSize = $('#updateExtentSize').val();
//
//     // Collect all selected values from the dynamically added dropdowns
//     const crops = [];
//     $('#updateFieldCropContainer select').each(function () {
//         if ($(this).val()) crops.push($(this).val());
//     });
//
//     const staffMembers = [];
//     $('#updateStaffMemberCropContainer select').each(function () {
//         if ($(this).val()) staffMembers.push($(this).val());
//     });
//
//     const logs = [];
//     $('#updateLogsCropContainer select').each(function () {
//         if ($(this).val()) logs.push($(this).val());
//     });
//
//     // Update the field card with the new values
//     const card = $('.card[data-id="' + fieldCode + '"]'); // Assuming each card has a unique data-id attribute with fieldCode
//
//     // Update the card content with the new values
//     card.find('.card-name').text('Name: ' + fieldName);
//     card.find('.card-location').text('Location: ' + location);
//     card.find('.card-extent-size').text('Extent Size: ' + extentSize);
//     card.find('.card-crop').text('Crop: ' + crops.join(', '));
//     card.find('.card-staff').text('Staff: ' + staffMembers.join(', '));
//     card.find('.card-log').text('Log: ' + logs.join(', '));
//
//     // Hide the modal
//     // $('#updateFieldModal').modal('hide');
// });

// Assuming each field card has a unique ID to identify it
$("#updateFieldButton").on("click", function() {
    // Get updated values from the modal inputs
    let updatedFieldName = $("#fieldNameInput").val();
    let updatedLocation = $("#locationInput").val();
    let updatedExtentSize = $("#extentSizeInput").val();
    let updatedCrop = $("#cropDropdown").val();
    let updatedStaff = $("#staffDropdown").val();
    let updatedLog = $("#logInput").val();

    // Get the ID of the field card being updated (this ID should be set when opening the modal)
    let fieldCardId = $("#fieldCardIdInput").val(); // This should be set when opening the modal

    // Find the specific field card element using its ID and update its content
    let $fieldCard = $("#" + fieldCardId);

    // Update the elements within the field card with the new values
    $fieldCard.find(".field-name").text(updatedFieldName);
    $fieldCard.find(".field-location").text(updatedLocation);
    $fieldCard.find(".field-extent-size").text(updatedExtentSize);
    $fieldCard.find(".field-crop").text(updatedCrop);
    $fieldCard.find(".field-staff").text(updatedStaff);
    $fieldCard.find(".field-log").text(updatedLog);

    // Close the modal after updating
    $("#updateModal").modal("hide");
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
    let fieldCardId; // Variable to hold the ID of the field card to be deleted

    // Show the confirmation modal and set the field card ID
    $('.delete-button').on('click', function() {
        fieldCardId = $(this).data('id'); // Assuming the delete button has a data-id attribute
        $('#confirmDeleteModal').modal('show');
    });

    // Handle the confirmation of the delete action
    $('#confirmDeleteButton').on('click', function() {
        // Remove the field card (you can use AJAX here if you need to communicate with a server)
        // For example, let's say you have a function to remove the card from the UI:
        removeFieldCard(fieldCardId);

        // Close the modal
        $('#confirmDeleteModal').modal('hide');
    });

    // Function to remove the field card from the UI (you may need to adjust this according to your HTML structure)
    function removeFieldCard(id) {
        $(`#fieldCard_${id}`).remove(); // Assuming each field card has an ID like 'fieldCard_1', 'fieldCard_2', etc.
    }
});

