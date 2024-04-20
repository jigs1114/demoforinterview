const options = {
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'posts_db',
  }
}

const knex = require('knex')(options);

knex.schema
  .hasTable('users')
  .then((exists) => {
    if (!exists) {
      return knex.schema.createTable('users', (table) => {
        table.increments('id').primary()
        table.string('idcode').nullable()
        table.string('first_name').nullable()
        table.string('last_name').notNullable()
        table.string('email_id').nullable()
        table.string('password').notNullable()
      })
        .then(async () => {
          console.log('Table \'users\' created')
          // add super admin user
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
    }
  })
  .then(() => {
    console.log('users table exists')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })

knex.schema
  .hasTable('posts')
  .then((exists) => {
    if (!exists) {
      return knex.schema.createTable('posts', (table) => {
        table.increments('id').primary()
        table.string('idcode').nullable()
        table.string('user_id').nullable()
        table.string('images').nullable()
        table.string('description').nullable()
        table.string('createDate').nullable()
        table.string('likes_count').nullable()
        table.string('comments_count').nullable()
        table.boolean('is_liked').nullable()

      })
        .then(() => {
          console.log('Table \'posts\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
    }
  })
  .then(() => {
    console.log('posts table exists')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })

knex.schema
  .hasTable('comments')
  .then((exists) => {
    if (!exists) {
      return knex.schema.createTable('comments', (table) => {
        table.increments('id').primary()
        table.string('idcode').nullable()
        table.string('post_id').nullable()
        table.string('user_id').nullable()
        table.string('message').nullable()
      })
        .then(() => {
          console.log('Table \'comments\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
    }
  })
  .then(() => {
    console.log('comments table exists')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })

knex.schema
  .hasTable('likes_posts')
  .then((exists) => {
    if (!exists) {
      return knex.schema.createTable('likes_posts', (table) => {
        table.increments('id').primary()
        table.string('idcode').nullable()
        table.string('post_id').nullable()
        table.string('user_id').nullable()
      })
        .then(() => {
          console.log('Table \'likes_posts\' created')
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`)
        })
    }
  })
  .then(() => {
    console.log('likes_posts table exists')
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`)
  })


module.exports = knex