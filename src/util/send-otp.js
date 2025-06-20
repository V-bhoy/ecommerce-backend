import appConfig from "../index.js";

export async function sendOtp({email, otp}){
    const mailOptions = {
        from: appConfig.nodemailer.senderEmail,
        to: email,
        subject: "Verify email to reset password",
        text: "Verify the below otp to reset new password for your account at One Stop. \n\n" +
            `This otp is valid only for 5 minutes - ${otp}.`
    }
    await appConfig.nodemailer.transport.sendMail(mailOptions);
}