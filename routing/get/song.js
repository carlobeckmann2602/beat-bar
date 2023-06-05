const express=require('express')
const router=express.Router()
const songModel = require('../../model/get/song')
router.get("/:song_id/:requestedAlgorithm",(req,res)=>{
    songModel.getSongById(req.params.song_id, req.params.requestedAlgorithm).then(response =>{
        res.status(200)
        res.send(response)
    }
    ).catch(error=>{
        res.status(500)
        res.send({error: "internal server error"})
    })
})

module.exports=router;
