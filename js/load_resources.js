(function() {
    "use strict"

    window.addEventListener("load", initialize);

    function initialize() {
        loadResources();
    }

    function loadResources() {
        fetch("php/load_resources.php")
            .then(checkStatus)
            .then(JSON.parse)
            .then(displayResources)
            .catch(displayError);
    }

    function displayResources(resources) {
        let currentResource = document.createElement("ul");

        for (let i = 0; i < resources.length; i++) {
            let resource = resources[i];
            if (resource["is_title"] == 1) {
                let courseRec = document.createElement("div");
                courseRec.classList.add("course-rec");

                let title = document.createElement("h3");
                title.innerText = resource["title"];

                courseRec.appendChild(title);
                courseRec.appendChild(currentResource);
                currentResource = document.createElement("ul");

                let courseRecContainer = null;
                if (resource["is_current"] == 1) {
                    courseRecContainer = get("current");
                } else {
                    courseRecContainer = get("previous");
                }

                courseRecContainer.insertBefore(courseRec, courseRecContainer.firstChild);
            } else if (resource["is_link"] == 1) {
                currentResource.insertBefore(createLink(resource), currentResource.firstChild);
            }
        }

        updateEmptyMessages();
    }

    function createLink(linkInfo) {
        let linkContainer = document.createElement("li");

        let author = document.createElement("p");
        author.innerText = linkInfo["link_author"] + " ";
        linkContainer.appendChild(author);

        let link = document.createElement("a");
        link.href = linkInfo["link_url"];
        link.target = "_blank";
        link.innerText = linkInfo["link_name"];
        linkContainer.appendChild(link);

        return linkContainer;
    }

    function updateEmptyMessages() {
        let current = get("current");
        if (current.childElementCount < 1) {
            let emptyMessage = document.createElement("p");
            emptyMessage.innerText = "There are no resources for current courses at this time.";
            current.appendChild(emptyMessage);
        }

        let previous = get("previous");
        if (previous.childElementCount < 1) {
            let emptyMessage = document.createElement("p");
            emptyMessage.innerText = "There are no resources for previous courses at this time."
            previous.appendChild(emptyMessage);
        }
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
