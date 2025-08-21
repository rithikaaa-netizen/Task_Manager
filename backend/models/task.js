const mongoose=require('mongoose');
const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true, 'Title is required']
    },
    due_date: {
        type: Date
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    }
},{ timestamps: true});
module.exports=mongoose.model('Task', TaskSchema);