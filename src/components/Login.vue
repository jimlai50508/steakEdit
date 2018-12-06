<template lang='pug'>
#Login
    .scene
        .title Steak Edit
        .subtitle 紀錄你的Markdown筆記
        .text 現在就登入使用吧！
        .login.g-signin2(data-onsuccess='onSignIn' data-theme='dark' data-longtitle='true' data-width='250' data-height='50')
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style lang='sass'>
@import '../assets/style/main.sass'
#Login
    +size(100%)
    +flexCenter
    position: relative
    background-color: rgba($grey3, 0.8)
    text-align: center
    overflow: hidden
    z-index: 101
    &::after
        +size(200%)
        content: ''
        display: block
        position: absolute
        background-color: rgba($black2, 0.8)
        bottom: -100%
        transform: skew(100deg)
        z-index: 1
    &>.scene
        +size(90%, 400px)
        display: flex
        flex-direction: column
        justify-content: space-between
        align-items: center
        padding: 40px 60px
        background-color: $theme4
        border-radius: 10px
        position: relative
        box-shadow: 0px 0px 10px black
        z-index: 2
        &>*
            margin-bottom: 20px
        &>.title
            padding: 10px
            font-size: 64px
            border-bottom: 4px solid $theme5
            color: $black3
        &>.subtitle
            font-size: 28px
            color: $black2
        &>.text
            font-size: 18px
            color: $black3
        &>.login.g-signin2
            &>div
                margin: 0 auto
                border: 2px solid $themeGoogle
</style>
