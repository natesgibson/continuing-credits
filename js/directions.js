(function() {
    "use strict"

    window.addEventListener("load", initialize);

    function initialize() {
        get("radio-sea").addEventListener("change", update_directions);
        get("radio-spo").addEventListener("change", update_directions);
    }

    function update_directions() {
        if (get("radio-sea").checked == true) {
            get("directions_seattle").style.display = 'block';
            get("directions_spokane").style.display = 'none';
        }
        else if (get("radio-spo").checked == true) {
            get("directions_seattle").style.display = 'none';
            get("directions_spokane").style.display = 'block';
        }
    }

    function get(id) {
        return document.getElementById(id);
    }
})();
