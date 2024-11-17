import { LoadCards } from './CropController.js';

let fieldCode = 0;
let cardCount = 0;

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
            let ids = $(this).val();
            const crops = {
                cropCode:ids
            }
            cropIds.push(crops);
        });

        // Collect all staff IDs from the main select and additional fields
        $('#filed-staffId').val() && staffIds.push($('#filed-staffId').val()); // Add main select value if not empty
        $('#additionalStaff select').each(function () {
            let ids = $(this).val();
            const staff = {
                memberCode:ids
            }
            staffIds.push(staff);
        });

        // Remove empty values (if any)
        cropIds = cropIds.filter(crop => ({ cropCode: crop }));
        staffIds = staffIds.filter(id => ({ memberCode: id }));

        let fieldImageFile1 = $('#fieldImage1Input')[0].files[0];
        let fieldImageFile2 = $('#fieldImage2Input')[0].files[0];

        const formData = new FormData();
        formData.append("name", fieldName);
        formData.append("location", location); //"e.g., 79.8612, 6.9271"
        formData.append("extentSize", extentSize);
        formData.append("fieldImage1", fieldImageFile1);
        formData.append("fieldImage2", fieldImageFile2);
        // formData.append("staffList", new Blob([JSON.stringify(staffIds)], { type: "application/json" }));
        formData.append("cropList", new Blob([JSON.stringify(cropIds)], { type: "application/json" }));

        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $.ajax({
                    url: "http://localhost:5050/api/v1/fields",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        let loadFieldCard = new LoadFieldCard();
                        let loadCropList = new LoadSelectedFieldWithCrop();
                        // Reset the form
                        $('#fieldForm')[0].reset();
                        $('#preview1').addClass('d-none'); // Hide image preview
                        $('#preview2').addClass('d-none'); // Hide image preview
                        $('#newFieldModal').modal('hide');
                        clearFieldForm();
                        loadFieldCard.loadAllFieldCard().then(fieldCodes => {
                            loadCropList.loadSelectedFiled(fieldCodes);
                            Swal.fire("Saved!", "", "success");
                        }).catch(error => {
                            console.error("Error loading field cards:", error);
                        });
                    },
                    error: function (xhr, status, error) {
                        alert("Faild field");
                    }
                });
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    });

    $('#fieldImage1Input').on('click',function (){
        previewFieldImage('#fieldImage1Input','#preview1')
    });

    $('#fieldImage2Input').on('click',function (){
        previewFieldImage('#fieldImage2Input','#preview2')
    });

    // Add Additional Crop Combo box
    $('#addFieldCropButton').on('click', function() {
        let cropCard = new LoadCards();
        cropCard.loadAllCropCard().then(cropCodes => {
            console.log("Field codes:", cropCodes);
            addDropdown('#additionalCrop', 'filed-cropId', cropCodes);
        }).catch(error => {
            console.error("Error loading field cards:", error);
        });
    });
    // Add Additional Staff Combo box
    $('#addFieldStaffButton').on('click', function() {
        addDropdown('#additionalStaff', 'filed-staffId', ["S01", "S02", "S03", "S04", "S05"]);
    });

// Update Field Card Modal setup
$('#fieldCard').on('click', '.update-button', function () {
    clearUpdateFieldForm();

    const cardId = $(this).data('card-id'); // Fetch the card ID from the clicked update button
    const fieldCard = $(`#${cardId}`);

    fieldCode = fieldCard.find('.card-filedCode').text().replace('Code:', '').trim();
    $('#updateFieldName').val(fieldCard.find('.card-name').text().replace('Name:', '').trim());
    $('#updateFieldLocation').val(fieldCard.find('.card-location').text().replace('Location:', '').trim());
    $('#updateExtentSize').val(fieldCard.find('.card-extent-size').text().replace('Extent Size:', '').trim());
    const crop = fieldCard.find('.card-crop').text().replace('Crop:', '').trim().split(', ').map(item => item.trim());
    const staff = fieldCard.find('.card-staff').text().replace('Staff:', '').trim().split(', ').map(item => item.trim());
    const logs = fieldCard.find('.card-log').text().replace('Log:', '').trim().split(', ').map(item => item.trim());
    $('#updatePreview1').attr('src', fieldCard.find('.image-preview1').attr('src')).removeClass('d-none');
    $('#updatePreview2').attr('src', fieldCard.find('.image-preview2').attr('src')).removeClass('d-none');

    // Populate dropdowns with multiple selections
    populateDropdown('#updateFieldCropId', crop, ["C01", "C02", "C03", "C04", "C05"]);
    populateDropdown('#updateLogCrop', logs, ["L01", "L02", "L03", "L04", "L05"]);
    populateDropdown('#updateStaffCrop', staff, ["S01", "S02", "S03", "S04", "S05"]);

    $('#updateFieldImage1Input').val('');
    $('#updateFieldImage2Input').val('');
    $('#updateFieldButton').data('card-id', cardId);
    $('#updateFieldModal').modal('show');
});

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

function populateDropdown(container, selectedValues, options) {
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

    let fieldImage1 = $('#updatePreview1').attr('src');
    let fieldImage2 = $('#updatePreview2').attr('src');

    // Update existing card details
    const cardId = $(this).data('card-id');
    const fieldCard = $(`#${cardId}`);

    fieldCard.find('.card-name').text(`Name: ${updatedFieldName}`);
    fieldCard.find('.card-location').text(`Location: ${updatedLocation}`);
    fieldCard.find('.card-extent-size').text(`Extent Size: ${updatedExtentSize}`);
    fieldCard.find('.card-crop').text(`Crop: ${updatedFieldCrop}`);
    fieldCard.find('.card-staff').text(`Staff: ${updatedFieldStaff}`);
    fieldCard.find('.card-log').text(`Log: ${updatedFieldLogs}`);
    fieldCard.find('.image-preview1').attr('src', fieldImage1);
    fieldCard.find('.image-preview2').attr('src', fieldImage2);

    $('#updateCropForm')[0].reset();
    $('#previewCrop').addClass('d-none');
    $('#additionalLogInCropUpdate').empty();
    $('#additionalFieldInCropUpdate').empty();
    clearUpdateFieldForm();
    $("#updateFieldModal").modal("hide");
});

$('#updateFieldImage1Input').on('click',function (){
    previewFieldImage("#updateFieldImage1Input","#updatePreview1");
});

$('#updateFieldImage2Input').on('click',function (){
    previewFieldImage("#updateFieldImage2Input","#updatePreview2");
});

//add a dropdown with predefined options and a remove button
function addDropdown(containerId, selectClass, options) {
    const $container = $('<div class="d-flex align-items-center mt-2"></div>');
    const $select = $('<select id="optionSelect" class="form-control me-2 text-white" style="background-color:#2B2B2B"></select>').addClass(selectClass);

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
    $(document).on('click', '.delete-button', function () {
        // Get the card ID from the delete button and set it on the confirm delete button
        const cardId = $(this).data('field-code');
        $('#confirmDeleteButton').data('field-code', cardId);
        $('#confirmDeleteModal').modal('show');
    });

    // Handle the confirmation of the delete action
    $('#confirmDeleteButton').on('click', function () {
        const cardId = $(this).data('field-code');

        $.ajax({
            url: `http://localhost:5050/api/v1/fields/${cardId}`,
            type: 'DELETE',
            success: function () {
                const loadFieldCard = new LoadFieldCard();
                loadFieldCard.loadAllFieldCard();
                Swal.fire('Deleted!', 'The field has been deleted.', 'success');
            },
            error: function (xhr, status, error) {
                console.error("Error deleting field:", error);
                if (xhr.status === 404) {
                    Swal.fire('Error', 'Field not found!', 'error');
                } else if (xhr.status === 400) {
                    Swal.fire('Error', 'Invalid field ID!', 'error');
                } else {
                    Swal.fire('Error', 'Failed to delete field. Please try again.', 'error');
                }
            }
        });

        // Hide the modal after deleting
        $('#confirmDeleteModal').modal('hide');
    });

    // Ensure the modal and backdrop are fully removed when hidden (overlay)
    $('#confirmDeleteModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open'); // Removes the modal-open class from body
        $('.modal-backdrop').remove();       // Removes the leftover backdrop element
    });
});

// Preview image in modal when file input changes
function previewFieldImage(imageInputId,imgPreviewId){
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

export class LoadFieldCard {
    loadAllFieldCard() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "http://localhost:5050/api/v1/fields",
                type: "GET",
                success: function (fields) {
                    $("#fieldCard").empty();
                    const fieldCodes = fields.map(field => field.fieldCode);

                    // Loop through each field and create a card
                    fields.forEach((field, index) => {
                        const location = field.location ? field.location.split(",") : ["No location data"];
                        const cropList = field.cropList ? field.cropList.map(crop => crop.cropCode).join(", ") : "No crops available";

                        let imageData1 = `data:image/jpeg;base64,${field.fieldImage1}`;
                        let imageData2 = `data:image/jpeg;base64,${field.fieldImage2}`;
                        const carouselId = `carousel${index}`;

                        let newFieldCard = `
                            <div id="card${index}" class="col-md-6 col-lg-4 mb-4">
                                <div class="card text-white" style="background-color: #2b2b2b; border: 1px solid gray;">
                                    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                                        <div class="carousel-inner">
                                            <div id="img1" class="carousel-item active">
                                                <img src="${imageData1}" id="image1" class="d-block w-100 fixed-image image-preview1" alt="Field Image 1">
                                            </div>
                                            <div id="img2" class="carousel-item">
                                                <img src="${imageData2}" id="image2" class="d-block w-100 fixed-image image-preview2" alt="Field Image 2">
                                            </div>            
                                        </div>
                                        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Previous</span>
                                        </button>
                                        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Field Details</h5>
                                        <p class="card-filedCode"><strong>Code:</strong> ${field.fieldCode}</p>
                                        <p class="card-name"><strong>Name:</strong> ${field.name}</p>
                                        <p class="card-location"><strong>Location:</strong> x: ${location[0]} y: ${location[1]}</p>
                                        <p class="card-extent-size"><strong>Extent Size:</strong> ${field.extentSize}</p>
                                        <p class="card-crop"><strong>Crop:</strong>${cropList}</p>
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-success flex-grow-1 me-2 update-button" data-field-code="${field.fieldCode}">Update</button>
                                            <button type="button" class="btn btn-danger flex-grow-1 delete-button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-field-code="${field.fieldCode}">Delete</button>
                                        </div>
                                    </div>                            
                                </div> 
                            </div>       
                        `;

                        // Append the new card to the row container
                        $('#fieldCard').append(newFieldCard);
                    });
                    // Resolve the promise with the list of field codes
                    resolve(fieldCodes);
                },
                error: function (xhr, status, error) {
                    alert("Failed to retrieve fields");
                    reject(error);
                }
            });
        });
    }
}

export class LoadSelectedFieldWithCrop{
    loadSelectedFiled(fieldCodes){
        console.log("-> codes : ",fieldCodes)
        let lastCode = fieldCodes.pop();
        const fieldId = lastCode; // Replace with the actual fieldId you want to retrieve
        console.log("pop code : " , fieldId)
        $.ajax({
            url: `http://localhost:5050/api/v1/fields/${fieldId}`,
            type: "GET",
            contentType: "application/json",
            success: function(data) {
                console.log("Field data:", data);
                // Process the data as needed
            },
            error: function(xhr, status, error) {
                console.error("Error fetching field data:", xhr.responseText);
            }
        });
    }
}

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
    $('#fieldImage1Input').val('');
    $('#fieldImage2Input').val('');
    $('#preview1').addClass('d-none').attr('src', '');
    $('#preview2').addClass('d-none').attr('src', '');
}
