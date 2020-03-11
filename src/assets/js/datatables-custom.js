const $ = require("jquery");
console.log($.fn.dataTableExt);

// All DataTables Turkish Letters Sorting Settings
if ($.fn.dataTableExt) {
    $.extend($.fn.dataTableExt.oSort, {
        "turkish-pre": function(data) {
            var special_letters = {
                C: "Ca",
                c: "ca",
                Ç: "Cb",
                ç: "cb",
                G: "Ga",
                g: "ga",
                Ğ: "Gb",
                ğ: "gb",
                I: "Ia",
                ı: "ia",
                İ: "Ib",
                i: "ib",
                O: "Oa",
                o: "oa",
                Ö: "Ob",
                ö: "ob",
                S: "Sa",
                s: "sa",
                Ş: "Sb",
                ş: "sb",
                U: "Ua",
                u: "ua",
                Ü: "Ub",
                ü: "ub"
            };
            for (var val in special_letters)
                data =
                    typeof data === "string"
                        ? data
                              .split(val)
                              .join(special_letters[val])
                              .toLowerCase()
                        : data;
            return data;
        },

        "turkish-asc": function(a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
        },

        "turkish-desc": function(a, b) {
            return a < b ? 1 : a > b ? -1 : 0;
        }
    });
}

// All DataTables errMode Settings
$.fn.DataTable.ext.errMode = "none";

// All DataTables Responsive Function
var _childNodeStore = {};
function _childNodes(dt, row, col) {
    var name = row + "-" + col;

    if (_childNodeStore[name]) {
        return _childNodeStore[name];
    }

    // https://jsperf.com/childnodes-array-slice-vs-loop
    var nodes = [];
    var children = dt.cell(row, col).node().childNodes;
    for (var i = 0, ien = children.length; i < ien; i++) {
        nodes.push(children[i]);
    }

    _childNodeStore[name] = nodes;

    return nodes;
}

// All DataTables Responsive Settings [DEFAULTS]
$.extend(true, $.fn.dataTable.defaults, {
    responsive: {
        details: {
            type: "column",
            target: 2,
            renderer: function(api, rowIdx, columns) {
                console.log(api, rowIdx);
                var tbl = $('<table class="w-100"/>');
                var found = false;
                var data = $.map(columns, function(col, i) {
                    if (col.hidden) {
                        $(`<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
                        <th class="w-1">${col.title}</th> 
                        </tr>`)
                            .append($("<td/>").append(_childNodes(api, col.rowIndex, col.columnIndex)))
                            .appendTo(tbl);
                        found = true;
                    }
                });

                return found ? tbl : false;
            }
        }
    },
    language: {
        sDecimal: ",",
        sEmptyTable: "Tabloda herhangi bir veri mevcut değil",
        sInfo: "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor",
        sInfoEmpty: "Kayıt yok",
        sInfoFiltered: "(_MAX_ kayıt içerisinden bulunan)",
        sInfoPostFix: "",
        sInfoThousands: ".",
        sLengthMenu: "_MENU_ göster",
        sLoadingRecords: "Yükleniyor...",
        sProcessing: "İşleniyor...",
        sSearch: "",
        searchPlaceholder: "Ara",
        sZeroRecords: "Eşleşen kayıt bulunamadı",
        oPaginate: {
            sFirst: "İlk",
            sLast: "Son",
            sNext: "Sonraki",
            sPrevious: "Önceki"
        },
        oAria: {
            sSortAscending: ": artan sütun sıralamasını aktifleştir",
            sSortDescending: ": azalan sütun sıralamasını aktifleştir"
        },
        select: {
            rows: {
                _: "%d kayıt seçildi",
                "0": "",
                "1": "1 kayıt seçildi"
            }
        },
        decimal: ",",
        thousands: "."
    }
});
