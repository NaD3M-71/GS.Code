import nodemailer from 'nodemailer';
// TODO: cambiar mailtrap por otro servicio smtp real
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS} = process.env;

const emailContacto = async (datos)=>{
    const transport = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });
    
    const { email, nombre, consulta } = datos;
    
    // enviar el mail
    await transport.sendMail({
        from: "gscode.com.ar",
        to: email,
        subject: "Consulta Recibida!",
        text: "Se recibio tu consulta correctamente!",
        html: ` <p> Hola ${nombre}, tu consulta fue recibida correctamente, la respuesta a esta será enviada al mail que proporcionaste</p><br>
        <p> Su consulta fue:<br>
        <b> ${consulta} </b>
          </p>
          <br>
          <br>
        <p>Si tu no enviaste esta consulta, puedes ignorar este mensaje, responder este email con "Yo no hice esta consulta" o clickear el siguiente link: ${process.env.BACKEND_URL}:${process.env.PORT ?? 7117}/negar-consulta/ </p>
        `,
      });
};

// recibir consulta en mi Email
const recibirConsulta = async (datos)=>{
    const transport = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });
    
    const {  nombre, email, consulta } = datos;
    
    // enviar el mail
    await transport.sendMail({
        from: "gscode.com.ar",
        to: "scaglioni96@gmail.com",
        subject: "Consulta Recibida!",
        text: "Tenes una nueva consulta",
        html: ` <p> Hola Giuliano, tenes una nueva consulta de parte de' ${nombre} '</p><br>
        <p> Su consulta fue:<br>
        <b> ${consulta} </b>
          </p>
          <br>
          <br>
        <p> Puedes contestarle la consulta por mail a: ${email} </p>
        `,
      });
};

export {
    emailContacto,
    recibirConsulta
}
