// // Please don't change the pre-written code
// // Import the necessary modules here
// import {getDB} from "../../config/mongodb.js"

// class BucketListRepository {
//   async addBucketListItem(bucketListItem) {
//     // Write your code here
//     const db = getDB();
//     const collection = db.collection("bucketList");

//     await collection.insertOne(bucketListItem);
//     return bucketListItem;
//   }

//   async findOneBucketListItem(title) {
//     // Write your code here
//     const db = getDB();
//     const collection = db.collection("bucketList");

//     return await collection.findOne({title});
//   }
// }

// export default BucketListRepository;

import { getDB } from "../../config/mongodb.js";

class BucketListRepository {
  async addBucketListItem(bucketListItem) {
    const db = getDB();
    await db.collection("bucketListItems").insertOne(bucketListItem);
    return bucketListItem;
  }

  async findOneBucketListItem(title) {
    const db = getDB();
    const item = await db.collection("bucketListItems").findOne({ title });
    return item;
  }
}

export default BucketListRepository;