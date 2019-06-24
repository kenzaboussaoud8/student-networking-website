var nodemailer = require("nodemailer");
const config = require("../../config.js");

module.exports = {
    checkRegisteryForm: checkRegisteryForm,
    checkPassword: checkPassword,
    sendMail: sendMail,
    sendApprovalMail: sendApprovalMail
};

function sendMail(receiverEmail) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.email,
            pass: config.password
        }
    });
    // Send mail to user
    var mailOptions = {
        from: "loveacademy.customer@gmail.com",
        to: receiverEmail,
        subject: "Bienvenue à Love Academy",
        text: "Votre inscription est en cours de revue"
    };
    // send mail to admin
    var secondMailOptions = {
        from: "loveacademy.customer@gmail.com",
        to: "admin@gmail.com",
        subject: "Nouvel utilisateur",
        text: "Vous avez un nouvel utilisateur à vérifier"
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
    transporter.sendMail(secondMailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent to admin: " + info.response);
        }
    });
}

function sendApprovalMail(receiverEmail) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "loveacademyorigin@gmail.com",
            pass: "lOvEaCaDeMy2019*"
        }
    });
    // Send mail to user
    var mailOptions = {
        from: "loveacademyorigin@gmail.com",
        to: receiverEmail,
        subject: "Bienvenue à Love Academy",
        text: "Votre inscription a été validée"
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

function checkString(string) {
    return (string = !"" &&
        typeof string == "string" &&
        string.length <= 25 && string.length >= 2);
}

function checkPassword(password) {
    var strongPasswordRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    return typeof password == "string" && strongPasswordRegex.test(password);
}

function checkEmail(email) {
    return (email = !"" &&
        typeof email == "string" &&
        email.indexOf("@") > 0 &&
        email.indexOf("@") < email.lastIndexOf(".") - 1 &&
        email.lastIndexOf(".") < email.length - 1);
}

function checkBirthDate(date) {
    birth_date = Date.parse(date);
    current_date = Date.now();
    var age = Math.floor(
        Math.abs((Date.now() - birth_date) / (1000 * 60 * 60 * 24 * 365.25))
    );
    return age >= 18;
}

/**
 * checking if data entered by user exists and is valid 
 * @param {*} body 
 */
function checkRegisteryForm(body) {
    var email = body.email;
    var first_name = body.first_name;
    var last_name = body.last_name;
    var password = body.password;
    var birth_date = body.birth_date;
    var errorMessage = undefined
        // check if data exists
    if (!first_name) {
        errorMessage = "Prénom manquant";
    } else if (!last_name) {
        errorMessage = "Nom manquant";
    } else if (!password) {
        errorMessage = "Mot de passe manquant";
    } else if (!birth_date) {
        errorMessage = "Date de naissance manquante";
    } else if (!email) {
        errorMessage = "Email manquant";
    }
    if (errorMessage) {
        return {
            success: false,
            error: 400,
            message: errorMessage
        };
    }
    // check if data is valid
    var ValidityErrorMessage = undefined
    if (!checkString(first_name)) {
        ValidityErrorMessage = "Prénom non valide";
    } else if (!checkString(last_name)) {
        ValidityErrorMessage = "Nom non valide";
    } else if (!checkPassword(password)) {
        ValidityErrorMessage = "Mot de passe pas assez sécurisé : Au moins une majuscule, minuscule, un chiffre et un caractère spécial";
    } else if (!checkEmail(email)) {
        ValidityErrorMessage = "Email erroné";
    } else if (!checkBirthDate(birth_date)) {
        ValidityErrorMessage = "Vous devez avoir plus de 18 ans pour accéder au site";
    }
    if (ValidityErrorMessage) {
        return {
            success: false,
            error: 400,
            message: ValidityErrorMessage
        };
    }
    return {
        success: true,
        error: 200,
        message: "Succès"
    };
}