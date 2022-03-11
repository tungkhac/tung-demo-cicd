// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require("express");
const router = express.Router();
const controller = require("./controller");
const distributionCourses = require("./distribution-courses");

router.post("/auth", controller.auth);
router.post("/users/search", controller.searchUser);
router.post(
  "/purchase/change_magazine_received_flag",
  controller.changeMagazineReceivedFlag
);
router.post("/products", controller.searchProduct);
router.post("/products/search", controller.searchProduct);
router.post("/products/variants", controller.productVariants);
router.post("/products/detail", controller.getProduct);
router.post(
  "/purchase/get_preferred_delivery_day",
  controller.getPreferredDeliveryDay
);
router.post(
  "/purchase/get_earliest_delivery_day",
  controller.getEarliestDeliveryDay
);
router.post("/purchase/get_periodic_list", controller.getPeriodicList);
router.post("/purchase/get_course_condition", controller.getCourseCondition);
router.post("/purchase/create_order", controller.createOrder);
router.post("/purchase/confirm_order", controller.confirmOrder);
router.post("/regular_courses/detail", controller.getRegularCourse);
router.post("/regular_courses/frequencies", controller.getFrequencies);
router.post("/regular_courses/variants", controller.getVariants);
router.post(
  "/regular_courses/get_product",
  controller.getProductOfRegularCourse
);

router.post("/each_user/course_orders", controller.getRegularCourseList);
router.post("/each_user/course_orders/update", controller.updateRegularCourse);
router.post("/each_user/course_orders/stop", controller.stopRegularCourse);
router.post("/most_priority_reason", controller.getMostPriorityReason);
router.post("/users/detail", controller.getCustomerDetail);
router.post("/course_order/detail", controller.getCourseOrderDetail);
router.post(
  "/course_order/get_preferred_delivery_time_zone_list",
  controller.getPreferredDeliveryTimeZoneList
);
router.post("/distribution_courses/detail", distributionCourses.getDetail);
router.post("/distribution_courses/search", distributionCourses.search);
router.post(
  "/distribution_courses/frequencies",
  distributionCourses.getFrequencies
);

const setProducts = require("./set-products");
router.post("/set-products/groups", setProducts.productGroups);
router.post("/set-products/detail", setProducts.getDetail);
router.post("/set-products/set-quantity", setProducts.setQuantityForVariant);

module.exports = router;
