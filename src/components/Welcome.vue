<template lang='pug'>
#Welcome(:class='{welcomeLeave: dataInitialized}')
    .scene 
        .circle
        .seaOuter
            .seaMain
        .loading Loading...
        .loaded Welcome!
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        dataInitialized: function() {
            return this.$store.state.dataInitialized
        }
    },
    mounted() {
        this.$root.$on('dataInitialized', function() {
            console.log('welcome  animation leaved!')
        })
    }
}
</script>

<style lang='sass'>
@import '../assets/style/main.sass'
#Welcome
    +size(100%)
    +flexCenter
    background-color: rgba(#000, 0.8)
    z-index: 100
    &.welcomeLeave
        transition-delay: 0.8s
        opacity: 0 // 0 || 1
        z-index: -1 // -1 || 100
        &>.scene
            animation: rotation 0.5s 
            transform: scale(10%)
            &>.loading
                display: none
            &>.loaded
                display: block
    &>.scene
        transform: scale(100%)
        position: relative
        &>.circle
            +size(300px)
            position: relative
            border: 15px solid $grey1
            border-style: outset
            border-radius: 50%
            background-color: #EEEEEE
            animation: rotation2 1s infinite
        &>.seaOuter
            +size(230px)
            +absCenter
            border-radius: 50%
            overflow: hidden
            &>.seaMain
                +size(400px)
                animation: rotation 8s linear infinite both
                position: absolute
                left: calc(50% - 200px)
                top: 50%
                background-color: $themeSea
                -webkit-clip-path: inset(10% 0% round 30% 20%)
        &>.loading, .loaded
            +absCenter
            text-align: center
            font-size: 28px
            font-weight: bold
            color: $black1
            text-shadow: 3px 4px rgba($black2, 0.3)
        &>.loaded
            display: none
</style>