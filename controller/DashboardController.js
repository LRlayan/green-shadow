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
        const allEquipment = await getAllVal.getValues("equipment");
        const allVehicles = await getAllVal.getValues("vehicles");
        const allStaff = await getAllVal.getValues("staff");

        // Set total counts
        $('#vehicleCount').text(allVehicles.length);
        $('#employees').text(allStaff.length);

        const categoryCounts = {
            hand: 0,
            irrigation: 0,
            powerAndMachinery: 0,
            ploughing: 0,
            weeding: 0,
            harvesting: 0,
            postHarvest: 0,
            measuring: 0,
            protective: 0,
        };

        const designationCounts = {
            "Manager": 0,
            "Senior Assistant Manager": 0,
            "Assistant Manager": 0,
            "Admin and HR Staff": 0,
            "Office Assistant": 0,
            "Senior Agronomist": 0,
            "Agronomist": 0,
            "Soil Scientist": 0,
            "Senior Technician": 0,
            "Technician": 0,
            "Supervisors": 0,
            "Labors": 0
        };


        // Iterate through allEquipment and update counts by category
        if (Array.isArray(allEquipment)) {
            allEquipment.forEach(item => {
                if (item.type && item.availableCount !== undefined) {
                    equipmentCount += parseInt(item.availableCount); // Total count

                    // Map equipment category to span ids
                    const categoryKey = mapCategoryToId(item.type);
                    if (categoryCounts[categoryKey] !== undefined) {
                        categoryCounts[categoryKey] += parseInt(item.availableCount);
                    }
                } else {
                    console.warn("No category or availableCount in this item:", item);
                }
            });

            // Update the spans and <li> elements dynamically
            for (const [key, count] of Object.entries(categoryCounts)) {
                const spanElement = $(`#${key}`);
                const listItem = spanElement.closest('li');

                // Set the count to the respective span and style <li> if count is 0
                if (count != 0) {
                    spanElement.text(count);
                    listItem.removeClass('text-danger');
                } else {
                    spanElement.text(0);
                    listItem.addClass('text-danger');
                }
            }
        } else {
            console.error("Unexpected response format:", allEquipment);
        }

        if (Array.isArray(allStaff)) {
            allStaff.forEach(staff => {
                if (staff.designation) {
                    const normalizedDesignation = staff.designation.trim();

                    console.log("Normalized Designation:", normalizedDesignation);

                    if (designationCounts[normalizedDesignation] !== undefined) {
                        designationCounts[normalizedDesignation]++;
                    } else {
                        console.warn("Unknown designation:", staff.designation);
                    }
                } else {
                    console.warn("Staff member has no designation defined:", staff);
                }
            });

            // Update the HTML with counts
            for (const [designation, count] of Object.entries(designationCounts)) {
                const spanElement = $(`#${designation.replace(/\s+/g, '')}`); // Use ID-safe version
                const listItem = spanElement.closest('li');

                if (spanElement.length === 0) {
                    console.error(`Span with ID '${designation.replace(/\s+/g, '')}' not found in HTML.`);
                    continue;
                }

                console.log(`Setting count for ${designation}:`, count);

                if (count !== 0) {
                    spanElement.text(count);
                    listItem.removeClass('text-danger');
                } else {
                    spanElement.text(0);
                    listItem.addClass('text-danger');
                }
            }
        } else {
            console.error("Unexpected response format for allStaff:", allStaff);
        }

        $('#equipmentCount').text(equipmentCount);
    } catch (error) {
        console.error("Error fetching values:", error);
    }
});

function mapCategoryToId(category) {
    const categoryMap = {
        "Hand Tools": "hand",
        "Irrigation Equipment": "irrigation",
        "Power Tools and Machinery": "powerAndMachinery",
        "Ploughing Equipment": "ploughing",
        "Weeding and Pest Control Equipment": "weeding",
        "Harvesting Equipment": "harvesting",
        "Post-Harvest Equipment": "post-harvest",
        "Monitoring and Measuring Tools": "measuring",
        "Protective Equipment": "protective",
    };
    return categoryMap[category] || null;
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
