<template lang='pug'> 
#Edit.mobileMode(@mouseover='$store.state.hoverTarget = "Edit"' :class='{renderMode: renderMode}')
    textarea#markdownEdit(@keyup='saveContext' @keydown='tabHandler($event)' spellcheck='false') {{context}}
</template>

<script>
import firebase from '../helpers/firebase.js'
import defaultFile from '../helpers/defaultFile.js'
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
    data() {
        return {
            contextLoaded: false,
        }
    },
    computed: {
        nowFile() {
            return this.$store.state.nowDocument.nowFile
        },
        nowFolder() {
            return this.$store.state.nowDocument.nowFolder
        },
        renderMode: function() {
            return this.$store.state.renderMode
        },
        dataInitialized: function() {
            return this.$store.state.dataInitialized
        },
        context: function() {
            return this.getContext()
        },
        currentUser: function() {
            return this.$store.state.currentUser
        }
    },
    methods: {
        tabHandler: function($event) {
            if($event.key == 'Tab') {
                $event.preventDefault()
                let markdownEdit = document.getElementById('markdownEdit')
                let index = markdownEdit.selectionStart
                let context = markdownEdit.value
                context = context.substr(0, index) + '\t' + context.substr(index)
                markdownEdit.value = context
                markdownEdit.selectionStart = markdownEdit.selectionEnd = index+1
            }
        },
        saveContext: function() {
            let self = this
            let context = document.getElementById('markdownEdit').value
            if(this.nowFile.length > 0) {
                firebase.db.ref(`${self.currentUser}/documents/${self.nowFolder}/${self.nowFile}`)
                .set(context)
            }
        },
        getContext: function() {
            let self = this
            let context = null
            try {
                let nowFile = this.$store.state.documents.find(function(docs) {
                    return docs.folder == self.nowFolder
                }).files.find(function(file) {
                    return file.name == self.nowFile
                })
                context = nowFile.context
                this.$root.$emit('renderNote', context)
                this.$store.state.allowToggleMode = true
                this.contextLoaded = true
                return context
            } catch(e) {
                console.log(e)
                this.$root.$emit('renderNote', '# Go write some markdown！\n---\n### 新增或選擇一個檔案開始編輯。')
                this.$store.state.allowToggleMode = false
                this.$store.state.renderMode = true
            }
        }
    },
    watch: {
        contextLoaded: function(newValue) {
            let self = this
            if(newValue) {
                // 確定資料載入後掛載滾動事件
                let markdownEdit = document.getElementById('markdownEdit')
                markdownEdit.addEventListener('scroll', scrollHandler)
                function scrollHandler() {
                    let scrlHeight = markdownEdit.scrollHeight
                    let clntHeight = markdownEdit.clientHeight
                    let scrlTop = markdownEdit.scrollTop
                    let scrlPosition = scrlTop / (scrlHeight - clntHeight)
                    self.$root.$emit('scrollingMarkdown', {
                        scrolling: 'markdownEdit',
                        target: 'markdownNote',
                        scrlPosition
                    })
                }
            }
        }
    }
}
</script>
<style lang='sass'>
@import '../assets/style/main.sass'
#Edit
    +scrollbar(6px, $grey1)
    display: flex
    &.renderMode
        display: none
    &>#markdownEdit
        +size(100%)
        margin: 0
        padding: 15px 25px
        resize: none
        overflow: auto
        outline: none
        font-size: $editMarkdown
        line-height: 26px
        background-color: $theme2
@media screen and (max-width: 800px)
    #Edit.mobileMode
        display: flex
        &.renderMode
            display: none
            width: 0
</style>