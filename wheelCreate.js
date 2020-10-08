			var applause = new Audio('applause.mp3');
			var boo = new Audio('boo.mp3');
			var tick = new Audio('tick.mp3');


			// Create new wheel object specifying the parameters at creation time.
            let theWheel = new Winwheel({
                'numSegments'       : 19,         // Specify number of segments.
                'outerRadius'       : 150,       // Set outer radius so wheel fits inside the background.
                'drawMode'          : 'image',   // drawMode must be set to image.
                'drawText'          : false,      // Need to set this true if want code-drawn text on image wheels.
                'textFontSize'      : 12,        // Set text options as desired.
                'textOrientation'   : 'curved',
                'textDirection'     : 'reversed',
                'textAlignment'     : 'outer',
                'textMargin'        : 5,
                'textFontFamily'    : 'monospace',
                'textStrokeStyle'   : 'black',
                'textLineWidth'     : 2,
                'textFillStyle'     : 'white',
                'segments'     :                // Define segments.
                [
                   {'text' : 'Foldable Recycle Bag'},
                   {'text' : 'Foldable Recycle Bag'},
                   {'text' : 'Pearl Jewellery'},
                   {'text' : 'RM50 Cash Voucher'},
                   {'text' : 'RM50 Cash Voucher'},
                   {'text' : 'Smart LED Tumbler'},
                   {'text' : 'Smart LED Tumbler'},
                   {'text' : 'Exclusive LAZO Umbrella'},
                   {'text' : 'Exclusive LAZO Umbrella'},
                   {'text' : 'Diamond Jewellery'},
                   {'text' : 'Foldable Recycle Bag'},
                   {'text' : 'Foldable Recycle Bag'},
                   {'text' : 'Please Spin Again!'},
                   {'text' : 'Please Spin Again!'},
                   {'text' : 'Premium Jewellery Box'},
                   {'text' : 'Premium Jewellery Box'},
                   {'text' : 'RM100 Cash Voucher'},
                   {'text' : 'Exclusive LAZO Umbrella'},
                   {'text' : 'Exclusive LAZO Umbrella'},
                ],
                'animation' :                   // Specify the animation to use.
                {
                    'type'     : 'spinToStop',
                    'duration' : 15,     // Duration in seconds.
                    'spins'    : 10,     // Number of complete spins.
                    'callbackFinished' : alertPrize
                }
            });

            // Create new image object in memory.
            let loadedImg = new Image();

            // Create callback to execute once the image has finished loading.
            loadedImg.onload = function()
            {
                theWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
                theWheel.draw();                    // Also call draw function to render the wheel.
            }

            // Set the image source, once complete this will trigger the onLoad callback (above).
            loadedImg.src = "lazo_wheel_base.jpg";



            // Vars used by the code in this page to do power controls.
            let wheelPower    = 2;
            let wheelSpinning = false;

            // -------------------------------------------------------
            // Function to handle the onClick on the power buttons.
            // -------------------------------------------------------
            function powerSelected(powerLevel)
            {
                // Ensure that power can't be changed while wheel is spinning.
                if (wheelSpinning == false) {
                    // Reset all to grey incase this is not the first time the user has selected the power.
                    document.getElementById('pw1').className = "";
                    document.getElementById('pw2').className = "";
                    document.getElementById('pw3').className = "";

                    // Now light up all cells below-and-including the one selected by changing the class.
                    if (powerLevel >= 1) {
                        document.getElementById('pw1').className = "pw1";
                    }

                    if (powerLevel >= 2) {
                        document.getElementById('pw2').className = "pw2";
                    }

                    if (powerLevel >= 3) {
                        document.getElementById('pw3').className = "pw3";
                    }

                    // Set wheelPower var used when spin button is clicked.
                    wheelPower = powerLevel;

                    // Light up the spin button by changing it's source image and adding a clickable class to it.
                    document.getElementById('spin_button').src = "spin_on.png";
                    document.getElementById('spin_button').className = "clickable";
                }
            }

            // -------------------------------------------------------
            // Click handler for spin button.
            // -------------------------------------------------------
            function startSpin()
            {
				theWheel.rotationAngle = 0;
                // Ensure that spinning can't be clicked again while already running.
                if (wheelSpinning == false) {
                    // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                    // to rotate with the duration of the animation the quicker the wheel spins.
                    if (wheelPower == 1) {
                        theWheel.animation.spins = 2;
                    } else if (wheelPower == 2) {
                        theWheel.animation.spins = 5;
                    } else if (wheelPower == 3) {
                        theWheel.animation.spins = 8;
                    }

                    // Disable the spin button so can't click again while wheel is spinning.
                    document.getElementById('spin_button').src       = "spin_off.png";
                    document.getElementById('spin_button').className = "";

                    // Begin the spin animation by calling startAnimation on the wheel object.
                    theWheel.startAnimation();

                    // Set to true so that power can't be changed and spin button re-enabled during
                    // the current animation. The user will have to reset before spinning again.
                    wheelSpinning = true;
                }
            }

            // -------------------------------------------------------
            // Function for reset button.
            // -------------------------------------------------------
            function resetWheel()
            {
                theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
                //theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
                theWheel.draw();                // Call draw to render changes to the wheel.

               // document.getElementById('pw1').className = "";  // Remove all colours from the power level indicators.
               // document.getElementById('pw2').className = "";
               // document.getElementById('pw3').className = "";
				
				document.getElementById('spin_button').className = "clickable";
				document.getElementById('spin_button').src       = "spin_on.png";

                wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
            }

			
            // -------------------------------------------------------
            // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
            // note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
            // -------------------------------------------------------
            function alertPrize(indicatedSegment)
            {
                // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
                if (indicatedSegment.text == "Please Spin Again!"){
					boo.play();
					alert("Sorry, please spin again!");
				} else {
					applause.play();
					alert("CONGRATULATIONS!<br>You have won:<p>" + indicatedSegment.text);
					onConfetti();
				}
				//resetWheel(); return false;
            }