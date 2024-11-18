import Staff from "../model/Staff.js";
import {equipmentDetails, staffDetails, pairsValues , staffEquipmentCount} from "../db/db.js"
import {LoadAllEquipment} from './EquipmentController.js';
import {LoadFieldCard} from './FieldController.js';
import {LoadAllVehicleDetails} from "./VehicleController.js";

let clickTableRow = 0;

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
            let vehicle = $(this).val();
            if (vehicle) {
                staffVehicle.push(vehicle);
            }
        });

        // Collect multiple staff values
        let staffEquipment = [];
        $("#additionalStaffEquipment select").each(function() {
            let equValue = $(this).val();
            if (equValue) {
                const equipment = {
                    equipmentCode:equValue
                }
                staffEquipment.push(equipment);
            }
        });

        let staffDTO = {
            firstName: firstName,
            lastName: lastName,
            joinedDate: joinedDate,
            dateOfBirth: dob,
            gender: gender,
            designation: designation,
            addressLine1: addressLine01,
            addressLine2: addressLine02,
            addressLine3: addressLine03,
            addressLine4: addressLine04,
            addressLine5: addressLine05,
            contactNo: contactNo,
            email: emailStaff,
            role: roleStaff,
            staffEquipmentDetailsList: [],
            vehicleList: staffVehicle,
            fieldCodeList: fieldStaff,
        };

        let staffMember = {
            memberCode: "MEMBER-1"
        }

        staffEquipmentCount.length = 0; // Clear previous values
        pairsValues.forEach(pair => {
            const equipmentCode = {
                equipmentEntity : pair.selectedValue
            }

            const staffEquipmentDetailsList = {
                id:"",
                useEquipmentCount: pair.inputCount,
                staffEntity: staffMember,
                equipmentEntity: equipmentCode
            };
            staffEquipmentCount.push(staffEquipmentDetailsList);
        });

        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                staffEquipmentCount.forEach(value => {
                    console.log("print     ====")
                    console.log("eq ",value.equipmentEntity)
                    console.log("staff ",value.staffEntity)
                    console.log("eseEquip ",value.useEquipmentCount)
                })

                $.ajax({
                    url: "http://localhost:5050/api/v1/staff",  // Replace with your actual API endpoint
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(staffDTO),
                    success: function () {
                        const allMember = new LoadAllStaffMember();
                        allMember.loadAllMembers().then(staff =>{
                            Swal.fire("Saved!", "", "success");
                            console.log(staff)
                        }).catch(error =>{
                            console.error("Error loading staff member:", error);
                        });
                        $('#staffForm')[0].reset()
                        $('#additionalStaffField').empty();
                        $('#additionalStaffVehicle').empty();
                        $('#additionalStaffEquipment').empty();
                        $('#newStaffModal').modal('hide');
                    },
                    error: function (xhr, status, error) {
                        if (xhr.status === 400) {
                            alert("Failed to save staff: Bad request");
                        } else {
                            alert("Failed to save staff: Server error");
                        }
                    }
                });
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    });

    //update Staff member
    $('#staffDetailsTable').on('click','tr', function (){
        resetForm("#updateStaffForm","#updateField","#updateVehicle","#updateEquipment","#additionalStaffEquipmentUpdate","#additionalStaffVehicleUpdate","#additionalStaffFieldUpdate");

        let code = $(this).find(".code").text();
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

        $('#selectedMemberCode').val(code);
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

        populateDropdownStaff("#updateField",fieldsArray,["F01", "F02", "F03", "F04", "F05"]);
        populateDropdownStaff("#updateVehicle",vehicleArray,["V01", "V02", "V03", "V04", "V05"]);
        populateDropdownStaff("#updateEquipment",equipmentArray,["E01", "E02", "E03", "E04", "E05"],"equipment");
    });

    //UPDATE STAFF MEMBER
    $('#updateMemberButton').on('click',function (){
        // Get updated values from modal inputs
        let memberFirstName = $('#firstNameUpdate').val();
        let memberLastName = $('#lastNameUpdate').val();
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
        $("#updateField select").each(function() {
            let fieldValue = $(this).val();
            if (fieldValue) {
                updatedFieldStaff.push(fieldValue);
            }
        });

        // Collect values from all Field dropdowns
        $('#additionalStaffFieldUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedFieldStaff.push(selectedValue);
        });

        // Collect updated vehicle values
        let updatedVehicleStaff = [];
        $("#updateVehicle select").each(function() {
            let vehicleValue = $(this).val();
            if (vehicleValue) {
                updatedVehicleStaff.push(vehicleValue);
            }
        });

        // Collect values from all vehicle dropdowns
        $('#additionalStaffVehicleUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedVehicleStaff.push(selectedValue);
        });

        // Collect updated equipment values
        let updatedEquipmentStaff = [];
        $("#updateEquipment select").each(function() {
            let equipmentValue = $(this).val();
            if (equipmentValue) {
                updatedEquipmentStaff.push(equipmentValue);
            }
        });

        // Collect values from all equipment dropdowns
        $('#additionalStaffEquipmentUpdate select').each(function () {
            const selectedValue = $(this).val();
            if (selectedValue) updatedEquipmentStaff.push(selectedValue);
        });

        let staff = staffDetails[clickTableRow];
        staff.firstName = memberFirstName;
        staff.lastName = memberLastName;
        staff.joinedDate = joinedDate;
        staff.designation = designation;
        staff.gender = gender;
        staff.dob = dob;
        staff.addressLine01 = addressLine01;
        staff.addressLine02 = addressLine02;
        staff.addressLine03 = addressLine03;
        staff.addressLine04 = addressLine04;
        staff.addressLine05 = addressLine05;
        staff.contactNo = contactNo;
        staff.email = email;
        staff.role = role;
        staff.fieldList = updatedFieldStaff;
        staff.vehicle = updatedVehicleStaff;
        staff.equipmentList = updatedEquipmentStaff;
        resetForm("#updateStaffForm","#updateField","#updateVehicle","#updateEquipment","#additionalStaffEquipmentUpdate","#additionalStaffVehicleUpdate","#additionalStaffFieldUpdate");
        $('#updateStaffModal').modal('hide');
    });

    function resetForm(){
        $('#updateStaffForm')[0].reset();
        $('#updateField').empty();
        $('#updateVehicle').empty();
        $('#updateEquipment').empty();
        $('#additionalStaffEquipmentUpdate').empty();
        $('#additionalStaffVehicleUpdate').empty();
        $('#additionalStaffFieldUpdate').empty();
    }

    function populateDropdownStaff(container, selectedValues, options, type) {
        $(container).empty();
        selectedValues.forEach(value => {
            const dropdownWrapper = $('<div class="dropdown-wrapper mb-3 d-flex align-items-center"></div>');
            const dropdown = $('<select class="form-control me-2 text-white" style="background-color:#2B2B2B"></select>');
            options.forEach(option => {
                dropdown.append(`<option value="${option}" ${option.trim() === value ? 'selected' : ''}>${option}</option>`);
            });
            dropdownWrapper.append(dropdown);
            if (type === "equipment") {
                const quantityInput = $('<input type="number" class="form-control me-2 text-white" placeholder="Count" min="1" value="1" style="background-color:#2B2B2B">');
                dropdownWrapper.append(quantityInput); // Add the quantity input to the wrapper
            }

            const removeButton = $('<button type="button" class="btn btn-danger ml-2">Remove</button>');
            removeButton.click(function() {
                dropdownWrapper.remove();
            });
            dropdownWrapper.append(removeButton);
            $(container).append(dropdownWrapper);
        });
    }

    //delete Staff Member Details
    $('#staffDetailsTable').on('click', '.delete-button', function () {
        const index = $(this).data('index');
        $('#confirmDeleteYes').data('index', index);
        $('#confirmStaffDeleteModal').modal('show');
    });

    // Handle the confirmation of deletion - yes button
    $('#confirmDeleteYes').on('click', function () {
        const index = $(this).data('index');

        $.ajax({
            url: `http://localhost:5050/api/v1/staff/${index}`,
            type: 'DELETE',
            success: function () {
                const loadAllStaffMember = new LoadAllStaffMember();
                loadAllStaffMember.loadAllMembers();
                Swal.fire('Deleted!', 'The staff has been deleted.', 'success');
            },
            error: function (xhr, status, error) {
                console.error("Error deleting staff:", error);
                if (xhr.status === 404) {
                    Swal.fire('Error', 'Staff not found!', 'error');
                } else if (xhr.status === 400) {
                    Swal.fire('Error', 'Invalid staff ID!', 'error');
                } else {
                    Swal.fire('Error', 'Failed to delete staff. Please try again.', 'error');
                }
            }
        });

        $('#confirmStaffDeleteModal').modal('hide');
        clearOverlayOfModal();
    });

//No button
    $('#confirmDeleteNo,#btn-close-staff').on('click',()=>{
        $('#confirmStaffDeleteModal').modal('hide'); // Hide the modal
        clearOverlayOfModal();
    });

    //Add Field
    $('#addStaffFieldButton').on('click', function() {
        const loadAllField = new LoadFieldCard();
        loadAllField.loadAllFieldCard().then(fieldCode => {
            addDropdownStaff("#additionalStaffField","#filed-staff",fieldCode);
        }).catch(error => {
            console.log("Not Loading field code",error)
        });
    });

    //Add Field Update Modal
    $('#addStaffFieldButtonUpdate').on('click', function() {
        const loadAllField = new LoadFieldCard();
        loadAllField.loadAllFieldCard().then(fieldCode => {
            addDropdownStaff("#additionalStaffFieldUpdate","#filed-staffUpdate",fieldCode);
        });
    });

    //Add Vehicle
    $('#addStaffVehicleButton').on('click', function() {
        const loadAllVehicleDetails = new LoadAllVehicleDetails();
        loadAllVehicleDetails.loadVehicleTable().then(vehicleCode => {
            addDropdownStaff("#additionalStaffVehicle","#vehicle-staff",vehicleCode);
        });
    });

    //Add Vehicle Update
    $('#addStaffVehicleButtonUpdate').on('click', function() {
        const loadAllVehicleDetails = new LoadAllVehicleDetails();
        loadAllVehicleDetails.loadVehicleTable().then(vehicleCode => {
            addDropdownStaff("#additionalStaffVehicleUpdate","#vehicle-staffUpdate",vehicleCode);
        });
    });

    //Add Equipment
    $('#addStaffEquipmentButton').on('click', function() {
        let equDetails = new LoadAllEquipment();
        equDetails.loadAllEquDetails().then(equCodes =>{
            addDropdownStaff("#additionalStaffEquipment","#equipment-staff",equCodes,"equipment",equipmentDetails);
        }).catch(error => {
            console.error("Error loading field equipment:", error);
        });
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
            const $quantityInput = $('<input type="number" id="equipmentInput" class="form-control me-2 text-white" placeholder="Count" min="1" value="1" style="background-color:#2B2B2B">');

            // Update count input based on selected equipment
            $select.on('change', function() {
                const selectedEquipment = $(this).val();
                if (selectedEquipment &&  equipmentCountsList.some(e => e.equipmentCode === selectedEquipment)) {
                    const equipment = equipmentCountsList.find(e => e.equipmentCode === selectedEquipment);
                    $quantityInput.val(equipment.count);
                } else {
                    $quantityInput.val(1); // Default value if none selected
                }
            });

            //default equipmentCode count selected
            const updateInputField = () => {
                const selectedEquipment = $select.val();
                const equipment = equipmentCountsList.find(e => e.equipmentCode === selectedEquipment);
                if (equipment) {
                    $quantityInput.val(equipment.count); // Set the count based on the selected equipment
                } else {
                    $quantityInput.val(1); // Default value if no matching equipment is found
                }
            };
            updateInputField();
            // Append the select, quantity input, and remove button to the container
            $container.append($select).append($quantityInput).append($removeBtn);

            $select.change(function () {
                updatePairsArray($select, $quantityInput);
            });
            $quantityInput.on('input', function () {
                updatePairsArray($select, $quantityInput);
            });
        }
    }

    function updatePairsArray(comboBox, inputField) {
        const selectedValue = comboBox.val();
        const inputCount = inputField.val();

        // Check if both combo box and input field have values
        if (selectedValue && inputCount) {
            // Find the existing pair in pairsArray if it exists
            const existingPairIndex = pairsValues.findIndex(
                pair => pair.comboBox === comboBox && pair.inputField === inputField
            );

            // If pair already exists, update it; otherwise, add new pair
            if (existingPairIndex > -1) {
                pairsValues[existingPairIndex] = { selectedValue, inputCount };
            } else {
                pairsValues.push({ selectedValue, inputCount });
            }
        }
        console.log(pairsValues); // For testing, outputs the array to the console
        pairsValues.forEach(pair => {
            console.log(`${pair.selectedValue} - ${pair.inputCount}`);
        });
    }

function clearOverlayOfModal(){
    // Ensure the modal and backdrop are fully removed when hidden (overlay)
    $('#confirmStaffDeleteModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open'); // Removes the modal-open class from body
        $('.modal-backdrop').remove();       // Removes the leftover backdrop element
    });
}

export class LoadAllStaffMember {
    loadAllMembers() {
        $('#staffDetailsTable').empty();  // Clear existing rows
        const tableBody = $("#staffDetailsTable");
        const memberCodes = [];

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "http://localhost:5050/api/v1/staff",
                type: "GET",
                success: function (staffMembers) {  // Assume 'vehicles' is an array of vehicle objects
                    staffMembers.forEach(staffMember => {
                        const staffDetail = new Staff(
                            staffMembers.memberCode,
                            staffMember.firstName,
                            staffMember.lastName,
                            staffMember.joinedDate,
                            staffMember.designation,
                            staffMember.gender,
                            staffMember.dateOfBirth,
                            staffMember.addressLine1,
                            staffMember.addressLine2,
                            staffMember.addressLine3,
                            staffMember.addressLine4,
                            staffMember.addressLine5,
                            staffMember.contactNo,
                            staffMember.email,
                            staffMember.role,
                            staffMember.fieldCodeList || "N/A", // Handle nested staff details
                            staffMember.vehicle || "N/A", // Handle nested staff details
                            staffMember.logList || "N/A", // Handle nested staff details
                            staffMember.equipmentList || "N/A" // Handle nested staff details
                        );
                        // Add vehicle code to the array
                        memberCodes.push(staffMember.memberCode);
                        const row = `
                                <tr>
                                    <td class="code">${staffMember.memberCode}</td>
                                    <td class="fName">${staffDetail.firstName}</td>
                                    <td class="lName">${staffDetail.lastName}</td>
                                    <td class="designation">${staffDetail.designation}</td>
                                    <td class="gender">${staffDetail.gender}</td>
                                    <td class="joinedDate">${staffDetail.joinedDate}</td>
                                    <td class="dob">${staffDetail.dob}</td>
                                    <td class="buildingNo">${staffDetail.addressLine01}</td>
                                    <td class="lane">${staffDetail.addressLine02}</td>
                                    <td class="city">${staffDetail.addressLine03}</td>
                                    <td class="state">${staffDetail.addressLine04}</td>
                                    <td class="postalCode">${staffDetail.addressLine05}</td>
                                    <td class="contactNo">${staffDetail.contactNo}</td>
                                    <td class="email">${staffDetail.email}</td>
                                    <td class="role">${staffDetail.role}</td>
                                    <td class="fields">${staffDetail.fieldList}</td>
                                    <td class="logs">${staffDetail.logList}</td>
                                    <td class="vehicle">${staffDetail.vehicle}</td>
                                    <td class="equipment">${staffDetail.equipmentList}</td>
                                    <td><button class="btn btn-danger delete-button" data-index="${staffMember.memberCode}">Delete</button></td>
                                </tr>
                            `;
                        tableBody.append(row);  // Append each row to the table
                    });

                    // Resolve the promise with the array of vehicle codes
                    resolve(memberCodes);
                },
                error: function (xhr, status, error) {
                    alert("Failed to retrieve staff data");
                    reject(error);
                }
            });
        });
    }
}
