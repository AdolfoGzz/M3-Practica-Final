import { db } from '../config/db.js';
import bcrypt from 'bcryptjs';

class User {
    static async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.request()
            .input('username', username)
            .input('password', hashedPassword)
            .query('INSERT INTO Adolfo (username, password) OUTPUT INSERTED.idUser VALUES (@username, @password)');
        return result.recordset[0];
    }

    static async findById(idUser) {
        const result = await db.request()
            .input('idUser', idUser)
            .query('SELECT idUser, username FROM Adolfo WHERE idUser = @idUser');
        return result.recordset[0];
    }

    static async findByUsername(username) {
        const result = await db.request()
            .input('username', username)
            .query('SELECT * FROM Adolfo WHERE username = @username');
        return result.recordset[0];
    }

    static async update(idUser, username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.request()
            .input('idUser', idUser)
            .input('username', username)
            .input('password', hashedPassword)
            .query('UPDATE Adolfo SET username = @username, password = @password WHERE idUser = @idUser');
        return result.rowsAffected[0] > 0;
    }

    static async delete(idUser) {
        const result = await db.request()
            .input('idUser', idUser)
            .query('DELETE FROM Adolfo WHERE idUser = @idUser');
        return result.rowsAffected[0] > 0;
    }

    static async getAll() {
        const result = await db.request()
            .query('SELECT idUser, username FROM Adolfo');
        return result.recordset;
    }

    static async deleteAll() {
        const result = await db.request()
            .query('DELETE FROM Adolfo');
        return result.rowsAffected[0] > 0;
    }
}

export default User; 