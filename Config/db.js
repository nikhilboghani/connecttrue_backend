const mongoose = require('mongoose');
const connectDB=async() =>{
    // const Mongod=await MongoMemoryServer.create();
    // const getUri=Mongod.getUri();
    mongoose.set('strictQuery', true);
    await mongoose.connect(`mongodb+srv://nikhilboghani1234:uLPJs1BhvAPb4OUO@cluster0.unfvnxd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        .then(() => console.log("done..."))
        .catch((err) => console.log(err));
//     mongoose.set('strictQuery', true)
//     const db = await mongoose.connect(`mongodb+srv://nikhilboghani1234:1644412887@cluster0.unfvnxd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
//         // useNewUrlParser: true,
//         // useUnifiedTopology: true,
//     });
//     console.log('Database Connected');
//     return db;
}
// export default connect

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);

//         console.log('Connected to the database');
//     }
//     catch (error) {
//         console.error('Failed to connect to the database:', error);
//     }
// }

module.exports = connectDB;