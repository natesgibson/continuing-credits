(function() {
    "use strict"

    window.addEventListener("load", initialize);

    var PAYPAL_POST = "https://www.paypal.com/cgi-bin/webscr";
    var PAYPAL_IMG_SRC = "https://www.paypalobjects.com/webstatic/en_US/i/buttons/buy-logo-large.png";

    function initialize() {
        loadCourses();
    }

    function loadCourses() {
        fetch("php/load_courses.php")
            .then(checkStatus)
            .then(JSON.parse)
            .then(displayCourses)
            .catch(displayError);
    }

    function displayCourses(courses) {
        if (courses.length > 0) {
            courses.forEach(addCourse);
        }
        else {
            let noCoursesText = "Sorry, we do not have any courses listed at this time. "
                                + "Please check back in a couple of weeks! :)";
            let noCoursesElement = createElement("p", "error_text", noCoursesText);
            let notificationText = "If you would like to be notified when new courses are announced,"
                                + " be sure to sign up for our ";
            let notificationElement = createElement("p", "error_text", notificationText);
            let notificationLink = document.createElement("a");
            notificationLink.innerText = "Special Deal Club.";
            notificationLink.href = "/deal_club.html";
            notificationElement.appendChild(notificationLink);
            document.querySelectorAll("main")[0].appendChild(noCoursesElement);
            document.querySelectorAll("main")[0].appendChild(createElement("br", null, null));
            document.querySelectorAll("main")[0].appendChild(createElement("br", null, null));
            document.querySelectorAll("main")[0].appendChild(notificationElement);
        }
    }

    function addCourse(courseInfo) {
        let course = createElement("div", "course", null);

        let courseTitle = createElement("div", "course_title", null);
        courseTitle.appendChild(createElement("h2", null, courseInfo["title"]));
        if (courseInfo["is_new"] == 1) {
            courseTitle.appendChild(createElement("strong", null, "NEW!"))
        }
        course.appendChild(courseTitle);

        let courseImage = createElement("img", null, null);
        courseImage.src = courseInfo["image_url"];
        if (courseInfo["image_height"] != "") {
            courseImage.height = courseInfo["image_height"];
        }
        if (courseInfo["image_width"] != "") {
            courseImage.width = courseInfo["image_width"];
        }
        course.appendChild(courseImage);

        course.appendChild(createElement("h3", null, courseInfo["subtitle"]));

        course.appendChild(createElement("p", "description", courseInfo["description"]));

        let creditText = courseInfo["clock_hours"] + " CLOCK HOURS | "
                            + courseInfo["credits"] + " QUARTER CREDIT";
        if (courseInfo["credits"] > 1) {
            creditText += "S";
        }
        course.appendChild(createElement("p", "credit", creditText));


        let courseDates = createElement("div", "course_dates", null);

        let seattleDates = createElement("div", "dates", null);
        seattleDates.appendChild(createElement("p", "date_label", "Seattle:"));
        seattleDates.appendChild(createElement("p", null, "Dates: " + courseInfo["seattle_date"]));
        seattleDates.appendChild(createElement("p", null, "Location: " + courseInfo["seattle_location"]));
        seattleDates.appendChild(createElement("p", null, "Times: " + courseInfo["seattle_times"]));
        if (courseInfo["seattle_closed"] == 1) {
            seattleDates.appendChild(createElement("p", "closed_text", "Registration for Seattle is closed."));
        }
        courseDates.appendChild(seattleDates);

        let spokaneDates = createElement("div", "dates", null);
        spokaneDates.appendChild(createElement("p", "date_label", "Spokane:"));
        spokaneDates.appendChild(createElement("p", null, "Dates: " + courseInfo["spokane_date"]));
        spokaneDates.appendChild(createElement("p", null, "Location: " + courseInfo["spokane_location"]));
        spokaneDates.appendChild(createElement("p", null, "Times: " + courseInfo["spokane_times"]));
        if (courseInfo["spokane_closed"] == 1) {
            spokaneDates.appendChild(createElement("p", "closed_text", "Registration for Spokane is closed."));
        }
        courseDates.appendChild(spokaneDates);

        course.appendChild(courseDates);

        if (courseInfo["seattle_closed"] == 0 || courseInfo["spokane_closed"] == 0) {
            let button = createElement("button", null, "Register Now!");
            button.onclick = function() { location.href = "register.html"; };
            course.appendChild(button);
        }

        let extraCredit = createElement("div", "extra_credit", null);
        extraCredit.appendChild(createElement("h2", null, "Extra Credit Opportunity!"));
        extraCredit.appendChild(createElement("p", null, courseInfo["ec_text"]));
        course.appendChild(extraCredit);

        if (courseInfo["ec_live"] == 1) {
            course.appendChild(createElement("h3", "ec_pp_btn", "Extra Credit Paypal:"))
            course.appendChild(generatePaypalBtn(courseInfo));
        }

        document.querySelectorAll("main")[0].appendChild(course);
    }

    function generatePaypalBtn(courseInfo) {
        let payBtn = document.createElement("form");
        payBtn.action = PAYPAL_POST;
        payBtn.method = "post";
        payBtn.target = "_blank";

        payBtn.appendChild(generateInput("hidden", "cmd", "_xclick"));
        payBtn.appendChild(generateInput("hidden", "business", "loribgibson@hotmail.com"));
        payBtn.appendChild(generateInput("hidden", "item_name", courseInfo["title"] + " -- Extra Credit"));

        payBtn.appendChild(generateInput("hidden", "item_number", "#"));                    //UPDATE?

        payBtn.appendChild(generateInput("hidden", "amount", courseInfo["ec_price"]));
        payBtn.appendChild(generateInput("hidden", "no_note", "1"));
        payBtn.appendChild(generateInput("hidden", "currency_code", "USD"));

        let paypalImage = generateInput("image", null, null);
        paypalImage.src = PAYPAL_IMG_SRC;
        payBtn.appendChild(paypalImage);

        return payBtn;
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

    function createElement(type, classText, innerText) {
        let element = document.createElement(type);
        if (classText) {
            element.classList.add(classText)
        }
        if (innerText) {
            element.innerText = innerText;
        }
        return element;
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
