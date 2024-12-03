import {LoadAllEquipment} from "./EquipmentController.js"

$(document).ready(async function () {
    let equipmentCount = 0;
    const updateDateTime = () => {
        const now = new Date();
        $('#current-date').text(now.toLocaleDateString());
        $('#current-time').text(now.toLocaleTimeString());
    };
    updateDateTime();
    setInterval(updateDateTime, 1000);

    const getAllVal = new GetValues();
    try {
        const allValues = await getAllVal.getValues("equipment");
        if (Array.isArray(allValues)) {
            allValues.forEach(item => {
                if (item.availableCount !== undefined) {
                    equipmentCount += parseInt(item.availableCount);
                } else {
                    console.warn("No availableCount in this item:", item);
                }
            });
        } else {
            console.error("Unexpected response format:", allValues);
        }
    } catch (error) {
        console.error("Error fetching values:", error);
    }
    $('#equipmentCount').text(equipmentCount);
});

async function getCountOfEquipment() {

}

export class GetValues{
    async getValues(endPoint) {
        const token = localStorage.getItem("jwtKey");
        const getVal = await $.ajax({
            url: `http://localhost:5050/api/v1/${endPoint}`,
            type: "GET",
            headers:{
                "Authorization": "Bearer " + token
            },
        });
        return getVal;
    }
}
