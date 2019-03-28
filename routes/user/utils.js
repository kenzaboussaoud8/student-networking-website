
module.exports = {
    checkRegisteryForm : checkRegisteryForm,
    checkPassword: checkPassword
}

function checkString(string) {
    return (typeof string == 'string' && string.length <= 25 && string.length >= 2)
}
function checkPassword(password) {
    var strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return (typeof password == 'string' && strongPasswordRegex.test(password))
}

function checkEmail(email) {
    return (typeof email == 'string'
        && email.indexOf('@') > 0
        && email.indexOf('@') < email.indexOf('.') - 1
        && email.indexOf('.') < email.length - 1)
}

function checkBirthDate(date) {
    birth_date = Date.parse(date)
    current_date = Date.now()
    var age = Math.floor(Math.abs((Date.now() - birth_date) / (1000 * 60 * 60 * 24 * 365.25)));
    return (age >= 18)
}
function checkRegisteryForm(body) {
    var email = body.email;
    var first_name = body.first_name;
    var last_name = body.last_name;
    var password = body.password;
    var birth_date = body.birth_date;
    var student_card = body.student_card;

    if (!(first_name && last_name && password && email && birth_date && student_card)) {
        return { success : false, error : 400, message : "Missing one or many required information" }
    }
    if (!(checkString(first_name)
        && checkString(last_name)
        && checkPassword(password)
        && checkEmail(email)
        && checkBirthDate(birth_date)))
        return { success : false, error : 400, message : "One or many incorrect data" }
    return {success : true}
}