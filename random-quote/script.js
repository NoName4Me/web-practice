var colors = ['#e53935', '#d81b60', '#8e24aa', '#5e35b1', '#3949ab', '#1e88e5', '#00acc1', '#00897b', "#43a047", "#c0ca33", "#fb8c00", "#f4511e", "#6d4c41",
    "#455a64", "#424242"
];

var curQuote = "";
var curAuthor = "";

function openURL(url) {
    window.open(url, 'Share', 'width=550, height=400, toolbar=0, scrollbars=1 ,location=0 ,statusbar=0,menubar=0, resizable=0');
}

function getQuote() {
    $.ajax({
        url: "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies",
        method: "POST",
        headers: {
            "X-Mashape-Key": "TpUbERw69vmshpHAXYeLN9KfZunYp1cpRxUjsnGnGAKejhEbPU",
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
        },
        success: function(response) {
            var r = JSON.parse(response);
            curQuote = r.quote;
            curAuthor = r.author;
            $(".content").animate({
                opacity: 0
            }, 400, function() {
                $(this).animate({
                    opacity: 1
                }, 400);
                $(".quote-text").text(curQuote);
                $(".quote-author").text("—  " + curAuthor);
            });

            var color = Math.floor(Math.random() * colors.length);
            $("body").animate({
                backgroundColor: colors[color],
                color: colors[color]
            }, 800);
            $(".btn").animate({
                backgroundColor: colors[color],
                color: colors[color]
            }, 800);
        }
    });
}

$(document).ready(function() {
    getQuote();
    $("#getQuote").on("click", getQuote);
    $('#twitter-share').on('click', function() {
        openURL('https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent('"' + curQuote + '"  — ' + curAuthor));
    });
    $('#weibo-share').on('click', function() {
        openURL('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent('"' + curQuote + '"  — ' + curAuthor));
    });
});
