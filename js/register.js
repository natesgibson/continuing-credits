(function() {
    "use strict"

    window.addEventListener("load", initialize);

    window.courses = null;

    var PAYPAL_POST = "https://www.paypal.com/cgi-bin/webscr";
    var PAYPAL_IMG_SRC = "https://www.paypalobjects.com/webstatic/en_US/i/buttons/buy-logo-large.png";

    function initialize() {
        get("city-one").addEventListener("change", displayDateType);
        get("city-two").addEventListener("change", displayDateType);

        get("type-one").addEventListener("change", displayContinue);
        get("type-two").addEventListener("change", displayContinue);
        get("type-three").addEventListener("change", displayContinue);


        get("continue").addEventListener("click", generateConfirm);
        get("continue").addEventListener("click", displayConfirm);

        get("back_reg").addEventListener("click", displayReg);
        get("confirm").addEventListener("click", generatePaypalBtn);
        get("confirm").addEventListener("click", displayPay);

        get("back_confirm").addEventListener("click", displayConfirm);


        loadCourses();
    }

    function displayLocation() {
        get("location").style.display = "block";

        get("location").scrollIntoView({behavior: "smooth"});
    }

    function displayDateType() {
        if (!locationClosed()) {
            updateDate();
            get("date").style.display = "block";
            get("type").style.display = "block";
            get("closed").style.display = "none";
            if (getSelectedType() != "none") {
                get("continue").style.display = "block";
            }
        } else {
            displayIsClosed();
        }
    }

    function displayIsClosed() {
        get("date").style.display = "none";
        get("type").style.display = "none";
        get("continue").style.display = "none";

        get("closed").style.display = "block";
    }

    function locationClosed() {
        let isClosed = false;
        let location = getSelectedLocation();
        let selectedCourse = getSelectedCourse();

        if ((location == "Seattle" && selectedCourse["seattle_closed"] == 1) ||
            (location == "Spokane" && selectedCourse["spokane_closed"] == 1)) {
            isClosed = true;
        }

        return isClosed;
    }

    function displayContinue() {
        get("continue").style.display = "block";

        get("continue").scrollIntoView({behavior: "smooth"});
    }

    function displayReg() {
        get("course_reg").style.display = "block";
        get("reg_confirm").style.display = "none";
        get("pay_options").style.display = "none";
    }

    function displayConfirm() {
        get("course_reg").style.display = "none";
        get("reg_confirm").style.display = "block";
        get("pay_options").style.display = "none";

        get("reg_confirm").scrollIntoView({behavior: "smooth"});
    }

    function displayPay() {
        get("course_reg").style.display = "none";
        get("reg_confirm").style.display = "none";
        get("pay_options").style.display = "block";

        get("pay_options").scrollIntoView({behavior: "smooth"});
    }

    function loadCourses() {
        fetch("php/load_courses.php")
            .then(checkStatus)
            .then(JSON.parse)
            .then(displayRegister)
            .catch(displayError);
    }

    function displayRegister(courses) {
        window.courses = courses;

        if (courses.length > 0) {
            courses.forEach(addCourseBtn);
        }
        else {
            let noCoursesText = "Sorry, we do not have any courses listed at this time. "
                                + "Please check back at a later date!"
            let textElement = document.createElement("p");
            textElement.innerText = noCoursesText;
            textElement.classList.add("error_text");
            document.querySelectorAll("main")[0].appendChild(textElement);
        }
    }

    function addCourseBtn(course) {
        let courseId = course["id"];

        let inputEl = document.createElement("input");
        inputEl.type = "radio";
        inputEl.id = "course-" + courseId;
        inputEl.name = "switch-course";
        inputEl.value = courseId;

        inputEl.addEventListener("change", displayLocation);
        inputEl.addEventListener("click", updateDate);
        inputEl.addEventListener("click", updatePrices);
        get("course-buttons").appendChild(inputEl);

        let labelEl = document.createElement("label");
        labelEl.htmlFor = inputEl.id;
        labelEl.innerText = course["title"];

        get("course-buttons").appendChild(labelEl);
    }

    function updateDate() {
        get("date").innerText = "Date: " + getSelectedDate();
    }

    function updatePrices() {
        let selectedCourse = getSelectedCourse();

        get("clock-hours").innerText = selectedCourse["clock_hours"] + " Clock Hours"
                                        + " - $" + selectedCourse["clock_price"];
        get("400").innerText = "400 Level Credit - $" + selectedCourse["400_price"];
        get("500").innerText = "500 Level Credit - $" + selectedCourse["500_price"];
    }

    function generateConfirm() {
        get("con-title").innerText = "Course: " + getSelectedCourse()["title"];
        get("con-loc").innerText = "Location: " + getSelectedLocation();
        get("con-date").innerText = "Date: " + getSelectedDate();
        get("con-type").innerText = "For: " + getConfirmType();
        get("con-price").innerText = "Price: $" + getSelectedPrice();
    }

    function generatePaypalBtn() {
        let payBtn = document.createElement("form");
        payBtn.action = PAYPAL_POST;
        payBtn.method = "post";
        payBtn.target = "_blank";

        payBtn.appendChild(generateInput("hidden", "cmd", "_xclick"));
        payBtn.appendChild(generateInput("hidden", "business", "loribgibson@hotmail.com"));
        payBtn.appendChild(generateInput("hidden", "item_name", getSelectedCourse()["title"]
                                            + " -- " + getSelectedType() + " -- " + getSelectedLocation()));
        payBtn.appendChild(generateInput("hidden", "item_number", getItemNumber()));
        payBtn.appendChild(generateInput("hidden", "amount", getSelectedPrice()));
        payBtn.appendChild(generateInput("hidden", "no_note", "1"));
        payBtn.appendChild(generateInput("hidden", "currency_code", "USD"));

        let paypalImage = generateInput("image", null, null);
        paypalImage.src = PAYPAL_IMG_SRC;
        payBtn.appendChild(paypalImage);

        let ppContainer = get("paypal-button-container");
        clearChildren(ppContainer);
        ppContainer.appendChild(payBtn);
    }

    function generateInput(type, name, value) {
        let input = document.createElement("input");

        if (type) {
            input.type = type;
        }
        if (name) {
            input.name = name;
        }
        if (value) {
            input.value = value;
        }

        return input;
    }

    function clearChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function getSelectedCourse() {
        let courseBtns = get("course-buttons").getElementsByTagName("INPUT");
        for (let i = 0; i < courseBtns.length; i++) {
            if (courseBtns[i].checked) {
                let id = courseBtns[i].value;
                return courses.find(course => course["id"] == id);
            }
        }
    }

    function getSelectedDate() {
        let selectedCourse = getSelectedCourse();
        let date = "";

        // Seattle date
        if (get("city-one").checked) {
            date = selectedCourse["seattle_date"];
        }
        // Spokane date
        else if (get("city-two").checked) {
            date = selectedCourse["spokane_date"];
        }

        return date;
    }

    function getSelectedLocation() {
        let locBtns = get("location-buttons").getElementsByTagName("INPUT");
        for (let i = 0; i < locBtns.length; i++) {
            if (locBtns[i].checked) {
                return locBtns[i].value;
            }
        }
    }

    function getSelectedType() {
        let typeBtns = get("type-buttons").getElementsByTagName("INPUT");
        for (let i = 0; i < typeBtns.length; i++) {
            if (typeBtns[i].checked) {
                return typeBtns[i].value;
            }
        }
        return "none";
    }

    function getSelectedPrice() {
        let selectedCourse = getSelectedCourse();
        let selectedType = getSelectedType();

        let price = 0;
        if (selectedType == "Clock Hours") {
            price = selectedCourse["clock_price"];
        } else if (selectedType == "400 Level Credit") {
            price = selectedCourse["400_price"];
        } else if (selectedType == "500 Level Credit") {
            price = selectedCourse["500_price"];
        }

        return price;
    }

    function getConfirmType() {
        let type = getSelectedType();
        let selectedCourse = getSelectedCourse();

        let confirmType = "";
        if (type == "Clock Hours") {
            return selectedCourse["clock_hours"] + " Clock Hours";
        } else if (type == "400 Level Credit") {
            let text400 = selectedCourse["credits"] + " 400 Level Quarter Credit";
            if (selectedCourse["credits"] > 1) {
                text400 += "s";
            }
            return text400;
        } else if (type == "500 Level Credit") {
            let text500 = selectedCourse["credits"] + " 500 Level Quarter Credit";
            if (selectedCourse["credits"] > 1) {
                text500 += "s";
            }
            return text500;
        }

        return confirmType;
    }

    function getItemNumber() {
        let type = getSelectedType();

        let itemNumber = "#";
        if (type == "Clock Hours") {
            itemNumber = "4";
        } else if (type == "400 Level Credit") {
            itemNumber = "5;"
        } else if (type == "500 Level Credit") {
            itemNumber = "6"
        }

        return itemNumber;
    }




    function get(id) {
        return document.getElementById(id);
    }

    function checkStatus(response) {
        const OK = 200;
        const ERROR = 300;
        let responseText = response.text();

        if (response.status >= OK && response.status < ERROR || response.status === 0) {
            return responseText;
        } else {
            return responseText.then(Promise.reject.bind(Promise));
        }
    }

    function displayError(error) {
        alert(error);
    }
})();
