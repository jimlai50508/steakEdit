import firebase from'firebase'
import credential from '../credentials/friebase.js'

firebase.initializeApp(credential)
export default {
    db: firebase.database()
}