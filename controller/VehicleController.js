import Vehicle from "../model/Vehicle.js";
import {vehicleDetails} from "../db/db.js"
$(document).ready(function () {
    let clickTableRow = 0;

    //save vehicle
    $("#modalSubmitButton").on("click", (e)=> {
        e.preventDefault(); // Prevent form submission

        // Collect form data
        let licensePlateNumber = $("#licensePlateNumber").val();
        let vehicleName = $("#vehicleName").val();
        let category = $("#category").val();
        let fuelType = $("#fuelType").val();
        let status = $("#status").val();
        let remark = $("#remark").val();

        // Collect multiple staff values
        let staffEquipment = [];
        $("#additionalVehicleStaff select").each(function() {
            let staffValue = $(this).val();
            if (staffValue) {
                staffEquipment.push(staffValue);
            }
        });

        let vehicleDetail = new Vehicle(licensePlateNumber,vehicleName,category,fuelType,status,staffEquipment,remark);
        vehicleDetails.push(vehicleDetail);
        loadVehicleTable(); // Refresh the table with updated data

        $('#vehicle-modal').modal("hide");
    });

    //load data to vehicle table
    function loadVehicleTable() {
        $('#vehicleDetailsTable').empty();
        const tableBody = $("#vehicleDetailsTable");
        tableBody.empty();

        vehicleDetails.map((vehicle,index) => {
            const row = `
                <tr>
                    <td class="code"></td>
                    <td class="licensePlateNumber">${vehicle.licensePlateNumber}</td>
                    <td class="vehicleName">${vehicle.vehicleName}</td>
                    <td class="category">${vehicle.category}</td>
                    <td class="fuelType">${vehicle.fuelType}</td>
                    <td class="status">${vehicle.status}</td>
                    <td class="staffMember">${vehicle.staffMember.join(', ')}</td>
                    <td class="remark">${vehicle.remark}</td>
                    <td><button class="btn btn-danger delete-button" data-index="${index}">Delete</button></td>
                </tr>
            `;
            tableBody.append(row);
        });
    }

    // Assuming your table rows are in tbody with id "vehicleDetailsTable"
    $('#vehicleDetailsTable').on('click', 'tr', function () {
        // Get values from the row
        let licensePlateNumber = $(this).find(".licensePlateNumber").text()
        let vehicleName = $(this).find(".vehicleName").text()
        let category = $(this).find(".category").text()
        let fuelType = $(this).find(".fuelType").text()
        let status = $(this).find(".status").text()
        let remark = $(this).find(".remark").text()

        clickTableRow = $(this).index();

        // Populate the modal fields
        $('#updateLicensePlateNumber').val(licensePlateNumber);
        $('#updateVehicleName').val(vehicleName);
        $('#updateCategoryVehicle').val(category);
        $('#updateFuelType').val(fuelType);
        $('#updateStatus').val(status);
        $('#updateRemark').val(remark);

        let staffMemberArray = $(this).find(".staffMember").text().split(", ");

        populateDropdownVehicle("#updateStaffVehicle",staffMemberArray,["S01", "S02", "S03", "S04", "S05"]);
    });

    // Show delete confirmation modal
    $('#vehicleDetailsTable').on('click', '.delete-button', function () {
        const index = $(this).data('index'); // Get the index of the vehicle to delete
        $('#confirmVehicleDeleteYes').data('index', index); // Store index in the button for later use
        $('#confirmVehicleDeleteModal').modal('show'); // Show the confirmation modal
    });

    // Handle the confirmation of deletion - yes button
    $('#confirmVehicleDeleteYes').on('click', function () {
        const index = $(this).data('index'); // Get the stored index
        vehicleDetails.splice(index, 1); // Remove the vehicle from the array
        loadVehicleTable(); // Refresh the table
        $('#confirmVehicleDeleteModal').modal('hide'); // Hide the modal
    });

    //No button
    $('#confirmVehicleDeleteNo').on('click',()=>{
        $('#confirmVehicleDeleteModal').modal('hide'); // Hide the modal
    });

    // Clear fields when the modal is closed
    $('#vehicle-modal').on('hidden.bs.modal', function () {
        $('#vehicleForm')[0].reset(); // Reset the form fields
    });

    // Handle the form submission for updating vehicle details
    $('#modalSubmitButtonUpdate').on('click', ()=> {
        // Collect form data
        let licensePlateNumber = $("#updateLicensePlateNumber").val();
        let vehicleName = $("#updateVehicleName").val();
        let category = $("#updateCategoryVehicle").val();
        let fuelType = $("#updateFuelType").val();
        let status = $("#updateStatus").val();
        let staffMember = $("#updateStaffMember").val();
        let remark = $("#updateRemark").val();

        // Collect updated staff values
        let updatedStaffVehicle = [];
        $("#updateStaffVehicle select").each(function() {
            let staffValue = $(this).val();
            if (staffValue) {
                updatedStaffVehicle.push(staffValue);
            }
        });

        // Collect values from all Staff Member dropdowns
        $('#additionalVehicleStaffUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedStaffVehicle.push(selectedValue);
        });

        let vehicle = vehicleDetails[clickTableRow];
        vehicle.licensePlateNumber = licensePlateNumber;
        vehicle.vehicleName = vehicleName;
        vehicle.category = category;
        vehicle.fuelType = fuelType;
        vehicle.status = status;
        vehicle.staffMember = updatedStaffVehicle;
        vehicle.remark = remark;
        loadVehicleTable();
    });

    //Add additional Staff Modal
    $('#addVehicleStaffButton').on('click', function() {
        addDropdownVehicle("#additionalVehicleStaff","#staff-vehicle",["S01", "S02", "S03", "S04", "S05"])
    });

    //Add additional Staff field Update Modal
    $('#addVehicleStaffButtonUpdate').on('click', function() {
        addDropdownVehicle("#additionalVehicleStaffUpdate","#staff-vehicleUpdate",["S01", "S02", "S03", "S04", "S05"])
    });

    function addDropdownVehicle(containerId, selectClass, options) {
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

    function populateDropdownVehicle(container, selectedValues, options) {
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
});


