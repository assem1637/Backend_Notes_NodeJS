import nodemailer from 'nodemailer';






const sendResetCode = async (email, name, code) => {


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

        <div style="width: 50%;padding: 40px; border-radius: 10px; margin: auto; background-color: #FFF; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);">
            <h2 style="text-align: center; color:rgb(103, 85, 85) ;">Reset Password</h2>

            <p style="color: #47505e; padding: 15px 0; font-size: 16px; font-weight: 550;">Hello ${name},</p>
            <p style="color: #47505e; padding: 15px 0; font-size: 16px; font-weight: 550;">Someone has requested a code to change your password at Notes App</p>

            <div style="padding: 13px 35px; text-align: center;width: 25%; margin: auto;font-size: 15px; font-weight: bold; border-radius: 20px; outline: none; border: none; color: #FFF; background-color: #E61F5B;">${code}</div>

            <p style="color: #47505e; padding: 15px 0; font-size: 16px; font-weight: 550;">If you didn't request this, please ignore this email.</p>
            <p style="color: #47505e; padding: 15px 0; font-size: 16px; font-weight: 550;">Your password won't change until you use the code above and create a new one.</p>
        </div>

        <p style="color: #47505e; padding: 15px 0; font-size: 16px; font-weight: 550; position: absolute; bottom: 0; left: 50%; transform: translate(-50%,-50%);">© Assem Saeed</p>
    </div>
    
    
    `, // html body
  });


};




export default sendResetCode;