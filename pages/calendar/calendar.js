//morningf@foxmail.com

var ccFile = require('../../utils/calendar-converter.js')
var calendarConverter = new ccFile.CalendarConverter();

//月份天数表
var DAY_OF_MONTH = [
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];

//判断当前年是否闰年
var isLeapYear = function(year){
    if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))
        return 1
    else
        return 0
};

//获取当月有多少天
var getDayCount = function(year, month){
    return DAY_OF_MONTH[isLeapYear(year)][month];
};

//获取当前索引下是几号
var getDay = function(index) {
    return index - curDayOffset;
};

var pageData = {
    date: "",                //当前日期字符串

    //arr数据是与索引对应的数据信息
    arrIsShow: [],          //是否显示此日期
    arrDays: [],            //关于几号的信息
    arrInfoEx: [],          //农历节假日等扩展信息
    arrInfoExShow: [],      //处理后用于显示的扩展信息

    //选择一天时显示的信息
    detailData: {
        curDay: "",         //detail中显示的日信息
        curInfo1: "",
        curInfo2: "",
    }
    
}

//设置当前详细信息的索引，前台的详细信息会被更新
var setCurDetailIndex = function(index){
    var curEx = pageData.arrInfoEx[index];
    curDay = curEx.sDay - 1;
    pageData.detailData.curDay = curEx.sDay;
    pageData.detailData.curInfo1 = "农历" + curEx.lunarMonth + "月" + curEx.lunarDay;
    pageData.detailData.curInfo2 = curEx.cYear+curEx.lunarYear + "年 " + curEx.cMonth + "月 " + curEx.cDay + "日 " + curEx.lunarFestival;
}

//刷新全部数据
var refreshPageData = function(year, month, day){
    pageData.date = year+'年'+(month+1)+'月';

    var offset = new Date(year, month, 1).getDay();

    for (var i = 0; i < 42; ++i)
    {
        pageData.arrIsShow[i] = i < offset || i >= getDayCount(year, month) + offset ? false : true;
        pageData.arrDays[i] = i - offset + 1;
        var d = new Date(year, month, i - offset + 1);
        var dEx = calendarConverter.solar2lunar(d);
        pageData.arrInfoEx[i] = dEx;
        if ("" != dEx.lunarFestival)
        {
            pageData.arrInfoExShow[i] = dEx.lunarFestival;
        }
        else if ("初一" === dEx.lunarDay)
        {
            pageData.arrInfoExShow[i] = dEx.lunarMonth + "月";
        }
        else
        {
            pageData.arrInfoExShow[i] = dEx.lunarDay;
        }
    }

    setCurDetailIndex(offset + day);
};

var curDate = new Date();
var curMonth = curDate.getMonth();
var curYear = curDate.getFullYear();
var curDay = curDate.getDay();
refreshPageData(curYear, curMonth, curDay);

Page({
    data: pageData,

    onLoad: function(options){
        
    },

    goToday: function(e){
        curDate = new Date();
        curMonth = curDate.getMonth();
        curYear = curDate.getFullYear();
        curDay = curDate.getDay();
        refreshPageData(curYear, curMonth, curDay);
        this.setData(pageData);
    },

    goLastMonth: function(e){
        if (0 == curMonth)
        {
            curMonth = 11;
            --curYear
        }
        else
        {
            --curMonth;
        }
        refreshPageData(curYear, curMonth, 0);
        this.setData(pageData);
    },

    goNextMonth: function(e){
        if (11 == curMonth)
        {
            curMonth = 0;
            ++curYear
        }
        else
        {
            ++curMonth;
        }
        refreshPageData(curYear, curMonth, 0);
        this.setData(pageData);
    },

    selectDay: function(e){
        setCurDetailIndex(e.currentTarget.dataset.dayIndex);
        this.setData({
            detailData: pageData.detailData,
        })
    },

    bindDateChange: function(e){
        var arr = e.detail.value.split("-");
        refreshPageData(+arr[0], arr[1]-1, arr[2]-1);
        this.setData(pageData);
    },
});