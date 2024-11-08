import Staff from "../model/Staff.js";
import {staffDetails} from "../db/db.js"

let clickTableRow = 0;
$(document).ready(function() {

    // Function to add a row with sample data
    function addRowToTable(staffData) {
        const $newRow = $('<tr></tr>');

        // Append data fields as cells in the row
        Object.keys(staffData).forEach(key => {
            $newRow.append(`<td>${staffData[key]}</td>`);
        });

        // Set data attributes for easy access during row click
        $newRow.data("staffData", staffData);

        // Add click event to populate update modal when row is clicked
        $newRow.on("click", function () {
            populateUpdateModal($(this).data("staffData"));
        });

        // Append delete button
        const $deleteBtn = $('<button class="btn btn-danger btn-sm">Delete</button>').on("click", function() {
            // Store the row for deletion reference in modal
            $('#confirmStaffDeleteModal').data('rowToDelete', $newRow);
            // Show confirmation modal
            $('#confirmStaffDeleteModal').modal('show');
        });
        $newRow.append($('<td></td>').append($deleteBtn));

        // Append the new row to the table body
        $('#staffDetailsTable').append($newRow);
    }

// Function to dynamically generate input fields and set values
    function addDynamicFields(containerId, values) {
        const $container = $('#' + containerId);
        $container.empty(); // Clear any existing inputs

        values.forEach((value, index) => {
            // Create a new input for each value
            const $input = $('<input>')
                .addClass('form-control mb-2')
                .attr('type', 'text')
                .attr('placeholder', `Enter value ${index + 1}`)
                .val(value); // Set the existing value

            $container.append($input);
        });
    }

    //save staff member
    $('#addFieldButtonInStaff').on('click',(e)=>{
        e.preventDefault();
        // Collect form data
        let firstName = $("#firstName").val();
        let lastName = $("#lastName").val();
        let joinedDate = $("#joinedDate").val();
        let designation = $("#designation").val();
        let gender = $("#gender").val();
        let dob = $("#dob").val();
        let addressLine01 = $("#addressLine01").val();
        let addressLine02 = $("#addressLine02").val();
        let addressLine03 = $("#addressLine03").val();
        let addressLine04 = $("#addressLine04").val();
        let addressLine05 = $("#addressLine05").val();
        let contactNo = $("#ContactNo").val();
        let emailStaff = $("#emailStaff").val();
        let roleStaff = $("#roleStaff").val();

        // Collect multiple field values
        let fieldStaff = [];
        $("#additionalStaffField select").each(function() {
            let fieldValue = $(this).val();
            if (fieldValue) {
                fieldStaff.push(fieldValue);
            }
        });

        // Collect multiple staff values
        let staffVehicle = [];
        $("#additionalStaffVehicle select").each(function() {
            let staffValue = $(this).val();
            if (staffValue) {
                staffVehicle.push(staffValue);
            }
        });

        // Collect multiple staff values
        let staffEquipment = [];
        $("#additionalStaffEquipment select").each(function() {
            let staffValue = $(this).val();
            if (staffValue) {
                staffEquipment.push(staffValue);
            }
        });
        let staffLogs = [];
        let staffDetail = new Staff("01",firstName,lastName,joinedDate,designation,gender,dob,addressLine01,addressLine02,addressLine03,addressLine04,addressLine05,contactNo,emailStaff,roleStaff,fieldStaff,staffVehicle,staffLogs,staffEquipment);
        staffDetails.push(staffDetail);
        loadStaffTable();
        $('#staffForm')[0].reset()
        $('#additionalStaffField').empty();
        $('#additionalStaffVehicle').empty();
        $('#additionalStaffEquipment').empty();
        $('#newStaffModal').modal('hide');
    });

    function loadStaffTable(){
        $('#staffDetailsTable').empty();
        staffDetails.map((staff, index) => {
            const row = `
            <tr>
                <td class="code">${staff.code}</td>
                <td class="fName">${staff.firstName}</td>
                <td class="lName">${staff.lastName}</td>
                <td class="designation">${staff.designation}</td>
                <td class="gender">${staff.gender}</td>
                <td class="joinedDate">${staff.joinedDate}</td>
                <td class="dob">${staff.dob}</td>
                <td class="buildingNo">${staff.addressLine01}</td>
                <td class="lane">${staff.addressLine02}</td>
                <td class="city">${staff.addressLine03}</td>
                <td class="state">${staff.addressLine04}</td>
                <td class="postalCode">${staff.addressLine05}</td>
                <td class="contactNo">${staff.contactNo}</td>
                <td class="email">${staff.email}</td>
                <td class="role">${staff.role}</td>
                <td class="fields">${staff.fieldList.join(', ')}</td>
                <td class="logs">${staff.logList.join(', ')}</td>
                <td class="vehicle">${staff.vehicle}</td>
                <td class="equipment">${staff.equipmentList.join(', ')}</td>
                <td><button class="btn btn-danger delete-button" data-index="${index}">Delete</button></td>
            </tr>
        `;
            $('#staffDetailsTable').append(row);
        });
    }

    //update Staff member
    $('#staffDetailsTable').on('click','tr', ()=>{

        let fName = $(this).find(".fName").text();
        let lName = $(this).find(".lName").text();
        let designation = $(this).find(".designation").text().trim();
        let gender = $(this).find(".gender").text().trim();
        let joinedDate = $(this).find(".joinedDate").text();
        let dob = $(this).find(".dob").text();
        let addressLine01 = $(this).find(".buildingNo").text();
        let addressLine02 = $(this).find(".city").text();
        let addressLine03 = $(this).find(".lane").text();
        let addressLine04 = $(this).find(".state").text();
        let addressLine05 = $(this).find(".postalCode").text();
        let contactNo = $(this).find(".contactNo").text();
        let email = $(this).find(".email").text();
        let role = $(this).find(".role").text().trim();
        let fieldsArray = $(this).find(".fields").text().split(", ");
        let logs = $(this).find(".logs").text().split(", ");
        let vehicleArray = $(this).find(".vehicle").text().split(", ");
        let equipmentArray = $(this).find(".equipment").text().split(", ");

        clickTableRow = $(this).index();

        $('#firstNameUpdate').val(fName);
        $('#lastNameUpdate').val(lName);
        $('#joinedDateUpdate').val(joinedDate);
        $('#dobUpdate').val(dob);
        $('#addressLine01Update').val(addressLine01);
        $('#addressLine02Update').val(addressLine02);
        $('#addressLine03Update').val(addressLine03);
        $('#addressLine04Update').val(addressLine04);
        $('#addressLine05Update').val(addressLine05);
        $('#ContactNoUpdate').val(contactNo);
        $('#emailStaffUpdate').val(email);

        // Check if the combo box has an option matching the input value
        $('#roleStaffUpdate option').each(function() {
            if ($(this).val() === role) {
                $('#roleStaffUpdate').val(role);
                return false; // Stop loop once a match is found
            }
        });

        $('#designationUpdate option').each(function() {
            if ($(this).val() === designation) {
                $('#designationUpdate').val(designation);
                return false; // Stop loop once a match is found
            }
        });

        $('#genderUpdate option').each(function() {
            if ($(this).val() === gender) {
                $('#genderUpdate').val(gender);
                return false; // Stop loop once a match is found
            }
        });

        // Clear any existing inputs in the modal's dynamic dropdowns
        $('#updateField').empty();
        $('#updateVehicle').empty();
        $('#updateEquipment').empty();

        populateDropdownStaff("#updateField",fieldsArray,["F01", "F02", "F03", "F04", "F05"]);
        populateDropdownStaff("#updateVehicle",vehicleArray,["V01", "V02", "V03", "V04", "V05"]);
        populateDropdownStaff("#updateEquipment",equipmentArray,["E01", "E02", "E03", "E04", "E05"]);
    });

    //UPDATE STAFF MEMBER
    $('#updateMemberButton').on('click',function (){
        // Get updated values from modal inputs
        let firstName = $('#firstNameUpdate').val();
        let lName = $('#lastNameUpdate').val();
        let joinedDate = $('#joinedDateUpdate').val();
        let dob = $('#dobUpdate').val();
        let addressLine01 = $('#addressLine01Update').val();
        let addressLine02 = $('#addressLine02Update').val();
        let addressLine03 = $('#addressLine03Update').val();
        let addressLine04 = $('#addressLine04Update').val();
        let addressLine05 = $('#addressLine05Update').val();
        let contactNo = $('#ContactNoUpdate').val();
        let email = $('#emailStaffUpdate').val();
        let role = $('#roleStaffUpdate').val();
        let designation = $('#designationUpdate').val();
        let gender = $('#genderUpdate').val();

        // Collect updated field values
        let updatedFieldStaff = [];
        $("#filed-staffUpdate input").each(function() {
            let fieldValue = $(this).val();
            if (fieldValue) {
                updatedFieldStaff.push(fieldValue);
            }
        });

        // Collect updated vehicle values
        let updatedVehicleStaff = [];
        $("#vehicle-staffUpdate input").each(function() {
            let vehicleValue = $(this).val();
            if (vehicleValue) {
                updatedVehicleStaff.push(vehicleValue);
            }
        });

        // Collect updated equipment values
        let updatedEquipmentStaff = [];
        $("#equipment-staffUpdate input").each(function() {
            let equipmentValue = $(this).val();
            if (equipmentValue) {
                updatedEquipmentStaff.push(equipmentValue);
            }
        });

        // Collect values from all Field dropdowns
        $('#additionalStaffFieldUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedFieldStaff.push(selectedValue);
        });

        // Collect values from all vehicle dropdowns
        $('#additionalStaffVehicleUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedVehicleStaff.push(selectedValue);
        });

        // Collect values from all equipment dropdowns
        $('#additionalStaffEquipmentUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedEquipmentStaff.push(selectedValue);
        });

        // Update the selected staff object with the new values
        let staff = staffDetails[clickTableRow];
        staff.firstName = firstName;
        staff.lastName = lName;
        staff.designation = joinedDate;
        staff.gender = dob;
        staff.joinedDate = addressLine01;
        staff.dob = addressLine02;
        staff.addressLine01 = addressLine03;
        staff.addressLine02 = addressLine04;
        staff.addressLine03 = addressLine05;
        staff.addressLine04 = contactNo;
        staff.addressLine05 = email;
        staff.contactNo = role;
        staff.email = designation;
        staff.role = gender;
        staff.fieldList = updatedFieldStaff;
        staff.vehicle = updatedVehicleStaff;
        staff.equipmentList = updatedEquipmentStaff;

        // Reload the equipment table to reflect updated data
        loadStaffTable();
    });

    function populateDropdownStaff(container, selectedValues, options) {
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

    //delete Staff Member Details
    // Show delete confirmation modal
    $('#staffDetailsTable').on('click', '.delete-button', function () {
        const index = $(this).data('index');
        $('#confirmDeleteYes').data('index', index);
        $('#confirmStaffDeleteModal').modal('show');
    });

    // Handle the confirmation of deletion - yes button
    $('#confirmDeleteYes').on('click', function () {
        const index = $(this).data('index'); // Get the stored index
        staffDetails.splice(index, 1); // Remove the vehicle from the array
        loadStaffTable(); // Refresh the table
        $('#confirmStaffDeleteModal').modal('hide'); // Hide the modal
    });

//No button
    $('#confirmDeleteNo').on('click',()=>{
        $('#confirmStaffDeleteModal').modal('hide'); // Hide the modal
    });

    //Add Field
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffFieldButton').on('click', function() {
        addDropdownStaff("#additionalStaffField","#filed-staff",["F01", "F02", "F03", "F04", "F05"]);
    });

    //Add Field Update Modal
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffFieldButtonUpdate').on('click', function() {
        addDropdownStaff("#additionalStaffFieldUpdate","#filed-staffUpdate",["F01", "F02", "F03", "F04", "F05"]);
    });

    //Add Vehicle
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffVehicleButton').on('click', function() {
        addDropdownStaff("#additionalStaffVehicle","#vehicle-staff",["V01", "V02", "V03", "V04", "V05"]);
    });

    //Add Vehicle Update
    // jQuery to add a new dropdown with predefined options and a remove button
    $('#addStaffVehicleButtonUpdate').on('click', function() {
        addDropdownStaff("#additionalStaffVehicleUpdate","#vehicle-staffUpdate",["V01", "V02", "V03", "V04", "V05"]);
    });

    //Add Equipment
    // Predefined counts for each equipment ID
    const equipmentCounts = {
        "E01": 5,
        "E02": 3,
        "E03": 7,
        "E04": 2,
        "E05": 4
    };

    // jQuery to add a new equipment dropdown with a count input and remove button
    $('#addStaffEquipmentButton').on('click', function() {
        addDropdownStaff("#additionalStaffEquipment","#equipment-staff",["E01", "E02", "E03", "E04", "E05"],"equipment",equipmentCounts);
    });

    //Add Equipment Update Modal
    // Predefined counts for each equipment ID
    const equipmentCountsUpdate = {
        "E01": 5,
        "E02": 3,
        "E03": 7,
        "E04": 2,
        "E05": 4
    };

    // jQuery to add a new equipment dropdown with a count input and remove button
    $('#addStaffEquipmentButtonUpdate').on('click', function() {
        addDropdownStaff('#additionalStaffEquipmentUpdate','#equipment-staffUpdate',["E01", "E02", "E03", "E04", "E05"],"equipment",equipmentCountsUpdate)
    });

    function addDropdownStaff(containerId, selectClass, options, type, equipmentCountsList) {
        const $container = $('<div class="d-flex align-items-center mt-2"></div>');
        const $select = $('<select id="optionSelect" class="form-control me-2 text-white" style="background-color:#2B2B2B"></select>').addClass(selectClass);

        // Populate select options
        options.forEach(option => $select.append(`<option class="text-white" style="background-color:#2B2B2B" value="${option}">${option}</option>`));

        // Remove button
        const $removeBtn = $('<button class="btn btn-danger">Remove</button>');
        $removeBtn.on('click', function() {
            $container.remove();
        });

        $container.append($select).append($removeBtn);
        $(containerId).append($container);

        if (type === "equipment"){
            // Create a quantity input field
            const $quantityInput = $('<input type="number" class="form-control me-2 text-white" placeholder="Count" min="1" value="1" style="background-color:#2B2B2B">');

            // Update count input based on selected equipment
            $select.on('change', function() {
                const selectedEquipment = $(this).val();
                if (selectedEquipment && equipmentCountsList[selectedEquipment]) {
                    $quantityInput.val(equipmentCountsList[selectedEquipment]);
                } else {
                    $quantityInput.val(1); // Default value if none selected
                }
            });
            // Append the select, quantity input, and remove button to the container
            $container.append($select).append($quantityInput).append($removeBtn);
        }
    }
});
