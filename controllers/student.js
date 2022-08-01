const router = require('express').Router()
const multer = require('multer');
const fs = require('fs')
const bcrypt = require('bcrypt');
const homeDB = require('../models/homedb');
const studentDB = require('../models/studentdb')
const session = require('express-session');
router.use(session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized:false
}))
// INITIATE DATABASE
const HomeDB = new homeDB();
const StudentDB = new studentDB();



//Image upload - multer config
const upload = multer({
    dest: 'public/images/users/',
    limits: {
    fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
    cb(new Error('Please upload an image.'))
    }
    cb( undefined, true)
    }
    })
//------------------------------------------------


router.get('/test', (req,res)=>{
    StudentDB.get_withdrawals(1,(response)=>{
        // console.log(response)
        res.send(response)
    })
    
})



// -----------------DASHBOARD PAGE -----------------
router.get('/dashboard',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    let storedUser = req.session.user

    if(req.session.user){
        let affiliate_code = req.session.user.affiliate_code;
        let user_id = req.session.user.id;
        let image = req.session.user.image;
        StudentDB.get_dashboard(user_id,affiliate_code,(response)=>{
            let counts = req.session.counts = {notification_count:response.response.notification_count, message_count:response.response.message_count}
            
        res.render('students/dashboard' ,{cart, storedUser, dashboard: response.response, counts,image})
        }) 
    }else{
        res.redirect('/')
    }
})


// -----------------MY COURSES PAGE -----------------
router.get('/courses',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.get_paid_courses(user_id,(response)=>{
        let counts = req.session.counts
        console.log('courses response :>> ', response.response);
        res.render('students/mycourses' ,
        {
            cart,
            courses: response.response || [],
            highlight:false, //FOR SETTING BG OF WATCHED LINK AS inACTIVE
            counts
        })
        }) 
    }else{
        res.redirect('/')
    }
})

router.get('/watched',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.get_paid_courses(user_id,(response)=>{
        let counts = req.session.counts
        console.log( 'data',response.response.filter((value)=> value.course_state == 'UNWATCHED'))
        res.render('students/mycourses' ,
            {
                cart, 
                courses: response.response.filter((value)=> value.course_state == 'UNWATCHED') || [],
                highlight:true, //FOR SETTING BG OF WATCHED LINK AS ACTIVE
                counts
            }
        )
        }) 
    }else{
        res.redirect('/')
    }
})

// -----------------MY VIDEO PAGE -----------------
router.get('/video/:course_id', (req,res)=>{
    let course_id = req.params.course_id;
    // console.log('courseId', course_id)
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        StudentDB.get_video(course_id,(response)=>{
            if(response.status){
                let counts = req.session.counts
                console.log('video',counts,cart)
                res.render('students/video', 
                {
                    counts,cart,
                    video:response.response
                })
            }else{
                res.render('students/courses')
            }
        })
    }else{
            res.redirect('/')
        }
    
})


// -----------------WISHLIST PAGE -----------------
router.get('/wishlist',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.get_wishlist(user_id,(response)=>{
            // console.log(response)
        let counts = req.session.counts
        res.render('students/wishlist' ,
            {
                cart,
                courses: response.response || [], 
                counts
            })
        }) 
    }else{
        res.redirect('/')
    }
})
router.get('/add_wishlist/:id',(req,res)=>{
    let course_id = req.params.id; 
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.add_wishlist(user_id,course_id,(response)=>{
            // console.log(response)
        res.redirect('/student/dashboard')
        }) 
    }else{
        res.redirect('/student/login')
    }
})

router.get('/remove_wishlist/:id',(req,res)=>{
    let wishlist_id = req.params.id; 
    if(req.session.user){
        StudentDB.remove_wishlist(wishlist_id,(response)=>{
            // console.log(response)
        res.redirect('/student/wishlist')
        }) 
    }else{
        res.redirect('/student/login')
    }
})


// -----------------CART PAGE -----------------
router.get('/cart', (req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let counts = req.session.counts
        if(cart.length !== 0){ 
            HomeDB.get_courses_by_cartList(cart, (response)=>{ 
                let cartList = [];
                if(response.status === true){
                    cartList = response.response;
                    res.render('students/cart', {user:req.session.user, cartList,counts})
                }else{
                    res.render('students/cart', {user:req.session.user, cartList,counts})
                }
            })
        }else{ 
            res.render('students/cart', {user:req.session.user, cartList:[],counts})
        }
       
    }else{
        res.redirect('/courses')
    }
})



// -----------------REFERRALS PAGE -----------------
router.get('/referrals',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let affiliate_code = req.session.user.affiliate_code
        StudentDB.get_referrals(affiliate_code,(response)=>{
        let counts = req.session.counts
        res.render('students/referrals' ,
            {
                cart,
                affiliate_code,
                balance: response.balance,
                referrals: response.referralList, 
                counts
            })
        }) 
    }else{
        res.redirect('/')
    }
})


// -----------------WITHDRAWALS PAGE -----------------
router.get('/withdrawals',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.get_withdrawals(user_id,(response)=>{
        let counts = req.session.counts
        res.render('students/withdrawals' ,
            {
                cart,
                withdrawals: response.response, 
                counts
            })
        }) 
    }else{
        res.redirect('/')
    }
})


// -----------------MESSAGES PAGE -----------------
router.get('/messages',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.get_messages(user_id,(response)=>{
        let counts = req.session.counts
        res.render('students/messages' ,
            {
                cart,
                messages: response.response, 
                counts
            })
        }) 
    }else{
        res.redirect('/')
    }
})

router.get('/read_message/:id',(req,res)=>{
    let message_id = req.params.id;
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.update_message_read(user_id,message_id,(response)=>{
            if(response.status==true){
                let counter = (parseInt(req.session.counts.message_count)-1)
                req.session.counts = {notification_count:req.session.counts.notification_count, message_count:counter}
            }
        res.redirect('/student/messages')
        }) 
    }else{
        res.redirect('/')
    }
})

router.get('/remove_message/:id',(req,res)=>{
    let message_id = req.params.id;
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.remove_message(user_id,message_id,(response)=>{
            if(response.status==true){
                console.log(response, "messages")
            }
        res.redirect('/student/messages')
        }) 
    }else{
        res.redirect('/')
    }
})

router.get('/add_message',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.get_messages(user_id,(response)=>{
        let counts = req.session.counts
        res.render('students/add_message' ,
            {
                cart,
                messages: response.response, 
                counts
            })
        }) 
    }else{
        res.redirect('/')
    }
})
router.post('/add_message',(req,res)=>{
    let {subject,message} = req.body;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.add_message(user_id,subject,message,(response)=>{
            if(response.status==true){
                console.log(response, "messages")
            }
        res.redirect('/student/messages')
        }) 
    }else{
        res.redirect('/')
    }
})

// -----------------NOTIFICATIONS PAGE -----------------
router.get('/notification',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.get_notification(user_id,(response)=>{
        let counts = req.session.counts
        res.render('students/notification' ,
            {
                cart,
                notification: response.response, 
                counts
            })
        }) 
    }else{
        res.redirect('/')
    }
})

router.get('/read_not/:id',(req,res)=>{
    let not_id = req.params.id;
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        let user_id = req.session.user.id
        StudentDB.update_not_read(user_id,not_id,(response)=>{
            if(response.status==true){
                let counter = (parseInt(req.session.counts.notification_count)-1)
                console.log(counter, 'counter')
                req.session.counts = {message_count:req.session.counts.message_count, notification_count:counter}
                console.log(response, "notification")
            }
        res.redirect('/student/notification')
        }) 
    }else{
        res.redirect('/')
    }
})


// -----------------SUPPORT PAGE -----------------
router.get('/support',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        StudentDB.get_support((response)=>{
        let counts = req.session.counts
        res.render('students/support' ,
            {
                cart,
                support: response.response, 
                counts
            })
        }) 
    }else{
        res.redirect('/')
    }
})



// -----------------SETTINGS PAGE -----------------
router.get('/settings',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    if(req.session.user){
        console.log(req.session.user)
        let email = req.session.user.email;
        HomeDB.get_user(email,(response)=>{
        let counts = req.session.counts
        res.render('students/settings' ,
            {
                cart,
                user: response.response, 
                counts,
                state:null, message:''
            })
        }) 
    }else{
        res.redirect('/')
    }
})

router.post('/upload_image', upload.single('upload'), (req, res)=>{
    let old_image = req.body.old_image || 'none';
    let image_path = req.file.path;
    console.log('uploads :>> ', image_path, 'old image', old_image);
    let user_id = req.session.user.id
    req.session.user.image = image_path;
    try {
        if(old_image !== 'none' ){
            console.log('old_image :>> ', old_image);
            fs.unlink(old_image, (err)=>{
                if (err) {
                    return res.status(500).json({
                        status: false, 
                        message: 'provide valid path to previous image'
                    });
                  } 
                  //just post image
                  StudentDB.update_image(user_id,image_path, (response)=>{
                        res.redirect('/student/settings')
                  }) 
                }) 
            }else{
                //just post image
                StudentDB.update_image(user_id,image_path, (response)=>{
                    res.redirect('/student/settings')
              })
            }
    } catch (error) {
        res.redirect('/student/dashboard')
    }
    
})

router.post('/update_names', (req,res)=>{
    let {firstname,lastname} = req.body;
    let user_id = req.session.user.id;
    StudentDB.update_name(user_id,firstname,lastname,(response)=>{
        if(response.status){
            req.session.user.firstname = firstname;
            req.session.user.lastname = lastname;
            res.redirect('/student/settings')
        }else{
            res.redirect('/student/dashboard')
        }
    })
})

router.post('/update_password', (req,res)=>{
    let {password,npassword,cpassword} = req.body;
 
    let needed_data = {
        user: req.session.user || null,
        cart:req.session.cart|| [],
        counts: req.session.counts
    }

    if(cpassword !== npassword){
        console.log('failed to change')
        return res.render('students/settings', {
            state:true,
             message:'Confirm password must be the same as new password',
             ...needed_data
            })
    }
    let user_id = req.session.user.id; 
    //ENCRYPT PASSWORD
    let hashedPassword = bcrypt.hashSync(String(npassword), 10);
    StudentDB.get_oldPassowrd(user_id,(response)=>{
        if(response.status){
            let oldpassword = response.response[0].password
            console.log('password',oldpassword)
            bcrypt.compare(password, oldpassword).then((result)=>{
                console.log(result,hashedPassword)
                if(result ==true){
                    StudentDB.update_password(user_id,hashedPassword, (response)=>{
                        if(response.status){
                            console.log('success to change' ,npassword,password)
                            console.log(response)
                            res.render('students/settings',{state:false, message:'Password updated successfully', ...needed_data})
                        }else{
                            return res.render('students/settings', {state:true, message:'Try another password', ...needed_data})
                        }
                    })
                }else{
                    return res.render('students/settings', {state:true, message:'Please try again', ...needed_data})
                }
                }).catch((err)=>{ 
                    console.log(err)
                    return res.render('students/settings', {state:true, message:'Please try again', ...needed_data})
                })
        }else{
            return res.render('students/settings', {state:true, message:'Please try again later', ...needed_data})
        }
    })
})

router.get('/delete/:id', (req,res)=>{
    let {id} = req.params;
    StudentDB.delete_account(id,(response)=>{
        if(response.status){
            req.session.user = null;
            console.log(response, req.session)
            res.render('delete_message', {user:req.session.user || null, cart:[], message:response.message})
            // res.redirect('/')
        }else{
            res.redirect('/student/dashboard')
        }
    })
})

// -----------------LOGOUT PAGE -----------------
router.get('/logout',(req,res)=>{
    req.session.user = null;
    res.redirect('/')
})



module.exports = router;