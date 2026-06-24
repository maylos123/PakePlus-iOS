window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 需要排除拦截的 URL 关键词（登录、OAuth 回调等）
const EXCLUDE_PATTERNS = [
    '/login',
    '/auth',
    '/oauth',
    '/sso',
    '/cas',
    'passport',
]

const shouldExclude = (url) => {
    if (!url) return true
    if (url === 'about:blank') return true
    if (url.startsWith('javascript:')) return true
    return EXCLUDE_PATTERNS.some((p) => url.toLowerCase().includes(p))
}

const hookClick = (e) => {
    // 用户主动按了修饰键（Cmd/Ctrl/Shift），尊重用户意图，不拦截
    if (e.metaKey || e.ctrlKey || e.shiftKey) return

    const origin = e.target.closest('a')
    if (!origin || !origin.href) return

    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )

    const shouldIntercept =
        (origin.target === '_blank' || isBaseTargetBlank) &&
        !shouldExclude(origin.href)

    if (shouldIntercept) {
        e.preventDefault()
        location.href = origin.href
    }
}

window.open = function (url, target, features) {
    // 空 URL 或排除列表中的，走原生 window.open，不拦截
    if (shouldExclude(url)) {
        return originalWindowOpen.call(window, url, target, features)
    }
    location.href = url
    // 返回 window 自身，避免调用方拿到 undefined 报错
    return window
}

const originalWindowOpen = window.open.bind(window)

document.addEventListener('click', hookClick, { capture: true })
