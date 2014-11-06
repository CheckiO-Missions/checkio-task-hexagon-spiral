//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
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

            //YOUR FUNCTION NAME
            var fname = 'hex_spiral';

            var checkioInput = data.in || [1, 9];
            var checkioInputStr = fname + '(' + checkioInput.join(", ") + ')';

            var failError = function (dError) {
                $content.find('.call').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call').html(checkioInputStr);
            $content.find('.output').html('Working...');

            var svg = new SVG($content.find(".explanation")[0]);


            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResult = data.out;
                var result = data.ext["result"];
                var result_addon = data.ext["result_addon"];

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];
                $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

                if (explanation) {
                    svg.draw(checkioInput, explanation);
                }

                if (!result) {
                    $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });


        function SVG(dom, options) {

            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            options = options || {};


            var zx = 10;
            var zy = 10;
            var cellSize = options.size || 40;
            var cellN = 6;

            var defaultmap = [
                [  0, 0, 0, 0, 0, 0],
                [  0, 0, 66, 0, 0],
                [  0, 0, 65, 67, 0, 0],
                [  0, 64, 41, 68, 0],
                [  0, 63, 40, 42, 69, 0],
                [ 62, 39, 22, 43, 70],
                [ 91, 38, 21, 23, 44, 71],
                [ 61, 20, 9, 24, 45],
                [ 90, 37, 8, 10, 25, 72],
                [ 60, 19, 2, 11, 46],
                [ 89, 36, 7, 3, 26, 73],
                [ 59, 18, 1, 12, 47],
                [ 88, 35, 6, 4, 27, 74],
                [ 58, 17, 5, 13, 48],
                [ 87, 34, 16, 14, 28, 75],
                [ 57, 33, 15, 29, 49],
                [ 86, 56, 32, 30, 50, 76],
                [ 85, 55, 31, 51, 77],
                [  0, 84, 54, 52, 78, 0],
                [  0, 83, 53, 79, 0],
                [  0, 0, 82, 80, 0, 0],
                [  0, 0, 81, 0, 0]

            ];

            var colorDark = "#294270";
            var colorOrange = "#F0801A";
            var attrCell = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue1};
            var attrCellMarked = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorOrange};
            var attrLine = {"stroke": colorOrange, "stroke-width": 3, "stroke-linecap": "round"};
            var attrText = {"font-family": "Roboto, Arial, serif", "font-size": 1.4 * cellSize / 4, "stroke": colorDark};


            var paper;
            var hset;
            var tset;
            var hexDict = {};
            var fullSizeX,
                fullSizeY;

            function hexagon(canvas, x0, y0, radius) {
                var path = "";
                for (var i = 0; i <= 6; i++) {
                    var a = i * 60;
                    var x = radius * Math.cos(a * Math.PI / 180);
                    var y = radius * Math.sin(a * Math.PI / 180);
                    path += (i == 0 ? "M" : "L") + (x + x0) + "," + (y + y0);
                }
                path += "Z";
                var hex = canvas.path(path);
                hex.cx = x0;
                hex.cy = y0;
                return hex;
            }

            this.draw = function (dataInput, expl, size) {
                var marked1 = dataInput[0];
                var marked2 = dataInput[1];
                fullSizeX = cellN * 1.5 * cellSize;
                fullSizeY = 1.5 * (cellN + 0.5) * cellSize;

                paper = Raphael(dom, fullSizeX, fullSizeY, 0, 0);
                hset = paper.set();
                tset = paper.set();
                for (var i = 6 - cellN + 1; i < cellN * 3 + 4; i++) {
                    for (var j = 0; j < (i % 2 ? cellN - 1 : cellN); j++) {
                        if (defaultmap[i][j]) {
                            var cx = zx + 1.5 * cellSize * j + cellSize / 2 + (i % 2 ? 3 * cellSize / 4 : 0);
                            var cy = (i + 1) * cellSize * Math.sin(Math.PI / 3) / 2 - zy;
                            var h = hexagon(paper, cx, cy, cellSize / 2).attr(attrCell);
                            var t = paper.text(cx, cy, String(defaultmap[i][j])).attr(attrText);
                            hexDict[defaultmap[i][j]] = h;
                            h.mark = defaultmap[i][j];
                            t.mark = defaultmap[i][j];
                            hset.push(h);
                            tset.push(t);
                        }

                    }
                }
                hexDict[marked1].attr(attrCellMarked);
                hexDict[marked2].attr(attrCellMarked);
                if (expl) {
                    paper.path(Raphael.format("M{0},{1}L{2},{3}",
                        hexDict[expl].cx,
                        hexDict[expl].cy,
                        hexDict[marked1].cx,
                        hexDict[marked1].cy
                    )).attr(attrLine);
                    paper.path(Raphael.format("M{0},{1}L{2},{3}",
                        hexDict[expl].cx,
                        hexDict[expl].cy,
                        hexDict[marked2].cx,
                        hexDict[marked2].cy
                    )).attr(attrLine);
                }
                tset.toFront();
            };

        }

    }
);
