const express = require('express');
const db = require('../data/helpers/projectModel');
const dbAction = require('../data/helpers/actionModel');

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

// ---------------------------- POST ----------------------------- //
router.post('/', validateProject, (req, res) => {
    const projectData = req.body;
        db.insert(projectData)    
        .then(project => {
            res.status(201).json({ success: `project was successfully added`});
        })
        .catch(error => {
            console.log('error on POST /api/projects', error);
            res.status(500).json({ error: 'There was an error while saving the project to the database' })
        })
});

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    const id = req.params.id;
    req.body.project_id = id;
    const actionData = req.body;
        dbAction.insert(actionData)    
        .then(action => {
            res.status(201).json(action);
        })
        .catch(error => {
            console.log('error on POST /api/projects/:id/actions', error);
            res.status(500).json({ error: 'There was an error while saving the action to the database' })
        })
});


// ---------------------------- DELETE ------------------------------- //
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(removed => {
        if (removed) {
            res.status(200).json({ message: 'project removed successfully', removed })   
        } else {
            res.status(404).json({ message: 'The project with the specified ID does not exist.' })
        }
    })
    .catch(error => {
        console.log('error on DELETE /api/projects/:id', error);
        res.status(500).json({ error: 'The project could not be removed' })
    })
});


// ------------------------------- PUT ------------------------------- //
router.put('/:id', validateProjectId, validateProject, (req, res) => {
    const id = req.params.id;
    const projectData = req.body;
    db.update(id, projectData)
    .then(project => {
        res.status(200).json({ message: `project ${id} was updated` });
    })
    .catch(error => {
        console.log('error on PUT /api/projects/:id', error);
        res.status(500).json({ error: 'The project information could not be modified.' })
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
        res.status(400).json({ error: 'missing project data' })
    } else if (!projectData.name || !projectData.description) {
        res.status(400).json({ error: 'missing required name and description field' })
    } else {
        next();
    }
}
  
function validateAction(req, res, next) {
    const actionData = req.body;
    if (!actionData) {
        res.status(400).json({ message: 'missing action data' })
    } else if (!actionData.description || !actionData.notes) {
        res.status(400).json({ message: 'missing required description and notes field' })
    } else {
        next();
    }
}


module.exports = router;