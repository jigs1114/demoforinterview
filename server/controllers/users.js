const knex = require('../mysql_db_schema')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { uploadedImage } = require('../controllers/imageUpload');

const fs = require('fs');

exports.users_all = async (req, res) => {
  knex
    .select('*')
    .from('users')
    .then(userData => {
      res.json({ data: userData })
    })
    .catch(err => {
      res.json({ error: `There was an error retrieving users: ${err}` })
    })
}

exports.users_create = async (req, res) => {
  try {
    const userData = await knex('users').select('*').where({
      email_id: req.body.email_id
    });
    if (userData.length > 0) {
      res.json({ error: `${req.body.email_id} already exists.` });
    } else {
      // console.log(req.body.password);
      let hashedPassword
      if (req.body.password !== undefined) {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
      } else {
        hashedPassword = await bcrypt.hash(`${req.body.first_name}@${req.body.last_name}`, 10);
      }
      console.log(hashedPassword);
      knex('users')
        .insert({
          'idcode': Date.now(),
          'first_name': req.body.first_name,
          'last_name': req.body.last_name,
          'email_id': req.body.email_id,
          'password': hashedPassword,
         
        })
        .then(() => {
          res.json({ data: `user \'${req.body.first_name} ${req.body.last_name}\' by ${req.body.email_id} created.` })
        })
        .catch(err => {
          res.json({ error: `There was an error creating ${req.body.first_name} ${req.body.last_name} user: ${err}` })
        })
    }
  } catch (error) {
    res.json({ error: `There was an error creating the user: ${err}` });
  }

}

exports.users_update = async (req, res) => {
  await knex('users')
    .where('idcode', req.body.idcode)
    .update({
      'first_name': req.body.first_name,
      'last_name': req.body.last_name,
      'email_id': req.body.email_id,
      'password': req.body.password,
    })
    .then(() => {
      res.json({ data: `User ${req.body.idcode} update.` })
    })
    .catch(err => {
      res.json({ error: `There was an error deleting ${req.body.idcode} user: ${err}` })
    })
}

exports.users_delete = async (req, res) => {
  knex('users')
    .where('idcode', req.body.idcode)
    .del()
    .then(() => {
      res.json({ data: `User ${req.body.idcode} deleted.` })
    })
    .catch(err => {
      res.json({ error: `There was an error deleting ${req.body.id} user: ${err}` })
    })
}

exports.users_by_id_code = async (req, res) => {
  // console.log(req.body.idcode);
  knex('users')
    .where('idcode', req.body.idcode)
    .select('*')
    .then(userData => {
      delete userData[0]['password']
      res.json({ data: userData })
    })
    .catch(err => {
      console.log(err);
      res.json({ error: `There was an error deleting ${req.body.idcode} user: ${err}` })
    })
}



exports.  users_login = async (req, res) => {

  // console.log('called login');
  try {
    if (req.body.email_id === "") {
      res.json({ message: 'email is required' })
      return false
    }

    if (req.body.password === "") {
      res.json({ message: 'password is required' })
      return false
    }
    knex('users')
      .where('email_id', req.body.email_id,
      )
      .select('*')
      .then(async userData => {
        if (userData.length > 0) {
          let data = userData[0]
          if (!data.email_id) {
            return res.json({ error: `Authentication failed` })
          }
          const passwordMatch = await bcrypt.compare(req.body.password, data.password);
          if (!passwordMatch) {
            return res.json({ error: `Authentication failed` })
          }

          if (data.status === 0) {
            return res.json({ error: `Account is deactive please contact administrator!` })
          }
          const token = jwt.sign({ idcode: data.idcode, user_role: data.user_role }, 'process.env.jwtSecretKeys', {
            expiresIn: '365d',
          });
          res.json({ data: token })
        }
        else {
          res.json({ error: 'invalid email id and  password!' })
        }
      })
      .catch(err => {
        console.log(err);
        res.json({ error: `There was an error deleting ${req.body.email} user: ${err}` })
      })
  } catch (error) {
    console.log(error);
  }
}

exports.users_change_password = async (req, res) => {
  let hashedPassword = await bcrypt.hash(req.body.password, 10);
  knex('users')
    .where('idcode', req.body.idcode)
    .update({
      'password': hashedPassword
    })
    .then(() => {
      res.json({ data: `Successfully change password!` })
    })
    .catch(err => {
      res.json({ error: `There was an error in changing password: ${err}` })
    })
}

exports.users_reset_password = async (req, res) => {
  let hashedPassword = await bcrypt.hash(req.body.password, 10);
  knex('users')
    .where('idcode', req.body.idcode)
    .update({
      'password': hashedPassword
    })
    .then(() => {
      res.json({ data: `Successfully change password!` })
    })
    .catch(err => {
      res.json({ error: `There was an error in changing password: ${err}` })
    })
}



exports.login_user_data_by_token = async (req, res) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied' });
  }
  const token = authHeader.substring(7);
  try {
      const decoded = jwt.verify(token, 'process.env.jwtSecretKeys');
      // console.log(decoded);
      knex('users')
          .where('idcode', decoded.idcode)
          .select('*')
          .then(userData => {
              if (userData.length > 0) {
                  let uData = userData[0]
                  let isVerify = uData.idcode === decoded.idcode;
                  if (!isVerify) {
                      return res.json({ error: 'Invalid token' });
                  }
                  delete uData.password
                  res.json({ data: uData })
              } else {
                  res.json({ error: 'User not found!' })
              }
          })
          .catch(err => {
              console.log(err);
              res.json({ error: `There was an error deleting ${decoded.idcode} user: ${err}` })
          })


  } catch (error) {
      res.json({ error: 'Invalid token' });
  }
}

