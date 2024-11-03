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
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card text-white" style="background-color: #2b2b2b; border: 1px solid gray;">
                    <div class="card-image-container">
                        <img src="${cropImage}" class="card-img-top" alt="Crop Image">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">Crop Details</h5>
                        <p class="card-cropCode"><strong>Code:</strong> C${Math.floor(Math.random() * 100)}</p>
                        <p class="card-name"><strong>Name:</strong> ${cropName}</p>
                        <p class="card-scientific"><strong>Scientific Name:</strong> ${scientificName}</p>
                        <p class="card-category"><strong>Category:</strong> ${category}</p>
                        <p class="card-season"><strong>Crop Season:</strong> ${season}</p>
                        <p class="card-FieldId"><strong>Field ID:</strong> ${fieldIds.join(', ')}</p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-success flex-grow-1 me-2" data-card-id="card${cardCount}">Update</button>
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

// Preview image in modal when file input changes
$('#cropImageInput').on('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#previewCropImg').attr('src', e.target.result).removeClass('d-none').show(); // Remove d-none and display the image
        };
        reader.readAsDataURL(file);
    } else {
        $('#previewCropImg').addClass('d-none'); // Hide if no file is selected
    }
});

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

