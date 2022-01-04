const express = require('express');
const package = require('./package.json');
const users = require('./modules/users.js');
const posts = require('./modules/posts.js');
const messages = require('./modules/messages.js');

let port =2718
const app = express()

const set_content_type = function (req, res, next) 
{
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	next()
}
app.use( set_content_type );
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded( // to support URL-encoded bodies
{  
  extended: true
}));


users.load_users();
posts.load_posts();
messages.load_messages();


//============ROUTING==========
//-------------USERS-----------
const router = express.Router();
router.get('/version', (req, res) => { get_version(req, res )  } );
router.get('/users', (req, res) => { users.list_users(req, res )  } )
router.post('/users', (req, res) => { users.create_user(req, res )  } )
router.put('/user/(:id)', (req, res) => { users.update_user(req, res )  } )
router.get('/user/(:id)', (req, res) => { users.get_user(req, res )  })
router.delete('/user/(:id)', (req, res) => { users.delete_user(req, res )  })
router.post('/user/login', (req, res) => { users.login(req, res )  })
router.put('/user/approve/(:id)', (req, res) => { users.approve_user(req, res )  })
router.put('/user/suspend/(:id)', (req, res) => { users.suspend_user(req, res )  })
router.put('/user/restore/(:id)', (req, res) => { users.restore_user(req, res )  })
router.post('/user/logout', (req, res) => { users.logout(req, res )  })
//router.post('/user', () => { users.load_users()  })

//-------------POSTS-----------
router.get('/posts', (req, res) => { posts.list_posts(req, res )  } )
router.post('/posts', (req, res) => { posts.create_post(req, res )  } )
router.get('/post/(:id)', (req, res) => { posts.get_post(req, res )  })
router.delete('/post/(:id)', (req, res) => { posts.delete_post(req, res )  })
//router.delete('/post', () => { posts.load_posts()  })

//-------------MESSAGES-----------
router.get('/messages', (req, res) => { messages.list_messages(req, res) })
router.post('/messages', (req, res) => { messages.create_message(req, res) })
router.post('/messages', (req, res) => { messages.create_message_for_all(req, res) })
router.get('/messages/(:id)', (req, res) => { messages.get_message(req, res )})
router.get('/messages/(:id)', (req, res) => { messages.get_chat(req, res ) })
//router.delete('/messages', () => { messages.load_messages()})




app.use('/api',router)


// Init 

let msg = `${package.description} listening at port ${port}`
app.listen(port, () => { console.log( msg ) ; });

