function previewImage(inputId, previewId) {
    const input = $(`#${inputId}`)[0];
    const preview = $(`#${previewId}`);

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.attr('src', e.target.result);
            preview.removeClass('d-none'); // Show the image preview
        };

        reader.readAsDataURL(input.files[0]); // Convert the image file to base64
    }
}

$(document).ready(function() {
    // Function to add crops
    $('#addCropButton').on('click', function() {
        const cropInput = $('#cropInput');
        const cropValue = cropInput.val().trim();
        if (cropValue) {
            const cropListDiv = $('#cropList');
            const cropElement = $('<div></div>').text(cropValue);
            cropListDiv.append(cropElement);
            cropInput.val(''); // Clear the input field
        }
    });

    // Function to add staff members
    $('#addStaffButton').on('click', function() {
        const staffInput = $('#staffInput');
        const staffValue = staffInput.val().trim();
        if (staffValue) {
            const staffListDiv = $('#staffList');
            const staffElement = $('<div></div>').text(staffValue);
            staffListDiv.append(staffElement);
            staffInput.val(''); // Clear the input field
        }
    });
});



