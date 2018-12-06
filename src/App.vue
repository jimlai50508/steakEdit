<template lang='pug'>
#app
    Login(:class='{disappear: currentUser != ""}')
    Welcome
    .mainPage
        .leftSection(:class='{hideLeftSection: hideLeftSection}')
            Sidebar
        .rightSection
            .topSection
                Topbar
            .bottomSection
                Edit(:key='$store.state.nowDocument.nowFile')
                Note
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import firebase from './helpers/firebase.js'
import defaultFile from './helpers/defaultFile.js'
export default {
    data() {
        return {
            hideLeftSection: false
        }
    },
    computed: {
        hoverTarget: function() {
            return this.$store.state.hoverTarget
        },
        renderMode: function() {
            return this.$store.state.renderMode
        },
        dataInitialized: function() {
            return this.$store.state.dataInitialized
        },
        documents: function() {
            return this.$store.state.documents
        },
        dataInitialized: function() {
            return this.$store.state.dataInitialized
        },
        currentUser: function() {
            return this.$store.state.currentUser
        }
    },
    methods: {
		...mapMutations(['setNowDocument', 'setDocuments']),
        ...mapActions(['loadNowDocument', 'loadDocuments'])
	},
    watch: {
        renderMode: function(newValue) {
            console.log(`renderMode: ${newValue}`)
        },
        documents: function(newValue) {
            if(newValue.length > 0) {
                this.$store.state.dataInitialized = true
            }
        },
        dataInitialized: function(newValue) {
            console.log(`dataInitialized: ${newValue}`)
            this.$root.$emit('dataInitialized')
        },
        currentUser: function(newValue) {
            let self = this
            // 載入資料
            if(newValue.length > 0) {
                let userRef = firebase.db.ref(newValue)
                userRef.on('value', function(doc) {
                    if(!doc.val()) {
                        userRef.set(defaultFile)
                        .then(function() {
                            self.loadNowDocument()
                            self.loadDocuments()
                        })
                    } else {
                        self.loadNowDocument()
                        self.loadDocuments()
                    }
                })
            }
        }
    },
    mounted() {
        let self = this
        // 處理選單切換
        this.$root.$on('toggleLeftSection', function() {
            self.hideLeftSection =! self.hideLeftSection
        })
        // 處理markdownEdit&markdownNote捲動事件
        this.$root.$on('scrollingMarkdown', function(context) {
            let target = document.getElementById(context.target)
            let tsH = target.scrollHeight
            let tcH = target.clientHeight
            let tSetPosition = context.scrlPosition * (tsH - tcH)
            if(context.scrolling=='markdownNote' && self.hoverTarget=='Note') {
                target.scrollTop = tSetPosition
            } else if(context.scrolling=='markdownEdit' && self.hoverTarget=='Edit') {
                target.scrollTop = tSetPosition
            }
        })
    },
    metaInfo: {
        title: 'Steak Edit',
        script: [
            {src: 'https://apis.google.com/js/platform.js', type: 'text/javascript'},
            {src: 'https://cdn.bootcss.com/screenfull.js/3.3.3/screenfull.min.js', type: 'text/javascript'},
            {
                src: 'https://firebasestorage.googleapis.com/v0/b/steakedit.appspot.com/o/script%2Flogin.js?alt=media&token=58b5ebb4-3ab7-49d7-b65c-3f93daabdac0',
                type: 'text/javascript'
            }
        ],
        meta: [
            {name: 'google-signin-client_id', content: '1048967680937-9o22ss1ccqcr3jao8hvuvb9488q2ie0h.apps.googleusercontent.com'},
            {name: 'google-signin-cookiepolicy', content: 'single_host_origin'}
        ],
        link: [
            {
                rel: 'stylesheet',
                href: 'https://use.fontawesome.com/releases/v5.4.1/css/all.css',
                integrity: 'sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz',
                crossorigin: 'anonymous'
            },
            {
                rel: 'icon',
                href: 'https://firebasestorage.googleapis.com/v0/b/steakedit.appspot.com/o/icon%2Ffavicon.ico?alt=media&token=86470da1-f914-4d37-9d29-080199575d69'
            }
        ]
    }
}
</script>
<style lang='sass'>
@import './assets/style/main.sass'
*
    box-sizing: border-box
    font-family: 'Ubuntu', 'Noto Sans TC'
html, body
    +size(100%)
    margin: 0
    padding: 0
#app
    +size(100%)
    display: flex
    position: relative
    & *
        transition: 0.5s
    &>#Login
        +size(100%)
        position: absolute
        left: 0
        top: 0
        &.disappear
            display: none
    &>#Welcome
        +size(100%)
        position: absolute
        left: 0
        top: 0
    &>.mainPage
        +size(100%)
        display: flex
        position: relative
        &>.leftSection
            flex: 2 0 0
            width: 20%
            z-index: 1
            &.hideLeftSection
                flex: 0
                width: 0
                & *
                    white-space: nowrap
        &>.rightSection
            flex: 8 0 0
            width: 80%
            display: flex
            flex-direction: column
            z-index: 2
            &>.topSection
                flex: 1
            &>.bottomSection
                +size(100%)
                flex: 9 0 0
                display: flex
                &>*
                    flex: 1 0 0
@media screen and (max-width: 800px)
    #app
        &>.mainPage
            +size(100%)
            display: flex
            position: relative
            &>.leftSection
                flex: 1 0 0
                width: 40%
            &>.rightSection
                flex: 1 0 0
                width: 60%
</style>