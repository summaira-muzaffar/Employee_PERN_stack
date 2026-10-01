import prisma from "../utils/prismaClient.js";

// Note: the runtime "create table if it doesn't exist" logic (ensureEmployeeTableExists)
// is gone — with Prisma, the table/enum are created once via migrations
// (`npx prisma migrate dev` or `npx prisma db push`), not checked on every request.

const findAll = async () => {
    return prisma.employee_details.findMany({ orderBy: { id: "asc" } });
};

const findById = async (id) => {
    return prisma.employee_details.findUnique({ where: { id: Number(id) } });
};

const create = async ({ name, email, age, role, salary }) => {
    return prisma.employee_details.create({
        data: { name, email, age: Number(age), role, salary },
    });
};

const updateById = async (id, { name, email, age, role, salary }) => {
    try {
        return await prisma.employee_details.update({
            where: { id: Number(id) },
            data: { name, email, age: Number(age), role, salary },
        });
    } catch (error) {
        if (error.code === "P2025") return null; // Prisma's "record not found"
        throw error;
    }
};

const deleteById = async (id) => {
    try {
        return await prisma.employee_details.delete({ where: { id: Number(id) } });
    } catch (error) {
        if (error.code === "P2025") return null;
        throw error;
    }
};

const search = async (term) => {
    return prisma.employee_details.findMany({
        where: {
            OR: [
                { name: { contains: term, mode: "insensitive" } },
                { email: { contains: term, mode: "insensitive" } },
            ],
        },
        orderBy: { id: "asc" },
    });
};

export default { findAll, findById, create, updateById, deleteById, search };