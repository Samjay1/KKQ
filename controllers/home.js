const router = require('express').Router()
const DB = require('../models/homedb');
const bcrypt = require('bcrypt');
const random = require('random');
require('dotenv').config();

const session = require('express-session');
router.use(session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized:false
}))

// INITIATE DATABASE
const HomeDB = new DB();


// -----------------HOME PAGE -----------------
router.get('/', (req,res)=>{

    // USE TOKEN IN SESSION INSTEAD OF USER ID
    console.log('homepage',req.session.user)
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    // TODO: get courses list from db plus session
   try {
    HomeDB.get_courses((response)=>{
        if(req.session.user){
            // console.log('works')
            res.render('index', {user:req.session.user, courses:response.response, cart})
        }else{
            console.log('no user')
            res.render('index', {user:null, courses:response.response, cart})
        }
    })
    
   } catch (error) {
    res.render('index',{ courses:[] ,cart})
   }
    
})


// -----------------COURSES PAGE -----------------

router.get('/courses', (req,res)=>{
    let level = req.query.level||null;
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    try {
        if(level === null || level === "all"){
            console.log('not available')
            HomeDB.get_courses((response)=>{
                if(req.session.user){
                    res.render('courses', {user:req.session.user, courses:response.response,cart})
                }else{
                    res.render('courses', {user:null, courses:response.response,cart})
                }
            })
        }else if(level !== null){
            console.log('level is',level)
            HomeDB.get_courses_by_category(level,(response)=>{
                if(req.session.user){
                    res.render('courses', {user:req.session.user, courses:response.response,cart})
                }else{
                    res.render('courses', {user:null, courses:response.response,cart})
                }
            })
        }
        
       } catch (error) {
        if(req.session.user){
            res.render('courses', {user:req.session.user, courses:response.response,cart})
        }else{
            res.render('courses', {user:null, courses:response.response,cart})
        }
       }
})



// -----------------CART PAGE -----------------
router.get('/cart', (req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    console.log(cart, 'cart page')
    
    if(req.session.user){
        if(cart.length !== 0){ 
            HomeDB.get_courses_by_cartList(cart, (response)=>{ 
                let cartList = [];
                if(response.status === true){
                    cartList = response.response;
                    res.render('home_cart', {user:req.session.user, cartList})
                }else{
                    res.render('home_cart', {user:req.session.user, cartList})
                }
            })
        }else{ 
            res.render('home_cart', {user:req.session.user, cartList:[]})
        }
       
    }else{
        if(cart.length !== 0){ 
            HomeDB.get_courses_by_cartList(cart, (response)=>{
                let cartList = [];
                if(response.status === true){
                    cartList = response.response;
                    res.render('home_cart', {user:null, cartList})
                }else{
                    res.render('home_cart', {user:null, cartList})
                }
            })
        }else{
            res.render('home_cart', {user:null, cartList:[]})
        }
    }
})

router.get('/add_cart/:id', (req,res)=>{
    let course_id = req.params.id;

    // ADDING COURSES TO CART
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    cart = cart.filter((value)=> course_id!=value)
    cart.push(course_id)
    req.session.cart = cart;

    res.redirect('/cart')
})


router.get('/remove_cart/:id', (req,res)=>{
    let course_id = req.params.id;

    // ADDING COURSES TO CART
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    req.session.cart = cart.filter((value)=> value!=course_id)

    res.redirect('/cart')
})

// -----------------PAYMENT -----------------
router.get('/payment', (req,res)=>{
    res.render('payment')
})



// -----------------SEARCH PAGE -----------------
router.post('/search', (req,res)=>{
    let value = req.body.value;
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    console.log(value)
    try {
        if(value !== ''){
            HomeDB.find_course(value,(response)=>{
                if(req.session.user){
                    res.render('search', {user:req.session.user, courses:response.response,cart})
                }else{
                    res.render('search', {user:null, courses:response.response,cart})
                }
            })
        }else{
            res.redirect('courses')
        }
    } catch (error) {
        if(req.session.user){
            res.render('search', {user:req.session.user, courses:response.response,cart})
        }else{
            res.render('search', {user:null, courses:response.response,cart})
        }
    }
})



// -----------------CONTACT -----------------
router.post('/contact', (req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    try {
        HomeDB.add_contact(name,email,message,(response)=>{
            if(response.status=true){
                res.render('success', {user:req.session.user || null, cart, message:response.message})
            }else{
                res.render('failed', {user:req.session.user || null, cart, message:response.message})
            }
        })
    } catch (error) {
        res.render('failed', {user:req.session.user || null, cart,message:'Oops please try again later.'})
    }
})

router.get('/success',(req,res)=>{
    let cart = req.session.cart == undefined ? [] : req.session.cart;
    res.render('failed', {user:req.session.user || null, cart})
})


// -----------------SUBSCRIBE -----------------
router.post('/subscribe', (req,res)=>{
    let email = req.body.email;
    let cart = req.session.cart == undefined ? [] : req.session.cart;

    try {
        HomeDB.add_subscriber(email,(response)=>{
            if(response.status=true){
                res.render('success', {user:req.session.user || null, cart, message:response.message})
            }else{
                res.render('failed', {user:req.session.user || null, cart,message:response.message})
            }
        })
    } catch (error) {
        res.render('failed', {user:req.session.user || null, cart, message:'Oops please try again.'})
    }
})



// -----------------REGISTER PAGE -----------------
router.get('/student/register', (req,res)=>{
    req.session.user = null;
    res.render('students/register',{message:false,info:''})
})
router.post('/student/register', (req,res)=>{
    let {firstname,lastname,email,country,city,password,cpassword,referral_code} = req.body;
    console.log(password,cpassword)
     //ENCRYPT PASSWORD
     let hashedPassword = bcrypt.hashSync(String(password), 10);
     //NEW TOKEN GENERATED
     let token = random.int(1000,10000);
     //NEW AFFILIATE CODE GENERATED
     let affiliate_code = 'KKQ'+random.int(1000,10000);
     if(password !==cpassword ){
        return res.render('students/register', {message:true,info:'Password must be the same'})
    }
    try {
       HomeDB.register(firstname,lastname,email,country,city,hashedPassword,referral_code,affiliate_code,token, (response)=>{
            if(response.status===true){
                res.render('students/login',{message:true,info:''})
            }else{
                res.render('students/register',{message:true,info:'Please try another email'})
            }
       })
    } catch (error) {
        res.render('students/register',{message:true,info:'Please try another time.'})
    }

})


// -----------------LOGIN PAGE -----------------
router.get('/student/login', (req,res)=>{
    req.session.user = null;
    res.render('students/login', {message:null,info:''})
})
router.post('/student/login', async (req, res)=>{
    let {email,password} = req.body;

    //CHECK FOR EMPTY PARAMETERS
    if(!email || !password){
        res.render('students/login', {message:false,info:'Password incorrect'})
    }
    HomeDB.get_user(email, (response)=>{
        if(response.status==true){
            bcrypt.compare(password, response.response.password).then((result)=>{
            if(result ==true){
                // SAVE USER DATE IN SESSION
                req.session.user = {
                    id:response.response.id,
                     token:response.response.token, 
                     affiliate_code:response.response.affiliate_code,
                     firstname:response.response.firstname,  
                     lastname:response.response.lastname, 
                     email:response.response.email,
                     image:response.response.image
                    }
                return res.redirect('/')
            }else{
                res.render('students/login', {message:false,info:'Password incorrect'})
                // res.status(404).send({
                //     status: false,
                //     message: 'password incorrect!', 
                // })
            }
            }).catch((err)=>{
                res.render('students/login', {message:false,info:'Please try again'})
            //    throw err;
            //     res.status(500).send({
            //     status: false, 
            //     message: 'password error!',
            //     other:response.message, 
            // })
            return;
            })
        }
        else{
            res.render('students/login', {message:false,info:'Please register!'})
            // res.render('Lo', {user:req.session.user || null, cart:[], message:response.message})
            
        } 
        });
     
});




router.get('/text',(req,res)=>{
    HomeDB.get_courses_by_cartList([2,1,3], (response)=>{
        console.log(response)
    })
    res.send('works')
})

module.exports = router;