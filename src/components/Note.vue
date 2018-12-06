<template lang='pug'>
#Note.mobileMode(@mouseover='$store.state.hoverTarget = "Note"' :class='{renderMode: renderMode}')
    #markdownNote(v-html='markdownHtml')
</template>
<script>
import firebase from '../helpers/firebase.js'
import md from '../helpers/markdown.js'
export default {
    data() {
        return {
            markdownHtml: ''
        }
    },
    computed: {
        renderMode: function() {
            return this.$store.state.renderMode
        }
    },
    methods: {
        mkdnToHtml: function(markdown) {
            return md.render(markdown)
        }
    },
    mounted() {
        // renderNote監聽事件
        let self = this
        this.$root.$on('renderNote', function(context) {
            self.markdownHtml = self.mkdnToHtml(context)
        })
        // marknote捲動事件
        let markdownNote = document.getElementById('markdownNote')
        markdownNote.addEventListener('scroll', scrollHandler)
        function scrollHandler() {
            let scrlHeight = markdownNote.scrollHeight
            let clntHeight = markdownNote.clientHeight
            let scrlTop = markdownNote.scrollTop
            let scrlPosition = scrlTop / (scrlHeight - clntHeight)
            self.$root.$emit('scrollingMarkdown', {
                scrolling: 'markdownNote',
                target: 'markdownEdit',
                scrlPosition
            })
        }
    }
}
</script>
<style lang='sass'>
@import '../assets/style/main.sass'
@import '../assets/style/highlightjs.sass'
#Note
    +scrollbar(8px, $black2, $grey3, 5px)
    display: flex
    justify-content: center
    margin: 0 auto
    word-break: break-all
    background-color: $themeMain
    &.renderMode
        display: flex
    &>#markdownNote
        +size(100%)
        padding: 20px 10%
        line-height: 36px
        overflow-y: scroll
        & pre
            white-space: pre-wrap
        & blockquote
            font-style: italic
        & img
            width: 100%
            margin: 20px 0
        & a
            font-weight: bold
            color: $themeHref
@media screen and (max-width: 800px)
    #Note.mobileMode
        display: none
        width: 0
        &.renderMode
            display: flex
</style>