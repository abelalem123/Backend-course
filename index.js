const { request, response } = require('express');
require('dotenv').config()
const express =require('express')
const Note=require('./models/notes')

const app =express();
const cors = require('cors')
app.use(express.static('build'))
app.use(express.json())
app.use(cors())


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if(error.name==='Validation Error'){
    return response.status(400).json({error:error.message})
  }
  next(error)
}
app.use(errorHandler)

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]
app.get('/',(request,response)=>{
    response.send('<h1>hello worldd</h1>')
})
app.get('/api/notes',(request,response)=>{
   Note.find({}).then((notes)=>{
    response.json(notes)
   })
})

app.get('/api/notes/:id', (request, response,next) => {
   
    Note.findById(request.params.id).then((note)=>{
      if(note){
        
        response.json(note)
      }
      else{
        response.status(404).end()
      }
    }).catch((error)=>next(error))
  })
  app.delete('/api/notes/:id', (request, response,next) => {
    
    Note.findByIdAndRemove(request.params.id).then((result)=>{
      response.status(204).end()
    }).catch((error)=>next(error))
  })
  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })
   
  note.save().then((savedNote)=>{
response.json(savedNote)
  })
  })
  app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
  const {important,content} =request.body
    
  
    Note.findByIdAndUpdate(request.params.id, {content,important}, { new: true ,runValidators:true, context:'true'})
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

const Port=process.env.PORT
app.listen(Port,()=>{
    console.log(`server is running on port ${Port}`);
})