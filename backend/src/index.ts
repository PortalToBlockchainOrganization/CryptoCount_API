/**
 * Required External Modules
 */

 

 import * as dotenv from "dotenv";
 import express from "express";
 import cors from "cors";
 import helmet from "helmet";
//  import TezosSet from "./path/TezosSet";
// import { writeFile } from "fs";
// import transformToUnrealized from "./documentInterfaces/stateModels/generate"
// import transformToRealizing from "./documentInterfaces/stateModels/realizing"
// import transformToSave from "./documentInterfaces/stateModels/saved"
// import populateUmbrella from "./documentInterfaces/umbrella/umbrella.statics"
// import {UmbrellaModel} from "./documentInterfaces/umbrella/umbrella.model"
// const testObjectRealize = require("./testObjectRealize.js")
// const testObjectSave = require("./testObjectSave.js")
// const testObjectUpdate = require("./testObjectUpdate.js")
const mongoose = require('mongoose')
const passport = require('passport')
//const keys = require('./config/keys')
const authRoutes = require('./routes/auth-routes')
//const profileRoutes = require('./routes/profile-routes')
//const passportSetup = require('./config/passport-setup')
const cookieSession = require('cookie-session')
const tezosRoutes = require('./routes/tezos-routes')
const historyRoutes = require('./routes/history-routes')
// var Validator = require("./routes/Validator.js");
// var { Session, router } = require("./routes/Session.js");
// const { body, validationResult } = require('express-validator');





import generate from "./documentInterfaces/CycleAndDate";
import umbrella from "./documentInterfaces/umbrella/umbrella.schema";


 
 dotenv.config();



/**
 * App Variables
 */


 if (!process.env.PORT) {
    process.exit(1);
 }
 
 const PORT: number = parseInt(process.env.PORT as string, 10);
 
 const app = express();

/**
 *  App Configuration
 */

//console.log(process.env)

 app.use(helmet());
const options: cors.CorsOptions = {
  origin:
			//process.env.DEV_ENV === "LOCAL"
				 "http://localhost:3000", //?
				//: "https://cryptocount.co",
        credentials: true,methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",};
app.use(cors(options));;


app.use(function (request, response, next) {
	console.log("Handling " + request.path + "/" + request.method);
	//
	response.header("Access-Control-Allow-Origin", "http://localhost:3000");
	response.header("Access-Control-Allow-Credentials");
	response.header("Access-Control-Allow-Headers", "Content-Type, Location");
	response.header("Access-Control-Expose-Headers", "Content-Type, Location");
	response.header("Access-Control-Allow-Methods", "GET, DELETE, PUT");
	response.end()
});




 app.use(express.json());
 mongoose.connect(process.env.dbURI, ()=>{
  console.log('connected to db')
})

app.use(cookieSession({
  maxAge: 1 * 60 *60 *1000,
  keys: [process.env.cookieKey]
}))

//setup view engine
app.set('view engine', 'ejs')

//initialize passport
app.use(passport.initialize())
app.use(passport.session())



// //setup routes
app.use('/auth', authRoutes);

//realized history
//app.use('/profile', profileRoutes);

app.use('/Tezos', tezosRoutes);
app.use('/history', historyRoutes)

// app.get('/cors', (req, res) => {
//   res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.send({ "msg": "This has CORS enabled 🎈" })
//   })

/**
 * Server Activation
//  */

//  app.use(function (req, res, next) {
// 	if (
// 		req.path.includes("auth") ||
// 		req.path === "/Prss/forgotpw" ||
// 		req.method === "GET" ||
// 		req.session ||
// 		(req.method === "POST" &&
// 			(req.path === "/Prss" || req.path === "/auth"))
// 	) {
// 		req.validator = new Validator(req, res);
// 		console.log(req.validator);
// 		next();
// 	} else {
// 		console.log("is this really happening");
// 		res.status(401).end();
// 	}
// });


 app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// console.log(env)
// module.exports = {
    
//   google: {
//       clientID: env.process.CLIENTID,
//       clientSecret: env.CLIENTSECRET
//   },
//   session: {
//       cookieKey: "adsfasdfasdfasdf"
//   },
//   mongodb:{
//       dbURI: env.dbURI
//   }

// }

// console.log(process.env)
// let Enviroment = process.env
// console.log(Enviroment)

// export default Enviroment


// //calls user object and gets set ids 
//  app.get('/', (req, res) => {
//   res.render('home');
// });

// //calls set object
// app.get(`/${setId}`, (req, res) => {
//   res.render('home');
// });


//   //creates db object
//   app.post('/Generate/', async (req, res)=>{

//     console.log("wtf" + req.body.fiat)
    
//     let ts: TezosSet = new TezosSet();

//     let unrealizedModel: any = {}

//     // await ts.init(req.body.fiat,req.body.address, req.body.consensusRole).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), async function(err) {
//     //     if(err) {
//     //       console.log(err);
//     //     } else {
//     //       console.log("JSON saved to " + "test.json");
//     //       //put ts in db by id
//     //       var setId: any
//     //       //how do i get the same instance ?
//     //       let model =  new UmbrellaModel(ts)
//     //       model.save(function(_err,room) {
//     //         setId = room.id
//     //         console.log(room.id);
//     //         model.objectId = setId
//     //         //control the model up 
//     //         unrealizedModel = transformToUnrealized(model)
//     //         res.status(200).send(unrealizedModel)
//     //      });
//     //     }
//     // })});
//     var test = require("../test.js")
//     res.status(200).send(test)
//   })

//  //takes db object and updates it
//   app.post('/Retrieve/', async (req, res)=>{

//     console.log(req.body.setId)
//     var date = new Date();
 

//     //let ts = query object from db by id
//     let obj: any = {}
  
//     UmbrellaModel.findById(req.body.setId, function (err: any, docs: any) {
//       if (err){
//           console.log(err);
//       }else{
//         console.log("what ")
//         obj = docs
//         console.log(docs.walletAddress)

//         //check if last updated within last two days
//         if(!(new Date(obj.lastUpdated) < new Date(date.setDate(date.getDate() - 2)))){
//           //return database version of set

//           console.log('doesnt need update')
//           var setId = docs.id
//           obj.objectId = setId

//           res.status(200).send(obj)
//         }
//         else{
//             //update tha bi
//             console.log('updating')
  
//           //define class framework
//           let ts: TezosSet = new TezosSet();
//           let ts2: TezosSet = new TezosSet();

//           //obj workable, pass in obj to third class 

//           //generate the updated set on first class, generate set with the og params
//           ts.init(obj.fiat, obj.walletAddress, obj.consensusRole).then(async updatedObject => {
//                 //second init method is combineUpdate class combines the classes //method combineUpdate in class, writing after two class passes in 
//                 await ts2.updateProcess(obj, ts)
//                 //UmbrellaModel.schema.methods.setLastUpdated(UmbrellaModel)
//                 UmbrellaModel.findByIdAndUpdate(req.body.setId, ts2, function(err, result){
//                   if(err){
//                       //res.send(err)
//                   }
//                   else{
//                      //console.log(result)
//                   }
//               })
//               res.status(200).send(ts2)

         
//           })

      
        

          
//           // //import db umbrella into new class framework
//           // let updatedUmbrella: any = {}

//           // ts.initUpdate(obj, params).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
//           //   if(err) {
//           //     console.log(err);
//           //   } else {
//           //     console.log("JSON saved to " + "test.json");
//           //     updatedUmbrella = transformToUnrealized(ts)
//           //     res.status(200).send(ts)

//           //     res.status(200).send(ts)
//           //   }
//           //   })});

//             //requery for the set findById and update it


//         }

        
//       }
//     })

//   })

//   //reads db object
//   app.post('/Realize/', (req, res)=>{

//     console.log(req.body.setId, req.body.quantity)

//     //define class framework
//     let ts: TezosSet = new TezosSet();

//     let obj: any = {}

//     //let ts = query object from db by id
//     UmbrellaModel.findById(req.body.setId, function (err, docs) {
//       if (err){
//           console.log(err);
//       }
//       else{
//           //console.log("Result : ", docs);
//           console.log(docs.walletAddress)
//          //import db umbrella into class framework
//           let realizingModel: any = {}
//           //console.log(obj)
//             ts.realizeProcess(req.body.quantity, docs).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
//               if(err) {
//                 console.log(err);
//               } else {
//                 console.log("JSON saved to " + "test.json");
//                 realizingModel = transformToRealizing(ts)
            
//               res.status(200).send(realizingModel)
//               console.log(ts)

//                 //res.status(200).send(ts)
//               }
//           })});
//       }
//   });
//   })

//   //takes db object and modifies it
//   //take user obj and add set id
//   app.post('/Save/', (req, res)=>{

//     //req.objectId, req.quantity
//     console.log(req.body.objectId, req.body.quantity, req.body.userId)

//     //define class framework
//     let ts: TezosSet = new TezosSet();

//     //import db umbrella into class framework
//     let savedModel: any = {}


//     UmbrellaModel.findById(req.body.objectId, function (err: any, docs: any) {
//       if (err){
//           console.log(err);
//       }
//       else{
//         //var realizingModel: any = {}
//         ts.realizeProcess(req.body.quantity, docs).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
//           if(err) {
//             console.log(err);
//           } else {
//             console.log("JSON saved to " + "test.json");
  
//           console.log(ts)

//           }
//         })});
//           ts.saveProcess(ts).then(x => {writeFile("test.json", JSON.stringify(ts, null, 4), function(err) {
//             if(err) {
//               console.log(err);
//             } else {
//               console.log("JSON saved to " + "test.json");
//               savedModel = transformToSave(ts)
//               res.status(200).send(savedModel)
              
//               UmbrellaModel.findByIdAndUpdate(req.body.objectId, ts, function(err, result){
//                         if(err){
//                             //res.send(err)
//                         }
//                         else{
//                             console.log(result)
//                         }
//                     })
//             }
//         })});
//     }
//   })
//   //find user by id 
//   //insert set id


// })

  
  


  // app.get('/Unrealize', (req, res)=>{

  // })

  // app.post('/Delete/', async (req, res)=>{

  
    
  // })

  // app.post('/Register/', async (req, res)=>{



  // })


  // app.post('/SignOut/', async (req, res)=>{

  

  // })


  // app.post('/SignIn/', async (req, res)=>{



  // })

  // app.post('/GetSets/', async (req, res)=>{
  

  // })

  // // app.post('/GetSet/', async (req, res)=>{

  // // })



  // app.post('/forgotPw/', async (req, res)=>{

  

  // })


  // app.post('/changePw/', async (req, res)=>{

  

  // })


