//Don't change it
requirejs(['ext_editor_io2', 'jquery_190', 'raphael_210'],
    function (extIO, $, rr) {
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

        var io = new extIO({
            animation: function($expl, data){
                var checkioInput = data.in;
                if (!checkioInput) return;
                var rightResult = data.ext.answer;
                var canvas = new DetermineOrderCanvas({"input": checkioInput[0], "answer": rightResult});
                canvas.createCanvas($expl[0]);
                canvas.animateCanvas()
            }
        });
        io.start();
    }
);
