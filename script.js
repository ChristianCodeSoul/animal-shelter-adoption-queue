let adoptionInterests = [
    {
        id: "1",
        applicantName: "Riya Sharma",
        phone: "567293765",
        contactEmail: "riya@example.com",
        animalName: "Tiger",
        householdType: "House",
        currentPets: "Yes",
        experienceLevel: "Experienced owner",
        notes: "Has a fenced backyard.",
        status: "Pending Review",
        timestamp: "2026-09-27T10:15:00"
    },
    {
        id: "2",
        applicantName: "Jake Wilson",
        phone: "9762537861",
        contactEmail: "jake@example.com",
        animalName: "Milo",
        householdType: "Apartment",
        currentPets: "No",
        experienceLevel: "First-time owner",
        notes: "Interested in learning about pet care.",
        status: "Pending Review",
        timestamp: "2026-09-27T11:30:00"
    }
];

const interestForm = document.getElementById("interestForm");
const queueList = document.getElementById("queueList");
const searchInput = document.getElementById("searchInput");
const loadingOverlay = document.getElementById("loadingOverlay");
const activeCount = document.getElementById("activeCount");
const pendingCount = document.getElementById("pendingCount");
const todayCount = document.getElementById("todayCount");
const queueCount = document.getElementById("queueCount");


function sanitizeInput(value) {
    const container = document.createElement("div");
    container.textContent = value;
    return container.textContent.trim();
}

function simulateNetworkDelay(time = 500) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
function setLoading(isLoading) {
    loadingOverlay.hidden = !isLoading;
}

function setFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}Error`);
    field.classList.toggle("error", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (errorElement) {
        errorElement.textContent = message;
    }
}

function validateForm() {
    let isValid = true;
    const applicantName = document.getElementById("applicantName");
    const contactPhone = document.getElementById("contactPhone");
    const contactEmail = document.getElementById("contactEmail");
    const householdType = document.getElementById("householdType");
    const experienceLevel = document.getElementById("experienceLevel");
    const animalName = document.getElementById("animalName");
    const nameValue = applicantName.value.trim();


    if (nameValue.length < 2) {
        setFieldError(applicantName, "Enter the applicant's name.");
        isValid = false;
    } else {
        setFieldError(applicantName, "");
    }

    const phoneValue = contactPhone.value.replace(/\D/g, "");
    if (phoneValue.length < 10 || phoneValue.length > 15) {
        setFieldError(contactPhone, "Enter a valid phone number.");
        isValid = false;
    } else {
        setFieldError(contactPhone, "");
    }
    const emailValue = contactEmail.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
        setFieldError(contactEmail, "Enter a valid email address.");
        isValid = false;
    } else {
        setFieldError(contactEmail, "");
    }
    if (!householdType.value) {
        setFieldError(
            householdType,
            "Select the household type."
        );
        isValid = false;
    } else {
        setFieldError(householdType, "");
    }

    if (!experienceLevel.value) {
        setFieldError(
            experienceLevel,
            "Select the experience level."
        );
        isValid = false;
    } else {
        setFieldError(experienceLevel, "");
    }
    const animalValue = animalName.value.trim();

    if (!animalValue) {
        setFieldError(animalName, "Enter the animal's name.");
        isValid = false;
    } else {
        setFieldError(animalName, "");
    }


    return isValid;
}

function updateSummary() {
    const today = new Date().toDateString();
    const addedToday = adoptionInterests.filter((interest) => {
        return new Date(interest.timestamp).toDateString() === today;
    });
    const pending = adoptionInterests.filter((interest) => {
        return interest.status === "Pending Review";
    });
    activeCount.textContent = adoptionInterests.length;
    pendingCount.textContent = pending.length;
    todayCount.textContent = addedToday.length;
    queueCount.textContent =
        `${adoptionInterests.length} ${adoptionInterests.length === 1 ? "entry" : "entries"
        }`;
}


function createDetail(label, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "detail";
    const labelElement = document.createElement("span");
    labelElement.className = "detail-label";
    labelElement.textContent = label;
    const valueElement = document.createElement("span");
    valueElement.className = "detail-value";
    valueElement.textContent = value || "Not provided";
    wrapper.append(labelElement, valueElement);
    return wrapper;
}


function renderQueue() {
    queueList.replaceChildren();
    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();
    const filteredInterests = adoptionInterests.filter((interest) => {
        const searchableText = [interest.applicantName, interest.animalName, interest.phone]
            .join(" ")
            .toLowerCase();
        return searchableText.includes(searchTerm);
    });

    if (filteredInterests.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-state";
        const title = document.createElement("h3");
        title.textContent = searchTerm
            ? "No data found"
            : "No adoption interests";
        const message = document.createElement("p");
        message.textContent = searchTerm
            ? "Try a different applicant, animal or phone number."
            : "New adoption interests will appear here.";
        emptyItem.append(title, message);
        queueList.appendChild(emptyItem);
        return;
    }


    filteredInterests.forEach((interest) => {
        const item = document.createElement("li");
        item.className = "queue-item";
        const top = document.createElement("div");
        top.className = "queue-item-top";
        const titleWrapper = document.createElement("div");
        const applicant = document.createElement("h3");
        applicant.textContent = interest.applicantName;
        const animal = document.createElement("p");
        animal.className = "animal-name";
        animal.textContent = `Interested in ${interest.animalName}`;
        titleWrapper.append(applicant, animal);
        const status = document.createElement("span");
        status.className = "status-badge";
        status.textContent = interest.status;
        top.append(titleWrapper, status);
        const details = document.createElement("div");
        details.className = "queue-details";
        details.append(
            createDetail("Phone", interest.phone),
            createDetail("Email", interest.contactEmail),
            createDetail("Household", interest.householdType),
            createDetail("Experience", interest.experienceLevel),
            createDetail("Current Pets", interest.currentPets)
        );

        const notes = document.createElement("p");
        notes.className = "queue-notes";
        if (interest.notes) {
            notes.textContent = `Notes: ${interest.notes}`;
        } else {
            notes.textContent = "Notes: None";
        }
        const footer = document.createElement("div");
        footer.className = "queue-footer";
        const timestamp = document.createElement("span");
        timestamp.className = "timestamp";
        timestamp.textContent = formatTimestamp(interest.timestamp);
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";
        removeButton.setAttribute(
            "aria-label", `Remove adoption interest from ${interest.applicantName}`
        );

        removeButton.addEventListener("click", async () => {
            await removeInterest(interest.id);
        });
        footer.append(timestamp, removeButton);
        item.append(
            top,
            details,
            notes,
            footer
        );
        queueList.appendChild(item);
    });
}


function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}

interestForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateForm()) {
        const firstError = interestForm.querySelector(".error");
        if (firstError) {
            firstError.focus();
        }
        return;
    }


    setLoading(true);
    const applicantName = sanitizeInput(
        document.getElementById("applicantName").value
    );
    const contactPhone = document
        .getElementById("contactPhone")
        .value
        .replace(/\D/g, "");
    const contactEmail = sanitizeInput(
        document.getElementById("contactEmail").value
    );
    const householdType = sanitizeInput(
        document.getElementById("householdType").value
    );
    const experienceLevel = sanitizeInput(
        document.getElementById("experienceLevel").value
    );
    const animalName = sanitizeInput(
        document.getElementById("animalName").value
    );
    const notes = sanitizeInput(
        document.getElementById("notes").value
    );
    const currentPets = document.querySelector(
        'input[name="currentPets"]:checked'
    ).value;
    await simulateNetworkDelay();


    const newInterest = {
        id: Date.now().toString(),
        applicantName,
        phone: contactPhone,
        contactEmail,
        animalName,
        householdType,
        currentPets,
        experienceLevel,
        notes,
        status: "Pending Review",
        timestamp: new Date().toISOString()
    };


    adoptionInterests.unshift(newInterest);
    console.log(
        "[Analytics] User interacted with Adoption Interest Queue"
    );


    interestForm.reset();
    document.querySelector(
        'input[name="currentPets"][value="No"]'
    ).checked = true;


    setLoading(false);
    updateSummary();
    renderQueue();
    document.getElementById("applicantName").focus();
});



async function removeInterest(id) {
    setLoading(true);
    await simulateNetworkDelay();


    adoptionInterests = adoptionInterests.filter((interest) => {
        return interest.id !== id;
    });


    setLoading(false);
    updateSummary();
    renderQueue();
    console.log(
        "[Analytics] User interacted with Adoption Interest Queue"
    );
}


searchInput.addEventListener("input", () => {
    renderQueue();
});


const fieldsToWatch = [
    "applicantName",
    "contactPhone",
    "contactEmail",
    "householdType",
    "experienceLevel",
    "animalName"
];

fieldsToWatch.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    field.addEventListener("input", () => {
        if (field.classList.contains("error")) {
            validateForm();
        }
    });
    field.addEventListener("change", () => {
        if (field.classList.contains("error")) {
            validateForm();
        }
    });
});
updateSummary();
renderQueue();
