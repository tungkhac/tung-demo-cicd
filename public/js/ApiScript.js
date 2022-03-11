// Product
function orderProduct(trigger, _productId, _amount) {
    var submitData = JSON.stringify(
       {
           productID: _productId,
           amount: _amount
       });

    $.ajax({
        type: "POST",
        url: "/desktopmodules/vnp_webapi/GlobalService.aspx/OrderProduct",
        data: submitData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            $(trigger).html('Đã đặt hàng');
            $(trigger).removeAttr('onclick');

            showCartInfo();
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}

function showCartInfo() {
    $.ajax({
        type: "POST",
        url: "/desktopmodules/vnp_webapi/GlobalService.aspx/GetShoppingCart",
        data: null,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var cartInfo = JSON.parse(msg.d);

            $('span[app-name="vnp_cart_product"]').html(cartInfo.NumberProduct);
            $('span[app-name="vnp_cart_cost"]').html(cartInfo.TotalCost);
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}

// PostOffice
function postOfficeChangeProvince(moduleId, _dropProvince, _dropDistrict) {
    var dropProvince = document.getElementById(_dropProvince);
    var dropDistrict = document.getElementById(_dropDistrict);

    var provinceID = parseInt(dropProvince.options[dropProvince.selectedIndex].value);
    var submitData = JSON.stringify(
      {
          moduleID: moduleId,
          provinceID: provinceID
      });

    $.ajax({
        type: "POST",
        url: "/desktopmodules/vnp_webapi/GlobalService.aspx/GetDistrictByProvinceID",
        data: submitData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            // Clear old item
            for (var i = dropDistrict.options.length - 1; i >= 0; i--) {
                dropDistrict.remove(i);
            }

            // Add new item
            var param = JSON.parse(msg.d);

            $.each(param, function (i, item) {
                var option = document.createElement("option");
                option.text = item.DistrictName;
                option.value = item.DistrictID;
                dropDistrict.add(option);
            });
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}

// Complain
function submitComplain(_txtTitle, _dropType, _txtCustomerName, _txtCustomerPhone, _txtCustomerEmail, _txtContent, _txtCaptchar) {
    var txtTitle = document.getElementById(_txtTitle);
    var dropType = document.getElementById(_dropType)
    var txtCustomerName = document.getElementById(_txtCustomerName);
    var txtCustomerPhone = document.getElementById(_txtCustomerPhone);
    var txtCustomerEmail = document.getElementById(_txtCustomerEmail);
    var txtContent = document.getElementById(_txtContent);
    var txtCaptchar = document.getElementById(_txtCaptchar);

    if (txtTitle.value.trim() == ''
        || txtCustomerName.value.trim() == ''
        || txtCustomerEmail.value.trim() == ''
        || txtContent.value.trim() == '') {
        alert('Bạn vui lòng nhập đầy đủ thông tin cá nhân và nội dung khiếu nại.');
        return;
    }

    if (txtCaptchar.value.trim() == '') {
        alert('Mã xác nhận không chính xác');
        return;
    }

    var submitData = JSON.stringify(
       {
           title: txtTitle.value,
           complainType: dropType.value,
           customerName: txtCustomerName.value,
           customerPhone: txtCustomerPhone.value,
           customerEmail: txtCustomerEmail.value,
           complainContent: txtContent.value,
           captchar: txtCaptchar.value.trim()
       });

    $.ajax({
        type: "POST",
        url: "/desktopmodules/vnp_webapi/GlobalService.aspx/SubmitComplain",
        data: submitData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            alert(msg.d);
            document.forms[0].reset();
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}

// Comment
function submitComment(refID, refType, refTitle, txtReaderName, txtReaderEmail, txtContent) {
    if (txtReaderName.value.trim() == ''
        || txtReaderEmail.value.trim() == ''
        || txtContent.value.trim() == '') {
        alert('Bạn vui lòng nhập đầy đủ thông tin cá nhân và nội dung bình luận.');
        return;
    }

    var submitData = JSON.stringify(
        {
            RefID: refID,
            RefType: refType,
            RefTitle: refTitle,
            ReaderName: txtReaderName.value,
            ReaderEmail: txtReaderEmail.value,
            Content: txtContent.value
        });

    $.ajax({
        type: "POST",
        url: "/desktopmodules/vnp_webapi/GlobalService.aspx/SubmitComment",
        data: submitData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            alert(msg.d);
            txtReaderName.value = '';
            txtReaderEmail.value = '';
            txtContent.value = '';
        },
        error: function (msg) {
            //alert(msg.responseText);
        }
    });
}

function getComment(refID, refType, hidPageIndexID, divHolder) {
    var hidPageIndex = document.getElementById(hidPageIndexID);
    var pageIndex = parseInt(hidPageIndex.value);

    var submitData = JSON.stringify(
        {
            RefID: refID,
            RefType: refType,
            PageIndex: pageIndex
        });

    $.ajax({
        type: "POST",
        url: "/desktopmodules/vnp_webapi/GlobalService.aspx/GetComment",
        data: submitData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var param = JSON.parse(msg.d);

            var comment = '';
            $.each(param.Comments, function (i, item) {
                comment += "<div>";
                comment += "<strong>" + item.ReaderName + "</strong>";
                comment += "<em>" + item.CreatedDTG + "</em>";
                comment += "<div>" + item.Content + "</div>";
                comment += "</div>";
            });

            divHolder.innerHTML += comment;

            if (param.HasOtherComment) {
                otherComment.style.display = 'visible';
                hidPageIndex.value = (pageIndex + 1).toString();
            }
            else {
                otherComment.style.display = 'none';
            }
        },
        error: function (msg) {
            //alert(msg.responseText);
        }
    });
}
