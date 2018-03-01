// 常用方法
var util = {
    /**
     * 去除字符串的首尾空格
     * @param  {String} s 字符串
     * @return {String}   去除首尾空格的字符串
     */
    trim: function(s){
        return s.replace(/^\s+|\s+$/g, "");
    },
    /**
     * 去除字符串中的所有空格
     * @param  {String} s 字符串
     * @return {String}   去除空格的字符串
     */
    trimAll: function(s){
        return s.replace(/\s+/g, "");
    },
    /**
     * 检测数据类型
     * @param  {[type]} val 数据
     * @return {String}     数据类型
     */
    judgeType: function(val){
        return (val == null) ? val
                             : val.constructor && val.constructor.toString().match(/function\s+([^(]*)/)[1];
    }
};
// 常用事件相关方法
util.eventUtil = {
    /**
     * 获取事件
     * @param  {[type]} e 事件
     * @return {[type]}   事件
     */
    getEvent: function(e){
        return e ? e : window.event;
    },
    /**
     * 获取事件名称
     * @param  {[type]} e 事件
     * @return {[type]}   事件名称
     */
    getType: function(e){
        e = this.getEvent(e);
        return e.type;
    },
    /**
     * 获取事件目标
     * @param  {[type]} e 事件
     * @return {[type]}   触发事件的元素
     */
    getTarget: function(e){
        e = this.getEvent(e);
        return e.target || e.srcElement;
    },
    /**
     * 阻止事件的默认行为
     * @param  {[type]} e 事件
     */
    preventDefault: function(e){
        e = this.getEvent(e);
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
    },
    /** 阻止事件冒泡
     * @param  {[type]} e 事件
     */
    stopPropagation: function(e){
        e = this.getEvent(e);
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    },
    /**
     * 向window.onload添加函数
     * @param {Function} func 函数
     */
    addLoadFunc: function(func){
        var load = window.onload;
        if(typeof load != "function"){
            window.onload = func;
        } else{
            load();
            func();
        }
    },
    /**
     * 注册事件
     * @param {Object} ele 元素
     * @param {String} type 事件名称
     * @param {Function} listener 监听函数
     * @param {Boolean} isCapture 是否捕获，默认false
     */
    addEvent: function(ele, type, listener, isCapture){
        if(ele.addEventListener){
            ele.addEventListener(type, listener, !!isCapture);
        } else if(ele.attachEvent){
            ele.attachEvent("on"+type, listener);
        } else{
            ele["on"+type] = listener;
        }
    },
    /**
     * 注销事件
     * @param {Object} ele 元素
     * @param {String} type 事件类型
     * @param {Function} listener 监听函数
     * @param {Boolean} isCapture 是否捕获，默认false
     */
    delEvent: function(ele, type, listener, isCapture){
        if(ele.removeEventListener){
            ele.removeEventListener(type, listener, !!isCapture);
        } else if(ele.detachEvent){
            ele.detachEvent("on"+type, listener);
        } else{
            ele["on"+type] = null;
        }
    }
};
// 常用dom操作方法
util.domUtil = {
    /**
     * 生成ClassName的正则
     * @param  {String} cls 样式名
     * @return {RegExp}     正则表达式
     */
    getClsRgx: function(cls){
        return new RegExp("(^|\\s+)" + cls + "(\\s+|$)");
    },
    /**
     * 向元素添加一个样式名
     * @param {[type]} ele 目标元素
     * @param {String} cls 样式名
     */
    addClass: function(ele, cls){
        if(!ele.className){
            ele.className = cls;
        } else{
            ele.className += " " + cls;
        }
    },
    /**
     * 删除指定元素的指定样式名
     * @param  {[type]} ele 目标元素
     * @param  {String} cls 样式名
     */
    delClass: function(ele, cls){
        if(ele.className){
            var curCls = ele.className,
                rgx = this.getClsRgx(cls);
            curCls = curCls.replace(rgx, " ");
            ele.className = window.util.trim(curCls);
        }
    },
    /**
     * getElmentsByClassName的兼容
     * @param  {[type]} nod 节点
     * @param  {String} cls 样式名
     * @return {Array}      获取到的元素数组
     */
    getElesByClsName: function(nod, cls){
        nod = nod || document;
        if(nod.getElementsByClassName){
            return nod.getElementsByClassName(cls);
        } else{
            var res = [],
                eles = nod.getElementsByTagName("*"),
                rgx = this.getClsRgx(cls);
            for(var i=0; i<eles.length; i++){
                if(rgx.test(eles[i].className)){
                    res.push(eles[i]);
                }
            }
            return res;
        }
    },
    /**
     * 获取元素的指定属性的当前值
     * @param  {[type]} ele  目标元素
     * @param  {String} attr 属性名
     * @return {String}      属性值
     */
    getStyle: function(ele, attr){
        return ele.currentStyle ? ele.currentStyle[attr] : getComputedStyle(ele, false)[attr];
    },
    /**
     * 设置元素的透明度
     * @param {[type]} ele   目标元素
     * @param {Number} value 透明度（0~1）
     */
    setOpacity: function(ele, value){
        if(ele.style.opacity !== undefined){
            ele.style.opacity = value;
        } else{
            ele.style.filter = "filter: Alpha(opacity=" + (value*100) + ")";
        }        
    },
    /**
     * 获取元素的dataset属性
     * @param  {[type]} ele 目标元素
     * @return {Object}     dataset属性对象
     */
    getDataset: function(ele){
        if(ele.dataset) return ele.dataset;
        var ds = {},
            // 去掉属性值上的引号，并获得dataset属性
            set = ele.outerHTML.replace(/\"/g, "").match(/data-[^\>\s]*/g);
        for(var i=0; i<set.length; i++){
            var a = set[i].split("=");
            // 去掉"data-"前缀，并采用驼峰命名法
            a[0] = a[0].substring(5).replace(/-([a-z])/g, function($,$1){
                return $1.toUpperCase();
            });
            ds[a[0]] = a[1];
        }
        return ds;
    },
    /**
     * 获取指定元素的下一个相邻元素
     * @param  {[type]} ele 目标元素
     * @return {[type]}     下一个相邻元素
     */
    getNextEle: function(ele){
        if(ele.nextElementSibling) return ele.nextElementSibling;
        do{
            ele = ele.nextSibling;
        } while(ele && (ele.nodeType !== 1))
        return ele;
    },
    /**
     * 获取指定元素的上一个相邻元素
     * @param  {[type]} ele 目标元素
     * @return {[type]}     上一个相邻元素
     */
    getPrevEle: function(ele){
        if(ele.previousElementSibling) return ele.previousElementSibling;
        do{
            ele = ele.previousSibling;
        } while(ele && (ele.nodeType !== 1))
        return ele;
    },
    /**
     * 在指定元素后插入新元素
     * @param  {[type]} newEle 新元素
     * @param  {[type]} ele    目标元素
     */
    insertAfter: function(newEle, ele){
        var parent = ele.parentNode,
            lastChild = parent.lastElementChild || parent.lastChild;
        if(lastChild == ele){
            parent.appendChild(newEle);
        } else{
            parent.insertBefore(newEle, ele.nextSibling);
        }
    },
    /**
     * 检测浏览器是否支持指定元素的指定属性
     * @param  {String} eleName 元素名
     * @param  {String} attr    属性名
     * @return {Boolean}        true表示支持，false表示不支持
     */
    eleSupportAttr: function(eleName, attr){
        if(!document.createElement) return false;
        var ele = document.createElement(eleName);
        return (attr in ele);
    }
};
// 常用http/ajax相关方法
util.httpUtil = {
    /**
     * 创建一个XHR对象
     * @return {[type]} XHR对象
     */
    getXHR: function(){
        if(window.XMLHttpRequest) return new XMLHttpRequest();
        // 兼容IE6-
        try{
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e){
            try{
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch(ee){
                return null;
            }
        }
    },
    /**
     * 序列化ajax请求参数
     * @param  {Object} data 参数对象
     * @return {String}      参数字符串
     */
    serialize: function(data){
        if(!data) return "";
        var d = [], key, val;
        for(key in data){
            // 判断data自身是否具有属性key，且key非函数
            if(!data.hasOwnProperty(key) || (typeof data[key] === "function")) continue;
            val = data[key].toString();
            // 编码
            key = encodeURIComponent(key);
            val = encodeURIComponent(val);
            d.push(key + "=" + val);
        }
        return d.join("&");
    },
    /**
     * 发送请求（get方法）
     * @param  {String}   url      请求地址
     * @param  {Object}   paras    请求参数
     * @param  {Function} callback 回调函数
     * @return {Boolean}           请求错误返回false
     */
    get: function(url, paras, callback){
        if(typeof callback !== "function") return false;
        var xhr = this.getXHR();
        if(!xhr) return false;
        xhr.onreadystatechange = function(){
            if((this.readyState === 4) && (this.status === 200)){
                callback(this.responseText);
            }
        };
        paras = this.serialize(paras);
        if(paras) url += "?" + paras;
        xhr.open("GET", url, true);
        xhr.send(null);
    },
    /**
     * 发送请求（post方法）
     * @param  {String}   url      请求地址
     * @param  {Object}   paras    请求参数
     * @param  {Function} callback 回调函数
     * @return {Boolean}           请求错误返回false
     */
    post: function(url, paras, callback){
        if(typeof callback !== "function") return false;
        var xhr = this.getXHR();
        if(!xhr) return false;
        xhr.onreadystatechange = function(){
            if(this.readyState === 4){
                if((this.status >= 200 && xhr < 300) || xhr.status === 304){
                    callback(this.responseText);
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(this.serialize(paras));
    },
    /**
     * 读取指定Cookie值
     * @param  {String} name 键
     * @return {[type]}      值
     */
    getCookie: function(name){
        if(document.cookie.length > 0){
            var arr = document.cookie.split(";"), arr2;
            for(var i=0; i<arr.length; i++){
                arr2 = arr[i].split("=");
                arr2[0] = decodeURIComponent(arr2[0]);
                if(arr2[0] == name) return decodeURIComponent(arr2[1]);
            }
        }
        return "";
    },
    /**
     * 设置Cookie
     * @param {String}  name   键
     * @param {String}  value  值
     * @param {Date}    expire 过期时间
     * @param {String}  path   作用路径
     * @param {String}  domain 作用域
     * @param {Boolean} secure https协议是否生效，默认false
     */
    setCookie: function(name, value, expire, path, domain, secure){
        var cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if(expire) cookie += "; expires=" + expire.toGMTString();
        if(path) cookie += "; path=" + path;
        if(domain) cookie += "; domain=" + domain;
        if(secure) cookie += "; secure=" + secure;
        document.cookie = cookie;
    },
    /**
     * 删除指定Cookie
     * @param {String} name   键
     * @param {Date}   expire 过期时间
     * @param {String} domain 作用域
     */
    delCookie: function(name, path, domain){
        this.setCookie(name, name, 0, null, domain);
    }
};
// 常用动画
util.animateUtil = {
    /**
     * 淡入
     * @param  {[type]} ele      目标元素
     * @param  {Number} duration 动画时长（毫秒），默认500
     * @param  {Number} interval 间隔时长（毫秒），默认100
     * @param  {Number} opacity  目标透明度（0~1），默认1
     */
    fadeIn: function(ele, duration, interval, opacity){
        duration = duration || 500;
        interval = interval || 50;
        opacity = opacity ? opacity*100 : 100;
        var c = Math.ceil(opacity/(duration/interval)),
            val = 0,
            timer = null;
        timer = setInterval(function(){
            util.domUtil.setOpacity(ele, val/100);
            val += c;
            if(val >= opacity) clearInterval(timer);
        }, interval);
        /*(function(){
            var c = Math.ceil(opacity/(duration/interval)),
                val = 0;
            setTimeout(function(){
                util.domUtil.setOpacity(ele, val/100);
                val += c;
                if(val < opacity) setTimeout(arguments.callee, interval);
            }, interval);
        })();*/
    },
    /**
     * 淡出
     * @param  {[type]} ele      目标元素
     * @param  {Number} duration 动画时长（毫秒），默认500
     * @param  {Number} interval 间隔时长（毫秒），默认100
     * @param  {Number} opacity  目标透明度（0~1），默认0
     */
    fadeOut: function(ele, duration, interval, opacity){
        duration = duration || 500;
        interval = interval || 100;
        opacity = opacity || 0;
        var c = Math.ceil(opacity/(duration/interval)),
            val = 1,
            timer = null;
        timer = setInterval(function(){
            util.domUtil.setOpacity(ele, val/100);
            val -= c;
            if(val <= opacity) clearInterval(timer);
        }, interval);
    }
}

// Object.create兼容
Object.create = Object.create || function(obj){
    var F = function(){},
        hasOwn = Object.prototype.hasOwnProperty,
        args = arguments;
    // 处理第一个参数
    if(typeof obj != "object"){
        throw new TypeError("必须是Object类型或null");
    }
    F.prototype = obj;
    var o = new F();
    F.prototype = null;
    // 处理第二个参数（如果存在）
    if(args.length > 1){
        var _props = Object(args[1]);
        for(var p in _props){
            if(hasOwn.call(_props, p)){
                o[p] = _props[p];
            }
        } 
    }
    // 返回o
    return o;
};

// bind()兼容
Function.prototype.bind = Function.prototype.bind || function(obj){
    // 判断this类型
    if(typeof this != "function"){
        throw new TypeError("必须是Function类型");
    }
    // 绑定this
    var _self = this, args = arguments;
    return function(){
        _self.apply(obj, Array.prototype.slice.call(args, 1));
    };
};

// JSON兼容
if(!window.JSON){
    window.JSON = {
        /**
         * JSON.parse方法
         * @param  {String} sJson JSON字符串
         * @return {[type]}       JS对象
         */
        parse: function(sJson){
            return eval("(" + sJson + ")");
        },
        /**
         * JSON.stringify方法
         * @param  {[type]} val JS数据
         * @return {String}     JSON字符串
         */
        stringify: function(val){
            var res = "", temp, i;            
            switch(Object.prototype.toString.call(val).slice(8,-1)){
                // 原始类型
                case "String":
                case "Number":
                case "Boolean":
                case "Null":
                    res = "" + val; // 转换为字符串
                    break;
                case "Undefined":
                // 内置对象类型
                case "Function":
                    res = undefined;
                    break;
                case "Date":
                    res = "" + (val.toJSON ? val.toJSON() : val.toString());
                    break;
                case "Array":
                    res += "[";
                    for(i=0; i<val.length; i++){
                        temp = (val[i] instanceof Object) ? this.stringify(val[i]) : val[i];
                        res += (temp === undefined) ? null : temp; // undefined转换为null
                    }
                    res = res.replace(/,$/, "]");
                    break;
                case "Object":
                    res += "{";
                    for(i in val){
                        if(val.hasOwnProperty(i)){
                            temp = (val[i] instanceof Object) ? this.stringify(val[i]) : val[i];
                            // 忽略undefined
                            if(temp !== undefined){
                                res += "\"" + i + "\"" + temp + ",";
                            }
                        }
                    }
                    res = res.replace(/,$/, "}");
                    break;
                // RegExp、Error等以及自定义类型
                default:
                    res = "{}";
            }
            return res;
        }
    };
}