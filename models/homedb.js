const database = require('./database')

 //DATE AND TIME
 const oldDate = new Date();
 let date = oldDate.toISOString().split('T')[0];
 let time  = oldDate.toLocaleTimeString(); 

class homedb {
    constructor(){
        global.db = database;
    }

   

    // #  DATABASE MODELS FOR KIZOMBA MAIN WEBSITE
    // #
    // #
    // ------------------- REGISTER SECTION-------------------
    register(firstname,lastname,email,country,city,password,referral_code,affiliate_code,token,callback){
        let query = 'INSERT INTO users (firstname,lastname,email,country,city,password,referral_code,affiliate_code,token,date,time) VALUES (?,?,?,?,?,?,?,?,?,?,?);'
        db.query(query,[firstname,lastname,email,country,city,password,referral_code,affiliate_code,token,date,time], (error,response)=>{
            if(error){
                // throw error;
                return callback({
                    status:false,
                    message:'Tecnhical issue'
                })
            }
            else if (response.length == 0) {
                return callback({
                  status: false,
                  message: "Failed, Please try again.(Check email)",
                });
              } 
            else{
                return callback({
                    status:true,
                    message:"You've registered successfully."
                })
            }
        })
    }
    // ------------------- END REGISTER SECTION-------------------
    // #  
    // #
    // #
    // ------------------- LOGIN SECTION-------------------
    get_user(email, callback) {
        let query = "SELECT * FROM users WHERE email=? AND status='ACTIVE'";
        db.query(query,[email], (err, response) => {
            if (err) {
                // throw err;
                return callback({
                    status:false,
                    message:'Tecnhical issue'
                })
            }
            if (response.length == 0) {
                return callback({
                    status: false,
                    message: "Don't have an account!",
                });
            } else {
                return callback({
                    status: true,
                    message: "Login successful",
                    response: response[0],
                });
            }
        });
      }
    
    // ------------------- END LOGIN SECTION-------------------
    // #  
    // #
    // #
    // ------------------- CONTACT SECTION-------------------
    add_contact(name,email,message,callback){
        let query = 'INSERT INTO contacts (name,email,message,date,time) VALUES (?,?,?,?,?);'
        db.query(query,[name,email,message,date,time], (error,response)=>{
            if(error){
                // throw error;
                return callback({
                    status:false,
                    message:'Tecnhical issue'
                })
            }
            else if (response.length == 0) {
                return callback({
                  status: false,
                  message: "Failed, Please try again.",
                });
              } 
            else{
                return callback({
                    status:true,
                    message:"You've sent us a message successfully."
                })
            }
        })
    }
    // ------------------- END CONTACT SECTION-------------------
    // #  
    // #
    // #
    // ------------------- SEARCH SECTION-------------------
    find_course(value, callback){
        let query = "SELECT * FROM courses  WHERE title LIKE '%"+value+"%' OR category LIKE '%"+value+"%' OR description LIKE '%"+value+"%';";
        db.query(query,[value], (error, response)=>{
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else{
                return callback({
                    status:true,
                    message:'Search results',
                    response: response
                })
            }
        })
    }
    // ------------------- END SEARCH SECTION-------------------
    // #  
    // #
    // #
    // ------------------- SUBSCRIBER SECTION-------------------
    add_subscriber(email,callback){
        let query = 'INSERT INTO subscribers (email,date,time) VALUES (?,?,?);'
        db.query(query,[email,date,time], (error,response)=>{
            if(error){
                // throw error;
                return callback({
                    status:false,
                    message:'Tecnhical issue'
                })
            }
            else if (response.length == 0) {
                return callback({
                  status: false,
                  message: "Failed to join subscriber list",
                });
              } 
            else{
                return callback({
                    status:true,
                    message:"You've joined our subscriber list successfully."
                })
            }
        })
    }
    // ------------------- END SUBSCRIBER SECTION-------------------
    // #  
    // #
    // #
    // ------------------- COURSES SECTION-------------------
    // ALL COURSES
    get_courses(callback){
        let query = 'SELECT * FROM courses'
        db.query(query, (error, response)=>{
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else{
                return callback({
                    status:true,
                    message:'Courses obtained successfully',
                    response: response
                })
            }
        })
    }
    // COURSES BY CATEGORY
    get_courses_by_category(category,callback){
        let query = 'SELECT * FROM courses  WHERE category=?'
        db.query(query,[category], (error, response)=>{
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else{
                return callback({
                    status:true,
                    message:'Courses obtained successfully',
                    response: response
                })
            }
        })
    }
    // COURSES BY CART LIST
    get_courses_by_cartList(cartList,callback){
        let query = 'SELECT * FROM courses  WHERE id IN (?)'
        db.query(query,[cartList], (error, response)=>{
            if(error){
                throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else{
                return callback({
                    status:true,
                    message:'Courses obtained successfully',
                    response: response
                })
            }
        })
    }
    // ------------------- END COURSES SECTION-------------------
    // #  
    // #
    // #
    // ------------------- BUY COURSE SECTION-------------------
    buy_course(user_id,course_id,title,price,payment_method,contact_info,extras,transaction_id,paid,date,time,callback){
        let query = 'INSERT INTO paid_courses (user_id,course_id,title,price,payment_method,contact_info,extras,transaction_id,paid,date,time,) VALUES (?,?,?,?,?,?,?,?,?,?,?);'
        db.query(query,[user_id,course_id,title,price,payment_method,contact_info,extras,transaction_id,paid,date,time], (error,response)=>{
            if(error){
                // throw error;
                return callback({
                    status:false,
                    message:'Tecnhical issue'
                })
            }
            else if (response.length == 0) {
                return callback({
                  status: false,
                  message: "Failed to receive payment for course",
                });
              } 
            else{
                return callback({
                    status:true,
                    message:"You've successfully paid for courses."
                })
            }
        })
    }
    // ------------------- END BUY COURSE SECTION-------------------
}

module.exports = homedb;