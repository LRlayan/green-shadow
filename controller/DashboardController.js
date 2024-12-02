$(document).ready(function () {
    const updateDateTime = () => {
        const now = new Date();
        $('#current-date').text(now.toLocaleDateString());
        $('#current-time').text(now.toLocaleTimeString());
    };
    updateDateTime();
    setInterval(updateDateTime, 1000);
});