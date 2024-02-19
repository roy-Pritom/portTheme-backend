import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFoundRoute from './app/middleware/notFoundRoute';

const app:Application=express();


// parser
app.use(express.json());
app.use(cors());

app.use('/',router)

app.get('/',(req:Request,res:Response)=>{
    res.json({
        success:true,
        message:'Hello From Mongodb'
    })
})

app.use(globalErrorHandler);
app.use(notFoundRoute);

export default app;