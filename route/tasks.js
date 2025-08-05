const express = require('express');
const Task = require('../models/task');
const router=express.Router();
router.get('/', async (req,res) => {
    const tasks = await Task.find();
    res.json(tasks);
});
router.get('/:id', async (req,res) => {
    try{
        const task= await Task.findById(req.params.id);
        if(!task) res.status(404).json({error: 'Task not found'});
        res.json(task);
    }
    catch(err){
        res.status(400).json({error :'Incalid ID'});
    }
});
router.post('/', async (req,res) => {
    try{
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    }
    catch(err){
        res.status(400).json({error : err.message});
    }
});
router.delete('/:id', async (req,res) => {
    try{
        const task= await Task.findByIdAndDelete(req.params.id);
        if(!task) 
            return res.status(400).json({error : "Task not found"});
        res.json({message : "Task deleted"});
    }
    catch (err){
        res.status(400).json({error : "Invalid ID"});
    }
});
router.put('/:id', async (req,res) =>{
    try{
        const task= await Task.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true});
        if(!task) 
            res.status(404).json({error: 'Task not found'});
        res.status(201).json(task);
    }
    catch(err){
        res.status(400).json({err : err.message});
    }
});
module.exports = router;