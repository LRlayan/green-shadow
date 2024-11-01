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
    // Handle form submission
    $('#fieldForm').on('submit', function (e) {
        e.preventDefault(); // Prevent form from actually submitting

        // Retrieve form values
        let fieldName = $('#fieldName').val();
        let location = $('#fieldLocation').val();
        let extentSize = $('#extentSize').val();
        let cropIds = []; // Array to store crop IDs
        let staffIds = []; // Array to store staff IDs
        let logIds = ["L01", "L02"]; // Sample log IDs

        // Collect all crop IDs from main and additional selects
        $('#filed-cropId').val() && cropIds.push($('#filed-cropId').val());
        $('#additionalCrop select').each(function () {
            $(this).val() && cropIds.push($(this).val()); // Add each non-empty additional select value
        });

        // Collect all staff IDs from main and additional selects
        $('#filed-staffId').val() && staffIds.push($('#filed-staffId').val());
        $('#additionalStaff select').each(function () {
            $(this).val() && staffIds.push($(this).val());
        });

        // Clean up arrays to remove any empty values
        cropIds = cropIds.filter(id => id);
        staffIds = staffIds.filter(id => id);

        let fieldImage1 = $('#preview1').attr('src'); // Preview image 1
        let fieldImage2 = $('#preview2').attr('src'); // Preview image 2

        let newFieldCard = `
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="card text-white" style="background-color: #2b2b2b; border: 1px solid gray;">
            <div class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="${fieldImage1}" class="d-block w-100 fixed-image" alt="Field Image 1">
                    </div>
                    <div class="carousel-item">
                        <img src="${fieldImage2}" class="d-block w-100 fixed-image" alt="Field Image 2">
                    </div>            
                </div>
                <button class="carousel-control-prev" type="button" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-slide="next">
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
                    <button type="button" class="btn btn-success flex-grow-1 me-2" data-bs-toggle="modal" data-bs-target="#updateFieldModal">Update</button>
                    <button class="btn btn-danger flex-grow-1" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">Delete</button>
                </div>
            </div>                            
        </div> 
    </div>       
    `;

        // Append the new card to the row container
        $('#fieldCard').append(newFieldCard);

        // Reset the form and previews
        $('#fieldForm')[0].reset();
        $('#preview1').addClass('d-none');
        $('#preview2').addClass('d-none');
        $('#newFieldModal').modal('hide');
    });

    // Preview image functionality
    $('#fieldImage1').on('change', function () {
        const [file] = this.files;
        if (file) {
            $('#preview1').removeClass('d-none').attr('src', URL.createObjectURL(file));
        }
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

    //Add Crop Combo Box
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

    //update modal ----------------------------------------------------------------------------------------
    // $('.card .btn-success').on('click', function() {
    //     // Get the card's current data
    //     const card = $(this).closest('.card');
    //     const fieldCode = card.find('.card-filedCode').text().replace('Code:', '').trim();
    //     const fieldName = card.find('.card-name').text().replace('Name:', '').trim();
    //     const location = card.find('.card-location').text().replace('Location:', '').trim();
    //     const extentSize = card.find('.card-extent-size').text().replace('Extent Size:', '').trim();
    //     const crop = card.find('.card-crop').text().replace('Crop:', '').trim();
    //     const staff = card.find('.card-staff').text().replace('Staff:', '').trim();
    //     const log = card.find('.card-log').text().replace('Log:', '').trim();
    //
    //     // Set data in modal fields
    //     $('#updateFieldCode').val(fieldCode);
    //     $('#updateFieldName').val(fieldName);
    //     $('#updateFieldLocation').val(location);
    //     $('#updateExtentSize').val(extentSize);
    //
    //     // Set crop and staff values
    //     const cropArray = crop.split(',');
    //     const staffArray = staff.split(',');
    //     const logArray = log.split(',');
    //
    //     $('#updateCrop').empty(); // Clear existing values in crop input
    //     $('#updateStaff').empty(); // Clear existing values in staff input
    //     $('#updateLogs').empty(); // Clear existing values in staff input
    //
    //     cropArray.forEach(cropItem => {
    //         $('#updateCrop').append(`<input type="text" class="form-control mb-2" value="${cropItem.trim()}">`);
    //     });
    //
    //     staffArray.forEach(staffItem => {
    //         $('#updateStaff').append(`<input type="text" class="form-control mb-2" value="${staffItem.trim()}">`);
    //     });
    //
    //     logArray.forEach(logsItem => {
    //         $('#updateLogs').append(`<input type="text" class="form-control mb-2" value="${logsItem.trim()}">`);
    //     });
    //
    //     // Show the update modal
    //     const updateModal = new bootstrap.Modal($('#updateFieldModal')[0]);
    //     updateModal.show();
    // });

    // Submit update form
    // $('#updateFieldForm').on('submit', function(event) {
    //     event.preventDefault();
    //     // Perform update logic, close modal, etc.
    // });

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



