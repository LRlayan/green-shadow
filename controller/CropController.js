// Function to add crops
$('#addCropFieldButton').on('click', function() {
    const cropInput = $('#crop-FieldId');
    const cropValue = cropInput.val().trim();
    if (cropValue) {
        const cropListDiv = $('#fieldList');
        const cropElement = $('<div></div>').text(cropValue);
        cropListDiv.append(cropElement);
        cropInput.val(''); // Clear the input field
    }
});