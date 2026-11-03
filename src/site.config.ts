// The site's UI settings. Every value the pages, the stylesheets (via `site-config()` in
// src/styles/fluid) and the browser scripts read lives here.

interface Banner {
  bannerImg: string;
  /** vh */
  bannerHeight: number;
  bannerMaskAlpha: number;
}

interface MenuItem {
  label: string;
  link: string;
  icon: string;
}

interface AboutIcon {
  class: string;
  link: string;
  tip: string;
}

export interface SiteConfig {
  site: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    language: string;
    ogLocale: string;
    url: string;
    timezone: string;
    favicon: string;
    appleTouchIcon: string;
    tabTitleSeparator: string;
    forceHttps: boolean;
    /** Date format of the post list on the home page. */
    dateFormat: string;
    postsPerPage: number;
  };
  /** Library base URLs (Fluid's `static_prefix`). */
  cdn: {
    bootstrap: string;
    jquery: string;
    githubMarkdown: string;
    hint: string;
    fancybox: string;
    nprogress: string;
    typed: string;
    tocbot: string;
    anchor: string;
    clipboard: string;
    busuanzi: string;
  };
  /** Icon fonts: Fluid's own set, then the site's set. */
  iconfonts: string[];
  /** Local stylesheets loaded after the theme's. */
  customCss: string[];
  darkMode: { enable: boolean; default: 'auto' | 'light' | 'dark' };
  color: {
    bodyBg: string;
    bodyBgDark: string;
    navbarBg: string;
    navbarBgDark: string;
    navbarText: string;
    navbarTextDark: string;
    subtitle: string;
    subtitleDark: string;
    text: string;
    textDark: string;
    secText: string;
    secTextDark: string;
    board: string;
    boardDark: string;
    postText: string;
    postTextDark: string;
    postHeading: string;
    postHeadingDark: string;
    postLink: string;
    postLinkDark: string;
    linkHover: string;
    linkHoverDark: string;
    linkHoverBg: string;
    linkHoverBgDark: string;
    line: string;
    lineDark: string;
    scrollbar: string;
    scrollbarDark: string;
    scrollbarHover: string;
    scrollbarHoverDark: string;
    buttonBg: string;
    buttonBgDark: string;
    buttonHoverBg: string;
    buttonHoverBgDark: string;
  };
  font: { size: string; family: string | null; letterSpacing: string; codeSize: string };
  code: {
    copyBtn: boolean;
    language: { enable: boolean; default: string };
    /** highlight.js style names, as files under highlight.js/styles. */
    highlight: { enable: boolean; lineNumber: boolean; style: string; styleDark: string };
  };
  features: {
    typing: { enable: boolean; typeSpeed: number; cursorChar: string; loop: boolean };
    anchorjs: { enable: boolean; element: string; placement: 'left' | 'right'; visible: string; icon: string };
    progressbar: {
      enable: boolean;
      heightPx: number;
      color: string;
      options: { showSpinner: boolean; trickleSpeed: number };
    };
  };
  analytics: { enable: boolean; followDnt: boolean; googleMeasurementId: string };
  lazyload: { enable: boolean; loadingImg: string; offsetFactor: number };
  navbar: {
    blogTitle: string;
    groundGlass: { enable: boolean; px: number; alpha: number };
    menu: MenuItem[];
  };
  search: { enable: boolean; path: string; content: boolean };
  banner: { parallax: boolean; widthHeightRatio: number };
  scrollDownArrow: { enable: boolean; bannerHeightLimit: number; scrollAfterTurningPage: boolean };
  scrollTopArrow: { enable: boolean };
  openGraph: { enable: boolean; twitterCard: string };
  footer: {
    content: string;
    statistics: { enable: boolean; pvFormat: string; uvFormat: string };
  };
  index: Banner & {
    slogan: {
      enable: boolean;
      text: string;
      api: { enable: boolean; url: string; method: string; headers: Record<string, string>; keys: string[] };
    };
    autoExcerpt: boolean;
    postUrlTarget: string;
    postMeta: { date: boolean; category: boolean; tag: boolean };
  };
  post: Banner & {
    meta: {
      author: boolean;
      date: { enable: boolean; format: string };
      wordcount: { enable: boolean; format: string };
      min2read: { enable: boolean; format: string; awl: number; wpm: number };
      views: { enable: boolean; format: string };
    };
    toc: { enable: boolean; placement: 'left' | 'right'; headingSelector: string; collapseDepth: number };
    copyright: {
      enable: boolean;
      /** Creative Commons license id, such as BY or BY-SA. */
      license: string;
      author: boolean;
      postDate: { enable: boolean; format: string };
    };
    prevNext: boolean;
    imageCaption: boolean;
    imageZoom: { enable: boolean; imgUrlReplace: [string, string] };
  };
  archive: Banner;
  category: Banner & { postLimit: number };
  tag: Banner & {
    tagcloud: { minFont: number; maxFont: number; unit: string; startColor: string; endColor: string };
  };
  about: Banner & { avatar: string; name: string; intro: string; icons: AboutIcon[] };
  page: Banner;
  page404: Banner & { redirectDelay: number };
}

export const config: SiteConfig = {
  site: {
    title: "Hamilton's home",
    description: 'This is Elizabeth Hamilton',
    keywords: 'meow',
    author: 'Elizabeth Hamilton',
    language: 'en',
    ogLocale: 'en_US',
    url: 'http://hling.org',
    timezone: 'Asia/Tokyo',
    favicon: '/image/site/favicon.ico',
    appleTouchIcon: '/image/site/favicon.ico',
    tabTitleSeparator: ' - ',
    forceHttps: true,
    dateFormat: 'YYYY-MM-DD',
    postsPerPage: 10,
  },
  cdn: {
    bootstrap: 'https://lib.baomitu.com/twitter-bootstrap/4.6.1/',
    jquery: 'https://lib.baomitu.com/jquery/3.6.4/',
    githubMarkdown: 'https://lib.baomitu.com/github-markdown-css/4.0.0/',
    hint: 'https://lib.baomitu.com/hint.css/2.7.0/',
    fancybox: 'https://lib.baomitu.com/fancybox/3.5.7/',
    nprogress: 'https://lib.baomitu.com/nprogress/0.2.0/',
    typed: 'https://lib.baomitu.com/typed.js/2.0.12/',
    tocbot: 'https://lib.baomitu.com/tocbot/4.20.1/',
    anchor: 'https://lib.baomitu.com/anchor-js/4.3.1/',
    clipboard: 'https://lib.baomitu.com/clipboard.js/2.0.11/',
    busuanzi: 'https://busuanzi.ibruce.info/busuanzi/2.3/',
  },
  iconfonts: ['//at.alicdn.com/t/font_1749284_hj8rtnfg7um.css', '//at.alicdn.com/t/font_1736178_lbnruvf0jn.css'],
  customCss: ['/css/iconfont.css'],
  darkMode: { enable: true, default: 'auto' },
  color: {
    bodyBg: '#eee8d5',
    bodyBgDark: '#181c27',
    navbarBg: '#2f4154',
    navbarBgDark: '#1f3144',
    navbarText: '#fff',
    navbarTextDark: '#d0d0d0',
    subtitle: '#fff',
    subtitleDark: '#d0d0d0',
    text: '#3c4858',
    textDark: '#c4c6c9',
    secText: '#718096',
    secTextDark: '#a7a9ad',
    board: '#fdf6e3',
    boardDark: '#252d38',
    postText: '#073642',
    postTextDark: '#c4c6c9',
    postHeading: '#002b36',
    postHeadingDark: '#c4c6c9',
    postLink: '#dc322f',
    postLinkDark: '#268bd2',
    linkHover: '#0366d6',
    linkHoverDark: '#dc322f',
    linkHoverBg: '#eee8d5',
    linkHoverBgDark: '#364151',
    line: '#eaecef',
    lineDark: '#435266',
    scrollbar: '#dc322f',
    scrollbarDark: '#687582',
    scrollbarHover: '#a6a6a6',
    scrollbarHoverDark: '#9da8b3',
    buttonBg: 'transparent',
    buttonBgDark: 'transparent',
    buttonHoverBg: '#f2f3f5',
    buttonHoverBgDark: '#46647e',
  },
  font: { size: '16px', family: null, letterSpacing: '0.02em', codeSize: '85%' },
  code: {
    copyBtn: true,
    language: { enable: true, default: 'TEXT' },
    highlight: { enable: true, lineNumber: true, style: 'github', styleDark: 'dark' },
  },
  features: {
    typing: { enable: true, typeSpeed: 60, cursorChar: '_', loop: false },
    anchorjs: { enable: true, element: 'h1,h2,h3,h4,h5,h6', placement: 'left', visible: 'hover', icon: '' },
    progressbar: { enable: true, heightPx: 3, color: '#29d', options: { showSpinner: false, trickleSpeed: 100 } },
  },
  analytics: { enable: true, followDnt: true, googleMeasurementId: 'G-8X396G5KJG' },
  lazyload: { enable: true, loadingImg: '/img/loading.gif', offsetFactor: 2 },
  navbar: {
    blogTitle: "Hamilton's home",
    groundGlass: { enable: true, px: 3, alpha: 0.7 },
    menu: [
      { label: 'Home', link: '/', icon: 'iconfont icon-home-fill' },
      { label: 'Archives', link: '/archives/', icon: 'iconfont icon-archive-fill' },
      { label: 'Categories', link: '/categories/', icon: 'iconfont icon-category-fill' },
      { label: 'Tags', link: '/tags/', icon: 'iconfont icon-tags-fill' },
      { label: 'About', link: '/about/', icon: 'iconfont icon-user-fill' },
    ],
  },
  search: { enable: true, path: '/local-search.xml', content: true },
  banner: { parallax: true, widthHeightRatio: 1.0 },
  scrollDownArrow: { enable: true, bannerHeightLimit: 80, scrollAfterTurningPage: true },
  scrollTopArrow: { enable: true },
  openGraph: { enable: true, twitterCard: 'summary_large_image' },
  footer: {
    content: '',
    statistics: { enable: true, pvFormat: 'Views: {}', uvFormat: 'Visitors: {}' },
  },
  index: {
    bannerImg: '/image/site/bg1.jpg',
    bannerHeight: 100,
    bannerMaskAlpha: 0.3,
    slogan: {
      enable: true,
      text: "Danger is real but fear is a choice                                   ..  Be yourself; everyone else is already taken                               ..  Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind",
      api: { enable: true, url: 'https://worker-subtitle.i-060.workers.dev/', method: 'GET', headers: {}, keys: ['data'] },
    },
    autoExcerpt: true,
    postUrlTarget: '_self',
    postMeta: { date: true, category: true, tag: true },
  },
  post: {
    bannerImg: '/image/site/default.png',
    bannerHeight: 70,
    bannerMaskAlpha: 0.3,
    meta: {
      author: true,
      date: { enable: true, format: 'LL a' },
      wordcount: { enable: true, format: '{} words' },
      min2read: { enable: true, format: '{} mins', awl: 2, wpm: 60 },
      views: { enable: true, format: '{} views' },
    },
    toc: { enable: true, placement: 'right', headingSelector: 'h1,h2,h3,h4,h5,h6', collapseDepth: 0 },
    copyright: { enable: true, license: 'BY', author: true, postDate: { enable: true, format: 'LL' } },
    prevNext: true,
    imageCaption: true,
    imageZoom: { enable: true, imgUrlReplace: ['', ''] },
  },
  archive: { bannerImg: '/image/site/default.png', bannerHeight: 60, bannerMaskAlpha: 0.3 },
  category: { bannerImg: '/image/site/default.png', bannerHeight: 60, bannerMaskAlpha: 0.3, postLimit: 10 },
  tag: {
    bannerImg: '/image/site/default.png',
    bannerHeight: 80,
    bannerMaskAlpha: 0.3,
    tagcloud: { minFont: 15, maxFont: 30, unit: 'px', startColor: '#BBBBEE', endColor: '#337ab7' },
  },
  about: {
    bannerImg: '/image/site/default.jpg',
    bannerHeight: 60,
    bannerMaskAlpha: 0.3,
    avatar: '/image/site/avatar.png',
    name: '<a target="_blank" rel="noopener" href=\'https://go.jusvail.com\'>Elizabeth Hamilton</a>',
    intro: 'History always repeats itself. Justice will finally prevail.',
    icons: [
      { class: 'iconfont icon-github-fill', link: 'https://jusvail.com/go/github', tip: 'GitHub' },
      { class: 'iconfont icon-steam', link: 'https://go.jusvail.com/steam', tip: 'Steam' },
      { class: 'iconfont icon-chess', link: 'https://go.jusvail.com/challenge', tip: 'OGS' },
    ],
  },
  page: { bannerImg: '/image/site/default.png', bannerHeight: 60, bannerMaskAlpha: 0.3 },
  page404: { bannerImg: '/image/site/default.png', bannerHeight: 85, bannerMaskAlpha: 0.3, redirectDelay: 5000 },
};
