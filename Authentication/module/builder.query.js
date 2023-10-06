const db = require('./../config/db.config');
const getAll = async (table, select = '*', filter = '', order = '') => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await db.pool.query(`SELECT ${select} FROM ${table} ${filter} ${order}`, []);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}
const getOne = async (table, id, select = '*', filter = '', order = '') => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await db.pool.query(`SELECT ${select} FROM ${table} WHERE id = ${id} ${filter} ${order}`, []);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}
const insert = async (table, data) => {
    return new Promise(async(resolve, reject) => {
        let stringData = '';
        let stringKey = '';
        let keys = [];
        Object.keys(data).forEach((key, index) => {
            stringKey += `${key} `
            stringData += `'${data[key]}' `
            if (index != Object.keys(data).length - 1) {
                stringKey += `, `;
                stringData += `, `;
            }
            // stringData += `${key} ='${data[key]}' `
        });
        try {
            const result = await db.pool.query(`INSERT INTO ${table} (${stringKey}) VALUES (${stringData})`, []);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}
const update = async (table, id, data) => {
    return new Promise(async(resolve, reject) => {
        let stringData = '';
        Object.keys(data).forEach((key, index) => {
            stringData += `${key} ='${data[key]}' `
            if (index != Object.keys(data).length - 1) {
                stringData += `, `;
            }
        });
        try {
            const result = await db.pool.query(`UPDATE ${table} SET ${stringData} WHERE id = ${id}`, []);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}
const deleteData = async (table, id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await db.pool.query(`DELETE FROM ${table} WHERE id = ${id}`, []);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}
const rawQuery = async (query) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await db.pool.query(query, []);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}
module.exports = {
    getAll,
    getOne,
    insert,
    update,
    deleteData,
    rawQuery
}