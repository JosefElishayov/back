const express= require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { validateHelped, HelpedModel } = require("../models/helpedModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();

router.get("/", async(req,res) => {
  res.json({msg:"Api Work 200"});
})

router.post("/", auth,async(req,res) => {
    let validBody = validateHelped(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let helped = new HelpedModel(req.body);

      let user = await UserModel.findOne({_id:req.tokenData._id})
      helped.user_id = user._id;
      helped.user_name= user.name;
      helped.user_id = req.tokenData._id;
      helped.user_name= req.tokenData.name;

      await helped.save()
     
      res.status(201).json(helped);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  
  router.delete("/:id", authAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await HelpedModel.deleteOne({ _id: id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})
module.exports = router;