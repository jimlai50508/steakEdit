<template lang='pug'>
#Sidebar
    .topSection
        .btn.newFile.fas.fa-file-medical(@click='startCreateFile')
        .btn.newFolder.fas.fa-folder-plus(@click='startCreateFolder')
        .btn.deleteItem.fas.fa-trash(@click='deleteDocument')
        .btn.renameItem.fas.fa-pencil-alt(@click='startRenameDocument')
    .bottomSection
        #documents
            .folder(@click='selectDocument("folder", document.folder)' v-for='document in documents' :id='folderIdHandler(document.folder)') 
                .foldername(:class='{folderSelected: nowDocument.nowFolder==document.folder && nowDocument.selecting=="folder"}') {{document.folder}}
                .files
                    .file(@click.stop='selectDocument("file", document.folder, file.name)' v-for='file in document.files' :class='{fileSelected: nowDocument.nowFile==file.name && nowDocument.selecting=="file" && nowDocument.nowFolder==document.folder}') {{file.name}}
</template>

<script>
import firebase from '../helpers/firebase.js'
import lodash from 'lodash'
export default {
    data() {
        return {
            status: 'idling'
        }
    },
    computed: {
        nowDocument() {
            return this.$store.state.nowDocument
        },
        documents() {
            return this.$store.state.documents
        },
        currentUser: function() {
            return this.$store.state.currentUser
        }
    },
    methods: {
        folderIdHandler: function(str) {
            let id = `steakEditFolder${str.replace(/\s/g, '')}`
            return id
        },
        selectDocument: function(type, ...document) {
            console.log(`selecting: ${document}`)
            let self = this
            if(this.status == 'idling') {
                if(type == 'folder') {
                    firebase.db.ref(`${self.currentUser}/nowDocument`).update({
                        nowFolder: document[0],
                        selecting: 'folder'
                    })
                } else if(type == 'file') {
                    firebase.db.ref(`${self.currentUser}/nowDocument`).update({
                        nowFolder: document[0],
                        nowFile: document[1],
                        selecting: 'file'
                    })
                }
            }
        },
        startCreateFolder: function() {
            if(this.status == 'idling') {
                this.status = 'creatingFolder'
                let folderInit = document.createElement('input')
                folderInit.setAttribute('id', 'folderInit')
                document.getElementById('documents').appendChild(folderInit)
            }
        },
        saveNewFolder: function() {
            let self = this
            let folderInit = document.getElementById('folderInit')
            let folderInitName = folderInit.value
            folderInit.parentNode.removeChild(folderInit)
            if(folderInitName.trim().length>0 && this.folderNameAllowed(folderInitName)) {
                firebase.db
                .ref(`${self.currentUser}/documents/${folderInitName}`)
                .set('')
                .then(function() {
                    firebase.db
                    .ref(`${self.currentUser}/nowDocument`)
                    .update({
                        nowFolder: folderInitName,
                        nowFile: '',
                        selecting: 'folder'
                    })
                })
            }
            this.status = 'idling'
        },
        startCreateFile: function() {
            let self = this
            if(this.status == 'idling') {
                this.status = 'creatingFile'
                let fileInit = document.createElement('input')
                fileInit.setAttribute('id', 'fileInit')
                document.querySelector(`#${self.folderIdHandler(self.nowDocument.nowFolder)}>.files`).appendChild(fileInit)
            }
        },
        saveNewFile: function() {
            let self = this
            let fileInit = document.getElementById('fileInit')
            let fileInitName = fileInit.value
            fileInit.parentNode.removeChild(fileInit)
            if(fileInitName.trim().length>0 && this.fileNameAllowed(fileInitName)) {
                firebase.db
                .ref(`${self.currentUser}/documents/${self.nowDocument.nowFolder}/${fileInitName}`)
                .set(`# ${fileInitName}\n---\n### Write something here...`)
                .then(function() {
                    firebase.db
                    .ref(`${self.currentUser}/nowDocument`)
                    .update({
                        nowFolder: self.nowDocument.nowFolder,
                        nowFile: fileInitName,
                        selecting: 'file'
                    })
                })
            }
            this.status = 'idling'
        },
        deleteDocument: function() {
            let self = this
            if(this.status=='idling') {
                let nowFolderRef = firebase.db.ref(`${self.currentUser}/documents/${self.nowDocument.nowFolder}`)
                let nowDocumentRef = firebase.db.ref(`${self.currentUser}/nowDocument`)
                let documentsRef = firebase.db.ref(`${self.currentUser}/documents`)
                if(self.nowDocument.selecting=='file' && (this.$store.state.documents.length>1 || this.$store.state.documents[0].files.length>1) ) {
                    nowFolderRef.once('value', function(files) {
                        let fileNumber = Object.keys(files.val()).length
                        if (fileNumber > 1) {
                            try {
                                let filesClone = _.clone(files.val())
                                let filesUpdated = _.omit(filesClone, [self.nowDocument.nowFile])
                                nowFolderRef.set(filesUpdated)
                                .then(function() {
                                    self.setNowDocToNowFolder(nowDocumentRef)
                                })
                            } catch(e) {
                                self.setNowDocToFirstDoc(nowDocumentRef, documentsRef)
                            }
                        } else if(fileNumber == 1) {
                            try {
                                nowFolderRef.set('')
                                .then(function() {
                                    self.setNowDocToNowFolder(nowDocumentRef)
                                })
                            } catch(e) {
                                self.setNowDocToFirstDoc(nowDocumentRef, documentsRef)
                            }
                        } 
                    })  
                } else if(self.nowDocument.selecting=='folder' && this.$store.state.documents.length>1) {
                    nowFolderRef
                    .set(null)
                    .then(function() {
                        self.setNowDocToFirstDoc(nowDocumentRef, documentsRef)
                    })
                }
            }
        },
        startRenameDocument: function() {
            let self = this
            if(this.status == 'idling') {
                if(self.nowDocument.selecting == 'file') {
                    this.status = 'renamingFile'
                    // 更名div區塊
                    let renameMainBlock = document.createElement('div')
                    renameMainBlock.setAttribute('id', 'renameMainBlock')
                    // 更名提示文字
                    let instruction = document.createElement('div')
                    instruction.innerText = 'Rename File to:'
                    renameMainBlock.appendChild(instruction)
                    // 更名輸入框
                    let fileRename = document.createElement('input')
                    fileRename.value = self.nowDocument.nowFile
                    renameMainBlock.appendChild(fileRename)
                    document.getElementById('Sidebar').appendChild(renameMainBlock)
                } else if(self.nowDocument.selecting == 'folder') {
                    this.status = 'renamingFolder'
                    // 更名div區塊
                    let renameMainBlock = document.createElement('div')
                    renameMainBlock.setAttribute('id', 'renameMainBlock')
                    // 更名提示文字
                    let instruction = document.createElement('div')
                    instruction.innerText = 'Rename Folder to:'
                    renameMainBlock.appendChild(instruction)
                    // 更名輸入框
                    let folderRename = document.createElement('input')
                    folderRename.value = self.nowDocument.nowFolder
                    renameMainBlock.appendChild(folderRename)
                    document.getElementById('Sidebar').appendChild(renameMainBlock)
                }
            }
        },
        saveRenamingDocument: function() {
            let self = this
            if(this.status == 'renamingFile') {
                let renameMainBlock = document.getElementById('renameMainBlock')
                let fileRenameName = document.querySelector('#renameMainBlock>input').value
                renameMainBlock.parentNode.removeChild(renameMainBlock)
                if(fileRenameName.trim().length>0 && fileRenameName!=self.nowDocument.nowFile && this.fileNameAllowed(fileRenameName)) {
                    let fileRef = firebase.db.ref(`${self.currentUser}/documents/${self.nowDocument.nowFolder}/${self.nowDocument.nowFile}`)
                    fileRef.on('value', function(doc) {
                        let context = doc.val()
                        fileRef.set(null)
                        firebase.db
                        .ref(`${self.currentUser}/documents/${self.nowDocument.nowFolder}/${fileRenameName}`)
                        .set(context)
                        .then(function() {
                            firebase.db.ref(`${self.currentUser}/nowDocument`)
                            .update({
                                nowFolder: self.nowDocument.nowFolder,
                                nowFile: fileRenameName,
                                selecting: 'file'
                            })
                        })
                    })
                    this.$store.state.nowDocument.nowFile = fileRenameName
                } 
            } if(this.status == 'renamingFolder') {
                let renameMainBlock = document.getElementById('renameMainBlock')
                let folderRenameName = document.querySelector('#renameMainBlock>input').value
                renameMainBlock.parentNode.removeChild(renameMainBlock)
                if(folderRenameName.trim().length>0 && folderRenameName!=self.nowDocument.nowFolder && this.folderNameAllowed(folderRenameName)) {
                    let folderRef = firebase.db.ref(`${self.currentUser}/documents/${self.nowDocument.nowFolder}`)
                    folderRef.once('value', function(doc) {
                        let files = doc.val()
                        folderRef.set(null)
                        firebase.db
                        .ref(`${self.currentUser}/documents/${folderRenameName}`)
                        .set(files)
                        .then(function() {
                            firebase.db.ref(`${self.currentUser}/nowDocument`)
                            .update({
                                nowFolder: folderRenameName,
                                nowFile: '',
                                selecting: 'folder'
                            })
                        })
                    })
                    this.$store.state.nowDocument.nowFolder = folderRenameName
                } 
            }
            this.status = 'idling'     
        },
        saveHandler: function(e) {
            if (e.keyCode==13 && this.status=='creatingFolder') { 
                this.saveNewFolder()
            } else if (e.keyCode==13 && this.status=='creatingFile') { 
                this.saveNewFile()
            } else if (e.keyCode==13 && this.status.indexOf('renaming') != -1) { 
                this.saveRenamingDocument()
            } 
        },
        folderNameAllowed: function(input) {
            let regularExp = /^(?=^[a-zA-Z\u4e00-\u9fa5])(?=^[\u4e00-\u9fa5a-zA-Z0-9\s]+$)+/.test(input)
            let folderNotNameExisted = !this.documents.map(function(docs) {return docs.folder}).includes(input)
            let result = regularExp && folderNotNameExisted
            console.log(`foldername allowed : ${result}`)
            return result
        },
        fileNameAllowed: function(input) {
            let self = this
            let regularExp = /^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/.test(input)
            let fileNotNameExisted = !this
            .documents.find(function(docs) {
                return docs.folder == self.nowDocument.nowFolder
            }).files.map(function(file) {
                return file.name
            }).includes(input)
            let result = regularExp && fileNotNameExisted
            console.log(`filename allowed : ${result}`)
            return result
        },
        setNowDocToFirstDoc: function(nowDocumentRef, documentsRef) {
            documentsRef
            .once('value', function(docs) {
                let firstFolder = Object.keys(docs.val())[0]
                nowDocumentRef.update({
                    nowFile: '',
                    nowFolder: firstFolder,
                    selecting: 'folder'
                })
            })
        },
        setNowDocToNowFolder: function(nowDocumentRef) {
            let self = this
            nowDocumentRef.set({
                nowFolder: self.nowDocument.nowFolder,
                nowFile: '',
                selecting: 'folder'
            })
        },
        setNowDocToNowFile: function(nowDocumentRef) {
            let self = this
            nowDocumentRef.set({
                nowFolder: self.nowDocument.nowFolder,
                nowFile: self.nowDocument.nowFile,
                selecting: 'file'
            })
        }
    },
    watch: {
        status: function(newValue) {
            let self = this
            if(this.status == 'idling') {
                window.removeEventListener('keyup', self.saveHandler)
            } else if (this.status.indexOf('creating') != -1 || this.status.indexOf('renaming') != -1) {
                window.addEventListener('keyup', self.saveHandler)
            }
        }
    }
}
</script>

<style lang='sass'>
@import '../assets/style/main.sass'
#Sidebar
    +size(100%)
    +scrollbar(7px, $grey3)
    display: flex
    flex-direction: column
    &>.topSection
        flex: 1 0 0
        display: flex
        align-items: center
        padding: 0 9px
        background-color: $grey1
        &>.btn
            padding: 9px
            border-radius: 5px
            font-size: $sidebarBtnFont
            color: $black1
            cursor: pointer
            position: relative
            &:hover
                background-color: $grey3
    &>.bottomSection
        overflow-y: scroll
        flex: 9 0 0
        color: $black1
        background-color: $grey2
        &>#documents
            & div
                width: 100%
                cursor: pointer
                text-overflow: ellipsis
            &>.folder
                font-size: $sidebarFolderFont
                vertical-align: center
                &>.foldername
                    padding: 4px 10px
                    overflow: hidden
                    &::before
                        content: "\f0da"
                        font-family: "Font Awesome 5 Free"
                        font-weight: 900
                        font-size: $sidebarFolderIconFont
                        margin-right: 6px
                    &.folderSelected
                        color: #eee
                        background-color: $themeFolder
                &>.files
                    &>.file
                        padding: 2px 25px
                        overflow: hidden
                        &.fileSelected
                            color: #eee
                            background-color: $themeFolder
                    &>input
                        margin-left: 15px
    &>#renameMainBlock
        width: 100%
        padding: 10px 20px
        color: $black3
        background-color: $grey3
        &>*
            margin-top: 5px
        &>input
            width: 100%
@media screen and (max-width: 800px)
    #Sidebar
        &>.topSection
            &>.btn
                font-size: $sidebarBtnFont*0.6
        &>.bottomSection
            &>#documents
                &>.folder
                    font-size: $sidebarFolderFont
                    &>.foldername
                        &::before
                            font-size: $sidebarFolderIconFont
</style>