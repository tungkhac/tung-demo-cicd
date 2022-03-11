function PopupCenter(pageURL, title, w, h) {
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);

    strFeatures = 'toolbar=no, location=no, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left;
    var targetWin = window.open(pageURL, title, strFeatures);
    targetWin.focus();
}

function enterSearch(event, baseUrl, searchBox) {
    if (event.keyCode == 13) {
        var keyword = encodeURI(searchBox.value.trim());
        window.location = baseUrl + keyword;
    }
}

function clickSearch(baseUrl, searchBoxId) {
    var searchBox = document.getElementById(searchBoxId);
    var keyword = encodeURI(searchBox.value.trim());
    window.location = baseUrl + keyword;
}

function getValueOfRadioGroup(groupId) {
    var list = document.getElementById(groupId); //Client ID of the radio group
    var inputs = list.getElementsByTagName("input");
    var selected;
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            selected = inputs[i];
            break;
        }
    }

    return selected.value;
}

function allowNumber(ctrl, min, max) {
    var str = $(ctrl).val();
    str = str.replace(',', '');
    var intVal = parseInt(str);

    if (isNaN(intVal)) {
        $(ctrl).val("");
    }
    else {
        if (min != null && intVal < min) {
            intVal = min;
        }
        if (max != null && intVal > max) {
            intVal = max;
        }
        $(ctrl).val(intVal.toString());
    }
}