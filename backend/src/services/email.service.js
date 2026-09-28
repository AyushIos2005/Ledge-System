const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.USERMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify email connection
transporter.verify((error) => {
    if (error) {
        console.log("Error connecting to email server:", error);
    } else {
        console.log("Email server is ready to send messages");
    }
});

// Common email sender
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `Ledger <${process.env.USERMAIL}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent:", info.messageId);

        const previewUrl = nodemailer.getTestMessageUrl(info);

        if (previewUrl) {
            console.log("Preview URL:", previewUrl);
        }

        return info;
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
};


// =====================================================
// REGISTRATION EMAIL
// =====================================================

async function sendRegistrationEmail(userEmail, name) {

    const subject = "Welcome to Ledger";

    const text = `Hello ${name},

Thank you for registering with Ledger.

Your account has been successfully created.

Regards,
Ledger Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="
    margin:0;
    padding:0;
    background:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
">

    <div style="
        max-width:600px;
        margin:40px auto;
        background:#ffffff;
        border-radius:12px;
        overflow:hidden;
        box-shadow:0 4px 15px rgba(0,0,0,0.08);
    ">

        <!-- Header -->
        <div style="
            background:#111827;
            padding:28px;
            text-align:center;
        ">
            <h1 style="
                margin:0;
                color:#ffffff;
                font-size:28px;
            ">
                Ledger
            </h1>

            <p style="
                margin:8px 0 0;
                color:#9ca3af;
                font-size:14px;
            ">
                Smart. Secure. Simple.
            </p>
        </div>


        <!-- Content -->
        <div style="padding:35px;">

            <h2 style="
                margin-top:0;
                color:#111827;
            ">
                Welcome, ${name} 👋
            </h2>

            <p style="
                color:#4b5563;
                font-size:15px;
                line-height:1.7;
            ">
                Thank you for registering with
                <strong style="color:#111827;">Ledger</strong>.
                Your account has been successfully created.
            </p>

            <!-- Success Box -->
            <div style="
                margin:25px 0;
                padding:18px;
                background:#ecfdf5;
                border:1px solid #a7f3d0;
                border-radius:8px;
                text-align:center;
            ">
                <p style="
                    margin:0;
                    color:#047857;
                    font-weight:bold;
                    font-size:15px;
                ">
                    ✓ Account Created Successfully
                </p>
            </div>

            <p style="
                color:#6b7280;
                font-size:14px;
                line-height:1.6;
            ">
                You can now securely manage your transactions
                and keep track of your financial activity using Ledger.
            </p>

        </div>


        <!-- Footer -->
        <div style="
            background:#f9fafb;
            padding:20px;
            text-align:center;
            border-top:1px solid #e5e7eb;
        ">
            <p style="
                margin:0;
                color:#6b7280;
                font-size:12px;
            ">
                © ${new Date().getFullYear()} Ledger. All rights reserved.
            </p>
        </div>

    </div>

</body>
</html>
`;

    await sendEmail(userEmail, subject, text, html);
}


// =====================================================
// SUCCESSFUL TRANSACTION EMAIL
// =====================================================

async function sendTransactionEmail(
    userEmail,
    name,
    amount,
    toAccount
) {

    const subject = "Transaction Successful - Ledger";

    const text = `Hello ${name},

Your transaction was successful.

Amount: ₹${amount}
To Account: ${toAccount}

Thank you for using Ledger.

Ledger Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="
    margin:0;
    padding:0;
    background:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
">

<div style="
    max-width:600px;
    margin:40px auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,0.08);
">

    <!-- Header -->
    <div style="
        background:#111827;
        padding:25px;
        text-align:center;
    ">
        <h1 style="
            margin:0;
            color:#ffffff;
            font-size:26px;
        ">
            Ledger
        </h1>
    </div>


    <!-- Content -->
    <div style="padding:35px;">

        <!-- Success Badge -->
        <div style="
            text-align:center;
            margin-bottom:25px;
        ">

            <div style="
                width:60px;
                height:60px;
                line-height:60px;
                margin:auto;
                border-radius:50%;
                background:#dcfce7;
                color:#16a34a;
                font-size:30px;
                font-weight:bold;
            ">
                ✓
            </div>

            <h2 style="
                color:#111827;
                margin-bottom:5px;
            ">
                Transaction Successful
            </h2>

            <p style="
                color:#6b7280;
                margin-top:0;
                font-size:14px;
            ">
                Your transaction has been completed successfully.
            </p>

        </div>


        <!-- Amount -->
        <div style="
            background:#f9fafb;
            border-radius:10px;
            padding:25px;
            text-align:center;
            margin-bottom:25px;
        ">

            <p style="
                margin:0;
                color:#6b7280;
                font-size:13px;
            ">
                Amount Transferred
            </p>

            <h1 style="
                margin:8px 0 0;
                color:#111827;
                font-size:32px;
            ">
                ₹${amount}
            </h1>

        </div>


        <!-- Transaction Details -->
        <div style="
            border:1px solid #e5e7eb;
            border-radius:10px;
            overflow:hidden;
        ">

            <div style="
                padding:15px 18px;
                border-bottom:1px solid #e5e7eb;
            ">
                <span style="color:#6b7280;font-size:13px;">
                    Account
                </span>

                <span style="
                    float:right;
                    color:#111827;
                    font-weight:bold;
                    font-size:14px;
                ">
                    ${toAccount}
                </span>
            </div>


            <div style="
                padding:15px 18px;
            ">
                <span style="color:#6b7280;font-size:13px;">
                    Status
                </span>

                <span style="
                    float:right;
                    color:#16a34a;
                    font-weight:bold;
                    font-size:14px;
                ">
                    Successful
                </span>
            </div>

        </div>


        <p style="
            color:#6b7280;
            font-size:13px;
            line-height:1.6;
            margin-top:25px;
        ">
            Hello ${name}, your transaction has been successfully
            processed by Ledger.
        </p>

    </div>


    <!-- Footer -->
    <div style="
        background:#f9fafb;
        padding:20px;
        text-align:center;
        border-top:1px solid #e5e7eb;
    ">

        <p style="
            margin:0;
            color:#6b7280;
            font-size:12px;
        ">
            If you did not authorize this transaction,
            please contact support immediately.
        </p>

        <p style="
            margin:10px 0 0;
            color:#9ca3af;
            font-size:11px;
        ">
            © ${new Date().getFullYear()} Ledger
        </p>

    </div>

</div>

</body>
</html>
`;

    await sendEmail(userEmail, subject, text, html);
}


// =====================================================
// FAILED TRANSACTION EMAIL
// =====================================================

async function sendTransactionFailureEmail(
    userEmail,
    name,
    amount,
    toAccount
) {

    const subject = "Transaction Failed - Ledger";

    const text = `Hello ${name},

Unfortunately, your transaction could not be completed.

Amount: ₹${amount}
To Account: ${toAccount}

Please try again later.

Ledger Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="
    margin:0;
    padding:0;
    background:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
">

<div style="
    max-width:600px;
    margin:40px auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,0.08);
">

    <!-- Header -->
    <div style="
        background:#111827;
        padding:25px;
        text-align:center;
    ">
        <h1 style="
            margin:0;
            color:#ffffff;
            font-size:26px;
        ">
            Ledger
        </h1>
    </div>


    <!-- Content -->
    <div style="padding:35px;">

        <!-- Failure -->
        <div style="
            text-align:center;
            margin-bottom:25px;
        ">

            <div style="
                width:60px;
                height:60px;
                line-height:60px;
                margin:auto;
                border-radius:50%;
                background:#fee2e2;
                color:#dc2626;
                font-size:30px;
                font-weight:bold;
            ">
                ×
            </div>

            <h2 style="
                color:#111827;
                margin-bottom:5px;
            ">
                Transaction Failed
            </h2>

            <p style="
                color:#6b7280;
                margin-top:0;
                font-size:14px;
            ">
                We were unable to complete your transaction.
            </p>

        </div>


        <!-- Amount -->
        <div style="
            background:#f9fafb;
            border-radius:10px;
            padding:25px;
            text-align:center;
            margin-bottom:25px;
        ">

            <p style="
                margin:0;
                color:#6b7280;
                font-size:13px;
            ">
                Transaction Amount
            </p>

            <h1 style="
                margin:8px 0 0;
                color:#111827;
                font-size:32px;
            ">
                ₹${amount}
            </h1>

        </div>


        <!-- Transaction Details -->
        <div style="
            border:1px solid #e5e7eb;
            border-radius:10px;
            overflow:hidden;
        ">

            <div style="
                padding:15px 18px;
                border-bottom:1px solid #e5e7eb;
            ">
                <span style="
                    color:#6b7280;
                    font-size:13px;
                ">
                    Account
                </span>

                <span style="
                    float:right;
                    color:#111827;
                    font-weight:bold;
                    font-size:14px;
                ">
                    ${toAccount}
                </span>
            </div>


            <div style="
                padding:15px 18px;
            ">
                <span style="
                    color:#6b7280;
                    font-size:13px;
                ">
                    Status
                </span>

                <span style="
                    float:right;
                    color:#dc2626;
                    font-weight:bold;
                    font-size:14px;
                ">
                    Failed
                </span>
            </div>

        </div>


        <p style="
            color:#6b7280;
            font-size:13px;
            line-height:1.6;
            margin-top:25px;
        ">
            Hello ${name}, your transaction could not be completed.
            No amount should be considered successfully transferred
            unless your account confirms it.
        </p>


        <!-- Warning -->
        <div style="
            margin-top:20px;
            padding:15px;
            background:#fff7ed;
            border:1px solid #fed7aa;
            border-radius:8px;
        ">
            <p style="
                margin:0;
                color:#c2410c;
                font-size:13px;
                line-height:1.5;
            ">
                Please verify your account details and try again later.
            </p>
        </div>

    </div>


    <!-- Footer -->
    <div style="
        background:#f9fafb;
        padding:20px;
        text-align:center;
        border-top:1px solid #e5e7eb;
    ">

        <p style="
            margin:0;
            color:#6b7280;
            font-size:12px;
        ">
            Need help? Contact Ledger Support.
        </p>

        <p style="
            margin:10px 0 0;
            color:#9ca3af;
            font-size:11px;
        ">
            © ${new Date().getFullYear()} Ledger
        </p>

    </div>

</div>

</body>
</html>
`;

    await sendEmail(userEmail, subject, text, html);
};


module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail,
};