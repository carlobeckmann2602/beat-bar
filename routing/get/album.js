const express=require('express')
const router= express.Router()
const albumGetModel = require('../../model/get/album')

router.get("/getidbyname/:name",(req,res)=>{
    albumGetModel.getAlbumIdByName(req.params.name).then(response =>{
        res.status(200)
        res.send(response)
    })
})

router.get("/:id",(req,res)=>{
    albumGetModel.getAlbumById(req.params.id).then(response =>{
        res.status(200)
        res.send(response)
    })
})

module.exports=router