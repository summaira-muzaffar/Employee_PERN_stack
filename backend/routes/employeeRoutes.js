import express from "express"

import { getAllEmployee, getEmployee, deleteEmployee, updateEmployee, createEmployee, searchEmployee } from "../controllers/employeeControllers.js";

const router = express.Router()

router.post("/", createEmployee)
router.get("/search", searchEmployee)
router.get("/", getAllEmployee)
router.put("/:id", updateEmployee)
router.delete("/:id", deleteEmployee)
router.get("/:id", getEmployee)

export default router;