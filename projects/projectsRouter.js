const express = require('express');
const db = require('../data/helpers/projectModel');

const router = express.Router();

router.use(express.json());



// ---------------------------- GET ----------------------------- //
router.get('/', (req, res) => {
    db.get()
    .then(project => {
        res.status(200).json(project);
    })
    .catch(error => {
        console.log('error on GET /api/projects', error);
        res.status(500).json({ error: 'The projects information could not be retrieved.' })
    })
});

router.get('/:id', validateProjectId, (req, res) => {
    const id = req.params.id;
    db.get(id) 
    .then(project => {
        res.status(200).json(project);
    })
    .catch(error => {
        console.log('error on GET /api/projects/:id', error);
        res.status(500).json({ error: 'The project information could not be retrieved.' })
    })
});

router.get('/:id/actions', validateProjectId, (req, res) => {
    const id = req.params.id;
    db.getProjectActions(id)
    .then(action => {
        res.status(200).json(action);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: 'The action information could not be retrieved.' })
    })  
});


// -------------------- Custom Middleware ------------------------ //

function validateProjectId(req, res, next) {
    const id = req.params.id;
      db.get(id) 
      .then(project => {
          if (project) {
              req.project = project;
              next();
          } else {
              res.status(404).json({ message: 'invalid project id' })
          }
      })
      .catch(error => {
            console.log('error on GET /api/projects/:id', error);
            res.status(500).json({ error: 'The project information could not be retrieved.' })
        })   
    }
  
function validateProject(req, res, next) {
    const projectData = req.body;
    if (!projectData) {
        res.status(400).json({ error: 'missing user data' })
    } else if (!projectData.name) {
        res.status(400).json({ error: 'missing required name field' })
    } else {
        next();
    }
}
  
function validatePost(req, res, next) {
    const postData = req.body;
    if (!postData) {
        res.status(400).json({ message: 'missing post data' })
    } else if (!postData.text) {
        res.status(400).json({ message: 'missing required text field' })
    } else {
        next();
    }
}


module.exports = router;