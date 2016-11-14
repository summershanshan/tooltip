/**
 * Created by summershanshan on 2016/10/19.
 */
(function(global,name,tooltip){
    if(typeof define =="function" && define.amd){
        define(tooltip);
    }else if(typeof module!=="undefined" && module.exports){
        module.exports=tooltip;
    }else{
        global[name]=tooltip;
    }
})(window,"toolTip",function(){
    "use strict";
    // 配置常量
    var DATA_TIT = "data-tit",
        DATA_PLACEMENT="data-placement",
        DATA_WIDTH="data-width",
        PT_TOOLTIP="pt-tooltip",
        DATA_TOOLTIP="data-tooltip",
        PT_TOOLTIP_BOX="pt-tooltip-box",
        PT_TOOLTIP_TITLE="pt-tooltip-title",
        CSS_HIDE="hide",
        CSS_SHOW="show",
        TOP="top",
        MAX_WIDTH=300,
        defaultObj={
            title:"",
            placement:TOP,
            width:MAX_WIDTH
        };

    // 一些小工具函数
    var util={
        extend:function(def,sour){
            for(var p in sour){
                if(sour.hasOwnProperty(p)){
                    def[p]=sour[p];
                }
            }
            return def;
        },
        searchUp:function searchObj(node,type){
            if(node===document.body || node === document) return undefined;
            if(node.hasAttribute(type)){
                return node;
            }
            return searchObj(node.parentNode,type);
        },
        getData:function(ele){    //获取自定义属性的值
            var obj = {
                title:ele.getAttribute(DATA_TIT) || "",
                placement:ele.getAttribute(DATA_PLACEMENT) || TOP,
                width:ele.getAttribute(DATA_WIDTH) || MAX_WIDTH
            };
            return this.extend(defaultObj,obj);
        },
        pos:function pos(ele,offset){  //// 嵌套元素的相对于body的位置
            if(ele===null) return offset;
            offset.left+=ele.offsetLeft;
            offset.top+=ele.offsetTop;
            return pos(ele.offsetParent,offset);
        },
        specialPos:function(ele,offset){  //// 特殊情况 如果html标签也设置了距离
            if(ele.offsetParent===document.body){
                offset.left+=document.documentElement.offsetLeft;
                offset.top+=document.documentElement.offsetTop;
            }
            return offset;
        }
    };

    // 主要事件处理程序对象
    var eventHandler={
        target:null,
        toolbox:null,
        init:function(){
            createDom();
            this.unbind();
            this.bind();
        },
        bind:function(){
            document.addEventListener("mouseover",this.mouseover,false);
            document.addEventListener("mouseout",this.mouseout,false);
        },
        unbind:function(){
            document.removeEventListener("mouseover",this.mouseover,false);
            document.removeEventListener("mouseout",this.mouseout,false);
        },
        mouseover:function(evt){
            var self=eventHandler.target=evt.target,
                target=eventHandler.target=util.searchUp(self,DATA_TOOLTIP);
                eventHandler.toolbox=document.querySelector("."+PT_TOOLTIP_BOX);
                if(target) {
                    var param = util.getData(target);
                    updateCon(param);
                    computePos(target);
                }
        },
        mouseout:function(){
            var that=eventHandler.toolbox,
                target=eventHandler.target;
            if(target){
                that.parentNode.classList.remove("in");
            }
        }
    };

    // 更新目标时 更新tooltip显示内容和大小
   function updateCon(obj){
       var toolBox=document.querySelector("."+PT_TOOLTIP_BOX),
           toolTit=document.querySelector("."+PT_TOOLTIP_TITLE),
       state= !obj.title && !obj.content? CSS_HIDE:CSS_SHOW;
       toolTit.innerHTML=obj.title;
       toolBox.className="pt-tooltip-box "+obj.placement+" "+state;
       toolBox.style.maxWidth=obj.width;
   }

    // 创建DOM
    function createDom(obj){
       var param=util.extend(defaultObj,obj),
        div= document.createElement("div");
        div.className=PT_TOOLTIP;
        var str='<div class="pt-tooltip-box '+ param.placement +'" style="max-width:'+param.width+'px">'
            +           '<div class="pt-tooltip-title">'
            +                param.title
            +            '</div>'
            +       '</div>';
        div.innerHTML=str;
        document.body.appendChild(div);
    }

    // 计算各目标的left top值 并显示出来
    function computePos(ele){
        var target=ele,
            self=document.querySelector("."+PT_TOOLTIP),
            tPos=util.specialPos(target,util.pos(target,{left:0,top:0})),//目标元素在窗口中的位置
            tWidth=target.offsetWidth,
            tHeight=target.offsetHeight,
            sWidth=self.offsetWidth,
            sHeight=self.offsetHeight,
            tLeft=tPos.left,
            tTop=tPos.top,
            placement=target.getAttribute(DATA_PLACEMENT) || TOP,
            left,top;
        switch(placement){
            case "top":
                left=tLeft+tWidth/2-sWidth/2;
                top=tTop-sHeight-10;
                break;
            case "right":
                left=tLeft+tWidth+10;
                top=tTop+tHeight/2-sHeight/2;
                break;
            case "bottom":
                left=tLeft+tWidth/2-sWidth/2;
                top=tTop+tHeight+10;
                break;
            case "left":
                left=tLeft-sWidth-10;
                top=tTop+tHeight/2-sHeight/2;
                break;
            default:
                break;
        }
        self.style.cssText=";left:"+left+"px;top:"+top+"px;";
        self.classList.add("in");
    }

    // 初始化调用
    eventHandler.init();
});