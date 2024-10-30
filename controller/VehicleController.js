const $vehicleModal = $('#vehicle-modal');
const $modalTitle = $('#modalTitle');
const $modalSubmitButton = $('#modalSubmitButton');

$vehicleModal.on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget); // Button that triggered the modal
    const action = button.data('action'); // Get action from data attribute

    if (action === 'update') {
        $modalTitle.text('Update Vehicle');
        $modalSubmitButton.text('Update Vehicle');
        $modalSubmitButton.removeClass('btn-primary').addClass('btn-success');
    } else {
        $modalTitle.text('Add Vehicle');
        $modalSubmitButton.text('Add Vehicle');
        $modalSubmitButton.removeClass('btn-primary').addClass('btn-success');
    }
});

$(document).ready(function () {
    const vehicleDetailsArray = [];

    $("#vehicleForm").on("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        // Collect form data
        const vehicleDetails = {
            licensePlateNumber: $("#licensePlateNumber").val(),
            vehicleName: $("#vehicleName").val(),
            category: $("#category").val(),
            fuelType: $("#fuelType").val(),
            status: $("#status").val(),
            staffMember: $("#staffMember").val(),
            remark: $("#remark").val()
        };

        // Add to the vehicleDetailsArray
        vehicleDetailsArray.push(vehicleDetails);

        // Refresh table
        updateVehicleTable();

        // Reset form and close modal
        this.reset();
        $("#vehicle-modal").modal("hide");
    });

    function updateVehicleTable() {
        const tableBody = $("#vehicleDetailsTable");
        tableBody.empty();

        vehicleDetailsArray.forEach(vehicle => {
            const row = `
                <tr>
                    <td>${vehicle.licensePlateNumber}</td>
                    <td>${vehicle.vehicleName}</td>
                    <td>${vehicle.category}</td>
                    <td>${vehicle.fuelType}</td>
                    <td>${vehicle.status}</td>
                    <td>${vehicle.staffMember}</td>
                    <td>${vehicle.remark}</td>
                </tr>
            `;
            tableBody.append(row);
        });
    }
});
