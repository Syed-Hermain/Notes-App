import express from 'express'

import { searchNotes, getNote, createNote, deleteNote } from './database.js'

const app = express()
const PORT = 8080
app.use(express.json())

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.render("index.ejs", {
        numberOfItterations: 50
    })
})

app.get('/notes',  async (req, res) => {
    const searchTerm = req.query.search || '';
    const notes = await searchNotes(searchTerm);
    res.render('notes.ejs', {notes:notes, search: searchTerm})
})


app.get('/notes/new', async (req, res) => {
    res.render('note-form', {note: null});  // ✅ Render here
});


app.get('/notes/:id', async( req, res) => {
    const id = req.params.id
    const [note] = await getNote(id)
    // res.render('note-detail.ejs', {note})
    res.render('note-detail',{note})
})

// Route to handle delete
app.post("/notes/:id/delete", async (req, res, next) => {
    try {
        const id = req.params.id
        await deleteNote(id)
        res.redirect('/notes')
    } catch (err) {
        next(err)
    }
})


app.post("/notes", async( req, res) => {
    const { title, contents} = req.body
    createNote(title, contents)
    res.redirect('/notes')
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('Something broke :/')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

