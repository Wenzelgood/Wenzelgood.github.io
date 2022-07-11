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


let updateDot = function() {
    let currentGeneration = $("#generation").val();
    $(".attribute>.value>.dot_set").each(function() {
        $(this).html("");
        let input = $("#" + $(this).attr("target"));
        let i = 1;
        let spec_input = $("input[target=" + $(this).attr("target") + "]")
        for (i = 1; i <= generations[currentGeneration].limit; i++) {
            $(this).append('<div class="dot" state="' + (input.val() < i ? 0 : 1) + '" v="' + i + '"></div>')
        }
        if (input.val() >= i ) {
            input.val(i - 1);
        }
        if (spec_input.val() != "" && input.val() < 4) {
            spec_input.val("");
        }
        if (input.val() >= 4) {
            spec_input.removeClass("hidden");
        } else {
            spec_input.addClass("hidden");
        }
    });
    $(".skill>.value>.dot_set").each(function() {
        $(this).html("");
        let input = $("#" + $(this).attr("target"));
        let i = 1;
        let spec_input = $("input[target=" + $(this).attr("target") + "]")
        for (i = 1; i <= 5; i++) {
            $(this).append('<div class="dot" state="' + (input.val() < i ? 0 : 1) + '" v="' + i + '"></div>')
        }
        if (spec_input.val() != "" && input.val() < 4) {
            spec_input.val("");
        }
        if (input.val() >= 4) {
            spec_input.removeClass("hidden");
        } else {
            spec_input.addClass("hidden");
        }
    });
    $(".advantages>.value>.dot_set").each(function() {
        $(this).html("");
        let input = $("#" + $(this).attr("target"));
        for (let i = 1; i <= 5; i++) {
            $(this).append('<div class="dot" state="' + (input.val() < i ? 0 : 1) + '" v="' + i + '"></div>')
        }
    });
    $(".virtues>.value>.dot_set").each(function() {
        $(this).html("");
        let input = $("#" + $(this).attr("target"));
        for (let i = 1; i <= 5; i++) {
            $(this).append('<div class="dot" state="' + (input.val() < i ? 0 : 1) + '" v="' + i + '"></div>')
        }
    });
    $(".path>.value>.dot_set").each(function() {
        $(this).html("");
        let input = $("#" + $(this).attr("target"));
        for (let i = 1; i <= 10; i++) {
            $(this).append('<div class="dot" state="' + (input.val() < i ? 0 : 1) + '" v="' + i + '"></div>')
        }
    });
    $(".will>.value>.dot_set").each(function() {
        $(this).html("");
        let input = $("#" + $(this).attr("target"));
        for (let i = 1; i <= 10; i++) {
            $(this).append('<div class="dot" state="' + (input.val() < i ? 0 : 1) + '" v="' + i + '"></div>')
        }
    });
    $(".blood_pull>.value>.dot_set").each(function() {
        $(this).html("");
        let input = $("#" + $(this).attr("target"));
        for (let i = 1; i <= generations[currentGeneration].pull; i++) {
            $(this).append('<div class="dot" state="' + (input.val() < i ? 0 : 1) + '" v="' + i + '"></div>')
        }
    });
    $(".helth_dot").each(function() {
        $(this).html("");
        let input = $("#" + $(this).attr("target"));
        let val = parseInt(input.val());
        switch(val) {
            case 0:
                break;
            case 1:
                $(this).html("<span>/</span>")
                break;
            case 2:
                $(this).html("<span>Ⅹ</span>")
                break;
            case 3:
                $(this).html("<span>∗</span>")
                break;
        }
    });
}

let toggleHelth = function(dot) {
    let state = parseInt(dot.attr("state"));
    let input = $("#" + dot.attr("target"));
    switch(state) {
        case 0:
            dot.attr("state", 1)
            input.val(1)
            break;
        case 1:
            dot.attr("state", 2)
            input.val(2)
            break;
        case 2:
            dot.attr("state", 3)
            input.val(3)
            break;
        case 3:
            dot.attr("state", 0)
            input.val(0)
            break;
    }
    updateDot();
}


let toggleDot = function(dot) {
    let input = $("#" + dot.parent().attr("target"));
    let dotVal = parseInt(dot.attr("v"));
    if (dot.attr("state") == "1") {
        input.val(dotVal - 1);
    } else {
        input.val(dotVal);
    }
    updateDot();
}

let changeSpecialization = function(input) {
    if (input.val() != "") {
        input.addClass("noborder");
    } else {
        input.removeClass("noborder");
    }
}

let setUrlParams = function() {
    $("input,textarea").each(function() {
        let input = $(this);
        if (typeof input.val() == "undefined") {
            return;
        }
        url.searchParams.set(input.attr("id"), input.val());
    });
    console.log(url.toString());
    window.history.replaceState(null, "", url.toString())
}

let readUrlParams = function() {
    url.searchParams.forEach(function(value, key) {
        $("#" + key).val(value);
    })
}


$(document).ready(function() {
    readUrlParams();
    $("#generation").on("change", function() {
        updateDot();
    })
    $("body").on("click", ".dot", function() {
        toggleDot($(this));
        setUrlParams();
    })
    $("body").on("click", ".helth_dot", function() {
        toggleHelth($(this));
        setUrlParams();
    })
    $(".specialization>input").on("change", function() {
        changeSpecialization($(this));
    })
    updateDot();
    $("input,textarea").on("change", function() {
        setUrlParams();
    })
})
