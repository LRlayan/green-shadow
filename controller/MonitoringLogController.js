$(document).ready(function() {

    $('#newButton').on('click',function (){
        clearModel('#logDate','#log-details','previewCropLogImg','#logCropImageInput','#additionalLogStaff','#additionalLogCrop','#additionalLogField');
    });

    $('#logCard').on('click','.update-button',function (){

    });

    $('#updateLogModalButton').on('click',function (){
        clearModel('#updateLogDate','#updateLog-details','#updatePreviewCropLogImg','#updateLogCropImageInput','#additionalLogStaffUpdate','#additionalLogsCropUpdate','#additionalLogFieldUpdate');
    });

    // Handle form submission
    $('#addLogButton').on('click', function (e) {
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

        let logImage = $('#previewCropLogImg').attr('src'); // Preview image 1

        let newLogCard = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card text-white" style="background-color: #2b2b2b; border: 1px solid gray;">
                            <div class="card-image-container">
                                <img src="${logImage}" class="card-img-top" alt="log Image">
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
                                    <button class="btn btn-success flex-grow-1 me-2 update-button">Update</button>
                                    <button class="btn btn-danger flex-grow-1">Delete</button>
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

    // Preview image functionality
    $('#logCropImageInput').on('change', function () {
        const [file] = this.files;
        if (file) {
            $('#previewCropLogImg').removeClass('d-none').attr('src', URL.createObjectURL(file));
        }
    });

    $('#cropImageInput').on('click',function (){
        previewLogImage("#logCropImageInput","#previewCropLogImg");
    });

    $('#updateCropImage').on('click',function (){
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

    function clearModel(logDate,logDetail,previewImage,imageInput,additionalStaffField,additionalCropField,additionalLogField){
        $(`${logDate},${logDetail}`).val('');
        $(`${previewImage}`).hide().attr('src', '');
        $(`${imageInput}`).val('');
        $(`${additionalStaffField},${additionalCropField},${additionalLogField}`).empty();
    }
});