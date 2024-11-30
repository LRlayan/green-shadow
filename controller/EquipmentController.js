import Equipment from "../model/Equipment.js";
import {equipmentDetails} from "../db/db.js"
import {LoadAllStaffMember} from "./StaffController.js";
import {LoadFieldCard} from './FieldController.js';

const token = localStorage.getItem('jwtKey');
let clickTableRow = 0;

$("#equipmentTableFilter").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#equipmentDetailsTable tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

//Add Field Modal
$('#addFieldButtonEquipment').on('click', function() {
    const loadAllField = new LoadFieldCard();
    loadAllField.loadAllFieldCard().then(fieldCode => {
        addDropdownEquipment("#additionalEquipmentField","#field-equipment",fieldCode)
    }).catch(error => {
        console.log('Not loading equipment ',error)
    });
});

//Add Staff Modal
$('#addStaffButton').on('click', function() {
    const loadAllMembers = new LoadAllStaffMember();
    loadAllMembers.loadAllMembers().then(memberCode => {
        addDropdownEquipment("#additionalEquipmentStaff","#staff-equipment",memberCode)
    }).catch(error => {
        console.log("Not loading member ",error)
    });
});

//SAVE EQUIPMENT
$('#addEquipmentButton').on('click',async function (e){
    e.preventDefault();
    let equipmentName = $("#equipmentName").val();
    let equipmentType = $("#equipmentType").val();
    let equipmentStatus = $("#equipmentStatus").val();
    let count = $("#count").val();

    let staffEquipment = collectSelectedValues('#additionalEquipmentStaff select');
    let fieldEquipment = collectSelectedValues('#additionalEquipmentField select');

    let equipmentDTO = {
        name:equipmentName,
        type:equipmentType,
        status:equipmentStatus,
        availableCount:count,
        staffCodeList:staffEquipment,
        fieldList:fieldEquipment
    }

    try {
        const result = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        });

        if (result.isConfirmed) {
            await $.ajax({
                url: "http://localhost:5050/api/v1/equipment",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(equipmentDTO),
                headers:{
                    "Authorization": "Bearer " + token
                },
            });

            const loadAllEquipment = new LoadAllEquipment();
            await loadAllEquipment.loadAllEquDetails();

            clearEquipmentModalFields(
                "#equipmentName",
                "#equipmentType",
                "#equipmentStatus",
                "#count",
                "#initialStaff select",
                "#initialEquipment select",
                "#additionalEquipmentStaff",
                "#additionalEquipmentField"
            );
            $("#equipment-modal").modal("hide");
            Swal.fire("Saved!", "The equipment has been added successfully.", "success");
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    } catch (error) {
        console.error("Error saving equipment:", error);
        const errorMessage =
            error.status === 400
                ? "Failed to save equipment. Please check your input."
                : "Failed to save equipment: Server error.";
        Swal.fire("Error", errorMessage, "error");
    }
});

// SET VALUES FOR UPDATE MODAL
$('#equipmentDetailsTable').on('click', 'tr', function () {
    $('#additionalStaffEquUpdate').empty();
    $('#additionalFieldEquipmentUpdate').empty();

    let code = $(this).find(".code").text();
    let name = $(this).find(".name").text();
    let type = $(this).find(".vehicleType").text();
    let status = $(this).find(".status").text();
    let count = $(this).find(".count").text();

    clickTableRow = $(this).index();

    // Split multiple values in "staffMember" and "fields" columns
    let staffMemberArray = $(this).find(".staffMember").text().split(", ");
    let fieldsArray = $(this).find(".fields").text().split(", ");

    $('#selectedEquipmentCode').val(code);
    $('#equipmentNameUpdate').val(name);
    $('#equipmentTypeUpdate').val(type);
    $('#equipmentStatusUpdate').val(status);
    $('#countUpdate').val(count);

    const loadAllField = new LoadFieldCard();
    loadAllField.loadAllFieldCard().then(fieldCode => {
        populateDropdownEquipment("#updateEquipmentFieldId",fieldsArray,fieldCode);
    }).catch(error => {
        console.log("Not loading field codes ",error)
    });
    const loadAllMembers = new LoadAllStaffMember();
    loadAllMembers.loadAllMembers().then(memberCode => {
        populateDropdownEquipment("#updateStaffEquipment",staffMemberArray,memberCode);
    }).catch(error => {
        console.log("Not loading member codes ",error)
    });
});

// UPDATE EQUIPMENT
$('#EquipmentButtonUpdate').on('click', async function () {
    let equCode = $("#selectedEquipmentCode").val();
    let equipmentName = $("#equipmentNameUpdate").val();
    let equipmentType = $("#equipmentTypeUpdate").val();
    let equipmentStatus = $("#equipmentStatusUpdate").val();
    let count = $("#countUpdate").val();

    let updatedStaffEquipment = collectSelectedValues('#updateStaffEquipment select','#additionalStaffEquUpdate select');
    let updatedFieldEquipment = collectSelectedValues('#updateEquipmentFieldId select','#additionalFieldEquipmentUpdate select');

    const equipmentDTO = {
        equipmentCode:equCode,
        name:equipmentName,
        type:equipmentType,
        status:equipmentStatus,
        availableCount: parseInt(count),
        staffCodeList:updatedStaffEquipment,
        fieldList:updatedFieldEquipment
    }

    try {
        const result = await Swal.fire({
            title: "Do you want to update the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Update",
            denyButtonText: `Don't update`
        });

        if (result.isConfirmed) {
            // Make PUT request
            await $.ajax({
                url: `http://localhost:5050/api/v1/equipment/${equCode}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(equipmentDTO),
                headers:{
                    "Authorization": "Bearer " + token
                }
            });

            // Close modal and reload equipment data
            $('#updateEquipment-modal').modal('hide');
            const loadAllEquipment = new LoadAllEquipment();
            await loadAllEquipment.loadAllEquDetails();

            // Clear modal fields and show success alert
            clearEquipmentModalFields(
                "#equipmentNameUpdate",
                "#equipmentTypeUpdate",
                "#equipmentStatusUpdate",
                "#countUpdate",
                "#initialFieldEquipmentUpdate select",
                "#initialStaffEquUpdate select",
                "#additionalStaffEquUpdate",
                "#additionalFieldEquipmentUpdate"
            );
            Swal.fire("Updated!", "Equipment details have been updated successfully.", "success");
        } else if (result.isDenied) {
            Swal.fire("Changes are not updated", "", "info");
        }
    } catch (error) {
        console.error("Error updating equipment:", error);

        const errorMessage =
            error.status === 400
                ? "Invalid input. Please check your data."
                : "Failed to update equipment: Server error.";
        Swal.fire("Error", errorMessage, "error");
    }
});

//Add additional Field Update Modal
$('#addFieldButtonUpdate').on('click', function() {
    const loadAllField = new LoadFieldCard();
    loadAllField.loadAllFieldCard().then(fieldCode => {
        addDropdownEquipment("#additionalFieldEquipmentUpdate", "#equipment-fieldUpdate", fieldCode)
    }).catch(error => {
        console.log("Not loading field codes ",error)
    });
});

//Add additional Staff field Update Modal
$('#addStaffButtonUpdate').on('click', function() {
    const loadAllMembers = new LoadAllStaffMember();
    loadAllMembers.loadAllMembers().then(memberCode => {
       addDropdownEquipment("#additionalStaffEquUpdate", "#equ-staffUpdate", memberCode);
    }).catch(error => {
        console.log("Not loading member codes ",error)
    });
});

// SHOW DELETE CONFIRMATION MODAL
$('#equipmentDetailsTable').on('click', '.delete-button', function () {
    const index = $(this).data('index');
    $('#confirmEquDeleteYes').data('index', index);
    $('#confirmEquipmentDeleteModal').modal('show');
});

// DELETE EQUIPMENT
$('#confirmEquDeleteYes').on('click', async function () {
    const index = $(this).data('index');
    try {
        await $.ajax({
            url: `http://localhost:5050/api/v1/equipment/${index}`,
            type: 'DELETE',
            headers:{
                "Authorization": "Bearer " + token
            }
        });

        const loadAllEquipment = new LoadAllEquipment();
        await loadAllEquipment.loadAllEquDetails();

        Swal.fire('Deleted!', 'The equipment has been deleted.', 'success');
    } catch (xhr) {
        console.error("Error deleting equipment:", xhr);
        let errorMessage = 'Failed to delete equipment. Please try again.';
        if (xhr.status === 404) {
            errorMessage = 'Equipment not found!';
        } else if (xhr.status === 400) {
            errorMessage = 'Invalid equipment ID!';
        }

        Swal.fire('Error', errorMessage, 'error');
    } finally {
        $('#confirmEquipmentDeleteModal').modal('hide');
        clearOverlayOfModal();
    }
});

//No button
$('#confirmEquDeleteNo,#btn-close-equ').on('click',()=>{
    $('#confirmEquipmentDeleteModal').modal('hide');
    clearOverlayOfModal();
});

// Listen for the modal to be shown
$('#equipment-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    if (button.data('action') === 'add') {
        $('#equipmentForm')[0].reset();
        resetForm("#additionalEquipmentStaff", "#additionalEquipmentField");
    }
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

function clearOverlayOfModal(){
    // Ensure the modal and backdrop are fully removed when hidden (overlay)
    $('#confirmEquipmentDeleteModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    });
}

function resetForm(additionalInput1,additionalInput2){
    $('#equipmentForm')[0].reset();
    $(`${additionalInput1}`).empty();
    $(`${additionalInput2}`).empty();
}

function addDropdownEquipment(containerId, selectClass, options) {
    const $container = $('<div class="d-flex align-items-center mt-2"></div>');
    const $select = $('<select id="optionSelect" class="form-control me-2 text-white" style="background-color:#2B2B2B"></select>').addClass(selectClass);
    options.forEach(option => $select.append(`<option class="text-white" style="background-color:#2B2B2B" value="${option}">${option}</option>`));
    // Remove button
    const $removeBtn = $('<button class="btn btn-danger">Remove</button>');
    $removeBtn.on('click', function() {
        $container.remove();
    });
    $container.append($select).append($removeBtn);
    $(containerId).append($container);
}

function populateDropdownEquipment(container, selectedValues, options) {
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
        dropdownWrapper.append(dropdown);
        dropdownWrapper.append(removeButton);
        $(container).append(dropdownWrapper);
    });
}

function clearEquipmentModalFields(equipmentName,equipmentType,equipmentStatus,count,initialStaff,initialEquipment,additionalEquipmentStaff,additionalEquipmentField) {
    $(`${equipmentName}`).val('');
    $(`${equipmentType}`).val('');
    $(`${equipmentStatus}`).val('');
    $(`${count}`).val('');
    $(`${initialStaff} select`).val('');
    $(`${initialEquipment} select`).val('');
    $(`${additionalEquipmentStaff}`).empty();
    $(`${additionalEquipmentField}`).empty();
}

export class LoadAllEquipment{
    loadAllEquDetails(){
        const tableBody = $("#equipmentDetailsTable");

        const equipmentCodes = [];

        return new Promise((resolve, reject) => {
            $.ajax({
                url: "http://localhost:5050/api/v1/equipment",
                type: "GET",
                headers:{
                    "Authorization": "Bearer " + token
                },
                success: function (equipment) {
                    $('#equipmentDetailsTable').empty();
                    equipment.forEach(equ => {
                        const equDetail = new Equipment(
                            equ.equipmentCode,
                            equ.name,
                            equ.type,
                            equ.status,
                            equ.availableCount,
                            equ.fieldList || "N/A",
                            equ.useCount,
                            equ.staffCodeList || "N/A"
                        );
                        equipmentCodes.push(equ.equipmentCode);
                        const row = `
                            <tr>
                                <td class="code">${equ.equipmentCode}</td>
                                <td class="name">${equDetail.name}</td>
                                <td class="vehicleType">${equDetail.type}</td>
                                <td class="status">${equDetail.status}</td>
                                <td class="count">${equDetail.count}</td>
                                <td class="staffMember">${equ.staffCodeList.join(', ') || "No Member"}</td>
                                <td class="fields">${equ.fieldList.join(', ') || "No field"}</td>
                                <td><button class="btn btn-danger delete-button" data-index="${equ.equipmentCode}">Delete</button></td>
                            </tr>
                        `;
                        tableBody.append(row);
                    });

                    $('#equipmentDetailsTable tr').each(function () {
                        const equipmentCode = $(this).find('.code').text();
                        const count = parseInt($(this).find('.count').text());
                        if (equipmentCode && !isNaN(count)) {
                            equipmentDetails.push({ equipmentCode, count });
                        }
                    });
                    resolve(equipmentCodes);
                },
                error: function (xhr, status, error) {
                    alert("Failed to retrieve vehicle data");
                    reject(error);
                }
            });
        });
    }
}