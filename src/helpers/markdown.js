import markdownIt from 'markdown-it'
import highlightjs from 'highlightjs'
let md = new markdownIt({
    html: true, 
    xhtmlOut: true, 
    breaks: true,        
    langPrefix: 'language-', 
    linkify: true,       
    typographer: true,
    highlight: function (str, lang) {
        if (lang && highlightjs.getLanguage(lang)) {
            try {
                return highlightjs.highlight(lang, str).value;
            } catch (__) {}
        }
        return ''
    }
})
export default md