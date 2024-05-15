import { Router } from "express";
import {
  addBanner,
  adminLogout,
  adminSignin,
  createCoupon,
  deleteBanner,
  deleteCoupon,
  deleteProduct,
  getBanners,
  getCoupons,
  getProduct,
  getUserDetails,
  updateBanner,
  updateCoupon,
  updateProduct,
  uploadProduct,
} from "../controllers/admin.controller.js";
import { bannerImageUpload, imageUpload } from "../utils/fileUpload.js";
import { verifyAdmin } from "../utils/authorisation.js";
const router = Router();

router.post("/signin", adminSignin);

//add new product
router.post("/addProduct/:adminId", verifyAdmin, imageUpload, uploadProduct);

//get all products from database
router.get("/getProducts/:adminId", verifyAdmin, getProduct);

//product update api
router.put(
  "/updateProduct/:adminId/:productId",
  verifyAdmin,
  imageUpload,
  updateProduct
);

//delete product
router.delete("/deleteProduct/:adminId", verifyAdmin, deleteProduct);

///banner management

//add new banner
router.post("/addBanner/:adminId", verifyAdmin, bannerImageUpload, addBanner);

// update banner
router.put(
  "/updateBanner/:adminId/:bannerId",
  verifyAdmin,
  bannerImageUpload,
  updateBanner
);

// list all banners
router.get("/getBanners/:adminId", verifyAdmin, getBanners);

router.delete("/deleteBanner/:adminId", verifyAdmin, deleteBanner);

///fetch user details
router.get("/getUsers/:adminId", verifyAdmin, getUserDetails);

///coupon management
router.get("/getCoupons/:adminId", verifyAdmin, getCoupons);

router.post("/createCoupon/:adminId", verifyAdmin, createCoupon);

router.put("/updateCoupon/:adminId/:couponId", verifyAdmin, updateCoupon);

router.delete("/deleteCoupon/:adminId/:couponId", verifyAdmin, deleteCoupon);


///logout
router.post("/signout/:adminId", verifyAdmin, adminLogout);
export default router;
