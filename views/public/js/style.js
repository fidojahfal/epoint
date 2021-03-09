$(document).ready(function() {
    var tably = $("#tably").DataTable({
        scrollY: "237px",
        scrollCollapse: true,
        ordering: false,
    });

    var tablx = $("#tablx").DataTable({
        scrollY: "337px",
        scrollCollapse: true,
        ordering: false,
        searching: false,
        paging: false,
        info: false,
    });

    $('.alt:contains("+")').addClass("statuscg");
    $('.alt:contains("-")').addClass("status");

    $("#btnfltr").click(function() {
        var kelas = $("#kelas").val();
        var jurusan = $("#jurusan").val();
        var index = $("#index").val();
        var kji = kelas + " " + jurusan + " " + index;
        if (kelas == "" && index == "" && jurusan == "") {
            tably.columns().search("").draw();
        } else {
            tably.columns(2).search(kji, true, false).draw();
        }
    });

    $("#kelas").change(function() {
        if ($(this).val() == "-") {
            $("#jurusan").attr("disabled", true);
            $("#index").attr("disabled", true);
            $("#btnfltr").attr("disabled", true);
        } else {
            $("#jurusan").attr("disabled", false);
        }
    });

    $("#jurusan").change(function() {
        if ($(this).val() == "-") {
            $("#index").attr("disabled", true);
            $("#btnfltr").attr("disabled", true);
        } else {
            $("#index").attr("disabled", false);
        }
    });

    $("#index").change(function() {
        if ($(this).val() == "-") {
            $("#btnfltr").attr("disabled", true);
        } else {
            $("#btnfltr").attr("disabled", false);
        }
    });

    $(".dataTables_length").addClass("bs-select");
});

var readURL = function(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $(".avatar").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
};

$(".file-upload").on("change", function() {
    readURL(this);
});

//Js for image preview before upload start
$("#profileImage").click(function(e) {
    $("#imageUpload").click();
});

function fasterPreview(uploader) {
    if (uploader.files && uploader.files[0]) {
        $("#profileImage").attr("src", window.URL.createObjectURL(uploader.files[0]));
    }
}

$("#imageUpload").change(function() {
    fasterPreview(this);
});

$(document).ready(function() {
    $('.btnedit').click(function() {
        var title = $(this).attr('title')
        var name = $(this).attr('title2')
        $('.hidden').val(title);
        $('.poin-hidden').val(name);
        document.getElementById("poin").innerHTML = name;
    })
})