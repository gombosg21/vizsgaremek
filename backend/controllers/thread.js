const thread = require("../models/thread_model");
const comment = require("../models/comment_model");

exports.getThread() = async (req,res,next) => {
    req.body.threadID = ID
    thread = await thread.findOne(ID)
    const comments = await comment.findAll({where: {thread_ID : thread.ID}})
    res.status(200).json(comments)      
}


exports.CreateThread() = (req,res,next) => {
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

exports.editThread() = async (req,res,next) => {
    const threadName = this.body.thread_name
    const threadDate = this.body.date
    const userID = this.body.user_id
    const threadID = this.body.thread_id
    const threadLocked = this.body.thread_locked

    thread = await thread.findOne(threadID);

    if (thread === null) 
    {
        res.status(404)
        res.send(error.noSuchThread)
    } 
    else 
    {
        thread.name = threadName,
        thread.locked = threadLocked
    }
}

exports.deleteTread() = (req,res,next) => {
    const threadID = this.body.thread_id
    thread.delete(threadID)
    .then(result => {res.send(200)})
    
}