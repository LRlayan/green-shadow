// Function to add field Ids
$('#addLogFieldButton').on('click', function() {
    const filedInput = $('#log-FieldId');
    const fieldValue = filedInput.val().trim();
    if (fieldValue) {
        const filedListDiv = $('#logFieldList');
        const filedElement = $('<div></div>').text(fieldValue);
        filedListDiv.append(filedElement);
        filedInput.val(''); // Clear the input field
    }
});

// Function to add crops Ids
$('#addLogCropButton').on('click', function() {
    const cropInput = $('#log-cropId');
    const cropValue = cropInput.val().trim();
    if (cropValue) {
        const cropListDiv = $('#logCropList');
        const cropElement = $('<div></div>').text(cropValue);
        cropListDiv.append(cropElement);
        cropInput.val(''); // Clear the input field
    }
});
