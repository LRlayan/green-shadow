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