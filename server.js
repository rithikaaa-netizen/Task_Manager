require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const tasksRouter=require('./route/tasks');
const app = express();
const PORT= process.env.PORT || 5000;
app.use(express.json());
app.use('/api/tasks', tasksRouter);
mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
})
.catch(err => console.error('DB connection error : ', err));