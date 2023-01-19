const thread = require("../models/thread_model");
const comment = require("../models/comment_model")

exports.getThread(ID) = (req,res,next) => {
    thread.find(ID)
    .then( comments => { comment.find(this.thread.ID)
        .then( comments => 
            {
                res.status(200)
                res.json(comment.toJson(comments))
            })
            .catch(err => console.log(err))
    })
}

exports.postCreateThread(target_ID) = (req,res,next) => {
 const parentID = this.body.parent_id   
 const threadName = this.body.thread_name
 const threadDate = this.body.date
 const userID = this.body.user_id

 const Thread = new thread({
    name : threadName,
    date : threadDate,
    user : userID,
 });
 thread.save()
 .then(result => {res.status(200)})  
 .catch(err => console.log(err))
}

exports.postEditThread() = (req,res,next) => {
    const threadName = this.body.thread_name
    const threadDate = this.body.date
    const userID = this.body.user_id
    const threadID = this.body.thread_id
}

exports.postDeleteTread() = (req,res,next) => {
    const threadID = this.body.thread_id
    thread.delete(threadID)
    .then(result => {res.send(200)})
    
}