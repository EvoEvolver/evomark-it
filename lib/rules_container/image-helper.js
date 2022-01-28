const legalType = ["normal", "wide", "narrow"]

module.exports.getImageClass = function (type) {
    if (legalType.indexOf(type) < 0)
        return "normal-image"
    else
        return type + "-image"
}