// let urlParams = new URLSearchParams(window.location.href);
let url = new URL(window.location.href)

let generations = [];
generations[3] = {limit: 10, pull: 100, spend: 20};
generations[4] = {limit: 9, pull: 50, spend: 10};
generations[5] = {limit: 8, pull: 40, spend: 8};
generations[6] = {limit: 7, pull: 30, spend: 6};
generations[7] = {limit: 6, pull: 20, spend: 4};
generations[8] = {limit: 5, pull: 15, spend: 3};
generations[9] = {limit: 5, pull: 14, spend: 2};
generations[10] = {limit: 5, pull: 13, spend: 1};
generations[11] = {limit: 5, pull: 12, spend: 1};
generations[12] = {limit: 5, pull: 11, spend: 1};
generations[13] = {limit: 5, pull: 10, spend: 1};
generations[14] = {limit: 5, pull: 10, spend: 1};
generations[15] = {limit: 5, pull: 10, spend: 1};

let setDots = (
    selectElements = " ",
    counterOuter = true,
    counterValue = 1, 
    counterStart = counterValue, 
    counterEnd = 5, 
    conditionOption = 0
    ) => {
    document.querySelectorAll(selectElements).forEach(function(e) {
        e.innerHTML = "";
        let input = document.querySelector("#" + e.getAttribute("target"));
        let i = counterOuter === true? counterValue : undefined;
        let spec_input = document.querySelector("input[target=" + e.getAttribute("target") + "]");
        for (i = counterStart; i <= counterEnd; i++) {
            e.insertAdjacentHTML("beforeend",'<div class="dot" state="' + (input.value < i ? 0 : 1) + '" v="' + i + '"></div>');
        }
        switch(conditionOption) {
            case 0:
                break;
            case 1:
                if (spec_input.value != "" && input.value < 4) {
                    spec_input.value;
                }
                if (input.value >= 4) {
                    spec_input.classList.remove("hidden");
                } else {
                    spec_input.classList.add("hidden");
                }
                break;
            case 2:
                if (input.value >= i ) {
                    input.value = i - 1;
                }
                if (spec_input.value != "" && input.value < 4) {
                    spec_input.value;
                }
                if (input.value >= 4) {
                    spec_input.classList.remove("hidden");
                } else {
                    spec_input.classList.add("hidden");
                }
                break;
        }
    });
    }

let updateDot = function() {
    let currentGeneration = document.querySelector("#generation").value;
    setDots(".attribute>.value>.dot_set", ...[,,,], generations[currentGeneration].limit, 2);
    setDots(".skill>.value>.dot_set", ...[,,,], 5, 1);
    setDots(".advantages>.value>.dot_set", ...[,,,], 5, 0);
    setDots(".virtues>.value>.dot_set", ...[,,,], 5, 0);
    setDots(".path>.value>.dot_set", ...[,,,], 10, 0);
    setDots(".will>.value>.dot_set", ...[,,,], 10, 0);
    setDots(".blood_pull>.value>.dot_set", ...[,,,], generations[currentGeneration].pull, 0);
    document.querySelectorAll(".helth_dot").forEach(function(e) {
        e.innerHTML = "";
        let input = document.querySelector("#" + e.getAttribute("target"));
        let val = parseInt(input.value);
        switch(val) {
            case 0:
                break;
            case 1:
                e.innerHTML = "<span>/</span>";
                break;
            case 2:
                e.innerHTML = "<span>Ⅹ</span>";
                break;
            case 3:
                e.innerHTML = "<span>∗</span>";
                break;
        }
    });
}

let toggleHelth = function(dot) {
    let state = parseInt(dot.getAttribute("state"));
    let input = document.querySelector("#" + dot.getAttribute("target"));
    switch(state) {
        case 0:
            dot.setAttribute("state", 1);
            input.value = 1;
            break;
        case 1:
            dot.setAttribute("state", 2);
            input.value = 2;
            break;
        case 2:
            dot.setAttribute("state", 3);
            input.value = 3;
            break;
        case 3:
            dot.setAttribute("state", 0);
            input.value = 0;
            break;
    }
    updateDot();
}


let toggleDot = function(dot) {
    let input = document.querySelector("#" + dot.parentElement.getAttribute("target"));
    let dotVal = parseInt(dot.getAttribute("v"));
    if (dot.getAttribute("state") == "1") {
        input.value = dotVal - 1;
    } else {
        input.value = dotVal;
    }
    updateDot();
}

let changeSpecialization = function(input) {
    if (input.value != "") {
        input.classList.add("noborder");
    } else {
        input.classList.remove("noborder");
    }
}

let setUrlParams = function() {
    document.querySelectorAll("input,textarea").forEach(function(e) {
        let input = e;
        if (typeof input.value == "undefined") {
            return;
        }
        url.searchParams.set(input.getAttribute("id"), input.value);
    });
    console.log(url.toString());
    window.history.replaceState(null, "", url.toString())
}

let readUrlParams = function() {
    url.searchParams.forEach(function(val, key) {
        document.querySelector("#" + key).value = val;
    })
}


document.addEventListener('DOMContentLoaded', function() {
    readUrlParams();
    document.querySelector("#generation").addEventListener("change", function() {
        updateDot();
    })
    document.body.addEventListener("click", function(e) {
        let dot = e.target.closest('.dot')
        if (dot) {
            toggleDot(e.target);
            setUrlParams();
        }
    })
    document.body.addEventListener("click", function(e) {
        let helthDot = e.target.closest('.helth_dot');
        if (helthDot) {
            toggleHelth(helthDot);
            setUrlParams();
        }
    })
    document.querySelector(".specialization>input").addEventListener("change", function(e) {
        changeSpecialization(e.target);
    })
    updateDot();
    document.addEventListener("change", function(e) {
        let inputAndTextarea = e.target.closest('input,textarea');
        if (inputAndTextarea) {
            setUrlParams();
        }
    })
})
