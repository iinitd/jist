import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

let db = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/data.db')
})

export default db