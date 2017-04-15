$(document).ready(function() {
    var $curInput = $('.current-input');
    var $preInput = $('.pre-input');
    var calculated = false;
    var pre = "0",
        cur = "0";
    var max_length = 12;
    $('button').on('click', function() {
        var btnText = $(this).text();
        if (btnText === 'C') {
            cur = '0'
            pre = '0';
        } else if (btnText === '=') {
            if (/[\d]$/.test(pre)) {
                calculated = true;
                cur = eval(pre) + "";
                pre += btnText;
                if (cur.includes('.')) {
                    cur = cur.slice(0, max_length);
                }
            }
        } else if (/[\d\.]/.test(btnText)) {
            if (calculated) {
                cur = btnText === '.' ? '0.' : btnText;
                pre = cur;
                calculated = false;
            } else if (/[\+\-\*\/\%]/.test(cur)) {
                cur = btnText === '.' ? '0.' : btnText;
                pre += cur;
            } else if (cur === '0') {
                if (btnText === '.') {
                    cur += btnText;
                    pre += btnText;
                } else if (btnText !== '0') {
                    cur = btnText;
                    pre = pre.slice(0, pre.length - 1) + cur;
                }
            } else if (!cur.includes('.') && btnText === '.' || /[\d]/.test(btnText)) {
                cur += btnText;
                pre += btnText;
            }
        } else {
          if(calculated){
            pre = cur;
            calculated = false;
          }
            if (/[\d]$/.test(cur)) {
                cur = btnText;
                pre += btnText;
            }
        }


        if (cur.length > max_length) {
            cur = 0;
            pre = 'Too Long!';
            calculated = true;
        }
        if (cur === 'Infinity') {
            calculated = true;
        }
        $curInput.text(cur);
        $preInput.text(pre);
    });
});
