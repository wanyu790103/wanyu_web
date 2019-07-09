(function ($) {
    $(function () {
        var url = "/cathaybk/web/service/InsuranceContactMe.ashx";
        var $btn = $("#btnPost");
        var $checkBox = $("#checkBox");
        var NameFieldName = "Name";
        var CellPhoneFieldName = "CellPhone";
        var GenderFieldName = "Gender";

        var ProjectCodeFieldName = "code";
        var ProjectCode = getParameterByName(ProjectCodeFieldName) || "465TQSU";
        var sourceFieldName = "utm_source";
        var source = getParameterByName(sourceFieldName) || "";
        var CampaignFieldName = "utm_campaign";
        var Campaign = getParameterByName(CampaignFieldName) || "";

        $.validator.setDefaults({
            submitHandler: function () {
                alert("提交事件!");
            }
        });
        $().ready(function () {
            $("#contactForm").validate();
        });

        var getReqData = (function () {
            var reqData = {};
            $.each([NameFieldName, CellPhoneFieldName, GenderFieldName], function (index, name) {
                var $dom = $('[name="' + name + '"]');
                switch ($dom.prop("type")) {
                    case "radio":
                        reqData[name] = $dom.filter(":checked").val();
                        break;
                    case "text":
                        reqData[name] = $dom.val();
                        break;
                }
            });
            var CelebrustFunc = window.cubcsafindCookieVal || function () { return ""; };
            var data = {
                "CookieId": CelebrustFunc('cubcsapersisted'),
                "SessionNumber": CelebrustFunc('cubcsasession'),
			};
            reqData["CampCode"] = ProjectCode;
            reqData["source"] = source;
            reqData["Campaign"] = Campaign;
			reqData["cookie_id"] = data["CookieId"].length < 40 ? "" : data["CookieId"].substring(7, 32);
            reqData["sessionnumber"] = data["SessionNumber"].indexOf("_") < 0 ? "" : data["SessionNumber"].split('_')[0];
            return reqData;
        });

        var checkReqData = function (data) {
            var msg = "";
            if($checkBox.filter(":checked").length === 0)
                msg = "請勾選同意";

            return msg;
        };

        $btn.on("click", function (e) {
            e.preventDefault();
            var reqData = getReqData();
            var msg = checkReqData(reqData);
            if (!$("#contactForm").valid()) {
                return;
            } else if (msg) {
                alert(msg);
                return;
            }
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(reqData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
            }).done(function (data) {
                if (data.Status === "0000") {
                    ga('send', 'event', '圖靈＿好險活動頁', '保險規劃專人聯繫我表格送出', '送出資料');
                    window.location.href = $btn.attr("href") + "?code=" + ProjectCode
                }
                else
                    alert(data.Msg + "(" + data.Status + ")");
            }).fail(function (xhr, status, err) {
                alert("系統失敗");
                console.log(xhr);
                console.log(status);
                console.log(err);
            });
           
        });
    });
})(jQuery);

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}