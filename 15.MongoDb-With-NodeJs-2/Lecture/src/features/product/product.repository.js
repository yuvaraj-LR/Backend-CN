import {ObjectId} from 'mongodb';
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository{

    constructor(){
        this.collection = "products";
    }
 
    async add(newProduct){
        try{
            // 1 . Get the db.
            const db = getDB();
            const collection = db.collection(this.collection);
            await collection.insertOne(newProduct);
            return newProduct;
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getAll(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find().toArray();
            console.log(products);
            return products;
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id: new ObjectId(id)});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async filter(minPrice, category){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression={};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            // if(maxPrice){
            //     filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
            // }
            if(category){
                filterExpression = {$or: [{category: {category}}, {filterExpression}]}
            }
            return await collection.find(filterExpression).toArray();
            
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    // This is not a good way to rate product.
    // async rate(userID, productID, rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);

    //         // 1. Find the product using the productID.
    //         let product = await collection.findOne({_id: new ObjectId(productID)});
    //         console.log(product, "product....");

    //         // 2. Find the product has the userID.
    //         let userRating = product?.ratings?.find(r => r.userID == userID);
    //         console.log(userRating, "userRating....");

    //         if(userRating) {
    //             // 3. Update the Rating.
    //             await collection.updateOne({
    //                 _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //             }, {
    //                 $set: {
    //                     "ratings.$.rating": rating
    //                 }
    //             })
    //         } else {
    //             await collection.updateOne({
    //                 _id: new ObjectId(productID)
    //             },{
    //                 $push: {ratings: {userID:new ObjectId(userID), rating}}
    //             })
    //         }
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }

    async rate(userID, productID, rating){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);

            // 1. Remove the rating from the product.
            await collection.updateOne({
                _id: new ObjectId(productID)
            }, {
                $pull: {ratings: {userID: new ObjectId(userID)}}
            });

            // 2. Add the rating to the product.
            await collection.updateOne({
                _id: new ObjectId(productID)
            }, {
                $push: {ratings: {userID: new ObjectId(userID), rating}}
            })
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async averagePrice() {
        try {
            const db = getDB();
            return await db.collection(this.collection).aggregate([
                {
                    $group: {
                        _id: "$category",
                        averagePrice: {$avg: "$price"}
                    }
                }
            ]).toArray();
            
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

}

export default ProductRepository;