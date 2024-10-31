/************************************************************
 * Align enum for anchor and childAnchor
 ***********************************************************/
const Anchor = {
    TL: 'topLeft',
    T:  'top',
    TR: 'topRight',
    L:  'left',
    C:  'center',
    CH: 'centerH',
    R:  'right',
    BL: 'bottomLeft',
    B:  'bottom',
    BR: 'bottomRight',
    F:  'fill'
};

/************************************************************
 * Theme
 ***********************************************************/
class Theme{
    constructor(opt) {
        this.name        = opt.name;
        this.text        = opt.text;
        this.textLight   = opt.textLight;
        this.background  = opt.background;
        this.link        = opt.link;
        this.linkHover   = opt.linkHover;
        this.linkVisited = opt.linkVisited;
        this.primary     = opt.primary;
        this.secondary   = opt.secondary;
        this.success     = opt.success;
        this.info        = opt.info;
        this.warning     = opt.warning;
        this.danger      = opt.danger;
        this.dark        = opt.dark;
        this.light       = opt.light;
        this.border      = opt.border;  // border style. eg. '1px solid red'
        this.radius      = opt.radius;
    }

    /** Theme light*/
    static themeLight = new Theme({
        name        : 'iOSLight',
        text        : 'black',
        textLight   : 'white',
        background  : 'white',
        link        : 'blue',
        linkHover   : 'darkblue',
        linkVisited : 'gray',
        primary     : '#007bff',
        secondary   : '#7633d4',
        success     : '#28a745',
        info        : '#17a2b8',
        warning     : '#ffc107',
        danger      : '#dc3545',
        dark        : '#343a40',
        light       : '#f8f9fa',
        //border      : '1px solid #cdcdcd',
        radius      : '8px',
    });

    /** Theme dark */
    static themeDark = new Theme({
        name        : 'MaterialDark',
        text        : '#cccccc',
        textLight   : '#f0f0f0', //'#f8f9fa',
        background  : '#171717',
        link        : 'red',
        linkHover   : 'green',
        linkVisited : 'gray',
        primary     : '#007bff',
        secondary   : '#7633d4',
        success     : '#28a745',
        info        : '#17a2b8',
        warning     : '#ffc107',
        danger      : '#dc3545',
        dark        : '#343a40',
        light       : '#f8f9fa',
        //border      : '1px solid #707070',
        radius      : '8px',
    });

    /** Global Theme*/
    static current = Theme.themeLight;

    /**
     * Set page theme.
     * @param {Theme} theme 
     */
    static setTheme(theme){
        this.current = theme;
        //document.body.style.transition = 'all 0.4s';
        //document.body.style.backgroundColor = theme.background;
        //document.body.style.color = theme.text;
        var eles = Array.from(document.querySelectorAll('*'));
        eles.forEach(ele => {
            if (ele instanceof HTMLElement){
                this.setBaseTheme(ele);
                if (ele.setTheme != undefined)
                  ele.setTheme();
            }
        });
        document.dispatchEvent(new Event('themechanged'));  // send message to document
    }

    /**
     * Set element theme.
     * @param {HTMLElement} ele 
     * @param {Theme} theme 
     */
    static setThemeCls(ele, themeCls){
        this.setBaseTheme(ele, themeCls);
        if (ele.setTheme != undefined){
            ele.setTheme();
        }
    }


    /**
     * Set theme for background and text color. Other settings will be setted in child class.
     * @param {HTMLElement} ele 
     */
    static setBaseTheme(ele, themeCls=null){
        if (themeCls == null)
            themeCls = ele.getAttribute('themeCls');
        if (themeCls == null)
            return;

        var t = Theme.current;
        ele.style.transition = 'all 0.4s';
        ele.style.color = t.text;
        switch (themeCls){
            case "bg":        ele.style.backgroundColor = t.background;  break;
            case "primary":   ele.style.backgroundColor = t.primary;     break;
            case "secondary": ele.style.backgroundColor = t.secondary;   break;
            case "success":   ele.style.backgroundColor = t.success;     break;
            case "info":      ele.style.backgroundColor = t.info;        break;
            case "warning":   ele.style.backgroundColor = t.warning;     break;
            case "danger":    ele.style.backgroundColor = t.danger;      break;
            default:          ele.style.backgroundColor = t.background;  break;
        }
        return ele;
    }
}


/************************************************************
 * Utils: sleep, theme, icon, color, px, position....
 ***********************************************************/
class Utils {
    //-----------------------------------------
    // Icon
    //-----------------------------------------
    /** Icon root path*/
    static iconRoot = "../img/";
    static iconFontRoot = '../iconfont/';

    /** Get icon url from icons root and icon name 
     * @param {string} name IconName without folder and extension
    */
    static getIconUrl(name){
        if (name.includes('.'))
            return this.iconRoot + name;
        return `${this.iconRoot}${name}.png`;
    }


    //-----------------------------------------
    // Log
    //-----------------------------------------
    /** Write log in container
     * @param (string) msg
     * @param (string) containerId Log container's id
     * @param (string) lvl  Message level: INFO, WARN, ERROR
     * @param (string) format Default : [{date}] {level} : {message}
    */
    static log(msg='', lvl='INFO', containerId='', format='[{date}] {level} : {message}'){
        // text
        if (format != ''){
            var dt = new Date();
            var dt = dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
            msg = format
                .replace('{date}', dt)
                .replace('{level}', lvl)
                .replace('{message}', msg)
                ;
        }

        // element
        var ele = document.createElement('div');
        ele.innerHTML = msg;
        ele.style.display = 'block';
        if (lvl == 'WARN')  ele.style.color = 'orange';
        if (lvl == 'ERROR') ele.style.color = 'red';

        // container
        var container = document.body;
        if (containerId != '')
            container = document.getElementById(containerId);
        container.appendChild(ele);
    }

    /**Clear logs */
    static clearLog(containerId){
        var container = document.body;
        if (containerId != '')
            container = document.getElementById(containerId);
        container.innerHTML = '';
    }


    //-----------------------------------------
    // Common
    //-----------------------------------------
    /**
     * async/await sleep 
     * @param {number} ms
     * @example await delay(20);
     */
    static sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**Take a nap by loop */
    static sleepNap(loop){
        while(loop > 0){
            loop--;
        }
    }

    /** Change func to async promise. eg. await toPromise(func); */
    static toPromise(func){
      return new Promise((resolve) => {
        func(); 
        resolve();
      });
    }

    /** Create unique id */
    static uuid(){
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**HtmlEncode string to & lt; & gt;...
     * @param {string} code 
    */
    static htmlEncode(code) {
        //return code.replace(/[<>&"']/g, function(match) {
        return code.replace(/[<>]/g, function(match) {
            switch (match) {
                case '<':   return '&lt;';
                case '>':   return '&gt;';
                //case '&':   return '&amp;';
                //case '"':   return '&quot;';
                //case "'":   return '&#39;';
            }
        });
    }

    /**HtmlDecode string to <>&'"
     * @param {string} code 
    */
    static htmlDecode(code) {
        return code
            .replace('&lt;',   '<')
            .replace('&gt;',   '>')
            .replace('&amp;',  '&')
            .replace('&quot;', '"')
            .replace('&#39;',  "'")
            ;
    }
    

    //-----------------------------------------
    // DOM
    //-----------------------------------------
    /** Get element by class or id
     * @param {string} selector eg. tagName #idName .className
     */
    static $(selector){
        return document.querySelector(selector);
    }

    /** Get all elements by class or id */
    static $$(selector){
       return document.querySelectorAll(selector);
    }

    /**Parse centain tag string to a html element node.
     * @param {string} tagText eg. <div>...</div>
     * @returns {ChildNode}
    */
    static parseElement(tagText){
        var parser = new DOMParser();
        var doc = parser.parseFromString(tagText, 'text/html');
        return doc.body.firstChild;
    }

    /**Insert link and check link whether exists 
     * @param {string} href 
    */
    static addLink(href) {
        if (!this.isLinkExist(href)) {
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', href);
            document.head.appendChild(link);
        }
    }

    /**Check link whether exists 
     * @param {string} href 
    */
    static isLinkExist(href) {
        const links = document.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            if (links[i].getAttribute('href') === href) {
                return true;
            }
        }
        return false;
    }



    //-----------------------------------------
    // DOM Calculate
    //-----------------------------------------
    /** Get view width */
    static get viewWidth() { return  window.innerWidth || document.documentElement.clientWidth;}

    /** Get view height */
    static get viewHeight() { return window.innerHeight || document.documentElement.clientHeight;}

    /** Center element in window */
    static centerlize(selector){
      const popup = document.querySelector(selector);
      const popupWidth = popup.offsetWidth;
      const popupHeight = popup.offsetHeight;
      popup.style.transtion = '';
      popup.style.left = (this.viewportWidth - popupWidth) / 2 + 'px';
      popup.style.top  = (this.viewportHeight - popupHeight) / 2 + 'px';
      popup.style.display = 'block';
    }

    /** Calculate element's real pixel value. 
     * @param {string} num css number expression, eg. 12px, 1em, 1rem
     * @param {Element} element when num unit is 'em', we need this parameter to calculate by parent node's size. 
    */
    static calcPx(num, element=null){
      if (num.endsWith('px')) {
        return parseInt(num, 10);
      } else if (num.endsWith('rem')) {
        const rootFontSize   = parseInt(getComputedStyle(document.documentElement).fontSize, 10);
        return parseInt(num, 10) * rootFontSize;
      } else if (num.endsWith('em')) {
        const parentFontSize = parseInt(getComputedStyle(element.parentNode).fontSize, 10);
        return parseInt(num, 10) * parentFontSize;
      }
      return 0;
    }

    /**Get element's real bound 
     * @param {Element} ele 
     * @returns DOMRect
    */
    static calcBound(ele){
      return ele.getBoundingClientRect();
    }

    /**
     * Calc element's real display style.
     * @param {Element} ele 
     * @returns CSSStyleDeclaration
     */
    static calcStyle(ele){
        return getComputedStyle(ele);
    }

    /**
     * Search and remove &lt;style&gt; tag that contains certain stylename (eg. '.mytag')
     * @param {string} styleName 
     */
    static removeStyleTag(styleName) {
        const styleTags = document.getElementsByTagName('style');
        for (let i = 0; i < styleTags.length; i++) {
            const tag = styleTags[i];
            if (tag.textContent.includes(styleName)) {
                tag.remove();
            }
        }
    }

    //-----------------------------------------------------
    // Animation
    //-----------------------------------------------------
    /**
     * Make animation
     * @param {HTMLElement} ele
     * @param {function} animFunc  target animation function. eg. this.style.height='0px';
     * @param {function} endFunc callback animation when finished. eg. this.style.visibility = 'hidden';
     * @param {number} second animation duration seconds
     * @param {string} [easing='ease'] easing animation name 
     * @example tag.animate((ele)=> ele.style.height = '0px');
     */
    static animate(ele, animFunc, endFunc=null, second=0.1, easing='ease'){
        ele.style.transition = `all ${second}s ${easing}`;
        if (endFunc != null)
            ele.addEventListener('transitionend', () => endFunc(ele), { once: true });
        requestAnimationFrame(() => animFunc(ele));
    }



    //-----------------------------------------
    // Convertor
    //-----------------------------------------
    /**Get boolean value 
     * @param {string | boolean} val 
    */
    static toBool(val){
        var type = typeof val;
        if (type == 'boolean') return val;
        if (type == 'string')  return val.toLowerCase() == 'true';
        return false;
    }
    

    //-----------------------------------------
    // Color
    //-----------------------------------------
    /** Build random color */
    static getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
  }

    /** Build opacity color */
    static getOpacityColor(rawColor, opacity) {
        var clr = this.parseColor(rawColor);
        if (clr!= null)
          return `rgba(${clr.r}, ${clr.g}, ${clr.b}, ${opacity})`;
        return 'white';
    }

    /** Build lighter color */
    static getLighterColor(color, factor = 0.5) {
        const rgb = this.parseColor(color);
        if (!rgb) return null;
      
        const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor));
        const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor));
        const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor));
      
        if (rgb.hasOwnProperty('a')) {
          return `rgba(${r}, ${g}, ${b}, ${rgb.a})`;
        } else {
          return `rgb(${r}, ${g}, ${b})`;
        }
      }
      
    /** Build darker color */
    static getDarkerColor(color, factor = 0.5) {
        const rgb = this.parseColor(color);
        if (!rgb) return null;
      
        const r = Math.max(0, Math.round(rgb.r * (1 - factor)));
        const g = Math.max(0, Math.round(rgb.g * (1 - factor)));
        const b = Math.max(0, Math.round(rgb.b * (1 - factor)));
      
        if (rgb.hasOwnProperty('a')) {
          return `rgba(${r}, ${g}, ${b}, ${rgb.a})`;
        } else {
          return `rgb(${r}, ${g}, ${b})`;
        }
      }

    static parseColor(colorStr) {
        let rgb;
        if (colorStr.startsWith('#')) {
          rgb = this.hexToRgb(colorStr);
        } else if (colorStr.startsWith('rgb(')) {
          rgb = this.rgbFromRgbExpression(colorStr);
        } else if (colorStr.startsWith('rgba(')) {
          rgb = this.rgbaFromRgbaExpression(colorStr);
        } else {
          return null;
        }
        return rgb;
    }
      
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
            : null;
    }
      
    static rgbFromRgbExpression(rgbExpression) {
        const values = rgbExpression.match(/\d+/g);
        return values
            ? {
              r: parseInt(values[0]),
              g: parseInt(values[1]),
              b: parseInt(values[2]),
            }
            : null;
    }
      
    static rgbaFromRgbaExpression(rgbaExpression) {
        const values = rgbaExpression.match(/[\d.]+/g);
        return values
            ? {
              r: parseInt(values[0]),
              g: parseInt(values[1]),
              b: parseInt(values[2]),
              a: parseFloat(values[3]),
            }
            : null;
      }

    //-----------------------------------------
    // Ajax
    //-----------------------------------------
    /**Parse QueryString 
     * @param {string} url
     * @returns {object} 
    */
    static getQueryStrings(url) {
        const queryString = url.split('?')[1];
        if (!queryString) {
            return {};
        }
        return queryString.split('&').reduce((acc, pair) => {
            const [key, value] = pair.split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
    }

    /**Async Ajax get
     * @param {string} url 
    */
    static async get(url) {
        return await this.ajax('GET', url);
    }

    /**Async Ajax post
     * @param {string} url 
     * @param {object} data 
    */
    static async post(url, data) {
        return await this.ajax('GET', url, data);
    }

    /**Async Ajax 
     * @param {string} method GET|POST
     * @param {string} url 
     * @param {object} data valid when method is POST 
    */
    static async ajax(method, url, data=null){
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  const content = xhr.responseText;
                  resolve(content);
                } else {
                  reject(new Error('Failed to fetch the page.'));
                }
              }
            };

            xhr.send(data);
          });    
    }
}

/*************************************************************
 * NoCss class : Write html with only attribute, no CSS anymore.
 * @author surfsky.github.com 2024-10
 *************************************************************/
class NoCss{

    /**Regist convenient properties */
    static registProperties(){
        //var baseAttrs = this.getPropertyNames(document.createElement('div').style);
        //var attrs = ['radius', 'bgcolor'].concat(baseAttrs);
        var names = [
            // alias
            'width', 'height', 'margin', 'padding', 'top', 'left', 'right', 'bottom', 
            'gridC', 'gridR', 

            // basic
            'newClass', 'z', 'visible',
    
            // box module
            'box', 'radius',  
    
            // position
            'anchor', 'lineAnchor', 'fixAnchor', 'dock', 
    
            // child
            'childAnchor', 'childMargin', 'childPadding',
    
            // theme
            'themeCls', 'color',
            'bg','bgColor', 'bgImage', 'bgRepeat', 'bgPosition', 'bgSize',
        
            // effect
            'shadow', 'transform', 'rotate', 'scale', 'skew', 'textShadow', 
            'hoverBgColor', 'hoverColor',
    
            // event
            'events', 'click', 'draggable',
        ];
        names.forEach((name) =>{
            var self = this;
            HTMLElement.prototype.__defineGetter__(name, function(){
                //return this.getAttribute(name);
                return self.getCustomAttribute(this, name);
            });
            HTMLElement.prototype.__defineSetter__(name, function (value) { 
                this.setAttribute(name, value);
                self.setCustomAttribute(this, name, value); 
            });
        });
    }

    /**
     * static constrctor
     */
    static {
        // create observer for dom changing.
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                const ele = mutation.target;
                if (mutation.type == 'childList'){
                    // when new element created, set it's custom attributes.
                    if (mutation.addedNodes.length > 0){
                        mutation.addedNodes.forEach((node)=>{
                            if (node instanceof HTMLElement)
                                this.setCustomAttributes(node);
                        });
                    }
                }
                else if (mutation.type === 'attributes') {
                    var name = mutation.attributeName;
                    if (name != 'style' && name != 'id')
                        this.setCustomAttribute(ele, name, ele.getAttribute(name));
                }
            }
        });
        observer.observe(document, { attributes: true, childList: true, subtree: true });
    }


    //-----------------------------------------------------
    // Custom tag
    //-----------------------------------------------------
    /**Custom tag renders */
    static customTags = {};

    /**Regist tag render 
     * @param {string} name 
     * @param {Tag} tag 
    */
    static registCustomTag(name, tag){
        name = name.toLowerCase();
        this.customTags[name] = tag;
    }

    /**Get custom tag render
     * @param {HTMLElement} ele  
     * @returns {Tag}
     */
    static getCustomTag(ele){
        var name = ele.tagName.toLowerCase();
        var render = this.customTags[name];
        return render;
    }

    //-----------------------------------------------------
    // Attributes
    //-----------------------------------------------------
    /**Get attribute value
     * @param {HTMLElement} ele
     * @param {string} name  
     */
    static getCustomAttribute(ele, name){
        var styleName = this.styleNames.find(t => t.toLowerCase() === name);
        if (styleName != null)
            return ele.style[styleName];
        return ele.getAttribute(name);
    }

    /**Set custom attributes values
    * @param {HTMLElement} ele
    */
    static setCustomAttributes(ele){
        // custome tag render process
        var render = this.getCustomTag(ele);
        if (render != null){
            ele = render.render(ele);
        }

        // set attributes
        var attrs = ele.getAttributeNames();
        attrs.forEach((attr) => {
            var val = ele.getAttribute(attr);
            if (val != null)
                this.setCustomAttribute(ele, attr, val);
        })
    }

    // style keys has 638-645 items.
    static styleNames = Object.keys(document.createElement('div').style);

    /**Set custom attribute value
    * @param {HTMLElement} ele
    * @param {string} name 
    * @param {string} newValue 
    */
    static setCustomAttribute(ele, name, newValue){
        // set basic style property (support low/high case)
        this.styleNames.forEach(k =>{
            if (k.toLowerCase() == name) {
                ele.style[k] = newValue;
                return;
            }
        });

        // set extension attribute value
        switch(name.toLowerCase()){
            // alias
            case 'z':                 ele.style.zIndex = newValue; break;
            case 'radius':            ele.style.borderRadius = newValue;  break;
            case 'box':               ele.style.boxSizing = newValue; break;
            case 'bg':                ele.style.background = newValue; break;
            case 'bgcolor':           ele.style.backgroundColor = newValue;  break;
            case 'bgimage':           ele.style.backgroundImage = `url('${newValue}')`; break;
            case 'bgrepeat':          ele.style.backgroundRepeat = newValue; break;
            case 'bgposition':        ele.style.backgroundPosition = newValue; break;
            case 'bgsize':            ele.style.backgroundSize = newValue; break;
            case 'events':            ele.style.pointerEvents = newValue; break;
            case 'gridc':             this.setGridColumn(ele, newValue); break;
            case 'gridr':             this.setGridRow(ele, newValue); break;

            // common
            case 'newclass':          ele.classList.add(newValue); break; //.setAttribute('class', newValue + ' ' + ele.getAttribute('class')); break;
            case 'visible':           this.setVisible(ele, newValue); break;

            // anchor(position)
            case 'anchor':            this.setAnchor(ele, newValue, 'absolute'); break;
            case 'fixanchor':         this.setAnchor(ele, newValue, 'fixed'); break;
            case 'dock':              this.setDock(ele, newValue, 'absolute'); break;
            case 'lineanchor':        this.setLineAnchor(ele, newValue); break;

            // child
            case 'childanchor':       this.setChildAnchor(ele, newValue); break;
            case 'childmargin':       this.setChildStyle(ele, 'margin', newValue); break;
            case 'childpadding':      this.setChildStyle(ele, 'padding', newValue); break;


            // theme
            case 'themecls':          Theme.setThemeCls(ele, newValue); break;

            // effect
            case 'shadow':            this.setShadow(ele, newValue); break;
            case 'textshadow':        this.setTextShadow(ele, newValue); break;
            case 'rotate':            ele.style.transform = `rotate(${newValue}deg)`; break;
            case 'skew':              ele.style.transform = `skew(${newValue}deg)`; break;
            case 'scale':             ele.style.transform = `scale(${newValue})`; break;
            case 'hoverbgcolor':      this.setHoverBgColor(ele, newValue); break;
            case 'hovercolor':        this.setHoverTextColor(ele, newValue);  break;

            // event
            case 'click':             this.setClick(ele, newValue); break;
            case 'draggable':         ele.setAttribute('draggable', newValue); break;
        }
    }

    //-----------------------------------------------------
    // Common
    //-----------------------------------------------------
    /**Get property names 
     * @param {object} o 
     * @returns {string[]}
    */
    static getPropertyNames(o){
        var names = [];
        for (let prop in o) {
            if (o.hasOwnProperty(prop)) {
                names.push(prop);
            }
        }
        return names;
    }

    /**Get or build uuid id. 
     * @param {Element} ele 
    */
    static getId(ele){
        var id = ele.id;
        if (id == ''){
            var idAttr = ele.getAttribute('id');
            if (idAttr != null)
                id = idAttr;
            else
                id = Utils.uuid();
        }
        return id;
    }

    /** Create unique id */
    static uuid(){
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    /** Save element's styleTage element 
    * @param {HTMLElement} ele
    */
    static saveStyle(ele){
        if (ele.styleTag == null) return;
        ele.id = this.getId(ele);
        var styleId = ele.id + '-style';
        ele.styleTag.id = styleId;

        //
        var tag = document.getElementById(styleId);
        if (tag == null)
            document.head.appendChild(ele.styleTag);
        else
            tag.textContent = ele.styleTag.textContent;
    }

    /** Set children style
     * @param {HTMLElement} ele 
     * @param {string} name css style name. eg. margin
     * @param {string} val css number. eg. 10px, 1em, 1rem
    */
    static setChildStyle(ele, name, val){
        ele.id = this.getId(ele);
        if (ele.styleTag == null)
            ele.styleTag = document.createElement('style');
        ele.styleTag.textContent = `#${ele.id} > *  {${name}: ${val} }`;
        this.saveStyle(ele);
    }


    //-----------------------------------------------------
    // Anchor
    //-----------------------------------------------------
    /**
     * Set anchor
     * @param {HTMLElement} ele
     * @param {string} anchor see Anchor
     * @param {string} [position='absolute'] positon type: absolute | fixed
     * @description
        .fixTopLeft    {position:fixed; top:0px;    left:0px; }
        .fixTop        {position:fixed; top:0px;    left:50%; transform: translateX(-50%);}
        .fixTopRight   {position:fixed; top:0px;    right:0px; }
        .fixBottomLeft {position:fixed; bottom:0px; left:0px; }
        .fixBottom     {position:fixed; bottom:0px; left:50%; transform: translateX(-50%); }
        .fixBottomRight{position:fixed; bottom:0px; right:0px; }
        .fixLeft       {position:fixed; top:50%;    left:0px; transform: translateY(-50%); }
        .fixCenter     {position:fixed; top:50%;    left:50%;transform: translate3D(-50%, -50%, 0); }
        .fixRight      {position:fixed; top:50%;    right:0px; transform: translateY(-50%); }
        .fill          {position:fixed; top:0px;    left:0px;  right:0px; bottom:0px; }
    */
    static setAnchor(ele, anchor, position='absolute'){
        var s = ele.style;
        switch (anchor){
            case Anchor.TL  : s.position=position; s.top='0px';    s.left='0px';  break;
            case Anchor.T   : s.position=position; s.top='0px';    s.left='50%';  s.transform='translateX(-50%)';break;
            case Anchor.TR  : s.position=position; s.top='0px';    s.right='0px'; break;
            case Anchor.BL  : s.position=position; s.bottom='0px'; s.left='0px';  break;
            case Anchor.B   : s.position=position; s.bottom='0px'; s.left='50%';  s.transform='translateX(-50%)'; break;
            case Anchor.BR  : s.position=position; s.bottom='0px'; s.right='0px'; break;
            case Anchor.L   : s.position=position; s.top='50%';    s.left='0px';  s.transform='translateY(-50%)';           break;
            case Anchor.C   : s.position=position; s.top='50%';    s.left='50%';  s.transform='translate3D(-50%, -50%, 0)'; break;
            case Anchor.R   : s.position=position; s.top='50%';    s.right='0px'; s.transform='translateY(-50%)';           break;
            case Anchor.F   : s.position=position; s.top='0';      s.right='0';   s.bottom='0';   s.left='0'; s.width='100%'; s.height='100%';              break;  //
        }
        return ele;
    }

    /**
     * Set flow mode line anchor
     * @param {HTMLElement} ele
     * @param {string} anchor left|center|right
    */
    //static setLineAnchor(ele, anchor){
    //    var s = ele.style;
    //    s.display = 'block';
    //    switch (anchor){
    //        case Anchor.L   : s.width='400px'; s.marginLeft = 0;       break;
    //        case Anchor.C   : s.width='400px'; s.margin = '0 auto';    break;
    //        case Anchor.R   : s.width='400px'; s.marginLeft = 'auto'; s.marginRight = 0; break;
    //    }
    //    return ele;
    //}
    static setLineAnchor(ele, anchor){
        var s = ele.style;
        s.display = 'block';
        switch (anchor){
            case Anchor.L   : s.width='400px'; s.marginLeft = 0;       break;
            case Anchor.C   : s.width='400px'; s.margin = '0 auto';    break;
            case Anchor.R   : s.width='400px'; s.marginLeft = 'auto'; s.marginRight = 0; break;
        }
        return ele;
    }
    

    /**
     * Set child anchor
     * @param {HTMLElement} ele
     * @param {Anchor} anchor 
     .childTopLeft       {display: flex; justify-content: flex-start;  align-items: flex-start;}
    .childTop           {display: flex; justify-content: center;      align-items: flex-start;}
    .childTopRight      {display: flex; justify-content: flex-end;    align-items: flex-start;}
    .childBottomLeft    {display: flex; justify-content: flex-start;  align-items: flex-end;}
    .childBottom        {display: flex; justify-content: center;      align-items: flex-end;}
    .childBottomRight   {display: flex; justify-content: flex-end;    align-items: flex-end;}
    .childLeft          {display: flex; justify-content: flex-start;  align-items: center;}
    .childCenter        {display: flex; justify-content: center;      align-items: center; flex-direction: column;}
    .childRight         {display: flex; justify-content: flex-end;    align-items: center;}
    */
    static setChildAnchor(ele, anchor){
        var s = ele.style;
        if (anchor == null || anchor == ""){
            s.display = '';
            s.flexDirection  = '';     
            s.justifyContent = '';  
            s.alignItems = '';
        }
        else{
            s.display = 'flex';
            switch (anchor){
                case Anchor.TL  : s.flexDirection='row';     s.justifyContent='flex-start';  s.alignItems='flex-start'; break;
                case Anchor.T   : s.flexDirection='row';     s.justifyContent='center';      s.alignItems='flex-start'; break;
                case Anchor.TR  : s.flexDirection='row';     s.justifyContent='flex-end';    s.alignItems='flex-start'; break;
                case Anchor.L   : s.flexDirection='row';     s.justifyContent='flex-start';  s.alignItems='center';     break;
                case Anchor.C   : s.flexDirection='column';  s.justifyContent='center';      s.alignItems='center';     break;
                case Anchor.CH  : s.flexDirection='row';     s.justifyContent='center';      s.alignItems='center';     break;
                case Anchor.R   : s.flexDirection='row';     s.justifyContent='flex-end';    s.alignItems='center';     break;
                case Anchor.BL  : s.flexDirection='row';     s.justifyContent='flex-start';  s.alignItems='flex-end';   break;
                case Anchor.B   : s.flexDirection='row';     s.justifyContent='center';      s.alignItems='flex-end';   break;
                case Anchor.BR  : s.flexDirection='row';     s.justifyContent='flex-end';    s.alignItems='flex-end';   break;
                case Anchor.F   : this.setChildFill();   break;
            }
        }
        return ele;
    }

    /** Set child fill parent. Add css. 
     * @param {HTMLElement} ele
    */
    static setChildFill(ele){
        ele.style.display = 'flex';
        ele.id = this.getId(ele);
        if (ele.styleTag == null){
            ele.styleTag = document.createElement('style');
        }
        ele.styleTag.textContent = `#${ele.id} > * { flex: 1}`;
        this.saveStyle(ele);
    }

    /**Set dock 
     * @param {HTMLElement} ele
     * @param {string} anchor top, left, right, bottom 
    */
    static setDock(ele, anchor, position='absolute'){
        var s = ele.style;
        switch (anchor){
            case Anchor.T   : s.position=position; s.width='';               s.top='0';                      s.left='0';    s.right='0';   break;
            case Anchor.B   : s.position=position; s.width='';               s.bottom='0';   s.left='0';    s.right='0';   break;
            case Anchor.L   : s.position=position; s.height='';              s.top='0';      s.bottom='0';   s.left='0';                   break;
            case Anchor.R   : s.position=position; s.height='';              s.top='0';      s.bottom='0';                  s.right='0';   break;
            case Anchor.F   : s.position=position; s.width='';  s.height=''; s.top='0';      s.bottom='0';   s.left='0';    s.right='0';   break;
        }
        return this;
    }

    //-----------------------------------------------------
    // Effect
    //-----------------------------------------------------
    /** Set box shadow
     * @param {HTMLElement} ele
     * @param {string | boolean} newValue 
    */
    static setShadow(ele, newValue){
        if (newValue == 'true' || newValue == true)
            ele.style.boxShadow = '5px 5px 10px lightgray';
        else if (newValue == 'false' || newValue == false)
            ele.style.boxShadow = '';
        else
            ele.style.boxShadow = newValue;
        return ele;
    }

    /** Set text shadow
     * @param {HTMLElement} ele
     * @param {string | boolean} newValue 
    */
    static setTextShadow(ele, newValue){
        if (newValue == 'true' || newValue == true)
            ele.style.textShadow = '5px 5px 10px black';
        else if (newValue == 'false' || newValue == false)
            ele.style.textShadow = '';
        else
            ele.style.textShadow = newValue;
        return ele;
    }

    /**
     * Set hover background color
     * @param {HTMLElement} ele
     * @param {Color} color 
     */
    static setHoverBgColor(ele, color){
        var oldColor  = ele.style.backgroundColor;
        var oldCursor = ele.style.cursor;
        ele.addEventListener('mouseover', () => {
            ele.style.backgroundColor = color;
            ele.style.cursor = 'pointer';
        });
        ele.addEventListener('mouseout', () => {
            ele.style.backgroundColor = oldColor;
            ele.style.cursor = oldCursor;
        });
        return ele;
    }

    /**
     * Set hover text color
     * @param {HTMLElement} ele
     * @param {Color} color 
     */
    static setHoverTextColor(ele, color){
        var element = ele;
        var oldColor = element.style.color;
        var oldCursor = element.style.cursor;
        element.addEventListener('mouseover', function() {
            element.style.color = color;
            element.style.cursor = 'pointer';
        });
        element.addEventListener('mouseout', function() {
            element.style.color = oldColor;
            element.style.cursor = oldCursor;
        });
        return ele;
    }

    /**
     * Set hover opacity color
     * @param {HTMLElement} ele
     * @param {Color} color 
     */
    static setHoverOpacity(ele, opacity){
        var element = ele;
        var oldValue = element.style.opacity;
        var oldCursor = element.style.cursor;
        element.addEventListener('mouseover', function() {
            element.style.opacity = opacity;
            element.style.cursor = 'pointer';
        });
        element.addEventListener('mouseout', function() {
            element.style.opacity = oldValue;
            element.style.cursor = oldCursor;
        });
        return ele;
    }
        
    /**
     * Set visible
     * @param {HTMLElement} ele
     * @param {boolean} newValue 
     */
    static setVisible(ele, newValue){
        var b = (newValue=='true' || newValue==true);
        ele.style.visibility = b ? 'visible' : 'hidden';
        return ele;
    }


    /**
     * Set enable. If disable, it become gray, and cannot click. 
     * @param {HTMLElement} ele
     * @param {boolean} b 
     */
    static setEnable(ele, b){
        if (b){
            ele.disabled = false;
            ele.style.pointerEvents = '';
            ele.style.filter = '';
        }
        else{
            ele.disabled = true;
            ele.style.pointerEvents = 'none';
            ele.style.filter = 'grayscale(100%)';
        }
        return ele;
    }


    //-----------------------------------------------------
    // Event
    //-----------------------------------------------------
    /** Set click event 
     * @param {HTMLElement} ele
     * @param {function | string} func 
    */
    static setClick(ele, func){
        ele.addEventListener('click', (e)=>{
            e.stopPropagation(); // no send event to other
            eval(func);
        });
        return ele;
    }


    /**Set grid column 
     * @param {HTMLElement} ele
     * @param {string} expr start-length or start/end
     */
    static setGridColumn(ele, expr){
        if (expr.indexOf('-') != -1){
            // start-length
            const parts = expr.split("-");
            ele.style.gridColumnStart = parts[0];
            ele.style.gridColumnEnd = parseInt(parts[1]) + 1;
        }
        else{
            // start/end
            ele.style.gridColumn = expr;
        }
        return ele;
    }

    /**Set grid row
     * @param {HTMLElement} ele
     * @param {string} expr start-length or start/end
     */
    static setGridRow(ele, expr){
        if (expr.indexOf('-') != -1){
            // start-length
            const parts = expr.split("-");
            ele.style.gridRowStart = parts[0];
            ele.style.gridRowEnd = parseInt(parts[1]) + 1;
        }
        else{
            // start/end
            ele.style.gridRow = expr;
        }
        return ele;
    }
}

/*************************************************************
 * Tag render base
 *************************************************************/
class Tag{
    /**Render tag 
     * @param {HTMLElement} ele Element parsed by page engine.
    */
    render(ele) {
        ele.style.transition = 'all 0.4s';
        return ele;
    }
}

/*************************************************************
 * Rect
 *************************************************************/
class Rect extends Tag{
    static { NoCss.registCustomTag('Rect', new Rect()); }

    /**@param {HTMLElement} ele */
    render(ele) {
        super.render(ele);
        ele.style.width = '100px';
        ele.style.height = '100px';
        ele.style.border = '1px solid #a0a0a0';
        ele.style.boxSizing = 'border-box';
        ele.style.overflow = 'hidden';
        if (ele.innerHTML != '')
            NoCss.setChildAnchor(ele, 'center');
        return ele;
    }
}

/*************************************************************
 * Circle
 *************************************************************/
class Circle extends Tag{
    static { NoCss.registCustomTag('Circle', new Circle()); }

    /**@param {HTMLElement} ele */
    render(ele) {
        ele.style.border = '1px solid #a0a0a0';
        ele.style.boxSizing = 'border-box';
        ele.style.overflow = 'hidden';
        var width = ele.getAttribute('width');
        if (width != null){
            ele.style.height = width;
            ele.style.borderRadius = '50%';
        }
        if (ele.innerHTML != '')
            NoCss.setChildAnchor(ele, 'center');
        return ele;
    }
}


/***********************************************************
 * Row container
 * @example
 *     <row gap="20px">
 ***********************************************************/
class Row extends Tag {
    static { NoCss.registCustomTag('Row', new Row());}

    /**@param {HTMLElement} ele */
    render(ele) {
        ele.style.width = '100%';
        ele.style.height = '100px';
        ele.style.display = "flex";
        ele.style.flexDirection = "row";
        var gap = ele.getAttribute('gap');
        if (gap != null)
            NoCss.setChildStyle(ele, 'margin', `0 ${gap} 0 0`);
        return ele;
    }
}


/***********************************************************
 * Column container
 * @example
 *     <column gap="20px">
 ***********************************************************/
class Column extends Tag {
    static { NoCss.registCustomTag('Column', new Column());}  // 'col' will collide

    /**@param {HTMLElement} ele */
    render(ele) {
        ele.style.width = '100px';
        ele.style.height = '100%';
        ele.style.display = "flex";
        ele.style.flexDirection = "column";
        var gap = ele.getAttribute('gap');
        if (gap != null)
            NoCss.setChildStyle(ele, 'margin', `0 0 ${gap} 0`);
        return ele;
    }
}

/************************************************************
 * Grid container
 * @example
 *     <grid gap="20px" columns='4'>
 *     <grid gap="20px" columns='100px auto 100px'>
 ***********************************************************/
class Grid extends Tag {
    static { NoCss.registCustomTag('Grid', new Grid()); }

    /**@param {HTMLElement} ele */
    render(ele) {
        ele.style.display = "grid";
        ele.style.gap = '10px';
        this.setColumns(ele, 4);

        var gap = ele.getAttribute('gap');
        if (gap != null)  
            ele.style.gap = gap;
        var cols = ele.getAttribute('columns');
        if (cols != null)  
            this.setColumns(ele, cols);
        var rows = ele.getAttribute('rows');
        if (rows != null)  
            this.setRows(ele, rows);

        return ele;
    }

    isNumberString(str) {
        const num = Number(str);
        return !isNaN(num);
    }

    setColumns(ele, val){
        if (this.isNumberString(val))
            ele.style.gridTemplateColumns = `repeat(${val}, 1fr)`; 
        else
            ele.style.gridTemplateColumns = val;
    }

    setRows(ele, val)   { 
        if (this.isNumberString(val))
            ele.style.gridTemplateRows = `repeat(${val}, 1fr)`; 
        else
            ele.style.gridTemplateRows = val;
    }
}




/************************************************************
 * Responsive form grid container to display 1-4 columns
 * @example
 *     <form>
 ***********************************************************/
class Form extends Tag {
    static { NoCss.registCustomTag('Form', new Form()); }

    /**@param {HTMLElement} ele */
    render(ele) {
        ele.classList.add('gridForm');
        ele.id = NoCss.getId(ele);
        var gap = ele.getAttribute('gap');
        if (gap != null)
            ele.style.gap = gap;

        ele.styleTag = this.createStyle(ele);
        NoCss.saveStyle(ele);
        return ele;
    }

    createStyle(ele){
        var id = ele.id;
        const style = document.createElement('style');
        style.textContent = `
            /* Responsive form grid container to display 1-4 columns*/
            .gridForm {
                display: grid;
                gap: 10px;
                padding: 10px;
            }
            @media (min-width: 400px)  {.gridForm { grid-template-columns: auto; }}
            @media (min-width: 800px)  {.gridForm { grid-template-columns: 100px auto; }}
            @media (min-width: 1000px) {.gridForm { grid-template-columns: 100px auto 100px auto; }}
            @media (min-width: 1200px) {.gridForm { grid-template-columns: 100px auto 100px auto 100px auto 100px auto;}}
            @media (min-width: 1400px) {.gridForm { grid-template-columns: 100px auto 100px auto 100px auto 100px auto 100px auto 100px auto;}}
            .gridForm > * {text-align: left; height: 30px;}
            .gridForm > label {padding-top: 0px;}
            .gridForm > input {border-radius: 4px; border: 1px solid gray;}
        `;
        return style;
    }
}



/************************************************************
 * Responsive container
 * @example
 *     <Container>
 ***********************************************************/
class Container extends Tag {
    static { NoCss.registCustomTag('Container', new Container()); }

    /**@param {HTMLElement} ele */
    render(ele) {
        ele.id = NoCss.getId(ele);
        ele.style.display = 'block';
        ele.style.transition = 'all 0.5s';   // animation
        ele.styleTag = this.createStyle(ele);
        NoCss.saveStyle(ele);
        return ele;
    }

    createStyle(ele){
        var id = ele.id;
        const style = document.createElement('style');
        style.textContent = `
            #${id} {
                width: 100%;
                margin-left: auto;
                margin-right: auto;
                padding-left: 15px;
                padding-right: 15px;
            }

            /* Responsive container 540-720-960-1140 */
            @media (min-width: 576px)  { #${id}   {max-width: 540px;}}  /*xs*/
            @media (min-width: 768px)  { #${id}   {max-width: 720px;}}  /*s*/
            @media (min-width: 992px)  { #${id}   {max-width: 960px;}}  /*m*/
            @media (min-width: 1200px) { #${id}   {max-width: 1140px;}} /*l*/
            @media (min-width: 1500px) { #${id}   {max-width: 1400px;}} /*xl*/
            @media (min-width: 1800px) { #${id}   {max-width: 1700px;}} /*xxl*/
            @media (min-width: 2000px) { #${id}   {max-width: 1900px;}} /*xxxl*/
        `;
        return style;
    }
}



/************************************************************
 * Button
 * @example
 *     <x-btn click='alert("...")' ripple='true'></x-btn>
 * @description
 *     - default theme like bootstrap
 *     - support click disable and become gray
 ***********************************************************/
class Button extends Tag {
    static { NoCss.registCustomTag('Button', new Button()); }

    /**@param {HTMLElement} ele */
    render(ele) {
        ele.style.boxSizing = 'border-box';
        ele.style.transition = 'all 0.5s';  // animation
        ele.style.padding = "10px";
        ele.style.overflow = 'hidden';
        ele.style.borderRadius = "8px";
        ele.style.borderWidth = "0px";
        ele.style.height = '44px';
        ele.style.width = '120px';
        ele.style.userSelect = 'none';   // can't select button text
        ele.style.textAlign = 'center';  // horizontal center text
        NoCss.setHoverOpacity(ele, '0.8');

        var icon = ele.getAttribute('icon');
        if (icon != null) {
            // <icon color='black'  fontsize="34px" key='user'      ></icon>
            var tag = document.createElement('icon');
            tag.setAttribute('key', icon);
            tag.style.color = Theme.current.textLight;
            tag.style.fontSize = '20px';
            tag.style.marginRight = '4px';
            ele.insertBefore(tag, ele.firstChild);
        }

        // event
        //var click = ele.getAttribute('click');
        //if (click != null) this.setClick(ele, click, false);
        var asyncClick = ele.getAttribute('asyncClick');
        if (asyncClick != null) this.setClick(ele, asyncClick, true);

        // default themecls
        var themeCls = ele.getAttribute('themeCls');
        if (themeCls == null) ele.setAttribute('themeCls', 'primary');

        // theme
        ele.setTheme = function(){
            var o = Theme.current;
            ele.style.borderRadius = o.radius;
            ele.style.color = o.textLight;
            if (o.border == null || o.border == ''){
                var clr = Utils.getDarkerColor(ele.style.backgroundColor, 0.2);
                ele.style.border = `1px solid ${clr}`;
            }
            else{
                ele.style.border = o.border;
            }
        }
        ele.setTheme();
        return ele;
    }


    /**
     * Set click event
     * @param {function | string} func callback function or string. eg. "alert('hello world');"
     * @param {boolean} [isAsync=false] Whether the func is async?
     */
    setClick(ele, func, isAsync=false) {
        if (isAsync)
            ele.addEventListener('click', async (e) => {
                e.stopPropagation(); // no send event to other

                // disable - eval - enable
                NoCss.setEnable(ele, false);
                if (typeof func === 'string')
                    await eval(`(async () => {${func}})()`);
                else
                    await func();
                NoCss.setEnable(ele, true);
            });
        else{
            ele.addEventListener('click',  (e) => {
                e.stopPropagation();

                // disable - eval - enable
                //this.setEnable(false);
                if (typeof func === 'string')
                    eval(func);
                else
                    func();
                //this.setEnable(true);
            });
        }
    }
}


/************************************************************
 * Mask
 * @example
 *     Mask.show(100);
 *     Mask.hide();
 ***********************************************************/
class Mask {
    static async show(z = 99) {
        if (this.overlay == null) {
            this.overlay = document.createElement('div');
            this.overlay.style.position = 'fixed';
            this.overlay.style.top = 0;
            this.overlay.style.left = 0;
            this.overlay.style.width = '100%';
            this.overlay.style.height = '100%';
            this.overlay.style.display = 'none';
            this.overlay.style.transition = 'all 0.5s';
            this.overlay.style.zIndex = z;
            document.body.appendChild(this.overlay);
        }
        this.overlay.style.display = 'block';
        //this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
        await Utils.sleep(50);
        this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    }

    static async hide() {
        if (this.overlay != null) {
            this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
            await Utils.sleep(500);
            this.overlay.style.display = 'none';
            document.body.removeChild(this.overlay);
            this.overlay = null;
        }
    }
}



/************************************************************
 * Toast
 * @example
 *     Toast.show('info', 'message info');
 ***********************************************************/
class Toast {
    static counter = 0;

    /**
     * Show toast
     * @param {string} icon iconname without extension
     * @param {string} text information 
     */
    static async show(text, icon='white-bulb', width='400px', height='38px') {
        var id = Utils.uuid();
        var tag = `
            <rect id='${id}' box='border-box' fixanchor='top' top='-100px' childanchor='centerH'
              width='${width}' height='${height}' radius='6px'  border='0'
              bgcolor='${Theme.current.success}' color='${Theme.current.light}' opacity='0.8'>
                <img src='${Utils.getIconUrl(icon)}' width='20px' height='20px'/>&nbsp;
                <div>${text}<div>
            </rect>
        `;

        // add to body
        var ele = Utils.parseElement(tag);
        document.body.appendChild(ele);

        // parse height's value and unit, calc top position.
        this.counter++;
        const regex = /(\d+(?:\.\d+)?)(px|rem|em|%)/;
        const match = height.match(regex);
        const value = match ? parseFloat(match[1]) : 38;
        const unit  = match ? match[2] : 'px';
        var top = 25 + (this.counter-1)*(value+10) + unit;

        // show and hide with animation
        var toast = Utils.$('#' + id);  // = ele.root
        await Utils.sleep(50);
        toast.style.top = top;
        await Utils.sleep(2000);
        toast.style.top = '-100px';
        await Utils.sleep(1000);
        document.body.removeChild(toast);
        this.counter--;
    }

}

/************************************************************
 * Tooltip
 * @example
 *     Tooltip.show(ele, 'message info');
 *     Tooltip.bind('#id');
 *     Tooltip.hide();
 ***********************************************************/
class Tooltip {
    /** Bind all matched elements to show tooltip
     * @param {string} selector Element selector 
     * @param {string} [attrName='tip'] Attribute name or callback， If null, show element's text content.
    */
    static bind(selector, attrName=null) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(ele => {
            var o = (ele.root == null) ? ele : ele.root;
            o.addEventListener('mouseover', () => Tooltip.show(ele, attrName));
            o.addEventListener('mouseout',  () => Tooltip.hide());
        });
    }

    /**
     * Show tooltip under element. 
     * @param {Tag} element 
     * @param {string} attrName
     */
    static show(element, attrName) {
        var text = '';
        if (attrName == null)                    text = element.textContent;
        else if (typeof attrName == 'function')  text = attrName(element);
        else                                     text = this.getVal(element, attrName);
        if (text == null || text == '')
            return;

        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.innerHTML = text;
        tooltip.style.display = 'block';
        tooltip.style.position = "fixed";
        tooltip.style.backgroundColor = 'white'; //"#f9f9f9";
        tooltip.style.border = "1px solid #ccc";
        tooltip.style.borderRadius = '4px';
        tooltip.style.padding = "5px";
        tooltip.style.zIndex = "999";

        var rect = element.getBoundingClientRect(); // get rect in viewport
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top  = rect.bottom + 4 + 'px';
        document.body.appendChild(tooltip);
    }

    /** Hide tooltip */
    static hide() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip != null)
            document.body.removeChild(tooltip);
    }

    /** Get element's attribute's value 
     * @param {Element} element 
     * @param {string} attr Attribute name, can be comma-seperated string: 'style.width'
    */
    static getVal(element, attr) {
        let attrs = attr.split('.');
        let value = element;
        for (let a of attrs) {
            value = value[a];
            if (value === undefined) {
                return undefined;
            }
        }
        return value;
    }
}


/***********************************************************
 * Column container
 * @example
 *     <img icon="20px">
 ***********************************************************/
class Image extends Tag {
    static { NoCss.registCustomTag('Img', new Image());}

    /**@param {HTMLElement} ele */
    render(ele) {
        ele.style.boxSizing = 'border-box';

        var icon = ele.getAttribute('icon');
        if (icon != null)
            ele.src = `${Utils.getIconUrl(icon)}`;

        var avatar = ele.getAttribute('avatar');
        if (avatar != null) {
            ele.style.height = ele.style.width;
            ele.style.backgroundColor = 'white';
            ele.style.padding = '5px';
            ele.style.border = '1px solid #a0a0a0';
            ele.style.borderRadius = '50%';
        }

        return ele;
    }
}


/************************************************************
 * IconFont
 * @example
 *     <icon name='user'  color='red'></icon>
 *     <icon name='users' color='blue'></icon>
 * @description
 *     see https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=1271142
 ***********************************************************/
class Icon extends Tag {
    static { NoCss.registCustomTag('Icon', new Icon());}

    /**@param {HTMLElement} ele */
    render(ele) {
        // <span class="icon iconfont icon-shop-pay"></span>
        ele.style.display = 'inline-block';
        ele.style.transition = 'all 0.5s';  // animation
        ele.classList.add('icon', 'iconfont');
        ele.classList.add('icon-' + ele.getAttribute('key'));

        // <link rel="stylesheet" href="iconfont.css">
        Utils.addLink(Utils.iconFontRoot + "iconfont.css");
        return ele;
    }
}



/************************************************************
 * FontAwesome Icon
 * @example
 *     <icona name='bulb' type='solid' color='red'></icona>
 *     <icona name='bulb' type='regular' color='blue'></icona>
 * @description
 *     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
 *     <i class="fa-regular fa-lightbulb" style="color:red"></i>
 *     see https://fontawesome.com.cn/v5
 ***********************************************************/
class IconAwesome extends Tag {
    static { NoCss.registCustomTag('Icona', new IconAwesome());}

    /**@param {HTMLElement} ele */
    render(ele) {
        // <i class="fa-regular fa-lightbulb" style="color:red"></i>
        ele.style.display = 'inline-block';
        ele.style.transition = 'all 0.5s';  // animation
        ele.classList.add('fa-' + ele.getAttribute('key'));
        ele.classList.add('fa-' + ele.getAttribute('type'));

        // <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        Utils.addLink("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css")
        return ele;
    }
}


/************************************************************
 * Dialog
 * @example
 *     Dialog.show();
 *     Dialog.close();
 ***********************************************************/
class Dialog extends Tag {
    static { NoCss.registCustomTag('Dialog', new Dialog());}

    createStyle(){
        const style = document.createElement('style');
        style.textContent = `
          /* popup layer */
          .popup {
              position: absolute;
              background-color: white;
              padding: 40px 20px 20px 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
              display: none;
              overflow: auto;
              box-sizing: border-box;
              width: 500px;
              height: 400px;
              z-index: 999;
              transition = 'all 0.5s';
            }
          .popup-content {
              text-align: center;
              /*user-select: none;*/
            }
          /* close button */
          .btn-close {
              position: absolute;
              top: 10px;
              right: 10px;
              cursor: pointer;
              user-select: none;
            }
          .btn-close:hover{
            color: red;
          }
          /* resizers */
          .resizer {
              position: absolute;
              cursor: pointer;
            }
          .resizer-top {
              top: 0;
              left: 0;
              right: 0;
              height: 10px;
              cursor: ns-resize;
            }
          .resizer-bottom {
              bottom: 0;
              left: 0;
              right: 0;
              height: 10px;
              cursor: ns-resize;
            }
          .resizer-left {
              top: 0;
              bottom: 0;
              left: 0;
              width: 10px;
              cursor: ew-resize;
            }
          .resizer-right {
              top: 0;
              bottom: 0;
              right: 0;
              width: 10px;
              cursor: ew-resize;
            }
          .resizer-topleft {
              top: 0;
              left: 0;
              width: 10px;
              height: 10px;
              cursor: nwse-resize;
            }
          .resizer-topright {
              top: 0;
              right: 0;
              width: 10px;
              height: 10px;
              cursor: nesw-resize;
            }
          .resizer-bottomleft {
              bottom: 0;
              left: 0;
              width: 10px;
              height: 10px;
              cursor: nesw-resize;
            }
          .resizer-bottomright {
              bottom: 0;
              right: 0;
              width: 10px;
              height: 10px;
              cursor: nwse-resize;
            }
          `;
        return style;
    }

    createRoot(){
        // popup
        this.root = document.createElement('div');
        this.root.classList.add('popup');
        this.root.transition = 'all 0.5s';


        // close button
        this.closeButton = document.createElement('span');
        this.closeButton.classList.add('btn-close');
        this.closeButton.textContent = '×';
        this.closeButton.addEventListener('click', async () => await this.close());
        this.root.appendChild(this.closeButton);

        // content
        this.contentDiv = document.createElement('div');
        this.contentDiv.classList.add('popup-content');
        //this.contentDiv.innerHTML = this.innerHTML;   ///////////
        Array.from(this.childNodes).forEach(child => this.contentDiv.appendChild(child));
        this.root.appendChild(this.contentDiv);

        // resizer(todo: use tag)
        const resizerTop = document.createElement('div');
        resizerTop.classList.add('resizer', 'resizer-top');
        this.root.appendChild(resizerTop);
        const resizerBottom = document.createElement('div');
        resizerBottom.classList.add('resizer', 'resizer-bottom');
        this.root.appendChild(resizerBottom);
        const resizerLeft = document.createElement('div');
        resizerLeft.classList.add('resizer', 'resizer-left');
        this.root.appendChild(resizerLeft);
        const resizerRight = document.createElement('div');
        resizerRight.classList.add('resizer', 'resizer-right');
        this.root.appendChild(resizerRight);
        const resizerTopLeft = document.createElement('div');
        resizerTopLeft.classList.add('resizer', 'resizer-topleft');
        this.root.appendChild(resizerTopLeft);
        const resizerTopRight = document.createElement('div');
        resizerTopRight.classList.add('resizer', 'resizer-topright');
        this.root.appendChild(resizerTopRight);
        const resizerBottomLeft = document.createElement('div');
        resizerBottomLeft.classList.add('resizer', 'resizer-bottomleft');
        this.root.appendChild(resizerBottomLeft);
        const resizerBottomRight = document.createElement('div');
        resizerBottomRight.classList.add('resizer', 'resizer-bottomright');
        this.root.appendChild(resizerBottomRight);

        // mouse, popup, handler
        let rawX, rawY;
        let rawTop, rawLeft, rawWidth, rawHeight;
        let handler = '';

        // mouse down to record data
        this.root.addEventListener('mousedown', (e) => {
            rawX = e.clientX;
            rawY = e.clientY;
            rawTop    = this.root.offsetTop;
            rawLeft   = this.root.offsetLeft;
            rawWidth  = this.root.offsetWidth;
            rawHeight = this.root.offsetHeight;

            if (e.target.classList.contains('resizer-topleft')) {
                handler = 'TL';
                document.documentElement.style.cursor = 'nwse-resize';
            } else if (e.target.classList.contains('resizer-topright')) {
                handler = 'TR';
                document.documentElement.style.cursor = 'nesw-resize';
            } else if (e.target.classList.contains('resizer-bottomleft')) {
                handler = 'BL';
                document.documentElement.style.cursor = 'nesw-resize';
            } else if (e.target.classList.contains('resizer-bottomright')) {
                handler = 'BR';
                document.documentElement.style.cursor = 'nwse-resize';
            } else if (e.target.classList.contains('resizer-top')) {
                handler = 'T';
                document.documentElement.style.cursor = 'ns-resize';
            } else if (e.target.classList.contains('resizer-bottom')) {
                handler = 'B';
                document.documentElement.style.cursor = 'ns-resize';
            } else if (e.target.classList.contains('resizer-left')) {
                handler = 'L';
                document.documentElement.style.cursor = 'ew-resize';
            } else if (e.target.classList.contains('resizer-right')) {
                handler = 'R';
                document.documentElement.style.cursor = 'ew-resize';
            } else {
                handler = 'DRAG';
                document.documentElement.style.cursor = 'pointer';
            }

            console.log(`DOWN : (${rawLeft}, ${rawTop}, ${rawWidth}, ${rawHeight}), (${rawX}, ${rawY}), ${handler}`);
        });

        // mouse move to drag or resize
        document.addEventListener('mousemove', (e) => {
            if (handler === '') return;

            let dx = e.clientX - rawX;
            let dy = e.clientY - rawY;
            switch (handler) {
                case 'DRAG':
                    this.root.style.left = rawLeft + dx + 'px';
                    this.root.style.top = rawTop + dy + 'px';
                    break;
                case 'TL':
                    this.root.style.left = rawLeft + dx + 'px';
                    this.root.style.top = rawTop + dy + 'px';
                    this.root.style.width = rawWidth - dx + 'px';
                    this.root.style.height = rawHeight - dy + 'px';
                    break;
                case 'T':
                    this.root.style.top = rawTop + dy + 'px';
                    this.root.style.height = rawHeight - dy + 'px';
                    break;
                case 'TR':
                    this.root.style.top = rawTop + dy + 'px';
                    this.root.style.width = rawWidth + dx + 'px';
                    this.root.style.height = rawHeight - dy + 'px';
                    break;
                case 'L':
                    this.root.style.left = rawLeft + dx + 'px';
                    this.root.style.width = rawWidth - dx + 'px';
                    break;
                case 'R':
                    this.root.style.width = rawWidth + dx + 'px';
                    break;
                case 'BL':
                    this.root.style.left = rawLeft + dx + 'px';
                    this.root.style.width = rawWidth - dx + 'px';
                    this.root.style.height = rawHeight + dy + 'px';
                    break;
                case 'B':
                    this.root.style.height = rawHeight + dy + 'px';
                    break;
                case 'BR':
                    this.root.style.width = rawWidth + dx + 'px';
                    this.root.style.height = rawHeight + dy + 'px';
                    break;
            }

            console.log(`${handler} : (${dx}, ${dy}), (${this.root.offsetLeft}, ${this.root.offsetTop}, ${this.root.offsetWidth}, ${this.root.offsetHeight}), (${e.clientX}, ${e.clientY})`);
        });

        // mouse up to clear
        document.addEventListener('mouseup', () => {
            handler = '';
            document.documentElement.style.cursor = 'auto';
        });

        return this.root;
    }

    async show(){ return await this.show({});}
    /**Show dialog with mask and center in screen
     * @param {boolean} [opt.model=true] 
     * @param {boolean} [opt.closable=true] 
     * @param {string} [opt.width='600px'] 
     * @param {string} [opt.height='400px'] 
     * @param {string} [opt.x=''] 
     * @param {string} [opt.y=''] 
     * @param {string} [opt.dock=''] right, bottom, center
     * @param {HTMLElement} [opt.appendIn=document.body] element that dialog create in.
    */
    async show({
        model=true, closable=true, 
        width='600px', height='400px', x='', y='', 
        dock='center', 
        appendIn=document.body
    }) {
        if (appendIn != null && this.parentNode == null)
            appendIn.appendChild(this);

        if (model)
            Mask.show();
        this.closeButton.style.display = closable ? 'block' : 'none';
        this.root.style.display = 'block';
        this.root.style.width = width;
        this.root.style.height = height;
        this.root.dock = dock;

        // get pixsel size
        const viewWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        const popWidth  = this.root.offsetWidth;
        const popHeight = this.root.offsetHeight;

        // position - certain
        if (x!='' && y!=''){
            x = XTags.calcPx(x, this.root);
            y = XTags.calcPx(y, this.root);
            this.root.startRect = new DOMRect(x + popWidth/2, y, 0, 0);
            this.setBound(this.root.startRect);
            await XTags.sleep(100);

            this.root.style.left = x + 'px';
            this.root.style.top = y + 'px';
            this.root.style.width = width;
            this.root.style.height = height;
            await XTags.sleep(100);
            return;
        }
        // position - center
        if (dock == Anchor.C){
            this.root.style.left = (viewWidth - popWidth) / 2 + 'px';
            this.root.style.top  = (viewHeight - popHeight) / 2 + 'px';
            return;
        }
        // position - fill
        if (dock == Anchor.F){
            this.root.startRect = new DOMRect(viewWidth, 0, viewWidth, viewHeight);
            this.setBound(this.root.startRect);
            await XTags.sleep(100);

            this.root.style.left = 0;
            this.root.style.borderRadius = 0;
            await XTags.sleep(100);
            return;
        }
        // position - left
        if (dock == Anchor.L){
            this.root.startRect = new DOMRect(-popWidth, 0, popWidth, viewHeight);
            this.setBound(this.root.startRect);
            await XTags.sleep(100);

            this.root.style.left = 0;
            this.root.style.borderTopLeftRadius = 0;
            this.root.style.borderBottomLeftRadius = 0;
            await XTags.sleep(100);
            return;
        }
        // position - right
        if (dock == Anchor.R){
            this.root.startRect = new DOMRect(viewWidth, 0, popWidth, viewHeight);
            this.setBound(this.root.startRect);
            await XTags.sleep(100);

            this.root.style.left = viewWidth - popWidth + 'px';
            this.root.style.borderTopRightRadius = 0;
            this.root.style.borderBottomRightRadius = 0;
            await XTags.sleep(100);
            return;
        }
        // position - bottom
        if (dock == Anchor.T){
            this.root.startRect = new DOMRect(0, -popHeight, viewWidth, popHeight);
            this.setBound(this.root.startRect);
            await XTags.sleep(100);

            this.root.style.top = 0;
            this.root.style.borderTopLeftRadius = 0;
            this.root.style.borderTopRightRadius = 0;
            await XTags.sleep(100);
            return;
        }
        // position - bottom
        if (dock == Anchor.B){
            this.root.startRect = new DOMRect(0, viewHeight, viewWidth, popHeight);
            this.setBound(this.root.startRect);
            await XTags.sleep(100);

            this.root.style.top = viewHeight - popHeight  + 'px';
            this.root.style.borderBottomLeftRadius = 0;
            this.root.style.borderBottomRightRadius = 0;
            await XTags.sleep(100);
            return;
        }
    }

    /**Close dialog*/
    async close(remove=true) {
        // move. TODO: animation
        if (this.root.startRect != null){
            // move to start position
            this.root.transition = 'all 0.5s';

            var dock = this.root.dock;
            if (dock == 'top' || dock == 'bottom')                      
                this.root.style.top = this.root.startRect.top;
            else if (dock == 'left' || dock == 'right' || dock == 'fill')    
                this.root.style.left = this.root.startRect.left;
            //this.setBound(this.root.startRect);
            await XTags.sleep(100);
        }

        // remove
        await XTags.sleep(100);
        this.root.style.display = 'none';
        if (remove)
            this.root.remove();

        // hide mask
        await XTags.sleep(100);
        Mask.hide();
    }


    /*Content*/
    get content()    { return this.contentDiv.innerHTML; }
    set content(val) { this.contentDiv.innerHTML = val; }

    /*Width*/
    get width()      { return this.root.style.width;}
    set width(val)   { this.root.style.width = val;}
    get height()     { return this.root.style.height;}
    set height(val)  { this.root.style.height = val;}


    /**Set bound rect
     * @param {DOMRect} rect 
     */
    setBound(rect){
        this.root.style.left   = rect.left   + 'px';
        this.root.style.top    = rect.top    + 'px';
        this.root.style.width  = rect.width  + 'px';
        this.root.style.height = rect.height + 'px';
    }
}