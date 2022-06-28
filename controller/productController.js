//import statements
import Product from "../models/products.js";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import JOI from "joi";
import fs from "fs";

//Multer code for uploading file

//Code to Uplaod a file to server
//diskStorage takes an object {destination and filename}
const storage = multer.diskStorage({
  //destination
  destination: (req, file, cb) => cb(null, "uploads/"),
  //to create a unique filename
  filename: (req, file, cb) => {
    //Date at which file was created - a random number generated within 100000
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

//A function to handle Multipart data
const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image"); //5mb size - field name

const productController = {
  async store(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      //If Error then message generates
      if (err) return next(CustomErrorHandler.serverError(err.message));

      //getting the filepath
      const filePath = req.file.path;

      //Validation of request
      const productSchema = JOI.object({
        name: JOI.string().min(3).max(30).required(),
        price: JOI.number().required(),
        size: JOI.string().required(),
      });

      const { error } = productSchema.validate(req.body);

      if (error) {
        //If there is schema validation error the delete the file as well
        //appRoot is a global variable which has root directory path
        //Deleting the file
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          return next(CustomErrorHandler.serverError());
        });

        return next(error);
      }

      //Create a document or product
      let document;
      try {
        document = await Product.create({
          name: req.body.name,
          price: req.body.price,
          size: req.body.size,
          image: filePath,
        });
      } catch (error) {
        return next(error);
      }
      res.status(201).json(document);
    });
  },

  //Updatation
  async update(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) return next(CustomErrorHandler.serverError(err.message));

      let filePath;

      //if wants to update file then get new filepath
      if (req.file) {
        filePath = req.file.path;
      }

      //Validation of request
      const productSchema = JOI.object({
        name: JOI.string().min(3).max(30).required(),
        price: JOI.number().required(),
        size: JOI.string().required(),
        image: JOI.string(),
      });

      const { error } = productSchema.validate(req.body);

      if (error) {
        //If there is a validation error then and file is provided as well
        if (req.file) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            return next(CustomErrorHandler.serverError());
          });
        }
        return next(error);
      }

      //Updating a complete document
      let document;
      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            name: req.body.name,
            price: req.body.price,
            size: req.body.size,
            ...(req.file && { image: filePath }), //Spread Syntax
          },
          { new: true }
        );
      } catch (error) {
        console.log("hello");
        return next(error);
      }

      //Returning new Document
      res.json(document);
    });
  },

  //Delete a Product
  async deleteProduct(req, res, next) {
    //Delete a product
    try {
      const deletedProduct = await Product.findOneAndRemove({
        _id: req.params.id,
      });
      if (!deletedProduct) {
        return next(new Error("Nothing to delete"));
      }

      //getting image's path 
      // ! not understandable
      const imagePath = deletedProduct._doc.image;

      //Deleting the image as well
      fs.unlink(`${appRoot}/${imagePath}`, (err) => {
        if (err) {
          return new Error(CustomErrorHandler.serverError());
        }
      });

      //Sending JSON
      res.json({ message: "deleted" });
    } catch (error) {}
  },

  async getProduct(req, res, next) {
    let documents;

    try {  
      documents = await Product.find().sort({ _id: -1 });

      res.json(documents);
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
  }
}; 

export default productController;
