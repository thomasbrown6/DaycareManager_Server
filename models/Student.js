const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  daycare: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'daycare'
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classroom'
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  parents: [
    {
      name: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = Student = mongoose.model('student', StudentSchema);
