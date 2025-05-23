const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async create(username, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.request()
                .input('username', username)
                .input('password', hashedPassword)
                .query('INSERT INTO Adolfo (username, password) OUTPUT INSERTED.idUser VALUES (@username, @password)');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async findById(idUser) {
        try {
            const result = await pool.request()
                .input('idUser', idUser)
                .query('SELECT idUser, username FROM Adolfo WHERE idUser = @idUser');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByUsername(username) {
        try {
            const result = await pool.request()
                .input('username', username)
                .query('SELECT * FROM Adolfo WHERE username = @username');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(idUser, username, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.request()
                .input('idUser', idUser)
                .input('username', username)
                .input('password', hashedPassword)
                .query('UPDATE Adolfo SET username = @username, password = @password WHERE idUser = @idUser');
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(idUser) {
        try {
            const result = await pool.request()
                .input('idUser', idUser)
                .query('DELETE FROM Adolfo WHERE idUser = @idUser');
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const result = await pool.request()
                .query('SELECT idUser, username FROM Adolfo');
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User; 