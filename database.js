import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getNotes() {
    const [rows] = await pool.query("SELECT * FROM notes")
    return rows
}

export async function searchNotes(searchTerm) {
    if (!searchTerm) {
        // If no search term, return all notes
        return getNotes();
    }
    
    const [rows] = await pool.query(`
        SELECT * FROM notes 
        WHERE title LIKE ? OR contents LIKE ?
        ORDER BY created_at DESC
    `, [`%${searchTerm}%`, `%${searchTerm}%`]);
    
    return rows;
}


export async function getNote(id){
    const [rows] = await pool.query(`
        SELECT *
        FROM notes
        where id = ?
        `, [id])
    return rows
}

export async function createNote( title, contents){
    const [result] = await pool.query(`
        INSERT INTO notes (title, contents)
        VALUES (?, ?)
        `, [title, contents])
    const id = result.insertId
    const [note] = await getNote(id)
    return note
}

export async function deleteNote(id){
    await pool.query(`
        DELETE FROM notes 
        WHERE id = ?
    `, [id])
}
// const notes = await getNote(100)
// const result = await createNote('Jhonny', 'There are very big brands for alcoholic beverages')
// console.log(result)