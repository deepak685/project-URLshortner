const express=require("express")

const router=express.Router()

const controlller=require("../controller/urlController")

router.post('/shorten',controlller.createUrl)

//router.get( "/:urlCode",controlller.)




module.exports=router