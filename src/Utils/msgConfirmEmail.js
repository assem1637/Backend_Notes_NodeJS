import nodemailer from 'nodemailer';






const sendConfirmEmail = async (email, name, token, protocol, host) => {


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"NotesApp 👻" <${process.env.EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "Confirmation ✔", // Subject line
    text: "Confirm Email", // plain text body
    html: `
    

    <div style="height: 100vh; width: 100%; position: relative; background-color: #F5F6F7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">

        <div style="width: 50%;padding: 20px; border-radius: 10px; margin: auto; background-color: #FFF; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);">
            <h2 style="text-align: center; color:rgb(103, 85, 85) ;">Confirm your email address</h2>

            <p style="color: #47505e; padding: 15px 0; font-size: 16px; font-weight: 550;">Hello ${name}</p>
            <p style="color: #47505e; padding: 15px 0; font-size: 16px; font-weight: 550;">Glad to have you on Notes App</p>
            <p style="color: #47505e; padding: 15px 0; font-size: 16px; font-weight: 550;">Please confirm your email address by clicking the button below:</p>

            <a href="${protocol}://${host}/api/v1/user/emailConfirmation/${token}"><button style="padding: 13px 35px; cursor: pointer;font-size: 15px; font-weight: bold; border-radius: 20px; outline: none; border: none; color: #FFF; background-color: #E61F5B;">Confirm Email</button></a>

            <p style="color: #47505e; padding: 15px 0; font-size: 16px; font-weight: 550;">Once confirmed, you'll be able to log in with your new account.</p>
        </div>

    </div>
    
    
    `, // html body
  });


};




export default sendConfirmEmail;