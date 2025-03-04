import nodemailer from "nodemailer";

export const sendOrderUpdateEmail = async (to: string, orderId: number, newStatus: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // Change this based on your email provider
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app password
        },
    });

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f0;">
            <h2 style="color: #D4AF37;">Order Update - Diamant Rouge</h2>
            <p>Dear Valued Customer,</p>
            <p>Your order <strong>#${orderId}</strong> has been updated to: <strong>${newStatus}</strong>.</p>
            <p>Thank you for choosing <strong>Diamant Rouge</strong>. If you have any questions, feel free to contact us.</p>
            <p style="margin-top: 20px;">Best Regards, <br><strong>Diamant Rouge Team</strong></p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Diamant Rouge" <${process.env.EMAIL_USER}>`,
            to,
            subject: `Your Order #${orderId} Status Update`,
            html: emailHtml,
        });

        console.log(`✅ Email sent to ${to} for Order #${orderId}`);
    } catch (error) {
        console.error(`❌ Failed to send email for Order #${orderId}:`, error);
    }
};
