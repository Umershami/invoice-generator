import nodemailer from "nodemailer";


const sendEmail=async({to,subject,text,html})=>{


    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
        console.log("📩 Email sent successfully");
    } catch (error) {
        console.error("❌ Email sending error:", error);
    }
}

export default sendEmail;