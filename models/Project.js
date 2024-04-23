
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    desc: {type: String, required: true},
    branch: {type: String, required: true},
    img: {type: String, required: true},
    blockimg: {type: String, required: true},
    component: {type: String, required: true},
    video: {type: String, required: true},
    price: {type: Number, required: true},
    availableQty: {type: Number, required: true},
   
}, {timestamps: true} );

mongoose.models = {}
export default mongoose.model("Project", ProjectSchema);
//export default mongoose.model.Hospital || mongoose.model("Hospital", HospitalSchema);