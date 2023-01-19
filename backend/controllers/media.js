const media = require("../models/media")

exports.getViewMedia(ID) = (req,res,next) => 
{
   data = media.findByID(ID)
   res.status(200).res.send(data)
}

exports.postUploadMedia() = (req,res,next) => 
{
    this.Data = req.imgData
    this.Date = req.date
    this.User = req.user
    this.visibility = req.visibility
    this.tags = req.tags
    NewMedia = new media({

    })
}

exports.postDeleteMedia(ID)  = (req,res,next) => 
{
    media.deleteByID(ID)
    .then( res.send(200))
}

exports.postEditMedia(ID)  = (req,res,next) => 
{
    media.findByID(ID)
    .then( item => { media(ID) 
        {
            this.Data = req.imgData
            this.Date = req.date
            this.visibility = req.visibility
            this.tags = req.tags
        }
    })
    .then(item => media.save())
    .then(res.send(200))
}