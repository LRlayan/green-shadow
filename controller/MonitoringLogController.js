import {LoadFieldCard} from "./FieldController.js";
import {LoadAllStaffMember} from "./StaffController.js";
import {LoadCards} from "./CropController.js";

let cardCount = 0;

    $('#newButton').on('click',function (){
        clearModel('#logDate','#log-details','previewCropLogImg','#logCropImageInput','#additionalLogStaff','#additionalLogCrop','#additionalLogField');
    });

    // Handle form submission - save
    $('#addLogButton').on('click', function (e) {
        cardCount++;
        e.preventDefault();

        let logDate = $('#logDate').val();
        let logDetails = $('#log-details').val();
        let fieldIds = [];
        let cropIds = [];
        let staffIds = [];

        $('#log-filedId').val() && fieldIds.push($('#log-filedId').val());
        $('#additionalLogField select').each(function () {
            fieldIds.push($(this).val());
        });

        $('#log-cropId').val() && cropIds.push($('#log-cropId').val());
        $('#additionalLogCrop select').each(function () {
            cropIds.push($(this).val());
        });

        $('#log-staffId').val() && staffIds.push($('#log-staffId').val());
        $('#additionalLogStaff select').each(function () {
            staffIds.push($(this).val());
        });

        // Clean up arrays to remove any empty values
        fieldIds = fieldIds.filter(fieldCode => ({fieldCode:fieldCode}));
        cropIds = cropIds.filter(cropId => ({cropCode:cropId}));
        staffIds = staffIds.filter(staffId => ({memberCode:staffId}));

        let observedImage = $('#logCropImageInput')[0].files[0];

        const formData = new FormData();
        formData.append("date",logDate);
        formData.append("logDetails",logDetails);
        formData.append("observedImage",observedImage);
        formData.append("staffList",new Blob([JSON.stringify(staffIds)], { type: "application/json" }));
        formData.append("cropList",new Blob([JSON.stringify(cropIds)], { type: "application/json" }));
        formData.append("fieldList",new Blob([JSON.stringify(fieldIds)], { type: "application/json" }));

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
                    url: "http://localhost:5050/api/v1/logs",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        Swal.fire("Saved!", "", "success");
                        $('#logForm')[0].reset();
                        $('#additionalLogField').empty();
                        $('#additionalLogCrop').empty();
                        $('#additionalLogStaff').empty();
                        const loadAllLogs = new LoadAllLogs();
                        loadAllLogs.loadAllLogsDetails().then(logCodes => {
                        }).catch(error => {
                            console.error("Error loading log cards:", error);
                        });
                        // Reset the form and previews
                        $('#logForm')[0].reset();
                        $('#previewCropLogImg').addClass('d-none');
                        $('#newMonitoringLogModal').modal('hide');
                    },
                    error: function (xhr, status, error) {
                        Swal.fire('Error', 'Failed Load logs!', 'error');
                    }
                });
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    });

    //SET DATA FOR UPDATE MODAL AFTER CLICK CARD UPDATE BUTTON
    $('#logCard').on('click','.update-button',function (){
        const card = $(this).closest('.card');
        const cardDate = card.find('.card-log-date').text().replace('Log Date:', '').trim();
        const details = card.find('.card-log-details').text().replace('Log Details:', '').trim();
        const fields = card.find('.card-log-fields').text().replace('Field:', '').trim().split(', ');
        const crops = card.find('.card-log-crop').text().replace('Crop:', '').trim().split(', ');
        const staff = card.find('.card-log-staff').text().replace('Staff:', '').trim().split(', ');
        $('#updatePreviewCropLogImg').attr('src', card.find('.image-preview').attr('src')).removeClass('d-none');

        $('#updateLogDate').val(cardDate);
        $('#updateLog-details').val(details);
        $('#updateMonitoringLogModal').modal('show');

        const loadAllField = new LoadFieldCard();
        loadAllField.loadAllFieldCard().then(fieldCode => {
            populateDropdownLog('#updateLogFieldId', fields, fieldCode);
        });

        const loadAllCrops = new LoadCards();
        loadAllCrops.loadAllCropCard().then(cropCode => {
            populateDropdownLog('#updateLogInCropId', crops, cropCode);
        });

        const loadAllStaffMember = new LoadAllStaffMember();
        loadAllStaffMember.loadAllMembers().then(memberCode => {
            populateDropdownLog('#updateLogInStaffId', staff, memberCode);
        });
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

        $.ajax({
            url: `http://localhost:5050/api/v1/logs/${cardId}`,
            type: 'DELETE',
            success: function () {
                Swal.fire('Deleted!', 'The Logs card has been deleted.', 'success');
                const loadLogCard = new LoadAllLogs();
                loadLogCard.loadAllLogsDetails();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting logs:", error);
                if (xhr.status === 404) {
                    Swal.fire('Error', 'Log not found!', 'error');
                } else if (xhr.status === 400) {
                    Swal.fire('Error', 'Invalid log code!', 'error');
                } else {
                    Swal.fire('Error', 'Failed to delete logs. Please try again.', 'error');
                }
            }
        });

        // Hide the modal after deleting
        $('#confirmLogDeleteModal').modal('hide');
    });

    // Ensure the modal and backdrop are fully removed when hidden (overlay)
    $('#confirmLogDeleteModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open'); // Removes the modal-open class from body
        $('.modal-backdrop').remove();       // Removes the leftover backdrop element
    });

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
        const loadAllStaffMember = new LoadAllStaffMember();
        loadAllStaffMember.loadAllMembers().then(staffCode => {
            addDropdownLogs('#additionalLogStaff', '#log-staffId', staffCode);
        })
    });

    // Function to add dynamic field dropdown in the add modal
    $('#addLogFieldButton').on('click', function() {
        const loadFieldCard = new LoadFieldCard();
        loadFieldCard.loadAllFieldCard().then(fieldCard => {
            addDropdownLogs('#additionalLogField', '#log-filedId', fieldCard);
        })
    });

    // Function to add dynamic field dropdown in the add modal
    $('#addLogCropButton').on('click', function() {
        const loadALlCrop = new LoadCards();
        loadALlCrop.loadAllCropCard().then(cropCode => {
            addDropdownLogs('#additionalLogCrop', '#log-cropId', cropCode);
        })
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

    export class LoadAllLogs{
        loadAllLogsDetails(){
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "http://localhost:5050/api/v1/logs",
                    type: "GET",
                    success: function (logs) {
                        $("#logCard").empty();
                        const logCodes = logs.map(log => log.logCode);
                        // Loop through each field and create a card
                        logs.forEach((log, index) => {
                            let logImage = `data:image/jpeg;base64,${log.observedImage}`;

                            let newLogCard = `
                            <div class="col-md-6 col-lg-4 mb-4" id="card${index}">
                                <div class="card text-white" data-card-code="${log.logCode}" style="background-color: #2b2b2b; border: 1px solid gray;">
                                    <div class="card-image-container">
                                        <img src="${logImage}" class="card-img-top image-preview" alt="log Image">
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Log Details</h5>
                                        <p class="card-log-code"><strong>Log Code:</strong>${log.logCode}</p>
                                        <p class="card-log-date"><strong>Log Date:</strong>${log.date}</p>
                                        <p class="card-log-details"><strong>Log Details:</strong>${log.logDetails}</p>
                                        <p class="card-log-fields"><strong>Field:</strong>${log.fieldList.join(', ')}</p>
                                        <p class="card-log-crop"><strong>Crop:</strong>${log.cropList.join(', ')}</p>
                                        <p class="card-log-staff"><strong>Staff:</strong>${log.staffList.join(', ')}</p>
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-success flex-grow-1 me-2 update-button" data-card-id="${log.logCode}">Update</button>
                                            <button class="btn btn-danger flex-grow-1 delete-button" data-card-id="${log.logCode}">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
                            $('#logCard').append(newLogCard);
                        });
                        resolve(logCodes);
                    },
                    error: function (xhr, status, error) {
                        alert("Failed to retrieve logs");
                        reject(error);
                    }
                });
            });
        }
    }