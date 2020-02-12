const cors=require('cors');
const mysql= require('mysql');
const express =  require('express');
const path= require('path');
const bodyparser =require('body-parser');
const expressMail = require('express-mailer');
const fileupload= require('express-fileupload');


var app= express();
app.use(cors());
app.use(bodyparser.json());
app.use(fileupload());
expressMail.extend(app,{
    from: 'noreply@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
      user: 'yourmail@gmail.com',
      pass: '********'
    }
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var mysqlcon=mysql.createConnection({
    host:'localhost',
    user:'admin',
    password:'admin',
    database:'friend',
    multipleStatements:true
});

mysqlcon.connect((err) => {
    if(!err)
        console.log('DB connection succeded');
    else
        console.log("DB connection failed \n Error : "+ JSON.stringify(err, undefined, 2));
}); 


//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}..`));

//file upload using express-fileupload npm
app.post("/fileupload",(req,res)=>{
    //
    let time=new Date;
    time=time.getFullYear()+"_"+(time.getMonth()+1)+"_"+time.getDate()+"_"+time.getHours()+"_"+time.getMinutes()+"_"+time.getSeconds()+"_"+time.getMilliseconds();
    
    let myfile= req.files.sampleFile;
    tfile="upload/"+Math.floor(Math.random() * 9999)+"_"+time+"_"+myfile.name;
    myfile.mv(tfile, (err)=>{
        if(err){
            res.json(err);
        }
        else{
            mysqlcon.query("INSERT INTO `user` (`image`) VALUES (?)",[tfile],(errr)=>{
                if(errr){
                    res.json(errr);
                }
                else{
                    res.json("success");
                }
            });
            
        }
    })
})

app.post('/mymail',(req,res)=>{
    

    app.mailer.send('email2', {
        to: 'sendmail@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
        subject: 'Test Email', // REQUIRED.
        otherProperty: 'Other Property', // All additional properties are also passed to the template as local variables.,
        data:{fname:'Subhajit',lname:'Majumder',msg:'this is message'}
      }, function (err) {
        if (err) {
          // handle error
          console.log(err);
          res.send('There was an error sending the email');
          return;
        }
        res.send('Email Sent');
      });
})