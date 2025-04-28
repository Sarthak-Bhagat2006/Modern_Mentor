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
          Mentors: { type: Schema.Types.ObjectId, ref: "User" },
          description: { type: String },

        pendingMembers:[{ type: Schema.Types.ObjectId, ref: "User" }],
        },
        
        
      );
      const Group = mongoose.model("Group", groupSchema);

      module.exports = Group;

      const addGroup = async ()=>{
  let group1 = new Group({
    groupName: 'Inovetors',
    members: ['67fd605bc29788f750317287','67fa2fd7b6752abdcdf35f2a','67fd4ea47126df76e97e608d'],
    Mentors :['67fd79d5d1c7346d93cc49cd'],
    description:"Working on project that helps student to make groups for hackthon",
    admin: '67fa2fd7b6752abdcdf35f2a',
  });

  
  let res = await group1.save();
 console.log(res);
}

// addGroup();