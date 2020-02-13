import { Request, Response, NextFunction} from "express";
import * as email_val from '../config/forget_pass_config/email_config';
import { getMaxListeners } from "cluster";
import * as jwt from 'jsonwebtoken';
import app from '../config/server/server';

var nodemailer = require('nodemailer');
require('dotenv').config()

export async function sendEmail(req: Request, res: Response, next: NextFunction): Promise <void> {
    const token: string = jwt.sign({ email: req.body.email }, app.get('secret'), {
        expiresIn: '60s'
    });
    nodemailer.createTestAccount((err: Error, account: Response) => {
        let transporter = nodemailer.createTransport({
            service: 'Gmail', // Gmail Host
            port: 25, // Port
            requireTLS: true,
            secure: true, // this is true as port is 465
            auth: {
                user: 'youremail@gmail.com', //Gmail username
                pass: '********'// Gmail password
            },
            debug: true,
        });
    
        let mailOptions = {
            from: 'youremail@gmail.com' ,
            to: 'sendemail@gmail.com', // Recepient email address. Multiple emails can send separated by commas
            subject: "Hello Sumon", //rohitkanchanshaw95@gmail.com
            html: `<a href = http://localhost:4200/auth/dashboard>Click here for email verify</a>`
        };
     
        transporter.sendMail(mailOptions, (error: Error, info: Response) => {
            if (error) {
                res.json({mess:'Mail not sent'})
                console.log(error);
            }else{
                res.json({mess:'Mail sent'})
                console.log(info);
            }
        });
    });
}
