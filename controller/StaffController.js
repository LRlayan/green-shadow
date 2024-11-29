import Staff from "../model/Staff.js";
import {equipmentDetails} from "../db/db.js"
import {LoadAllEquipment} from './EquipmentController.js';
import {LoadFieldCard} from './FieldController.js';
import {LoadAllVehicleDetails} from "./VehicleController.js";
import {CurrentDate} from "./indexController.js";

const token = localStorage.getItem('jwtKey')
let clickTableRow = 0;

//SAVE STAFF MEMBER
$('#staffNewBtn').on('click',function (){
    const currentDate = new CurrentDate();
    $('#joinedDate').val(currentDate.getCurrentFormattedDate());
});
$('#addFieldButtonInStaff').on('click',async function (e){
    e.preventDefault();
    try {
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
        let fieldStaff = collectSelectedValues('#additionalStaffField select');
        let staffVehicle = collectSelectedValues('#additionalStaffVehicle select');
        let staffEquipment = collectSelectedValues('#additionalStaffEquipment select');

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
            vehicleList: staffVehicle,
            fieldCodeList: fieldStaff,
            equipmentList: staffEquipment,
        };

        // Confirming save action with Swal
        const result = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        });

        if (result.isConfirmed) {
            await $.ajax({
                url: "http://localhost:5050/api/v1/staff",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(staffDTO),
                headers:{
                    "Authorization": "Bearer " + token
                }
            });

            Swal.fire("Saved!", "", "success");
            const allMember = new LoadAllStaffMember();
            await allMember.loadAllMembers();

            $('#staffForm')[0].reset();
            $('#additionalStaffField').empty();
            $('#additionalStaffVehicle').empty();
            $('#additionalStaffEquipment').empty();
            $('#newStaffModal').modal('hide');
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    } catch (error) {
        console.error("Error during staff creation:", error);
        Swal.fire("Error", "Failed to save staff. Please try again.", "error");
    }
});

//SET DATA UPDATE MODAL
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

    const loadEquipment = new LoadAllEquipment();
    loadEquipment.loadAllEquDetails().then(equCode => {
        populateDropdownStaff("#updateEquipment",equipmentArray,equCode,"equipment");
    });
});

//UPDATE STAFF MEMBER
$('#updateMemberButton').on('click',async function (){
    try {
        let memberCode = $('#selectedMemberCode').val();
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

        const staffDTO = {
            memberCode:memberCode,
            firstName:memberFirstName,
            lastName:memberLastName,
            joinedDate:joinedDate,
            dateOfBirth:dob,
            gender:gender,
            designation:designation,
            addressLine1:addressLine01,
            addressLine2:addressLine02,
            addressLine3:addressLine03,
            addressLine4:addressLine04,
            addressLine5:addressLine05,
            contactNo:contactNo,
            email:email,
            role:role,
        }

        // Confirm update action
        const result = await Swal.fire({
            title: "Do you want to update the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Update",
            denyButtonText: `Don't update`
        });

        if (result.isConfirmed) {
            await $.ajax({
                url: `http://localhost:5050/api/v1/staff/${memberCode}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(staffDTO),
                headers:{
                    "Authorization": "Bearer " + token
                }
            });
            Swal.fire("Updated!", "", "success");
            const loadAllStaff = new LoadAllStaffMember();
            await loadAllStaff.loadAllMembers();

            resetForm("#updateStaffForm", "#updateField", "#updateVehicle", "#updateEquipment", "#additionalStaffEquipmentUpdate", "#additionalStaffVehicleUpdate", "#additionalStaffFieldUpdate");
            $('#updateStaffModal').modal('hide');
        } else if (result.isDenied) {
            Swal.fire("Changes are not updated", "", "info");
        }
    } catch (error) {
        console.error("Error updating staff:", error);
        Swal.fire("Error", "Failed to update staff. Please try again.", "error");
    }
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

//DELETE STAFF MEMBER
$('#staffDetailsTable').on('click', '.delete-button', function () {
    const index = $(this).data('index');
    $('#confirmDeleteYes').data('index', index);
    $('#confirmStaffDeleteModal').modal('show');
});

//DELETE STAFF MEMBER
$('#confirmDeleteYes').on('click', async function () {
    try {
        const index = $(this).data('index'); // Get the staff index to delete

        await $.ajax({
            url: `http://localhost:5050/api/v1/staff/${index}`,
            type: 'DELETE',
            headers:{
                "Authorization": "Bearer " + token
            }
        });
        const loadAllStaffMember = new LoadAllStaffMember();
        await loadAllStaffMember.loadAllMembers();

        // Notify user of success
        Swal.fire('Deleted!', 'The staff has been deleted.', 'success');

    } catch (error) {
        console.error("Error deleting staff:", error);
        if (xhr.status === 404) {
            Swal.fire('Error', 'Staff not found!', 'error');
        } else if (xhr.status === 400) {
            Swal.fire('Error', 'Invalid staff ID!', 'error');
        } else {
            Swal.fire('Error', 'Failed to delete staff. Please try again.', 'error');
        }
    } finally {
        $('#confirmStaffDeleteModal').modal('hide');
        clearOverlayOfModal();
    }
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

//Add Vehicle
$('#addStaffVehicleButton').on('click', function() {
    const loadAllVehicleDetails = new LoadAllVehicleDetails();
    loadAllVehicleDetails.loadVehicleTable().then(vehicleCode => {
        addDropdownStaff("#additionalStaffVehicle","#vehicle-staff",vehicleCode);
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
// const equipmentCountsUpdate = {
//     "E01": 5,
//     "E02": 3,
//     "E03": 7,
//     "E04": 2,
//     "E05": 4
// };
//
// // jQuery to add a new equipment dropdown with a count input and remove button
// $('#addStaffEquipmentButtonUpdate').on('click', function() {
//     addDropdownStaff('#additionalStaffEquipmentUpdate','#equipment-staffUpdate',["E01", "E02", "E03", "E04", "E05"],"equipment",equipmentCountsUpdate)
// });

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

        // $select.change(function () {
        //     updatePairsArray($select, $quantityInput);
        // });
        // $quantityInput.on('input', function () {
        //     updatePairsArray($select, $quantityInput);
        // });
    }
}

// function updatePairsArray(comboBox, inputField) {
//     const selectedValue = comboBox.val();
//     const inputCount = inputField.val();
//
    // Check if both combo box and input field have values
    // if (selectedValue && inputCount) {
    //     const existingPairIndex = pairsValues.findIndex(
    //         pair => pair.comboBox === comboBox && pair.inputField === inputField
    //     );
    //     if (existingPairIndex > -1) {
    //         pairsValues[existingPairIndex] = { selectedValue, inputCount };
    //     } else {
    //         pairsValues.push({ selectedValue, inputCount });
    //     }
    // }
    // console.log(pairsValues);
    // pairsValues.forEach(pair => {
    //     console.log(`${pair.selectedValue} - ${pair.inputCount}`);
    // });
// }

function clearOverlayOfModal(){
    // Ensure the modal and backdrop are fully removed when hidden (overlay)
    $('#confirmStaffDeleteModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open'); // Removes the modal-open class from body
        $('.modal-backdrop').remove();       // Removes the leftover backdrop element
    });
}

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

export class LoadAllStaffMember {
    async loadAllMembers() {
         // Clear existing rows
        const tableBody = $("#staffDetailsTable");
        const memberCodes = [];

        try {
            // Perform the GET request using await
            const staffMembers = await $.ajax({
                url: "http://localhost:5050/api/v1/staff",
                type: "GET",
                headers:{
                    "Authorization": "Bearer " + token
                },
            });
            $('#staffDetailsTable').empty();
            // Process the staff members
            staffMembers.forEach(staffMember => {
                const staffDetail = new Staff(
                    staffMember.memberCode,
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
                    staffMember.fieldCodeList || "No Fields",
                    staffMember.vehicleList || "No Vehicle",
                    staffMember.logList || "No logs",
                    staffMember.equipmentList || "No Member"
                );

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
                        <td>
                            <button class="btn btn-danger delete-button" 
                                data-index="${staffMember.memberCode}" 
                                data-bs-target="#confirmStaffDeleteModal">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
                tableBody.append(row);
            });

            // Return the member codes as the result
            return memberCodes;
        } catch (error) {
            // Handle errors and alert the user
            console.error("Failed to retrieve staff data:", error);
            alert("Failed to retrieve staff data");
            throw error;
        }
    }
}
