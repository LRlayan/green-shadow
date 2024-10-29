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