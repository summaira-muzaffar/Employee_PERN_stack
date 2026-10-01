import employeeService from "../services/employeeService.js";

const getAllEmployee = async (req, res, next) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        next(error);
    }
};

const getEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.getEmployeeById(id);
        res.json(employee);
    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.deleteEmployee(id);
        res.json({ message: "Employee deleted.", employee });
    } catch (error) {
        next(error);
    }
};

const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.updateEmployee(id, req.body);
        res.json(employee);
    } catch (error) {
        next(error);
    }
};

const createEmployee = async (req, res, next) => {
    try {
        const employee = await employeeService.createEmployee(req.body);
        res.status(201).json(employee);
    } catch (error) {
        next(error);
    }
};

const searchEmployee = async (req, res, next) => {
    try {
        const { q } = req.query;
        const employees = await employeeService.searchEmployees(q);
        res.json(employees);
    } catch (error) {
        next(error);
    }
};

export { getAllEmployee, getEmployee, deleteEmployee, updateEmployee, createEmployee, searchEmployee };