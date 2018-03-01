util.eventUtil.addEvent(window, "load", function(){
    var oMask = document.getElementById("mask");

    // 关闭顶部通知条
    +function(){
        var oNote = document.getElementById("note"),
            oNoNtf = util.domUtil.getElesByClsName(oNote, "no-ntf")[0];
        // 点击“不再提醒”时关闭
        util.eventUtil.addEvent(oNoNtf, "click", function(e){
            util.eventUtil.preventDefault(e);
            util.domUtil.addClass(oNote, "z-hide");
            util.httpUtil.setCookie("note", "0");
        }, false);
    }();

    // 关注&登录
    +function(){
        var oLogo1 = document.getElementById("logo1"),
            oWatch = util.domUtil.getElesByClsName(oLogo1, "watch")[0],
            oWatched = util.domUtil.getElesByClsName(oLogo1, "watched")[0],
            oFansQty = util.domUtil.getElesByClsName(oLogo1, "fans")[0].getElementsByTagName("span")[0].lastChild,
            oLogin = document.getElementById("login");
        var _logSuc = util.httpUtil.getCookie("loginSuc"),
            _folSuc = util.httpUtil.getCookie("followSuc");

        // 关注后调用的函数
        var afterWatch = function(){
            util.domUtil.addClass(oWatch, "z-hide");
            util.domUtil.delClass(oWatched, "z-hide");
            if(!_folSuc || _folSuc != 1){ // 未关注
                util.httpUtil.get("http://study.163.com/webDev/attention.htm", null, function(res){
                    if(res == 1){
                        util.httpUtil.setCookie("followSuc", "1");
                    } else{
                        alert("关注失败");
                        return false;
                    }
                });
                util.httpUtil.setCookie("followSuc", "1");
            }
        };

        // 关注
        util.eventUtil.addEvent(oWatch, "click", function(e){
            util.eventUtil.preventDefault(e);
            if(!_logSuc || _logSuc != 1){ // 未登录
                util.domUtil.delClass(oLogin, "z-hide");
                util.domUtil.delClass(oMask, "z-hide");
            } else{ // 已登录
                afterWatch();
            }
        }, false);

        // 取消关注
        util.eventUtil.addEvent(oWatched.getElementsByTagName("a")[0], "click", function(e){
            util.eventUtil.preventDefault(e);
            util.domUtil.delClass(oWatch, "z-hide");
            util.domUtil.addClass(oWatched, "z-hide");
            // oFansQty.nodeValue = parseInt(oFansQty.nodeValue, 10) - 1;
        }, false);

        // 登录
        util.eventUtil.addEvent(oLogin.getElementsByTagName("button")[0], "click", function(e){
            util.eventUtil.preventDefault(e);
            var _uid = document.getElementById("uid").value,
                _pwd = document.getElementById("pwd").value
                _url = "http://study.163.com/webDev/login.htm";
            // 判断账户和密码是否为空（定义了required属性可省略）
            if(!_uid || !_pwd){
                alert("账户和密码不可为空");
                return false;
            }
            // MD5加密
            _uid = util.md5(_uid);
            _pwd = util.md5(_pwd);
            // 登录请求
            util.httpUtil.get(_url, {
                "userName": _uid,
                "password": _pwd
            }, function(res){
                if(res == 1){ // 登录成功
                    afterWatch();
                    util.domUtil.addClass(oLogin, "z-hide");
                    util.domUtil.addClass(oMask, "z-hide");
                } else{ // 登录失败
                    alert("账户或密码错误");
                    return false;
                }
            });
        }, false);

        // 关闭登录界面
        util.eventUtil.addEvent(oLogin.getElementsByTagName("i")[0], "click", function(){
            util.eventUtil.preventDefault(e);
            util.domUtil.addClass(oLogin, "z-hide");
            util.domUtil.addClass(oMask, "z-hide");
        }, false);
    }();

    // 轮播图
    +function(){
        var oSlide = document.getElementById("slide"),
            oLis = oSlide.getElementsByTagName("li"),
            oPoints = util.domUtil.getElesByClsName(oSlide, "u-pointer")[0].getElementsByTagName("i");
        var _qty = oLis.length,
            _timer = null,
            _idxCur = 0,
            i,j;

        // 初始化，第一张图片的透明度为1，其他为0
        util.domUtil.setOpacity(oLis[0], 1);
        for(i=1; i<_qty; i++){
            util.domUtil.setOpacity(oLis[i], 0);
        }
        // 切换时各图片和圆点的状态
        var statusChange = function(idxCur){
            for(i=0; i<_qty; i++){
                oPoints[i].className = "";
                oLis[i].className = "z-hide";
                util.domUtil.setOpacity(oLis[i], 0);
            }
            oPoints[idxCur].className = "z-crt";
            oLis[idxCur].className = "z-show";
            util.animateUtil.fadeIn(oLis[idxCur], 500, 100, 1);
        };
        // 点击圆点，切换图片
        for(i=0; i<_qty; i++){
            oPoints[i].idx = i;
            util.eventUtil.addEvent(oPoints[i], "click", function(e){
                util.eventUtil.preventDefault(e);
                _idxCur = this.idx;
                statusChange(this.idx);
            }, false);
        }
        // 轮播
        function play(){
            (_idxCur == _qty-1) ? (_idxCur = 0) : _idxCur++;
            statusChange(_idxCur);
        }
        _timer = setInterval(play, 5000);
        // 鼠标悬停时暂停
        util.eventUtil.addEvent(oSlide, "mouseover", function(e){
            util.eventUtil.preventDefault(e);
            clearInterval(_timer);
        }, false);
        // 鼠标移走时继续
        util.eventUtil.addEvent(oSlide, "mouseout", function(e){
            util.eventUtil.preventDefault(e);
            _timer = setInterval(play, 5000);
        }, false);
    }();

    // 视频
    +function(){
        var oVideoImg = document.getElementById("sd-video").getElementsByTagName("img")[0],
            oVideo = document.getElementById("video");
        // 点击图片，显示视频浮层
        util.eventUtil.addEvent(oVideoImg, "click", function(e){
            util.eventUtil.preventDefault(e);
            util.domUtil.delClass(oVideo, "z-hide");
            util.domUtil.delClass(oMask, "z-hide");
        }, false);
        // 关闭视频浮层
        util.eventUtil.addEvent(oVideo.getElementsByTagName("i")[0], "click", function(){
            util.eventUtil.preventDefault(e);
            oVideo.getElementsByTagName("video")[0].ended = true;
            util.domUtil.addClass(oVideo, "z-hide");
            util.domUtil.addClass(oMask, "z-hide");
        }, false);
    }();

    // 热门
    +function(){
        util.httpUtil.get("http://study.163.com/webDev/hotcouresByCategory.htm", null, function(res){
            if(res){
                var _arr = window.JSON.parse(res),
                    len = _arr.length;
                var oRank = document.getElementById("sd-rank"),
                    oRankUl = oRank.getElementsByTagName("ul")[0];
                var _html = "";
                for(var i=0; i<10; i++){
                    _html += "<li class=\"f-cb\">";
                    _html += "<img src=\"" + _arr["smallPhotoUrl"] + "\" width=\"50\" height=\"50\" class=\"f-fl\" />";
                    _html += "<div class=\"cnt-right\">";
                    _html += "<p class=\"f-toe\"><a href=\"#\">" + _arr["name"] + "</a></p>";
                    _html += "<p><i class=\"u-icn u-icn-people\"></i>&nbsp;" + _arr["learnerCount"] + "</p>";
                    _html += "</div></li>";
                    oRankUl.innerHTML += _html;
                }
            }
        });
    }()

    // 课程
    +function(){
        var oTabs = document.getElementById("tab").getElementsByTagName("li"),
            oCurTab = oTabs[0],
            oCourse = document.getElementById("courses"),
            oPager = document.getElementById("pager"),
            _crsUrl = "http://study.163.com/webDev/couresByCategory.htm",
            _curPageNo = 1;
        // tab切换
        for(var i=0; i<oTabs.length; i++){
            oTabs[i].idx = i;
            util.eventUtil.addEvent(oTabs[i], "click", function(e){
                for(var j=0; j<oTabs.length; j++){
                    oTabs[j].className = "";
                }
                this.className = "z-crt";
                oCurTab = this;
                var ds = util.domUtil.getDataset(this),
                    _pageSize = 10,
                    _ctype = (this.idx + 1) * 10;
                if(ds){
                    if(ds.pageSize) _pageSize = ds.pageSize;
                    if(ds.type) _ctype = ds.type;
                }
                _curPageNo = 1;
                oCurTab.dataset.type = _ctype;
                getCourse(1, _pageSize, _ctype);
            }, false);
        }
        /**
         * 创建课程盒子
         * @param  {Object} data 课程信息
         */
        function createCourseBox(data){
            var _html = "<li class=\"m-crsbox\"><a href=\"#\">";
            _html += "<img src=\"" + data["middlePhotoUrl"] + "\"" + "alt=\"" + data["name"] +"/>";
            _html += "<p class=\"subject f-toe\">" + data["name"] + "</p>";
            _html += "<p class=\"provider\">" + data["provider"] + "</p>";
            _html += "<p class=\"learner z-show-ib\"><i class=\"u-icn u-icn-people\"></i><span>&nbsp;" + data["learnerCount"] + "</span></p>";
            _html += "<p class=\"kind\">分类：<span>" + data["categoryName"] + "</span></p>";
            _html += "<p class=\"price\">&yen;" + data["price"] + "</p>";
            _html += "<div class=\"descrp\">" + data["description"] + "</div>";
            _html += "</a></li>";
            oCourse.innerHTML += _html;
        }
        /**
         * 创建翻页器
         * @param  {Object} data 课程信息
         */
        function createPager(data){
            /*var oPager = document.getElementById("pager"),
                oNext = util.domUtil.getElesByClsName(oPager, "u-icn-next")[0],
                oPageLi = document.createElement("li");
            for(var i=2; i<=data["totalPage"]; i++){
                var _txt = document.createTextNode(i);
                oPageLi.appendChild(_txt);
                oPager.insertBefore(oPageLi, oNext);
            }*/
            var _html = "<i class=\"u-icn u-icn-prev\"></i>";
            for(var i=1; i<=data["totalPage"]; i++){
                if(i == data["pagination"]["pageIndex"]){
                    _html += "<li class=\"z-crt\">" + i + "</li>";
                } else{
                    _html += "<li>" + i + "</li>";
                }
            }
            _html += "<i class=\"u-icn u-icn-next\"></i>";
        }
        /**
         * 获取课程
         * @param  {Number} pageNo   当前页码
         * @param  {Number} pageSize 每页的课程数目
         * @param  {Number} ctype    筛选类型（产品设计=10，编程语言=20）
         */
        function getCourse(pageNo, pageSize, ctype){
            util.httpUtil.get(_crsUrl, {
                "pageNo": pageNo || 1,
                "psize": pageSize || 10,
                "type": ctype || 10
            }, function(res){
                if(res){
                    _curPageNo = res["pagination"]["pageIndex"];
                    oCurTab.dataset.pageNo = _curPageNo;
                    oCurTab.dataset.pageSize = res["pagination"]["pageSize"];
                    oCurTab.dataset.totalPage = res["totalPage"];
                    var list = res["list"];
                    for(var i=0; i<list.length; i++){
                        createCourseBox(list[i]);
                        // createPager(res);
                    }
                }
            });
        }
        util.eventUtil.addEvent(util.domUtil.getElesByClsName(oPager, "u-icn-prev")[0], "click", function(e){
            util.eventUtil.preventDefault(e);
            if(_curPageNo > 1){
                if(oTabs[0].className && oTabs[0].className == "z-crt"){
                    getCourse(_curPageNo - 1, 10, 10);
                } else{
                    getCourse(_curPageNo - 1, 10, 20);
                }
                // getCourse(_curPageNo-1, 10, oCurTab.dataset.type);
            }
        }, false);
        util.eventUtil.addEvent(util.domUtil.getElesByClsName(oPager, "u-icn-next")[0], "click", function(e){
            util.eventUtil.preventDefault(e);
            if(_curPageNo < 8){
                if(oTabs[0].className && oTabs[0].className == "z-crt"){
                    getCourse(_curPageNo + 1, 10, 10);
                } else{
                    getCourse(_curPageNo + 1, 10, 20);
                }
                // getCourse(_curPageNo+1, 10, oCurTab.dataset.type);
            }
        }, false);
    }();
}, false);