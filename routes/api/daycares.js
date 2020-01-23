const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Daycare = require('../../models/Daycare');
const Classroom = require('../../models/Classroom');
const User = require('../../models/User');

// @route   GET api/daycares
// @desc    Get all daycares
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const daycares = await Daycare.find().sort({ company: 1 });

    if (!daycares) {
      return res.status(400).json({ msg: 'There are no daycares found' });
    }

    return res.status(200).json(daycares);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/daycares/me
// @desc    Get all users daycares
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const daycares = await Daycare.find({
      user: req.user.id
    })
      .sort({ company: 1 })
      .populate('user', ['name', 'avatar']);

    if (!daycares) {
      return res
        .status(400)
        .json({ msg: 'There are no daycares for this user' });
    }

    return res.status(200).json(daycares);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/daycares/:id
// @desc    Get daycare by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const daycare = await Daycare.findById(req.params.id);
    if (!daycare) {
      return res.status(404).json({ msg: 'daycare not found' });
    }

    return res.status(200).json(daycare);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'daycare not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/daycares
// @desc    Create a daycare
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('company', 'Company name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { company, website, location } = req.body;

      const daycareFields = {};
      daycareFields.user = req.user.id;

      if (company) daycareFields.company = company;
      if (website) daycareFields.website = website;
      if (location) daycareFields.location = location;

      //let daycare = await Daycare.findOne({ })

      const daycare = new Daycare(daycareFields);
      await daycare.save();

      return res.status(200).json(daycare);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/daycares/:daycare_id
// @desc    Delete daycare by id
// @access  Private
router.delete('/:daycare_id', auth, async (req, res) => {
  try {
    const daycare = await Daycare.findById(req.params.daycare_id);

    if (!daycare) {
      return res.status(404).json({ msg: 'Daycare not found' });
    }

    // Check that user deleting the daycare created it
    if (daycare.user.toString() !== req.user.id) {
      return res.status(401).json('User is not authorized to delete daycare');
    }

    await daycare.remove();
    res.status(200).json('Daycare removed');
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Daycare not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // @route   POST api/daycares/classrooms/:id
// // @desc    Add a classroom to daycare
// // @access  Private
// router.put(
//   '/classrooms/:id',
//   [
//     auth,
//     [
//       check('name', 'Have to have a name for classroom ')
//         .not()
//         .isEmpty()
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, description } = req.body;

//     const newClass = {
//       user: req.user.id,
//       daycare: req.params.id,
//       name,
//       description
//     };

//     try {
//       const daycare = await Daycare.findById(req.params.id);

//       if (!daycare) {
//         return res.status(404).json({ msg: 'Daycare not found' });
//       }

//       daycare.classrooms.unshift(newClass);

//       await daycare.save();

//       return res.status(200).json(daycare);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

// // @route   GET /api/daycares/classrooms/:id
// // @desc    Get all classrooms for daycare
// // @access  Private
// router.get('/classrooms/:id', auth, async (req, res) => {
//   try {
//     const daycare = await Daycare.findById(req.params.id);

//     if (!daycare) return res.status(404).json({ msg: 'Daycare not found' });

//     if (!daycare.classrooms || daycare.classrooms.length === 0)
//       return res.status(404).json({ msg: 'no classrooms for daycare' });

//     return res.status(200).json(daycare.classrooms);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// // @route   POST api/daycares/classrooms/students/:daycare_id/class_id
// // @desc    Add a student to classroom
// // @access  Private
// router.put(
//   '/classrooms/students/:daycare_id/:class_id',
//   [
//     auth,
//     [
//       check('firstname', 'Have to have a first name for student')
//         .not()
//         .isEmpty(),
//       check('lastname', 'Have to have a last name for student')
//         .not()
//         .isEmpty(),
//       check('parents', 'Student must have at least one parent')
//         .not()
//         .isEmpty()
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { firstname, lastname, parents } = req.body;

//     const newStudent = {
//       user: req.user.id,
//       daycare: req.params.daycare_id,
//       classroom: req.params.class_id,
//       firstname,
//       lastname,
//       parents
//     };

//     try {
//       let daycare = await Daycare.findById(req.params.daycare_id);

//       if (!daycare) {
//         return res.status(404).json({ msg: 'Daycare not found' });
//       }

//       const classrooms = daycare.classrooms;

//       let classroom = classrooms.find(x => x.id === req.params.class_id);

//       let duplicate = classroom.students.find(
//         x => x.firstname === firstname && x.lastname === lastname
//       );
//       if (duplicate) {
//         return res.status(400).json({ msg: 'Student already exists' });
//       }

//       classroom.students.push(newStudent);

//       const updated = await daycare.save();

//       return res.status(200).json(updated);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

// // @route   GET /api/daycares/classrooms/:id/students/
// // @desc    Get all students for classroom
// // @access  Private
// router.get(
//   '/classrooms/students/:daycare_id/:class_id',
//   auth,
//   async (req, res) => {
//     try {
//       const daycare = await Daycare.findById(req.params.daycare_id);

//       if (!daycare) return res.status(404).json({ msg: 'Daycare not found' });

//       if (!daycare.classrooms || daycare.classrooms.length === 0)
//         return res.status(404).json({ msg: 'no classrooms for daycare' });

//       if (
//         !daycare.classrooms.students ||
//         daycare.classrooms.students.length === 0
//       )
//         return res.status(404).json({ msg: 'no students for daycare' });

//       return res.status(200).json(daycare.classrooms);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );
module.exports = router;
