 

require('dotenv').config();

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require ('express');
const app = express();

const mongoose = require ('mongoose');
const MongoStore = require('connect-mongo').default;
const path = require ('path');
const methodOverride = require ('method-override');
const ejsMate = require ('ejs-mate'); 
const Listing = require('./models/listing.js');
        const wrapAsync = require('./utils/wrapAsync.js');
        const ExpressError = require('./utils/ExpressError.js');
        const { render } = require('ejs');
        const {listingSchema, reviewSchema} = require('./schema.js')
        const Review = require ('./models/reviews.js');
        
        const ListingsRouter = require ('./routes/listing.js');
        const reviewsRouter = require('./routes/review.js');    
        const userRouter = require('./routes/user.js'); 
        
        const { error } = require('console');
        const session = require('express-session');
        const flash = require('connect-flash');
        
        const passport = require ('passport');
        const LocalStrategy = require ('passport-local')
        const User = require ('./models/user.js');         
        const { register } = require('module');
        const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
        const dbUrl = process.env.ATLASDB_URL;
        
        
        app.use(express.static(path.join(__dirname, './public')));
        app.set('view engine', 'ejs');
        app.set('views',path.join (__dirname, 'views'))
        app.use(express.urlencoded({extended : true}));
        app.use(methodOverride('_method'));
        app.engine('ejs', ejsMate);
        main()
        .then((res) =>{
            console.log(res);    
        })
        .catch((err) =>{
            console.log(err);    
        })
        
        async function main() {
            await mongoose.connect(dbUrl);
             console.log("Connected to MongoDB Atlas!");
        }
        
        const store = MongoStore.create({
          mongoUrl : dbUrl,
            crypto : {
                secret :  process.env.SECRET,
            },
            touchAfter: 24 * 3600,
        });

        store.on('error', () => {
            console.log('ERROR IN MONGO SESSION STORED', err);
        });

        const sessionOption = {
            store,
            secret : process.env.SECRET,
            resave : false,
            saveUninitialized : true,
            cookie : {
                expire : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                maxAge : 7 * 24 * 60 * 60 * 1000,
                httpOnly : true,           
            }
        }
        
     

        app.use(session(sessionOption));
        app.use(flash());
        
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new LocalStrategy(User.authenticate())) ;
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
        
        app.use((req, res, next) =>{
            res.locals.successMsg = req.flash('success');
            res.locals.errorMsg = req.flash('error');
            res.locals.currUser = req.user;
            next();
        });
        
        app.get('/demoUser',async(req, res) => {
            let faker = new User ({
                email: 'chiragMittal',
                username : 'Chirag Mittal',
            });
            let registeredUser =  await User.register(faker, 'helloWorld');
            res.send(registeredUser);
        });
        
        
        app.use('/listings', ListingsRouter);
        app.use('/listings/:id/reviews', reviewsRouter);
        app.use('/', userRouter);
        
        
        app.all("/*splat", (req, res, next) =>{
            next(new ExpressError(404, 'Page Not Found!'))
        });

        // All errr alert bootsrap
        app.use((err, req, res, next) =>{
                let{statusCode=500, message='Something went wrong!'} = err;
                console.log(err);
                
                res.status(statusCode).render('error.ejs', {message})
            });          


        app.listen(8080, (req, res) =>{
            console.log('request are Listening');    
        });
        
        
 