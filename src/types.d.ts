// adding userId in express typwes globally so that it wont throw type error 
// express wont contain userId field by deafult by doing this we make sure that 
// we added the filed globally 
// here {} breactes show that we are changing it in whole project not only in this project
export{}
declare global {
    namespace Express {
        interface Request {
            userId?: String;
        }
    }
}