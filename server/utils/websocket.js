import url from 'node:url'
import { v4 as uuid4 } from 'uuid'

 let users = new Map()
 let connections = { }

function wsOnConnection(connection,request) {
    const { username } = url.parse(request.url,true).query
    const currentUser = {
        username,
        state: {
            text:"",
        }
    }
    const uuid = uuid4()
    connections[uuid] = connection
    users.set(uuid, currentUser)

    console.log(users.get(uuid));

    connection.send(JSON.stringify({data:"from server"}))
    connection.on('message', message => handleMessage(message, uuid))
    connection.on('close', () => handleClose(uuid))
}

function handleMessage(message, uuid) {
    message = message.toString()
    const user = users.get(uuid)
    const updatedUser = {
        username: user.username,
        state: {
            text:message,
        }
    }
    users.set(uuid, updatedUser)
    console.log([...users.values()])
}

function handleClose(uuid) {
    users.delete(uuid);
}

module.exports = {
    wsOnConnection,
    users,
    connections
}