const nodemailer = require('nodemailer');

const SendEmailPasswordReset = async (event) => {
    const { email, CodeOTP } = JSON.parse(event.body);
    const username = 'fuximusicapp@gmail.com';
    const password = 'tzuh tuui xxeo mnrj';

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
            user: username,
            pass: password,
        },
    });

    var mailOptions = {
        from: username,
        to: email,
        subject: '[Fuxi] - Password Reset Request',
        html: htmlSendCodeResetPassword(CodeOTP),
    };

    await transporter.sendMail(mailOptions);
    return {
        statusCode: 200,
    };
};

const SendEmailSignUp = async (event) => {
    const { email, CodeOTP } = JSON.parse(event.body);
    const username = 'fuximusicapp@gmail.com';
    const password = 'tzuh tuui xxeo mnrj';

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
            user: username,
            pass: password,
        },
    });

    var mailOptions = {
        from: username,
        to: email,
        subject: '[Fuxi] - Registration Code Request',
        html: htmlSendCodeSignUp(CodeOTP),
    };

    await transporter.sendMail(mailOptions);
    return {
        statusCode: 200,
    };
};

const SendEmailLogin = async (event) => {
    const { email, CodeOTP } = JSON.parse(event.body);
    const username = 'fuximusicapp@gmail.com';
    const password = 'tzuh tuui xxeo mnrj';

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        auth: {
            user: username,
            pass: password,
        },
    });

    var mailOptions = {
        from: username,
        to: email,
        subject: '[Fuxi] - Login Code Request',
        html: htmlSendCodeLogin(CodeOTP),
    };

    await transporter.sendMail(mailOptions);
    return {
        statusCode: 200,
    };
};

module.exports = { SendEmailPasswordReset, SendEmailSignUp, SendEmailLogin };

const htmlSendCodeResetPassword = (CodeOTP) => {
    return `   
    <html>
    <head></head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8" leftmargin="0">
        <table
            cellspacing="0"
            border="0"
            cellpadding="0"
            width="100%"
            bgcolor="#f2f3f8"
            style="
                @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
                font-family: 'Open Sans', sans-serif;
            "
        >
            <tr>
                <td>
                    <table
                        style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
                        width="100%"
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                    >
                        <tr>
                            <td style="height: 80px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align: center">
                                <h1
                                    style="
                                        color: #137882;
                                        font-weight: 600;
                                        margin: 0;
                                        font-size: 50px;
                                        font-family: 'Rubik', sans-serif;
                                        letter-spacing: 10px;
                                    "
                                >
                                    FUXI
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table
                                    width="95%"
                                    border="0"
                                    align="center"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="
                                        max-width: 670px;
                                        background: #fff;
                                        border-radius: 3px;
                                        text-align: center;
                                        -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                        -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                        box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                    "
                                >
                                    <tr>
                                        <td style="height: 40px">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0 35px">
                                            <h1
                                                style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Rubik', sans-serif"
                                            >
                                                You have requested to reset your password
                                            </h1>
                                            <span
                                                style="
                                                    display: inline-block;
                                                    vertical-align: middle;
                                                    margin: 29px 0 26px;
                                                    border-bottom: 1px solid #cecece;
                                                    width: 100px;
                                                "
                                            ></span>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0">
                                                We've received a password reset request for your FUXI account. A unique OTP has been generated for
                                                you. To reset your password, please use this OTP
                                            </p>
                                            <p style="color: #455056; font-size: 35px; line-height: 24px; margin: 30px 0; letter-spacing: 10px">
                                                ${CodeOTP}
                                            </p>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0">
                                                The password reset link will expire in 1 hours. If you do not reset your password within this time,
                                                you will need to request another reset. If you did not request a password reset, please report this to
                                                us immediately.
                                            </p>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0; margin-top: 10px">
                                                If you did not request a password reset, please report this to us immediately.
                                            </p>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0; margin-top: 35px">
                                                Thank you for using our service.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height: 40px">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <td style="height: 80px">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>

   `;
};

const htmlSendCodeSignUp = (CodeOTP) => {
    return `
    <html>
    <head></head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8" leftmargin="0">
        <table
            cellspacing="0"
            border="0"
            cellpadding="0"
            width="100%"
            bgcolor="#f2f3f8"
            style="
                @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
                font-family: 'Open Sans', sans-serif;
            "
        >
            <tr>
                <td>
                    <table
                        style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
                        width="100%"
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                    >
                        <tr>
                            <td style="height: 80px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align: center">
                                <h1
                                    style="
                                        color: #137882;
                                        font-weight: 600;
                                        margin: 0;
                                        font-size: 50px;
                                        font-family: 'Rubik', sans-serif;
                                        letter-spacing: 10px;
                                    "
                                >
                                    FUXI
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table
                                    width="95%"
                                    border="0"
                                    align="center"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="
                                        max-width: 670px;
                                        background: #fff;
                                        border-radius: 3px;
                                        text-align: center;
                                        -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                        -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                        box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                    "
                                >
                                    <tr>
                                        <td style="height: 40px">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0 35px">
                                            <h1
                                                style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Rubik', sans-serif"
                                            >
                                                You have requested a code for signing up
                                            </h1>
                                            <span
                                                style="
                                                    display: inline-block;
                                                    vertical-align: middle;
                                                    margin: 29px 0 26px;
                                                    border-bottom: 1px solid #cecece;
                                                    width: 100px;
                                                "
                                            ></span>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0">
                                                We've received a sign-up code request for your FUXI account. A unique OTP has been generated for
                                                you. To complete your sign-up, please use this OTP
                                            </p>
                                            <p style="color: #455056; font-size: 35px; line-height: 24px; margin: 30px 0; letter-spacing: 10px">
                                                ${CodeOTP}
                                            </p>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0">
                                                The sign-up code will expire in 1 hour. If you do not complete your sign-up within this time,
                                                you will need to request another code. If you did not request a sign-up code, please report this to
                                                us immediately.
                                            </p>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0; margin-top: 10px">
                                                If you did not request a sign-up code, please report this to us immediately.
                                            </p>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0; margin-top: 35px">
                                                Thank you for using our service.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height: 40px">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <td style="height: 80px">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
    `;
};

const htmlSendCodeLogin = (CodeOTP) => {
    return `
    <html>
    <head></head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8" leftmargin="0">
        <table
            cellspacing="0"
            border="0"
            cellpadding="0"
            width="100%"
            bgcolor="#f2f3f8"
            style="
                @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
                font-family: 'Open Sans', sans-serif;
            "
        >
            <tr>
                <td>
                    <table
                        style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
                        width="100%"
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                    >
                        <tr>
                            <td style="height: 80px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align: center">
                                <h1
                                    style="
                                        color: #137882;
                                        font-weight: 600;
                                        margin: 0;
                                        font-size: 50px;
                                        font-family: 'Rubik', sans-serif;
                                        letter-spacing: 10px;
                                    "
                                >
                                    FUXI
                                </h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table
                                    width="95%"
                                    border="0"
                                    align="center"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="
                                        max-width: 670px;
                                        background: #fff;
                                        border-radius: 3px;
                                        text-align: center;
                                        -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                        -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                        box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                    "
                                >
                                    <tr>
                                        <td style="height: 40px">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0 35px">
                                            <h1
                                                style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Rubik', sans-serif"
                                            >
                                                You have requested a login code
                                            </h1>
                                            <span
                                                style="
                                                    display: inline-block;
                                                    vertical-align: middle;
                                                    margin: 29px 0 26px;
                                                    border-bottom: 1px solid #cecece;
                                                    width: 100px;
                                                "
                                            ></span>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0">
                                                We've received a login code request for your FUXI account. A unique OTP has been generated for
                                                you. To complete your login, please use this OTP
                                            </p>
                                            <p style="color: #455056; font-size: 35px; line-height: 24px; margin: 30px 0; letter-spacing: 10px">
                                                ${CodeOTP}
                                            </p>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0">
                                                The login code will expire in 1 hour. If you do not complete your login within this time,
                                                you will need to request another code. If you did not request a login code, please report this to
                                                us immediately.
                                            </p>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0; margin-top: 10px">
                                                If you did not request a login code, please report this to us immediately.
                                            </p>
                                            <p style="color: #455056; font-size: 15px; line-height: 24px; margin: 0; margin-top: 35px">
                                                Thank you for using our service.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height: 40px">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr></tr>
                        <tr>
                            <td style="height: 80px">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>
`;
};
