'use strict'
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from './firebase'

Vue.use(Vuex)

let store = new Vuex.Store({
    state: {
        nowDocument: {},
        documents: [],
        hoverTarget: '',
        renderMode: true,
        allowToggleMode: true,
        dataInitialized: false,
        currentUser: ''
    },
    mutations: {
        setNowDocument(state, value) {
            state.nowDocument = value
        },
        setDocuments(state, value) {
            let dataset = Object.keys(value).map(function(folder) {
                return {
                    folder,
                    files: Object.keys(value[folder]).map(function(file) {
                        return {
                            name: file,
                            context: value[folder][file]
                        }
                    })
                }
            })
            state.documents = dataset
        }
    },
    actions: {
        loadNowDocument(context) {
            let nowDocRef = firebase.db.ref(`${this.state.currentUser}/nowDocument`)
            nowDocRef.on('value', function(nowDoc) {
                context.commit('setNowDocument', nowDoc.val())
            })
        },
        loadDocuments(context) {
            let docRef = firebase.db.ref(`${this.state.currentUser}/documents`)
            docRef.on('value', function(docs) {
                context.commit('setDocuments', docs.val())
            })
        }
    }

})
export default store