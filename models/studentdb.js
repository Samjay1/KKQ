const database = require('./database')


 //DATE AND TIME
 const oldDate = new Date();
 let date = oldDate.toISOString().split('T')[0];
 let time  = oldDate.toLocaleTimeString(); 

class studentdb {
    constructor(){
        global.db = database;
    }


    // #  DATABASE MODELS FOR KIZOMBA STUDENT DASHBOARD
    // #
    // #
    // ------------------- MY COURSES SECTION-------------------
    // ALL COURSES
    get_paid_courses(user_id,callback){
        let query = 'SELECT course_id,course_state FROM paid_courses WHERE user_id=? ORDER BY course_id ASC'
        db.query(query,[user_id], (error, response)=>{ 
            // console.log(response)
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if(response.length !== 0){
                let ids = response.map((value)=> value.course_id); //GETS ONLY THE IDs OF THE PAID COURSES
                let course_state = response.map((value)=> value.course_state); //GETS ONLY THE COURSE_STATE OF THE PAID COURSES
                this.get_courseList(ids, (response)=>{
                    if(response.status===true){
                        let courseList = response.response.map((value,index)=> { //ADDS THE COURSE_STATE TO THE COURSES RESPONSE ~
                            return {...value,course_state:course_state[index]}  // FROM THE 'course' TABLE 
                        })
                        return callback({
                            status:true,
                            message:'Courses obtained successfully',
                            response: courseList
                        })
                    }else{
                        return callback({
                            status:true,
                            message:'Courses obtained successfully',
                            response: []
                        })
                    }
                })
            }else{
                return callback({
                    status:false,
                    message:'No paid course available'
                })
            }
        })
    }
    get_courseList(ids, callback){
        let query = 'SELECT * FROM courses  WHERE id IN (?)'
        db.query(query,[ids], (error, response)=>{
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if(response.length !== 0){
                return callback({
                    status:true,
                    message:'Courses obtained successfully',
                    response: response
                })
            }else{
                return callback({
                    status:false,
                    message:'This course has expired(Admin Removed)'
                })
            }
        })
    }
    get_video(course_id,callback){
        let query = 'SELECT * FROM courses WHERE id=?'
        db.query(query,[course_id], (error, response)=>{ 
            console.log(response)
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if(response.length !== 0){
                return callback({
                    status:true,
                    message:'Video obtained successfully',
                    response: response[0]
                })
            }else{
                return callback({
                    status:false,
                    message:'No paid video available'
                })
            }
        })
    }

    // ------------------- END MY COURSES SECTION-------------------
    // #  
    // #
    // #
    // ------------------- WISHLIST SECTION-------------------
    get_wishlist(user_id, callback){
        let query = 'SELECT * FROM wishlist  WHERE user_id=?;'
        db.query(query,[user_id], (error, response)=>{
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if(response.length !== 0){
                let wish_ids = response.map((value)=> value.id);
                let ids = response.map((value)=> value.course_id); //GETS ONLY THE IDs OF THE PAID COURSES
                this.get_courseList(ids, (response)=>{
                    if(response.status===true){
                        let courseList = response.response.map((value,index)=> { //ADDS THE COURSE_STATE TO THE COURSES RESPONSE ~
                            return {...value,wish_id:wish_ids[index]}  // FROM THE 'course' TABLE 
                        })
                        return callback({
                            status:true,
                            message:'Wishlist obtained successfully',
                            response: courseList
                        })
                    }else{
                        return callback({
                            status:true,
                            message:'Wishlist obtained successfully',
                            response: []
                        })
                    }
                })
            }else{
                return callback({
                    status:false,
                    message:'Empty Wishlist'
                })
            }
        })
    }
    add_wishlist(user_id,course_id, callback){
        let query = 'INSERT INTO wishlist (user_id,course_id,date,time) VALUES (?,?,?,?)'
        db.query(query,[user_id,course_id,date,time], (error,response)=>{
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if (response.length == 0) {
                return callback({
                  status: false,
                  message: "Failed, Please try again.",
                });
              } 
            else{
                return callback({
                    status:true,
                    message:"Added to wishlist successfully."
                })
            }
        })
    }
    remove_wishlist(wishlist_id, callback){
        let query = 'DELETE FROM wishlist WHERE id=?'
        db.query(query,[wishlist_id], (error,response)=>{
            console.log('response wish:>> ', response);
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if (response.affectedRows == 0) {
                return callback({
                  status: false,
                  message: "Failed, Please try again.",
                });
              } 
            else{
                return callback({
                    status:true,
                    message:"Removed from wishlist successfully."
                })
            }
        })
    }
    // ------------------- END WISHLIST SECTION-------------------
    // #  
    // #
    // #
    // ------------------- REFERRALS SECTION-------------------
    get_referrals(affiliate_code,callback){
        let query = 'SELECT id,firstname,lastname,image,date FROM users  WHERE referral_code=?;'
        db.query(query,[affiliate_code], (error, response)=>{
            // console.log('referrals', response)
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if(response.length !== 0){
                let ids = response.map((value)=>value.id)

                this.get_each_earnings(ids,(result)=>{
                    let referralList = response.map((value,index)=>{ 
                        
                        let Earned = result.response[index] || {earned:0}
                        return {...value, ...Earned}
                    })
                    if(result.status===true){
                        this.get_balance(affiliate_code, (res)=>{
                            if(res.status==true){
                                return callback({
                                    status:true,
                                    message:'Referral list obtained successfully',
                                    balance:res.response,
                                    referralList
                                })
                            }
                        })
                    }else{
                        return callback({
                            status:true,
                            message:result.message,
                        })
                    }
                })
            }else{
                return callback({
                    status:true,
                    message:'Empty Referral list',
                    balance:0,
                    referralList: []
                })
            }
        })
    }
    get_each_earnings(ids,callback){
        let query = 'SELECT earned FROM commissions WHERE user_id IN (?)'
        db.query(query,[ids], (error, response)=>{
            // console.log(response)
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if(response.length !== 0){
                return callback({
                    status:true,
                    message:'Earning list obtained successfully',
                    response: response
                })
            }else{
                return callback({
                    status:false,
                    message:'Empty Earning list'
                })
            }
        })
    }
    // ------------------- END REFERRALS SECTION-------------------
    // #  
    // #
    // #
    // ------------------- EARNINGS & WITHDRAWALS SECTION-------------------
    get_balance(affiliate_code, callback){
        let query = 'SELECT SUM(earned) as earned FROM commissions WHERE referral_code=?'
        db.query(query, [affiliate_code], (error,response)=>{
            if(error){
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }else{
                return callback({
                    status:true,
                    message:'Balance requested',
                    response: response[0]['earned'] || 0
                })

            }
        })
    }

    get_withdrawals(user_id, callback){
        let query = 'SELECT * FROM withdrawal WHERE user_id=?'
        db.query(query, [user_id], (error,response)=>{
            if(error){
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }else{
                return callback({
                    status:true,
                    message:'Withdrawal list requested',
                    response: response
                })

            }
        }) 
    }
    request_withdrawal(user_id,amount_requested,payment_method,phone,account_name,bank_name,bank_branch,account_number, callback){
        let query = 'INSERT INTO withdrawal (user_id,amount_requested,payment_method,phone,account_name,bank_name,bank_branch,account_number,date,time) VALUES (?,?,?,?,?,?,?,?,?,?)'
        db.query(query,[user_id,amount_requested,payment_method,phone,account_name,bank_name,bank_branch,account_number,date,time], (error,response)=>{
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if (response.length == 0) {
                return callback({
                  status: false,
                  message: "Failed, Please try again.",
                });
              } 
            else{
                return callback({
                    status:true,
                    message:"Withdrawal requested successfully."
                })
            }
        })
    }
    // ------------------- END EARNINGS &  WITHDRAWALS SECTION-------------------
    // #  
    // #
    // #
    // ------------------- MESSAGES SECTION-------------------
    get_messages(user_id, callback){
        let query = 'SELECT * FROM messages WHERE user_id=? AND status="ACTIVE" ORDER BY id DESC'
        db.query(query, [user_id], (error,response)=>{
            if(error){
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }else{
                let unread = response.filter((value)=> value.read_state === 'UNREAD')
                return callback({
                    status:true,
                    message:'Messages list requested',
                    unread:unread.length,
                    response: response
                }) 
            }
        }) 
    }
    add_message(user_id,subject,message, callback){
        let query = 'INSERT INTO messages (user_id,subject,message,read_state,date,time) VALUES (?,?,?,?,?,?)'
        db.query(query,[user_id,subject,message,'READ',date,time], (error,response)=>{
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if (response.length == 0) {
                return callback({
                  status: false,
                  message: "Failed, Please try again.",
                });
              } 
            else{
                return callback({
                    status:true,
                    message:"Message sent successfully."
                })
            }
        })
    }
    update_message_read(user_id,message_id,callback){
        let query = 'UPDATE messages SET read_state="READ" WHERE id=? AND user_id=?;'
        db.query(query, [message_id,user_id], (error, response)=>{
            if(error)  {
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }else if (response.changedRows == 0) {
                  return callback({
                      status:false,
                      message: 'Message no change'
                  })
              }else{
                return callback({
                    status:true,
                    message: 'Message read'
                })
              }
          })
    }
    remove_message(user_id,message_id,callback){
        let query = 'UPDATE messages SET status="INACTIVE" WHERE id=? AND user_id=?;'
        db.query(query, [message_id,user_id], (error, response)=>{
            if(error)  {
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }
            else if (response.changedRows == 0) {
                return callback({
                    status:false,
                    message: 'Notification no change'
                })
            }else{
              return callback({
                status:true,
                message: 'Notification read'
            })
            }
          })
    }
    // ------------------- END MESSAGES SECTION-------------------
    // #  
    // #
    // #
    // ------------------- NOTIFICATION SECTION-------------------
    get_notification(user_id, callback){
        let query = 'SELECT * FROM notifications WHERE user_id=? AND status="ACTIVE"'
        db.query(query, [user_id], (error,response)=>{
            if(error){
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }else{
                let unread = response.filter((value)=> value.read_state === 'UNREAD')
                return callback({
                    status:true,
                    message:'Notification list requested', 
                    unread: unread.length,
                    response: response
                })

            }
        }) 
    }
   
    add_notification(user_id,message, callback){
        let query = 'INSERT INTO notifications (user_id,message,date,time) VALUES (?,?,?,?)'
        db.query(query,[user_id,message,date,time], (error,response)=>{
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else if (response.length == 0) {
                return callback({
                  status: false,
                  message: "Failed, Please try again.",
                });
              } 
            else{
                return callback({
                    status:true,
                    message:"Notification sent successfully."
                })
            }
        })
    }
    update_not_read(user_id,not_id,callback){
        let query = 'UPDATE notifications SET read_state="READ" WHERE id=? AND user_id=?;'
        db.query(query, [not_id,user_id], (error, response)=>{
            if(error)  {
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }
            else if (response.changedRows == 0) {
                return callback({
                    status:false,
                    message: 'Notification no change'
                })
            }else{
              return callback({
                status:true,
                message: 'Notification read'
            })
            }
          })
    }
    remove_not(user_id,not_id,callback){
        let query = 'UPDATE notifications SET status="INACTIVE" WHERE id=? AND user_id=?;'
        db.query(query, [not_id,user_id], (error, response)=>{
            if(error)  {
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }
            else if (response.changedRows == 0) {
                return callback({
                    status:false,
                    message: 'Notification no change'
                })
            }else{
              return callback({
                status:true,
                message: 'Notification read'
            })
            }
          })
    }
    // ------------------- END NOTIFICATION SECTION-------------------
    // #  
    // #
    // #
    // ------------------- SUPPORT SECTION-------------------
    get_support(callback){
        let query = 'SELECT * FROM faq'
        db.query(query, (error,response)=>{
            if(error){
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }else{ 
                return callback({
                    status:true,
                    message:'Support list requested', 
                    response: response
                })

            }
        }) 
    }
    // ------------------- END SUPPORT SECTION-------------------
    // #  
    // #
    // #
    // ------------------- SETTINGS SECTION-------------------
    update_image(user_id,image_path,callback){
        let query = 'UPDATE users SET image=? WHERE id=?;'
        db.query(query, [image_path,user_id], (error, response)=>{
            if(error)  {
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
          }
            else if (response.changedRows == 0) {
                return callback({
                  status: true,
                  message: "Already upload this image",
                });
              }
              else{
                  return callback({
                      status:true,
                      message: 'Profile updated successful'
                  })
              }
          })
    }
    update_name(user_id,firstname,lastname,callback){
        let query = 'UPDATE users SET firstname=?, lastname=? WHERE id=?;'
        db.query(query, [firstname,lastname,user_id], (error, response)=>{
            if(error)  {
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
          }
            else if (response.changedRows == 0) {
                return callback({
                  status: true,
                  message: "Already have this profile info",
                });
              }
              else{
                  return callback({
                      status:true,
                      message: 'Profile updated successful'
                  })
              }
          })
    }
    update_password(user_id,password,callback){
        let query = 'UPDATE users SET password=? WHERE id=?;'
        db.query(query, [password,user_id], (error, response)=>{
            if(error)  {
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
             }else{
                  return callback({
                      status:true,
                      message: 'Password updated successful'
                  })
              }
          })
    }
    get_oldPassowrd(user_id,callback){
        let query = 'SELECT password FROM users WHERE id=?'
        db.query(query,[user_id], (error,response)=>{
            if(error){
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }else{ 
                return callback({
                    status:true,
                    message:'Support list requested', 
                    response: response
                })

            }
        }) 
    }
    delete_account(user_id,callback){
        let query = 'UPDATE users SET status="DELETED" WHERE id=?;'
        db.query(query, [user_id], (error, response)=>{
            if(error)  {
                throw error;
                return callback({
                    status:false,
                    message: 'Technical issue'
                })
            }
            else if (response.changedRows == 0) {
                return callback({
                  status: true,
                  message: "Same status",
                });
              }
            else{
                return callback({
                    status:true,
                    message: 'Account deleted successful'
                })
            }
          })
    }
    // ------------------- END SETTINGS SECTION-------------------
    // #  
    // #
    // #
    // -------------------  DASHBOARD SECTION-------------------
    get_dashboard(user_id,affiliate_code,callback){
        let query = 'SELECT course_state FROM paid_courses WHERE user_id=? AND status="ACTIVE"'
        db.query(query,[user_id], (error, response)=>{ 
            // console.log(response)
            if(error){
                // throw error;
                return callback({
                    status: false,
                    message: 'Technical issue'
                })
            }else{
                // let unwatched = response.filter((value)=> value.course_state === 'UNWATCHED')
                let watched = response.filter((value)=> value.course_state === 'WATCHED')
                this.get_referral_totals(affiliate_code, (res)=>{
                    this.get_notification(user_id, (result)=>{
                        this.get_messages(user_id, (resp)=>{
                            return callback({
                                status: true,
                                message: 'Dashboard information requested',
                                response:{
                                    completed: watched.length,
                                    all: response.length,
                                    ...res,
                                    notification_count: result.unread || 0,
                                    message_count: resp.unread || 0
                                }
                            })
                        })
                    })
                })
            }
        })
    }

    get_referral_totals(affiliate_code,callback){
        this.get_referrals(affiliate_code, (response)=>{
            if(response.status===true){
                let balance = response.balance
                let activeRefs = response.referralList.filter((value)=> value.earned !==0)
                return callback({
                    balance,
                    referrals:response.referralList.length,
                    active_referrals:activeRefs.length
                })
            }
        })
    }
    // ------------------- END DASHBOARD SECTION-------------------
    // #  
    // #
    // #
  
}

module.exports = studentdb;