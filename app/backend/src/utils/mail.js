import Mailgen from "mailgen"
import nodemailer from "nodemailer"

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "AniScope",
            link: "https://example.com",
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)

    const emailHtml = mailGenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        }
    })

    const mail = {
        from: "mail.aniscope@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml,
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email service failed. Make sure that you have provided your MAILTRAP credentials in the .env file")
        console.error("ERROR: " + error)
    }

}
const emailVerificationMailgenContent = (username, otp) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our app! We're excited to have you on board.",
            dictionary: {
                "OTP": otp,
                "Valid For": "10 minutes"
            },

            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    };
};

export {
    sendEmail,
    emailVerificationMailgenContent,
}