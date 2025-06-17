import appConfig from "../index.js";

export async function sendWelcomeEmail(email){
    const mailOptions = {
        from: appConfig.nodemailer.senderEmail,
        to: email,
        subject: "Welcome to One Stop website",
        text: "Welcome to One Stop website! \n\n" +
            `Your email has been successfully registered with email Id - ${email}.\n\n` +
            "Thank you for choosing us.\n\n"+
            "Happy Shopping!"
    }
    await appConfig.nodemailer.transport.sendMail(mailOptions);
}