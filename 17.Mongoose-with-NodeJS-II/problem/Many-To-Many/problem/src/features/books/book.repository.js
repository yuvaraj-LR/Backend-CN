// Make necessary imports here.
// Don't change the pre-written code.

import mongoose from 'mongoose';
import { bookSchema } from './book.schema.js'
import { reviewSchema } from './review.schema.js';
import { authorSchema } from "./author.schema.js";
import { ObjectId } from 'mongodb';

// creating model from schema.
const booksModel = mongoose.model('Book', bookSchema);

// creating model for review.
const reviewModel = mongoose.model('Review', reviewSchema);

// creating model for author.
const authorModel = mongoose.model("Author", authorSchema);

export default class BookRepository {
    async createBook(bookData) {
        const book = new booksModel(bookData);
        const savedBook = await book.save();
        return savedBook;
    }

    async addReviewToBook(bookId, text, rating) {
        try {
            const reviewData = {
                text,
                rating,
                book: new mongoose.Types.ObjectId(bookId)
            }
            const review = new reviewModel(reviewData);
            const savedReview = await review.save();
    
            const book = await booksModel.findById(bookId);
    
            book.reviews.push(savedReview._id);
    
            await book.save();
    
            return savedReview;
        } catch (error) {
            // console.log(error, "error in addReviewToBook...");
            ret
        }
        

    }

    async getOne(id) {
        const book = await booksModel.findById(id);
        return book;
    }

    async listBooksByGenre(genre) {
        const books = await booksModel.find({ genre });
        return books;
    }

    async updateBookAvailability(bookId, quantity) {

        console.log(bookId);
        const book = await booksModel.findById(bookId);

        // Calculate the new availableCopies value
        const newAvailableCopies = book.availableCopies + quantity;

        // Update the availableCopies field and save the book
        book.availableCopies = newAvailableCopies;

        await book.save();
        return book;
    }

    async deleteBookById(bookId) {
        const deletedBook = await booksModel.findByIdAndRemove(bookId);
        return deletedBook;
    }

    // Complete the following four funtions.
    async createAuthor(authorData) { 
        try {
            let newAuthor = new authorModel(authorData);
            let savedAuthor = await newAuthor.save();
            console.log(savedAuthor, "authorrr....");

            return savedAuthor;
        } catch (error) {
            console.log(error, "error in createAuthor...");
        }
    }

    // async addAuthorToBook(bookId, authorId) {
    //     try {
    //         await booksModel.updateOne(
    //             {_id: new ObjectId(bookId)},
    //             {$push: {authors: new ObjectId(authorId)}}
    //         );

    //         return {
    //             book: await booksModel.findById(bookId),
    //             author: await authorModel.findById(authorId)
    //         }
    //     } catch (error) {
    //         console.log(error, "error in addAuthorToBook...");
    //     }
    //  }

     async addAuthorToBook(bookId, authorId) {
        const book = await booksModel.findById(bookId);
        const author = await authorModel.findById(authorId);

        if (!book || !author) {
            throw new Error('Book or author not found');
        }
        book.authors.push(author._id);
        author.books.push(book._id);

        await book.save();
        await author.save();

        return { book, author };
    }

    async listAuthorsByBook(bookId) {
        try {
            let book = await booksModel.findById(bookId).populate(`authors`);

            if (!book) {
                throw new Error('Book not found');
            }
            return book.authors;
        } catch (error) {
            console.log(error, "error in listAuthorsByBook...");
        }
    }

    async listBooksByAuthor(authorId) { 
        try {
            let author = await authorModel.findById(authorId).populate(`books`);
            console.log(author, "authorRepo...");

            if (!author) {
                throw new Error('Author not found');
            }
            return author.books;
        } catch (error) {
            console.log(error, "error in listBooksByAuthor...");
        }
    }
}