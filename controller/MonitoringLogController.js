let cardCount = 0;
$(document).ready(function() {

    $('#newButton').on('click',function (){
        clearModel('#logDate','#log-details','previewCropLogImg','#logCropImageInput','#additionalLogStaff','#additionalLogCrop','#additionalLogField');
    });

    // Handle form submission
    $('#addLogButton').on('click', function (e) {
        cardCount++;
        e.preventDefault(); // Prevent form from actually submitting

        // Retrieve form values
        let logDate = $('#logDate').val();
        let details = $('#log-details').val();
        let fieldIds = []; // Sample field IDs
        let cropIds = []; // Array to store crop IDs
        let staffIds = []; // Array to store staff IDs

        // Collect all crop IDs from main and additional selects
        $('#log-filedId').val() && fieldIds.push($('#log-filedId').val());
        $('#additionalLogField select').each(function () {
            fieldIds.push($(this).val()); // Add each non-empty additional select value
        });

        // Collect all staff IDs from main and additional selects
        $('#log-cropId').val() && cropIds.push($('#log-cropId').val());
        $('#additionalLogCrop select').each(function () {
            cropIds.push($(this).val());
        });

        // Collect all staff IDs from main and additional selects
        $('#log-staffId').val() && staffIds.push($('#log-staffId').val());
        $('#additionalLogStaff select').each(function () {
            staffIds.push($(this).val());
        });

        // Clean up arrays to remove any empty values
        fieldIds = fieldIds.filter(id => id);
        cropIds = cropIds.filter(id => id);
        staffIds = staffIds.filter(id => id);

        let logImage = $('#previewCropLogImg').attr('src');

        let newLogCard = `
                    <div class="col-md-6 col-lg-4 mb-4" id="card${cardCount}">
                        <div class="card text-white" style="background-color: #2b2b2b; border: 1px solid gray;">
                            <div class="card-image-container">
                                <img src="${logImage}" class="card-img-top image-preview" alt="log Image">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Log Details</h5>
                                <p class="card-log-code"><strong>Log Code:</strong>C${Math.floor(Math.random() * 100)}</p>
                                <p class="card-log-date"><strong>Log Date:</strong>${logDate}</p>
                                <p class="card-log-details"><strong>Log Details:</strong>${details}</p>
                                <p class="card-log-fields"><strong>Field:</strong>${fieldIds.join(', ')}</p>
                                <p class="card-log-crop"><strong>Crop:</strong>${cropIds.join(', ')}</p>
                                <p class="card-log-staff"><strong>Staff:</strong>${staffIds.join(', ')}</p>
                                <div class="d-flex justify-content-between">
                                    <button class="btn btn-success flex-grow-1 me-2 update-button" data-card-id="card${cardCount}">Update</button>
                                    <button class="btn btn-danger flex-grow-1 delete-button" data-card-id="card${cardCount}">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
    `;

        // Append the new card to the row container
        $('#logCard').append(newLogCard);

        // Reset the form and previews
        $('#logForm')[0].reset();
        $('#previewCropLogImg').addClass('d-none');
        $('#newMonitoringLogModal').modal('hide');
    });

    //SET DATA FOR UPDATE MODAL AFTER CLICK CARD UPDATE BUTTON
    $('#logCard').on('click','.update-button',function (){
        const cardId = $(this).data('card-id');
        const cropCard = $(`#${cardId}`);

        // Populate modal with card details for updating
        $('#updateLogDate').val(cropCard.find('.card-log-date').text().replace('Log Date:', '').trim());
        $('#updateLog-details').val(cropCard.find('.card-log-details').text().replace('Log Details:', ''));
        let field = cropCard.find('.card-log-fields').text().replace('Field:', '').trim().split(', ').map(item => item.trim());
        let staff = cropCard.find('.card-log-staff').text().replace('Staff:', '').trim().split(', ').map(item => item.trim());
        let crop = cropCard.find('.card-log-crop').text().replace('Crop:', '').trim().split(', ').map(item => item.trim());
        $('#updatePreviewCropLogImg').attr('src', cropCard.find('.image-preview').attr('src')).removeClass('d-none');

        $('#updateLogCropImageInput').val(''); // Clear file input for new upload
        $('#updateLogModalButton').data('card-id', cardId); // Set card ID
        $('#updateMonitoringLogModal').modal('show');

        populateDropdownLog('#updateLogFieldId', field, ["F01", "F02", "F03", "F04", "F05"]);
        populateDropdownLog('#updateLogInCropId', crop, ["C01", "C02", "C03", "C04", "C05"]);
        populateDropdownLog('#updateLogInStaffId', staff, ["S01", "S02", "S03", "S04", "S05"]);
    });

    //UPDATE LOG CARD
    $('#updateLogModalButton').on('click',function (){
        let logDate = $('#updateLogDate').val();
        let logDetails = $('#updateLog-details').val();

        //field
        let updatedLogField = [];
        $('#updateLogFieldId select').each(function() {
            let fieldValue = $(this).val();
            if (fieldValue) {
                updatedLogField.push(fieldValue);
            }
        });

        // Collect values from all Field dropdowns
        $('#additionalFieldInLogUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedLogField.push(selectedValue);
        });

        //crop
        let updatedCropLogs = [];
        $('#updateLogInCropId select').each(function() {
            let fieldValue = $(this).val();
            if (fieldValue) {
                updatedCropLogs.push(fieldValue);
            }
        });

        // Collect values from all Field dropdowns
        $('#additionalLogsCropUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedCropLogs.push(selectedValue);
        });

        //staff
        let updatedStaffLogs = [];
        $('#updateLogInStaffId select').each(function() {
            let fieldValue = $(this).val();
            if (fieldValue) {
                updatedStaffLogs.push(fieldValue);
            }
        });

        // Collect values from all Field dropdowns
        $('#additionalLogStaffUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedStaffLogs.push(selectedValue);
        });

        let logImage = $('#updatePreviewCropLogImg').attr('src');
        // Update existing card details
        const cardId = $(this).data('card-id'); //update button in card
        const cropCard = $(`#${cardId}`);

        cropCard.find('.card-log-date').text(`Log Date: ${logDate}`);
        cropCard.find('.card-log-details').text(`Log Details: ${logDetails}`);
        cropCard.find('.card-log-fields').text(`Field: ${updatedLogField.join(', ')}`);
        cropCard.find('.card-log-staff').text(`Staff: ${updatedStaffLogs.join(', ')}`);
        cropCard.find('.card-log-crop').text(`Crop: ${updatedCropLogs.join(', ')}`);
        cropCard.find('.image-preview').attr('src', logImage);

        $('#updateLogForm')[0].reset();
        $('#updatePreviewCropLogImg').addClass('d-none');
        $('#additionalFieldInLogUpdate').empty();
        $('#additionalLogsCropUpdate').empty();
        $('#additionalLogStaffUpdate').empty();

        $('#updateMonitoringLogModal').modal('hide');
    });

    // DELETE LOG CARD
    $(document).on('click', '.delete-button', function () {
        // Get the card ID from the delete button and set it on the confirm delete button
        const cardId = $(this).data('card-id');
        $('#confirmLogDeleteButton').data('card-id', cardId);
        $('#confirmLogDeleteModal').modal('show');
    });

    // Handle the confirmation of the delete action
    $('#confirmLogDeleteButton').on('click', function () {
        const cardId = $(this).data('card-id');
        removeFieldCard(cardId);

        // Hide the modal after deleting
        $('#confirmLogDeleteModal').modal('hide');
    });

    // Ensure the modal and backdrop are fully removed when hidden (overlay)
    $('#confirmLogDeleteModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open'); // Removes the modal-open class from body
        $('.modal-backdrop').remove();       // Removes the leftover backdrop element
    });

    function removeFieldCard(id) {
        $('#' + id).remove();
    }


    function populateDropdownLog(container, selectedValues, options) {
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

    $('#addFieldBtnInLogUpdate').on('click',function (){
        addDropdownLogs("#additionalFieldInLogUpdate","#fieldInLogUpdate",["F01", "F02", "F03", "F04","F05"]);
    });

    $('#addLogCropButtonUpdate').on('click',function (){
        addDropdownLogs("#additionalLogsCropUpdate","#log-cropIdUpdate",["C01", "C02", "C03", "C04","C05"]);
    });

    $('#addLogStaffButtonUpdate').on('click',function (){
        addDropdownLogs("#additionalLogStaffUpdate","#log-staffIdUpdate",["S01", "S02", "S03", "S04","S05"]);
    });

    $('#logCropImageInput').on('click',function (){
        previewLogImage("#logCropImageInput","#previewCropLogImg");
    });

    $('#updateLogCropImageInput').on('click',function (){
        previewLogImage("#updateLogCropImageInput","#updatePreviewCropLogImg");
    });

    // Preview image in modal when file input changes
    function previewLogImage(imageInputId,imgPreviewId){
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

    // Function to add dynamic staff field dropdown in the add modal
    $('#addLogStaffButton').on('click', function() {
        addDropdownLogs('#additionalLogStaff', '#log-staffId', ["S01", "S02", "S03", "S04", "S05"]);
    });

    // Function to add dynamic field dropdown in the add modal
    $('#addLogFieldButton').on('click', function() {
        addDropdownLogs('#additionalLogField', '#log-filedId', ["F01", "F02", "F03", "F04", "F05"]);
    });

    // Function to add dynamic field dropdown in the add modal
    $('#addLogCropButton').on('click', function() {
        addDropdownLogs('#additionalLogCrop', '#log-cropId', ["C01", "C02", "C03", "C04", "C05"]);
    });

    //add additional combo box in add modal
    function addDropdownLogs(containerId, selectClass, options) {
        const $container = $('<div class="d-flex align-items-center mt-2"></div>');
        const $select = $('<select id="optionSelect" class="form-control me-2 text-white" style="background-color:#2B2B2B"></select>').addClass(selectClass);

        // Populate select options
        options.forEach(option => $select.append(`<option value="${option}" style="background-color:#2B2B2B">${option}</option>`));

        // Remove button
        const $removeBtn = $('<button class="btn btn-danger">Remove</button>');
        $removeBtn.on('click', function() {
            $container.remove();
        });

        $container.append($select).append($removeBtn);
        $(containerId).append($container);
    }

    function clearModel(logDate,logDetail,previewImage,imageInput,additionalStaffField,additionalCropField,additionalLogField){
        $(`${logDate},${logDetail}`).val('');
        $(`${previewImage}`).hide().attr('src', '');
        $(`${imageInput}`).val('');
        $(`${additionalStaffField},${additionalCropField},${additionalLogField}`).empty();
    }
});