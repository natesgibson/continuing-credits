(function() {
    "use strict"

    window.addEventListener("load", initialize);

    function initialize() {
        document.querySelectorAll("main")[0].scrollIntoView({behavior: "smooth"});
    }
})();
