<template lang='pug'>
#Topbar
    .leftSection
        .fas.fa-folder.toggleLeftSection(@click='toggleLeftSection')
        .currentUser {{currentUser}}
    .rightSection
        .title {{nowDocument.nowFile}}
        .fullscreen.fas.fa-desktop(@click='enterFullscreen')
        .logout.fas.fa-sign-out-alt(onclick='signOut()')
    #viewMode
        #viewModeBtn.fa(:class='[renderMode ? "fa-edit":"fa-book-open"]' @click='viewModeHandler')
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        nowDocument() {
            return this.$store.state.nowDocument
        },
        currentUser() {
            return this.$store.state.currentUser
        },
        renderMode: function() {
            return this.$store.state.renderMode
        },
        allowToggleMode: function() {
            return this.$store.state.allowToggleMode
        }
    },
    methods: {
        toggleLeftSection: function() {
            this.$root.$emit('toggleLeftSection')
        },
        viewModeHandler: function() {
            if(this.allowToggleMode) {
                this.$store.state.renderMode = !this.$store.state.renderMode
            }
        },
        enterFullscreen: function() {
            if (screenfull.enabled) {
                screenfull.toggle();
            }
        }
    },
    watch: {
        renderMode: function(newValue) {
            let viewModeBtn = document.querySelector('#viewModeBtn')
            if(!viewModeBtn.style.transform) {
                viewModeBtn.style.transform = 'rotate(360deg)'
            } else if(viewModeBtn.style.transform == 'rotate(360deg)') {
                viewModeBtn.style.transform = 'rotate(0deg)'
                console.log(1)
            } else if(viewModeBtn.style.transform == 'rotate(0deg)') {
                viewModeBtn.style.transform = 'rotate(360deg)'
                console.log(2)
            }
        }
    }
}
</script>

<style lang='sass'>
@import '../assets/style/main.sass'
#Topbar
    +size(100%)
    display: flex
    justify-content: space-between
    padding: 0 20px
    color: $grey1
    background-color: $black3
    font-family: '微軟正黑體'
    font-size: $topbarFont
    & div
        text-overflow: ellipsis
    &>.leftSection
        display: flex
        align-items: center
        &>*
            margin-right: 20px
            cursor: pointer
        &>.currentUser
            font-size: $topbarUser
    &>.rightSection
        display: flex
        align-items: center
        justify-content: flex-end
        max-width: 60%
        &>*
            margin-left: 20px
        &>.title
            white-space: nowrap
            width: 80%
            overflow: hidden
        &>.fullscreen
            display: none
            cursor: pointer
        &>.logout
            cursor: pointer
    &>#viewMode
        +size(100px)
        position: fixed
        top: 10%
        right: 8px
        background-color: rgba($theme4, 0.6)
        -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 100%)
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%)
        &>#viewModeBtn
            position: absolute
            right: 15px
            top: 15px
            font-size: 25px
            color: darken($theme4, 20)
            cursor: pointer
            transform: rotate(0deg)
@media screen and (max-width: 800px)
    #Topbar
        font-size: $topbarFont*0.6
        overflow: hidden
        &>.leftSection
            &>.currentUser
                font-size: $topbarUser*0.6
        &>.rightSection
            &>.fullscreen
                display: block
</style>