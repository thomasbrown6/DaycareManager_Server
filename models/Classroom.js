const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  daycare: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'daycare',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  students: [
    {
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
    }
  ],
  teachers: [
    {
      firstname: {
        type: String
      },
      lastname: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Classroom = mongoose.model('classroom', ClassroomSchema);
