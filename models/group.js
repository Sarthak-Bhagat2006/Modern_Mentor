const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const groupSchema = new Schema(
        {
          groupName: { type: String, required: true },
          members: [{ type: Schema.Types.ObjectId, ref: "User" }],
          Mentors: [{ type: Schema.Types.ObjectId, ref: "User" }],
          description: { type: String },
        },
        { timestamps: true }
      );
      const Group = mongoose.model("Group", groupSchema);

      module.exports = Group;

      const addGroup = async ()=>{
  let group1 = new Group({
    groupName: 'Inovetors',
    members: ['67f4cbff3f90d854e10ff515','67f4cbc7b4f1792a0e42b9bd','67f4cb5e71debaa60d3a4557'],
    Mentors :['67f4cc1e47539592bd49c671'],
    description:"Working on project that helps student to make groups for hackthon",
  });

  
  let res = await group1.save();
 console.log(res);
}

// addGroup();