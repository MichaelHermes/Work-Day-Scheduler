// Configure the business hours for the scheduler using 24-hour notation (default 9AM-5PM)
const hourStart = 9,
	hourEnd = 17;
const eventStorageKey = "WorkDaySchedulerEvent";

let timeBlocksContainer = $("div.container:first");

$("#currentDay").text(moment().format("dddd, MMMM Do"));

init(hourStart, hourEnd);

// Initializes the Work Day Scheduler on page load. Builds the HTML elements representing the day's time blocks and populates them with any existing events from local storage.
function init(hourStart, hourEnd) {
	let workDayMoment = new moment().set("hour", hourStart);

	for (let i = hourStart; i <= hourEnd; i++) {
		let timeBlockElement = $("<div>").addClass("row time-block");
		let timeBlockHour = workDayMoment.format("hA");

		// Build the HTML element to display the hour of this time block.
		let hourElement = $("<div>")
			.addClass("col hour d-flex justify-content-center pt-3 pr-1")
			.text(timeBlockHour);

		// Build the HTML element to collect the description for this time block.
		let descriptionElement = $("<div>")
			.addClass("col-10 description d-flex p-0")
			.append($("<textarea>").addClass("flex-fill"));
		// Set the appropriate color for the time block.
		if (moment().hour() > workDayMoment.hour()) {
			descriptionElement.addClass("past");
		} else if (moment().hour() < workDayMoment.hour()) {
			descriptionElement.addClass("future");
		} else {
			descriptionElement.addClass("present");
		}
		// Set any existing description for this time block from local storage.
		let timeBlockExistingDescription = localStorage.getItem(
			`${eventStorageKey}-${timeBlockHour}`
		);
		if (timeBlockExistingDescription !== null) {
			$(descriptionElement).find("textarea").text(timeBlockExistingDescription);
		}

		// Build the HTML element for the save button.
		let saveElement = $("<button>")
			.addClass("col saveBtn d-flex justify-content-center align-items-center")
			.append($("<i>").addClass("fas fa-save"));

		// Append the hour, description and save elements to the time block, then add the time block to the time blocks container.
		timeBlockElement
			.append(hourElement)
			.append(descriptionElement)
			.append(saveElement);
		timeBlocksContainer.append(timeBlockElement);

		// Increment the work day moment by one hour to continue building time blocks.
		workDayMoment.add(1, "hour");
	}
}

timeBlocksContainer.on("click", ".saveBtn", function (event) {
	event.preventDefault();

	let hour = $(event.target).closest(".time-block").children(".hour").text();
	let description = $(event.target)
		.closest(".time-block")
		.find(".description textarea")[0];

	// Remove the local storage item if the user is submitting with an empty description. Otherwise, store the item.
	if (description.value === "") {
		localStorage.removeItem(`${eventStorageKey}-${hour}`);
	} else {
		localStorage.setItem(`${eventStorageKey}-${hour}`, description.value);
	}
});
