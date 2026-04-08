const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
})

exports.sendOrderConfirmation = async (toEmail, orderId, items, total) => {
    const itemsList = items.map(i =>
        `<tr>
        <td style="padding:8px;border-bottom:1px solid #2d3748;">${i.name}</td>
        <td style="padding:8px;border-bottom:1px solid #2d3748;text-align:center;">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #2d3748;text-align:right;">$${(Number(i.price) * i.quantity).toFixed(2)}</td>
        </tr>`
    ).join('')

    await transporter.sendMail({
        from: `"PCStore 🖥️" <${process.env.MAIL_USER}>`,
        to: toEmail,
        subject: `✅ Confirmation de votre commande #${orderId}`,
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#1a202c;color:#e2e8f0;padding:32px;border-radius:16px;">
            <h1 style="color:#818cf8;margin-bottom:4px;">PCStore</h1>
            <p style="color:#94a3b8;margin-top:0;">Confirmation de commande</p>

            <div style="background:#2d3748;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0;font-size:18px;font-weight:bold;">Commande <span style="color:#818cf8;">#${orderId}</span> confirmée ! 🎉</p>
            <p style="margin:8px 0 0;color:#94a3b8;font-size:14px;">Merci pour votre achat. Voici le récapitulatif :</p>
            </div>

            <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr style="background:#4a5568;">
                <th style="padding:10px;text-align:left;border-radius:8px 0 0 0;">Produit</th>
                <th style="padding:10px;text-align:center;">Qté</th>
                <th style="padding:10px;text-align:right;border-radius:0 8px 0 0;">Prix</th>
                </tr>
            </thead>
            <tbody>${itemsList}</tbody>
            </table>

            <div style="text-align:right;margin-top:16px;padding-top:16px;border-top:2px solid #4a5568;">
            <p style="font-size:22px;font-weight:bold;color:#818cf8;">Total : $${Number(total).toFixed(2)}</p>
            </div>

            <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:32px;">
            PCStore — Votre configurateur PC en ligne
            </p>
        </div>
        `
    })
}