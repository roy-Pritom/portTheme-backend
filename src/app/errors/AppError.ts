
class MyAppError extends Error{
    public statusCode:number
    public errMessage:string
   constructor(statusCode:number,message:string,errMessage:string){
    super(message)
    this.statusCode=statusCode
    this.errMessage=errMessage
   }
}

export default MyAppError;