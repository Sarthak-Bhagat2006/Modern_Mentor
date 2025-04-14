const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const groupSchema = new Schema(
        {
          groupName: { type: String, required: true },
          groupAdmin: {
            type: Schema.Types.ObjectId, 
            ref: "User"
          },
          members: [{ type: Schema.Types.ObjectId, ref: "User" }],
          Mentors: [{ type: Schema.Types.ObjectId, ref: "User" }],
          description: { type: String },
        },
        
      );
      const Group = mongoose.model("Group", groupSchema);

      module.exports = Group;

      const addGroup = async ()=>{
  let group1 = new Group({
    groupName: 'Inovetors',
    members: ['67fa309bb6752abdcdf35f2e','67fa362883ab780e35bd434e','67fa38ac99be4d7df5de80ee'],
    Mentors :['67fa362883ab780e35bd434e'],
    description:"Working on project that helps student to make groups for hackthon",
  });

  
  let res = await group1.save();
 console.log(res);
}

// addGroup();