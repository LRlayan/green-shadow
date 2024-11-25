import { LoadCards } from './CropController.js';
import { LoadAllStaffMember } from './StaffController.js';

// SAVE MODAL
$('#fieldForm').on('submit', async function (e) {
    e.preventDefault();

    let fieldName = $('#fieldName').val();
    let location = $('#fieldLocation').val();
    let extentSize = $('#extentSize').val();

    let updatedFieldCrop = collectSelectedValues('#filed-cropId select', '#additionalCrop select');
    let updatedFieldStaff = collectSelectedValues('#filed-staffId select', '#additionalStaff select');

    // Remove empty values (if any)
    updatedFieldCrop = updatedFieldCrop.filter(crop => ({ cropCode: crop }));
    updatedFieldStaff = updatedFieldStaff.filter(id => ({ memberCode: id }));

    let fieldImageFile1 = await handleLogImage('#fieldImage1Input','#preview1');
    let fieldImageFile2 = await handleLogImage('#fieldImage2Input','#preview2');

    const formData = new FormData();
    formData.append("name", fieldName);
    formData.append("location", location); //"e.g. 79.8612, 6.9271"
    formData.append("extentSize", extentSize);
    formData.append("fieldImage1", fieldImageFile1);
    formData.append("fieldImage2", fieldImageFile2);
    formData.append("staffList", new Blob([JSON.stringify(updatedFieldStaff)], { type: "application/json" }));
    formData.append("cropList", new Blob([JSON.stringify(updatedFieldCrop)], { type: "application/json" }));

    const swalResult = await Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
    });

    if (swalResult.isConfirmed) {
        try {
            const response = await $.ajax({
                url: "http://localhost:5050/api/v1/fields",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
            });

            let loadFieldCard = new LoadFieldCard();
            $('#fieldForm')[0].reset();
            $('#preview1').addClass('d-none');
            $('#preview2').addClass('d-none');
            $('#newFieldModal').modal('hide');
            Swal.fire("Saved!", "", "success");
            clearFieldForm();
            await loadFieldCard.loadAllFieldCard();
        } catch (error) {
            console.error("AJAX error:", error);
            Swal.fire("Failed to save the field", "", "error");
        }
    } else if (swalResult.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
    }
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
    const loadAllStaffMember = new LoadAllStaffMember();
    loadAllStaffMember.loadAllMembers().then(memberCode => {
        addDropdown('#additionalStaff', 'filed-staffId', memberCode);
    })
});

// SET DATA FOR UPDATE MODAL
$('#fieldCard').on('click', '.update-button', function () {
    const card = $(this).closest('.card');
    $('#selectedFieldCode').val(card.find('.card-filedCode').text().replace('Code:', '').trim());
    $('#updateFieldName').val(card.find('.card-name').text().replace('Name:', '').trim());
    let location = card.find('.card-location').text().replace('Location:', '').trim();
    $('#updateExtentSize').val(card.find('.card-extent-size').text().replace('Extent Size:', '').trim());
    const crop = card.find('.card-crop').text().replace('Crop:', '').trim().split(', ');
    const staff = card.find('.card-staff').text().replace('Staff:', '').trim().split(', ');
    $('#updatePreview1').attr('src', card.find('.image-preview1').attr('src')).removeClass('d-none');
    $('#updatePreview2').attr('src', card.find('.image-preview2').attr('src')).removeClass('d-none');

    let coordinates = location.match(/x:\s*(-?\d+\.?\d*)\s*y:\s*(-?\d+\.?\d*)/);
    if (coordinates) {
        let formattedCoordinates = `${coordinates[1]}, ${coordinates[2]}`;
        $('#updateFieldLocation').val(formattedCoordinates);
    }

    // Populate dropdowns with multiple selections
    const loadAllCrop = new LoadCards();
    loadAllCrop.loadAllCropCard().then(cropCode => {
        populateDropdown('#updateFieldCropId', crop, cropCode);
    });
    const loadAllStaff = new LoadAllStaffMember();
    loadAllStaff.loadAllMembers().then(memberCode => {
        populateDropdown('#updateStaffCrop', staff, memberCode);
    });

    $('#updateFieldImage1Input').val('');
    $('#updateFieldImage2Input').val('');
    $('#updateFieldModal').modal('show');
});

//UPDATE FIELD CARD
$("#updateFieldButton").on("click", async function() {
    let fieldCode = $('#selectedFieldCode').val();
    let updatedFieldName = $("#updateFieldName").val();
    let updatedLocation = $("#updateFieldLocation").val();
    let updatedExtentSize = $("#updateExtentSize").val();

    let updatedFieldCrop = collectSelectedValues('#updateFieldCropId select', '#additionalFieldCropUpdate select');
    let updatedFieldStaff = collectSelectedValues('#updateStaffCrop select', '#additionalStaffCropUpdate select');

    updatedFieldCrop = updatedFieldCrop.filter(id => ({cropCode:id}));
    updatedFieldStaff = updatedFieldStaff.filter(id => ({memberCode:id}));

    let fieldImage1 = await handleLogImage('#updateFieldImage1Input','#updatePreview1');
    let fieldImage2 = await handleLogImage('#updateFieldImage2Input','#updatePreview2');

    const formData = new FormData();
    formData.append("name", updatedFieldName);
    formData.append("location", updatedLocation);
    formData.append("extentSize", updatedExtentSize);
    formData.append("memberCodeList", new Blob([JSON.stringify(updatedFieldStaff)], { type: "application/json" }));
    formData.append("cropCodeList", new Blob([JSON.stringify(updatedFieldCrop)], { type: "application/json" }));

    if (!fieldImage1 || !fieldImage2) {
        const previewImage1 = $('#updatePreview1').attr('src');
        const previewImage2 = $('#updatePreview2').attr('src');
        if (previewImage1 && previewImage2) {
            try {
                const response1 = await fetch(previewImage1);
                const response2 = await fetch(previewImage2);
                const blob1 = await response1.blob();
                const blob2 = await response2.blob();
                formData.append("fieldImage1", blob1);
                formData.append("fieldImage2", blob2);
            } catch (error) {
                Swal.fire('Error', 'Failed to process the image. Please try again.', 'error');
                return;
            }
        } else {
            Swal.fire('Error', 'No image provided!', 'error');
            return;
        }
    }else {
        formData.append("fieldImage1", fieldImage1);
        formData.append("fieldImage2", fieldImage2);
    }

    const swalResult = await Swal.fire({
        title: "Do you want to update the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Update",
        denyButtonText: `Don't update`
    });

    if (swalResult.isConfirmed) {
        try {
            const response = await $.ajax({
                url: `http://localhost:5050/api/v1/fields/${fieldCode}`,
                type: "PUT",
                data: formData,
                processData: false,
                contentType: false
            });
            $('#updateCropForm')[0].reset();
            $('#previewCrop').addClass('d-none');
            $('#additionalLogInCropUpdate').empty();
            $('#additionalFieldInCropUpdate').empty();
            clearUpdateFieldForm();
            $("#updateFieldModal").modal("hide");

            let loadAllField = new LoadFieldCard();
            await loadAllField.loadAllFieldCard();

            Swal.fire("Updated!", "", "success");
        } catch (error) {
            console.error("Update failed:", error);
            Swal.fire("Failed to update field", "", "error");
        }
    } else if (swalResult.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
    }
});

// Function to add dynamic Crop dropdown in the update modal
$('#addFieldCropButtonUpdate').on('click', function() {
    const loadAllCrop = new LoadCards();
    loadAllCrop.loadAllCropCard().then(cropCode => {
        addDropdown('#additionalFieldCropUpdate', 'fieldCropUpdate', cropCode);
    });
});

// Function to add dynamic Staff dropdown in the update modal
$('#addFieldStaffButtonUpdate').on('click', function() {
    const loadAllStaff = new LoadAllStaffMember();
    loadAllStaff.loadAllMembers().then(memberCode => {
        addDropdown('#additionalStaffCropUpdate', 'staffCropUpdate', memberCode);
    });
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

//DELETE FIELD CARD
$('#fieldCard').on('click', '.delete-button', function () {
    // Get the card ID from the delete button and set it on the confirm delete button
    const cardId = $(this).data('field-code');
    $('#confirmDeleteButton').data('field-code', cardId);
    $('#confirmDeleteModal').modal('show');
});

// Handle the confirmation of the delete action
$('#confirmDeleteButton').on('click', async function () {
    const cardId = $(this).data('field-code');

    try {
        const response = await $.ajax({
            url: `http://localhost:5050/api/v1/fields/${cardId}`,
            type: 'DELETE',
        });

        // Reload field cards
        const loadFieldCard = new LoadFieldCard();
        await loadFieldCard.loadAllFieldCard();

        Swal.fire('Deleted!', 'The field has been deleted successfully.', 'success');
    } catch (error) {
        console.error("Error deleting field:", error);
        const status = error.status;

        if (status === 404) {
            Swal.fire('Error', 'Field not found!', 'error');
        } else if (status === 400) {
            Swal.fire('Error', 'Invalid field ID!', 'error');
        } else {
            Swal.fire('Error', 'Failed to delete the field. Please try again.', 'error');
        }
    } finally {
        $('#confirmDeleteModal').modal('hide');
    }
});

// Ensure the modal and backdrop are fully removed when hidden (overlay)
$('#confirmDeleteModal').on('hidden.bs.modal', function () {
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
});

function collectSelectedValues(...selectors) {
    let values = [];
    selectors.forEach(selector => {
        $(selector).each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) values.push(selectedValue);
        });
    });
    return values;
}

async function handleLogImage(input,preview) {
    let logImage = $(input)[0].files[0];
    if (!logImage) {
        const previewImageSrc = $(preview).attr('src');
        if (previewImageSrc) {
            try {
                const response = await fetch(previewImageSrc);
                const blob = await response.blob();
                return blob;
            } catch (error) {
                throw new Error('Failed to process the image. Please try again.');
            }
        } else {
            throw new Error('No image provided!');
        }
    }
    return logImage;
}

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
                        let imageData1 = `data:image/jpeg;base64,${field.fieldImage1}`;
                        let imageData2 = `data:image/jpeg;base64,${field.fieldImage2}`;
                        const carouselId = `carousel${index}`;
                        let newFieldCard = `
                            <div id="card${index}" class="col-md-6 col-lg-4 mb-4">
                                <div class="card text-white" data-card-code="${field.fieldCode}" style="background-color: #2b2b2b; border: 1px solid gray;">
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
                                        <p class="card-crop"><strong>Crop:</strong>${field.cropCodeList && field.cropCodeList.length > 0 ? field.cropCodeList.join(', ') : "No Crops"}</p>
                                        <p class="card-log"><strong>Log:</strong>${field.logCodeList && field.logCodeList.length > 0 ? field.logCodeList.join(', ') : "No Logs"}</p>
                                        <p class="card-staff"><strong>Staff:</strong>${field.memberCodeList && field.memberCodeList.length > 0 ? field.memberCodeList.join(', ') : "No Members"}</p>
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-success flex-grow-1 me-2 update-button" data-field-code="${field.fieldCode}">Update</button>
                                            <button type="button" class="btn btn-danger flex-grow-1 delete-button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-field-code="${field.fieldCode}">Delete</button>
                                        </div>
                                    </div>                            
                                </div> 
                            </div>       
                        `;
                        $('#fieldCard').append(newFieldCard);
                    });
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
