const express = require('express');
const db = require('../data/helpers/actionModel');

const router = express.Router();

router.use(express.json());


// ------------------------------- GET ------------------------------- //
router.get("/", (req, res) => {
    db.get()
      .then(action => {
        res.status(200).json(action);
      })
      .catch(error => {
        console.log('error on GET /api/actions', error);
        res.status(500).json({ error: "The action information could not be retrieved." });
      });
});

router.get('/:id', validateActionId, (req, res) => {
    const id = req.params.id;
    db.get(id) 
    .then(action => {
        res.status(200).json(action);
    })
    .catch(error => {
        console.log('error on GET /api/actions/:id', error);
        res.status(500).json({ error: 'The action information could not be retrieved.' })
    })
});


// ---------------------------- DELETE ------------------------------- //
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(removed => {
        if (removed) {
            res.status(200).json({ message: 'action removed successfully', removed })   
        } else {
            res.status(404).json({ message: 'The action with the specified ID does not exist.' })
        }
    })
    .catch(error => {
        console.log('error on DELETE /api/actions/:id', error);
        res.status(500).json({ error: 'The action could not be removed' })
    })
});


// ------------------------------- PUT ------------------------------- //
router.put('/:id', validateActionId, validateAction, (req, res) => {
    const id = req.params.id;
    const actionData = req.body;
    db.update(id, actionData)
    .then(action => {
        res.status(200).json({ message: `action ${id} was updated` });
    })
    .catch(error => {
        console.log('error on PUT /api/actions/:id', error);
        res.status(500).json({ error: 'The action information could not be modified.' })
    })
});



// -------------------- Custom Middleware ------------------------ //
function validateActionId(req, res, next) {
    const id = req.params.id;
      db.get(id) 
      .then(action => {
          if (action) {
              req.action = action;
              next();
          } else {
              res.status(404).json({ message: 'invalid action id' })
          }
      })
      .catch(error => {
            console.log('error on GET /api/actions/:id', error);
            res.status(500).json({ error: 'The action information could not be retrieved.' })
        })
}

function validateAction(req, res, next) {
    const actionData = req.body;
    if (!actionData) {
        res.status(400).json({ message: 'missing action data' })
    } else if (!actionData.description || !actionData.notes) {
        res.status(400).json({ message: 'missing required description and notes field' })
    } else if (actionData.description && actionData.description.length > 128) {
        res.status(400).json({ message: 'exceeded maximum description character limit of 128' })
    } else {
        next();
    }
}


module.exports = router;