var clipboard = new ClipboardJS('.btn');

clipboard.on('success', function (e) {
    showToast("复制成功")
    e.clearSelection();
});

var output = $("#output")
var input = $("#input")
clipboard.on('error', function (e) {
    if (output.val() != "") {
        showToast("复制失败")
    }
});

$("#url").on("click", function () {
    var text = input.val().trim();

    if (text == "") {
        return
    }

    var p
    try {
        url = new URL(text)
        p = url.searchParams
    } catch (e) {
        p = new URLSearchParams(text)
    }

    // value: string, key: string, parent: URLSearchParams

    var code = "type Gen struct {\n"
    p.forEach(function (value, key, parent) {
        var field = formatName(key)
        var type = "string"

        if (isNumber(value)) {
            if (isFloat(value)) {
                type = "float64"
            } else {
                type = "int"
            }
        }

        code += `    ${field}  ${type}  \`form:"${key}"\`\n`

    })

    code += "}"

    output.val(code);
})

function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/;//非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;//负浮点数
    return regPos.test(val) || regNeg.test(val);
}

function isFloat(n) {
    return /^-?\d*\.\d+$/.test(n);
}

function formatName(v) {
    var split = v.split("_");
    var newText = ""
    split.forEach(function (value, index, array) {
        newText += firstUpperCase(value)
    })
    return newText
}

function firstUpperCase(v) {
    return v.substring(0, 1).toUpperCase() + v.substring(1)
}

function showToast(msg, duration) {
    duration = isNaN(duration) ? 1000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "width:20%; min-width:20%; background:#fff; opacity:0.6; height:auto;min-height: 30px; color:#000; line-height:30px; text-align:center; border-radius:4px; position:fixed; top:80%; left:40%; z-index:999999;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}