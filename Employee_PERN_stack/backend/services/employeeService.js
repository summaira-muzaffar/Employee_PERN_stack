import employeeModel from "../models/employeeModel.js";

class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const getAllEmployees = async () => {
    return employeeModel.findAll();
};

const getEmployeeById = async (id) => {
    if (!id) {
        throw new ApiError(400, "Missing employee id.");
    }

    const employee = await employeeModel.findById(id);

    if (!employee) {
        throw new ApiError(404, "Employee not found.");
    }

    return employee;
};

const createEmployee = async ({ name, age, role, salary, email }) => {
    if (!name || !role || !age || !salary || !email) {
        throw new ApiError(400, "Missing fields.");
    }

    return employeeModel.create({ name, email, age, role, salary });
};

const updateEmployee = async (id, { name, age, role, salary, email }) => {
    if (!id) {
        throw new ApiError(400, "Missing employee id.");
    }

    const updated = await employeeModel.updateById(id, { name, email, age, role, salary });

    if (!updated) {
        throw new ApiError(404, "Employee not found.");
    }

    return updated;
};

const deleteEmployee = async (id) => {
    if (!id) {
        throw new ApiError(400, "Missing employee id.");
    }

    const deleted = await employeeModel.deleteById(id);

    if (!deleted) {
        throw new ApiError(404, "Employee not found.");
    }

    return deleted;
};

const searchEmployees = async (term) => {
    if (!term || !term.trim()) {
        return employeeModel.findAll();
    }
    return employeeModel.search(term.trim());
};

export default { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, searchEmployees };