//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').remove();
            }
            //Dont change the code before it

            var canvas = new DetermineOrderCanvas({"input": checkioInput, "answer": rightResult});
            canvas.createCanvas($content.find(".explanation")[0]);
            canvas.animateCanvas();


            this_e.setAnimationHeight($content.height() + 60);

        });

        var $tryit;
        var tryitData;
        var tCanvas;
//
        ext.set_console_process_ret(function (this_e, ret) {
            if (tCanvas) {
                tCanvas.clearCanvas();
            }
            if (typeof(ret) !== "string") {
                $tryit.find(".checkio-result-in").html(ext.JSON.stringify(ret));
                return false;
            }
            ret = ret.replace(/\'/g, "");
            tCanvas = new DetermineOrderCanvas({"input": tryitData, "answer": ret});
            tCanvas.createCanvas($tryit.find(".tryit-canvas")[0]);
            tCanvas.animateCanvas();
            return false;
        });

        ext.set_generate_animation_panel(function (this_e) {

            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit')));

            $tryit.find('form').submit(function (e) {
                var data = $tryit.find("form .input-words").val();
                if (!data) {
                    return false;
                }
                tryitData = data.match(/\w+/gi);
                $tryit.find("form .input-words").val(tryitData.join(" "));
                this_e.sendToConsoleCheckiO(tryitData);
                e.stopPropagation();
                return false;
            });

        });

        function DetermineOrderCanvas(data) {

            var words = data.input || [];
            var result = data.answer || "";


            var zx = 10;
            var zy = 10;
            var cellSizeY = 30;
            var cellSizeX = 22;
            var spacing = 0;
            var resSpacing = 1.3;
            var delay = 200;

            var fullSizeX = result.length * cellSizeX > 300 ? result.length * cellSizeX : 300;
            var fullSizeY = zy + (resSpacing + words.length) * cellSizeY * (1 + spacing);

            var colorDark = "#294270";
            var colorOrange = "#F0801A";
            var colorBlue = "#8FC7ED";

            var attrLetter = {"font-family": "Verdana", "font-size": cellSizeY * 0.9, "stroke": colorDark};
            var attrLetterDisabled = {"font-family": "Verdana", "font-size": cellSizeY * 0.8,
                "stroke": colorBlue, "fill": colorBlue};
            var attrLetterNone = {"font-family": "Verdana", "font-size": cellSizeY * 0.8,
                "stroke": colorOrange, "fill": colorOrange, "opacity": 0};

            var paper;
            var letterSet;
            var letterDict = {};
            for (var l = 0; l < result.length; l++) {
                letterDict[result[l]] = [];
            }

            this.createCanvas = function(dom) {
                paper = Raphael(dom, fullSizeX, fullSizeY, 0, 0);
                letterSet = paper.set();
                for (var i = 0; i < words.length; i++) {
                    var sx = (fullSizeX - words[i].length * cellSizeX) / 2 + cellSizeX / 2;
                    var sy = zy + (resSpacing + i) * cellSizeY * (1 + spacing) + cellSizeY / 2;
                    for (var j = 0; j < words[i].length; j++){
                        var letter = words[i][j];
                        if (result.indexOf(letter) !== -1) {
                            letterDict[letter] = letterDict[letter].concat([letterSet.length]);
                        }
                        letterSet.push(
                            paper.text(sx + j * cellSizeX, sy, letter).attr(attrLetter)
                        );

                    }
                }
            };

            this.animateCanvas = function() {
                var sx = (fullSizeX - result.length * cellSizeX) / 2 + cellSizeX / 2;
                var sy = zy + cellSizeY / 2;

                for (var i = 0; i < result.length; i++) {
                    setTimeout(function(){
                        var letter = result[i];
                        var pos = i;
                        var rLetter;
                        return function() {
                            if (letterDict[letter].length) {
                                rLetter = letterSet[letterDict[letter][0]];
                                var disabledLetter = rLetter.clone();
                                disabledLetter.attr(attrLetterDisabled);
                                for (var j = 1; j < letterDict[letter].length; j++) {
                                    letterSet[letterDict[letter][j]].animate(attrLetterDisabled, delay);
                                }
                            }
                            else {
                                rLetter = paper.text(sx + pos * cellSizeX, sy, letter).attr(attrLetterNone);
                            }
                            rLetter.animate({"x": sx + pos * cellSizeX, "y": sy, "opacity": 1}, delay);
                        }
                    }(), delay * 2 * i);
                }
            };

            this.clearCanvas = function() {
                paper.remove();
            }

        }


    }
);
