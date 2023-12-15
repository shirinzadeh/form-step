(function ($) {
    const staffes = []
    const services = []

    function addClassToClicked(item) {
        $('.item-wrapper').each(function (ind, el) {
            $(el).find('.item-inner').removeClass('js-item-active')
        })
        // Add active class to click {ed item 
        if (item.hasClass('js-item-active')) {
            item.removeClass('js-item-active')
        } else {
            item.addClass('js-item-active')
        }
    }

    const headerTitle = $('.header__title');
    const warningMsg = $('.warning-content')
    $.getJSON('../assets/data/staffes.json', function (data) {
        headerTitle.text('Select staff');
        warningMsg.find('span').text('select staff')

        for (let staff of data.staffes) {
            $('.staffes').append(
                `<div class="item-inner" key=${staff.id}>
                    <div class='item'>
                        <div class="item__img"><img src="assets/img/${staff.image}" alt="Staff1"></div>
                        <div class="item__tail">
                            <p class="item__name">${staff.name}</p>
                            <span class="item__mail text-muted">${staff.email}</span>
                        </div>
                    </div>
                </div>`
            )
        }

        // ** Onclick item 
        $('.staffes').find('.item-inner').click(function () {
            const $this = $(this)

            $this.parents('.js-step-content').attr('validated', true) //Adding attribute to clicked item for validation
            $('.js-next-btn').trigger('click') //click next button

            // Add active class to clicked item 
            addClassToClicked($this)
        })
    })

    $.getJSON('../assets/data/services.json', function (data) {
        // headerTitle.text('Select service');
        // warningMsg.find('span').text('select service')

        for (let service of data.services) {
            $('.services').append(
                `<div class="item-inner" key=${service.id}>
                    <div class='item'>
                        <div class="item__img"><img src="assets/img/${service.image}" alt="Staff1"></div>
                        <div class="item__tail">
                            <p class="item__name">${service.name}</p>
                            <span class="item__mail text-muted">${service.duration}</span>
                        </div>
                    </div>
                    <h2 class='success'>${service.price}$</h2>
                </div>`
            )
        }

        // ** Onclick item 
        $('.services').find('.item-inner').click(function () {
            const $this = $(this)

            $this.parents('.js-step-content').attr('validated', true) //Adding attribute to clicked item for validation
            $('.js-next-btn').trigger('click') //click next button

            // Add active class to clicked item 
            addClassToClicked($this)
        })
    })


    //validation 
    var navListItems = $('.js-step a'), //steps
        allWells = $('.js-step-content'), //contents
        allNextBtn = $('.js-next-btn'),
        prevBtn = $('.js-prev-btn'),
        field = $('.form_field');

    allWells.hide(); //Default hide all content


    //Onclick steps
    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this);


        console.log($target)
        console.log($item)

        //Prevent click to disable items
        if ($item.attr('disabled')) {
            console.log('1')
            $(this).css('pointer-events', 'none')
        }
        //clicking previous item
        else if ($item.hasClass('js-step-checked')) {
            console.log('2')
            //remove bg color and add active color
            $(this).removeClass('js-step-checked').addClass('step-active');
            //remove all next items active and bg color
            $(this).parent().nextAll().find('a').removeClass('step-active').removeClass('js-step-checked');
            allWells.hide();
            $target.show();
        }
        else if (!$item.attr('disabled')) {
            console.log('3')
            //remove all items active color
            // navListItems.removeClass('step-default')
            navListItems.removeClass('step-active').addClass('step-default');
            //add active color to clicked item
            $item.addClass('step-active');
            //add bg color to all previous items
            $item.parent().prevAll().find('a').addClass('js-step-checked');
            allWells.hide();
            $target.show();
            // $target.find('input:eq(0)').focus();
        }
    });

    // Trigger default active navbar link to show content
    $('.js-step-wrapper .step-active').trigger('click');

    prevBtn.click(function () {
        console.log(warningMsg)
        warningMsg.removeClass('visible').addClass('invisible')
        //select visible content
        let curStep = $(this).parents('.app').find('.js-step-content').not('.js-step-content[style*="display: none"]'),
            //get visible content id
            curStepBtn = curStep.attr("id"),
            //select previous step of the same id step
            prevStepWizard = $('.js-step-wrapper .js-step a[href="#' + curStepBtn + '"]').parent().prev().children("a");
        //go to previous content
        prevStepWizard.trigger('click');

        //Hide back button on first step
        let firstStep = $('.js-step').first().find('.step-active').length
        if (firstStep) {
            $('.js-prev-btn').addClass('invisible')
        }
    });

    // Go to Next step
    allNextBtn.click(function (e) {
        e.stopImmediatePropagation();

        console.log('clicked')
        let curStep = $($(this).parents('.app').find('.navbar .step-active').attr('href'))
        // let curStep = $(this).parents('.app').find('.js-step-content').not('.js-step-content[style*="display: none"]');
        let curStepBtn = curStep.attr("id");
        let nextStepWizard = $('.js-step-wrapper .js-step a[href="#' + curStepBtn + '"]').parent().next().children("a");
        let curInputs = curStep.find("input, select");
        let isValid = true;

        //Hide error border


        // get specific input
        for (var i = 0; i < curInputs.length; i++) {

            if (!curInputs[i].validity.valid) {
                isValid = false;
                //add errpr class to invalid input
                //   $(curInputs[i]).closest(".main-input-group")
                //                  .find('.main-input__field')
                //                  .addClass("has-error");
                //   //add error border to invalid select
                //   $(curInputs[i]).closest(".main-input-group")
                //                  .find('.form__select .dropdown-toggle')
                //                  .addClass('has-error')
                //   //show invalid text                      
                //   $(curInputs[i]).closest(".main-input-group")
                //                  .find('.form-text')
                //                  .show();
            }
        }

        console.log('curStep', curStep)
        //Check step validation
        const validStep = curStep.attr('validated')
        if (validStep === undefined && !validStep && nextStepWizard.length !== 0) {
            isValid = false
            warningMsg.removeClass('invisible').addClass('visible') //Show warning msg
        }

        if (isValid) {
            //go to next step
            nextStepWizard.removeAttr('disabled').trigger('click');
            // Hide warning message
            warningMsg.removeClass('visible').addClass('invisible')
            //Show go back button
            $('.js-prev-btn').removeClass('invisible');

            //Check if last step
            if (nextStepWizard.length === 0) {
                // curStep.children('.js-step-content-inner').hide(); //Hide input fields
                // $('.navbar').hide(); // hide steps
                $('body').addClass('overlay')
                $('#successModal').removeClass('hidden'); //show confirmation message
            }
        } else if (!isValid && nextStepWizard.length === 0) {
            $('#errorModal').removeClass('hidden'); //show confirmation message
        }


        $('#datepicker').datepicker({
            onSelect: function (dateText) {
                $('#datepicker2').datepicker("setDate", $(this).datepicker("getDate"));
            }
        });
    });



    //form-step-nav navbardi
    //form-step js-step
    // js-form-step-bg js-step-active 
    // setup-content js-setup-content
    // nextBtn js-next-btn
    // form_step_panel - js-step-wrapper
})(jQuery)