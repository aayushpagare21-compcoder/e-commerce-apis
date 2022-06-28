import mongoose from "mongoose";

import { APP_URL } from "../config/index.js";

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    image: {
      //storing images path
      type: String,
      required: true,
      get: (image) => {
        // uploads/imagename
        //Add domain name + server name
        return `${APP_URL}/${image}`;
      },
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

export default mongoose.model("Product", productSchema, "Products");
