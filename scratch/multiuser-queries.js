'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

mongoose.connect(MONGODB_URI)
  .then(() => {

//*********GET/READ A SINGLE ITEM***********//  
// const id = '111111111111111111111106';
// const userId = '000000000000000000000002';

// return Note.findOne( { _id: id, userId } )
//     // .populate('tags')
    // .then(result => {
    // if (result) {
    //     console.log(result);
    // } else (err => {
    //     console.log(err);
    // })
    // .catch(err => {
    // console.log(err);
    // })

//*********GET/READ ALL NOTES***********//  

// const userId = '000000000000000000000002';
// const searchTerm = "cats";
// const folderId = "222222222222222222222202";
// const tagId = "333333333333333333333302";

// let filter = { };

// if (searchTerm ) {
//     const re = new RegExp(searchTerm, 'i');
//     filter.$or = [{ 'title': re }, { 'content': re }];
// };
// if (folderId) {
//     filter.folderId = folderId
// };
// if (tagId) {
//     filter.tags = tagId
// };
// // if (userId) {
// //     filter.userId = userId
// // };

// return Note.find(filter)
//     // .populate('tags')
//     .sort({ updatedAt: 'desc' })
//     .then(result => {
//         if (result) {
//             console.log(result);
//         } else (err => {
//             console.log(err);
//         })
//         .catch(err => {
//         console.log(err);
//         })

//*********CREATE A NEW ITEM***********//  
// const newNote = {
//     title: "A new note about dogs",
//     content: "...lorem ipsum...",
//     folderId: "222222222222222222222202",
//     tags: ["333333333333333333333302", "333333333333333333333303"],
//     userId: "000000000000000000000001"
// };

// return Note.create(newNote)
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     })

//*********PUT/UPDATE A SINGLE ITEM***********// 
const id = "5c083ef9b360e8d23a35aaff"
const updatedNote = {
    title: "A new ******UPDATED***** about dogs",
    content: "...lorem..**updated**..ipsum...",
    userId: "000000000000000000000001"
};
 
return Note.findByIdAndUpdate(id, updatedNote)
    .then(result => {
      if (result) {
        console.log(result);
      }
    })
    .catch(err => {
      console.log(err);
    }) 
 

.then(() => {
    return mongoose.disconnect();
})
.catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
    })
});