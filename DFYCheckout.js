jQuery(document).ready(function($) {
    if (window.location.href.includes("/checkout")) {

        const INTRO_TIME = 300;

        const SPAM_TIMEOUT = 1100;


        setTimeout(function(){
            $('.loading-screen-wrapper').effect("puff", INTRO_TIME, callback => {
                $('.checkout-application-wrapper').fadeIn();
            });
        },3500);

        const formSetType = {
            UNSET: "UNSET",
            LINKANDANCHOR: "Links And Anchors",
            FIXEDFIELDS: "Fixed Fields",
            PACKAGE: "Package Fields",
        };

        const FIXED_FIELD_TYPE = {
            GMB: "GMB",
            PRESS_RELEASE: "Press Release",
            CITATION: "Citation",
        };

        const PACKAGE_CONTENTS = {
            SLOW_BURNER: ["3x DR20-30 Niche Edits#3", "DR35-50 Niche Edit#1"],
            WHITE_KNIGHT_MONTHLY: ["3x DR35-50 Niche Edits#3", "3x DR45+ Guest Posts#3", "9x Tier 2 PBN#9"],
            BLACK_NIGHT_MONTHLY: ["6x DR20-35 Niche Edits#6", "5x DR35-50 Niche Edits#5"],
            AUTHORITY_TAKE_OVER_MONTHLY_PACKAGE: ["Monthly Checkup URL#1", "Monthly Disavow#We'll get in contact!",
                "5x 1,000 Word Supporting Blog Posts#5", "DR20 - 35 Niche Edits (@Supporting Content)#5",
                "3x DR35-50 Niche Edits (@Money Pages)#3", "9x Tier Two PBNs#9"],

            FOUNDATION_PACKAGE: ["Tell us what to post for your 30 Citations?#CITATION", "Social Profile Setup", "5x DR20 - 35 Niche Edits#5",
                "5x DR35 -50 Niche Edits#5"],
            WHITE_KNIGHT_ONE_OFF_PACKAGE: ["5x DR45+ Guest Posts#5", "20x Tier 2 PBNs#20"],
            BLACK_KNIGHT_PACKAGE: ["1,000 Social Signals#Multi", "5x DR20-35 Niche Edits#5",
                "5x DR35-50 Niche Edits#5"],
            WHITE_KNIGHT_RAID_PACKAGE: ["5x DR35-50 Niche Edits#5", "3x DR60+ Guest Posts#3", "5x DR45+ Guest Posts#5",
                "Tier 2 PBNs#20"],
            BLACK_KNIGHT_ASSAULT_PACKAGE: ["How should we split your 5k Social Signals#Multi", "DR20-35 Niche Edits#10", "DR35-50 Niche Edits#5",
                "DR50-75 Niche Edits#3"],
            KING_AND_HIS_CASTLE_PACKAGE: ["DR60+ Guest Post#5", "DR50-75#5"],
            THE_KING_AND_HIS_EMPIRE_PACKAGE: ["DR50-75 Niche Edits#10", "DR60+ Guest Posts#5", "DR45+ Guest Posts#8"],

            LOCAL_PARASITE_LOW_COMP: ["Aged PBN Links#5", "DR10+ Niche Edits#3"],
            MEDIUM_COMPETITION_PARASITE: ["Aged PBN Links#15", "DR10+ Niche Edits#10"],
            HIGH_COMPETITION_PARASITE: ["DR10+ Niche Edits#20", "Aged PBN Links#25"],
            HQ_SPAM_BLAST_PARASITE: ["Autopilot Spam Blast#1", "Aged PBN Links#5"],

            PROFESSIONAL_SEO_PACKAGE: ["Tell us what to post for your 135 Citations#CITATION", "4x DR20-35 Niche Edits#4", "4x DR35-50 niche edits#4",
                "DR50-75 Niche Edit#1"],
            INTERMEDIATE_SEO_PACKAGE: ["Tell us what to post for your 75 Citations#CITATION", "DR20-35 Niche Edits#4", "4x DR35-50 niche edits#4"],
            STARTER_SEO_PACKAGE: ["Tell us what to post for your 35 Citations#CITATION", "Social Profile Setup", "4x DR20-35 Niche Edits#4"],

        };

        const ALERT_TYPE = {
            COULD_NOT_TRANSITION: "ERROR: Couldn't Transition, error report in log.",
        };

        const PARENT_NODE_ID = "checkout-data-form-container";


        $('.woocommerce-billing-fields').attr('disabled', 'disabled'); //Completely disable the default WooCommerce billing section

        let arrowSection = $('.checkout-arrows-wrapper');
        arrowSection.css('display', 'none');


        /**
         * Show a specific alert type popup.
         * @param alert type enum.
         */
        function showAlert(alertType) {
            let alertTag = $('.checkout-alert');
            alertTag.html(alertType);
            alertTag.fadeIn();
            setTimeout(e => {
                alertTag.fadeOut();
            }, 3600);
        }

        function decidePackageContents(packageName) {
            switch (packageName) {
                case("The King & His Empire Package"):
                    return PACKAGE_CONTENTS.THE_KING_AND_HIS_EMPIRE_PACKAGE;
                case("King & His Castle Package"):
                    return PACKAGE_CONTENTS.KING_AND_HIS_CASTLE_PACKAGE;
                case("High Competition Parasite Ranker"):
                    return PACKAGE_CONTENTS.HIGH_COMPETITION_PARASITE;
                case("Medium Competition Parasite Ranker"):
                    return PACKAGE_CONTENTS.MEDIUM_COMPETITION_PARASITE;
                case("Local Parasite / Local SEO ORM"):
                    return PACKAGE_CONTENTS.LOCAL_PARASITE_LOW_COMP;
                case("Authority Take Over Monthly Package"):
                    return PACKAGE_CONTENTS.AUTHORITY_TAKE_OVER_MONTHLY_PACKAGE;
                case("Black Knight Monthly Package"):
                    return PACKAGE_CONTENTS.BLACK_NIGHT_MONTHLY;
                case("White Knight Monthly Package"):
                    return PACKAGE_CONTENTS.WHITE_KNIGHT_MONTHLY;
                case("Slow Burner Monthly Package"):
                    return PACKAGE_CONTENTS.SLOW_BURNER;
                case("Black Knight: The Assault Package"):
                    return PACKAGE_CONTENTS.BLACK_KNIGHT_ASSAULT_PACKAGE;
                case("Black Knight Package"):
                    return PACKAGE_CONTENTS.BLACK_KNIGHT_PACKAGE;
                case("White Knight: The Raid Package"):
                    return PACKAGE_CONTENTS.WHITE_KNIGHT_RAID_PACKAGE;
                case("White Knight Package"):
                    return PACKAGE_CONTENTS.WHITE_KNIGHT_ONE_OFF_PACKAGE;
                case("Foundation Package"):
                    return PACKAGE_CONTENTS.FOUNDATION_PACKAGE;
                case("Starter SEO Package"):
                    return PACKAGE_CONTENTS.STARTER_SEO_PACKAGE;
                case("Intermediate SEO Package"):
                    return PACKAGE_CONTENTS.INTERMEDIATE_SEO_PACKAGE;
                case("Professional SEO Package"):
                    return PACKAGE_CONTENTS.PROFESSIONAL_SEO_PACKAGE;
                default:
                    console.error("PACKAGE CONTENTS COULD NOT BE FOUND");
                    console.error("FOR PACKAGE " + packageName);
            }
        }


        class Checkout {

            constructor() {
                this.currentStep = 0;
                this.dataWizard = undefined;
                this.userInput = new UserInputSettings();
                this.checkoutScreen = new CheckoutScreen();
                this.tipHandler = new TipHandler();
                this.instance = this;
            }

            getInstance() {
                return this.instance;
            }

            getTipHandler()
            {
                return this.tipHandler;
            }

            createDataWizard()
            {
                this.dataWizard = new CheckoutDataWizard();
            }

            getDataWizard()
            {
                return this.dataWizard;
            }

            /**
             * Gets the pseudo checkout screen object
             * for handling the view.
             * @returns {CheckoutScreen}
             */
            getCheckoutScreen() {
                return this.checkoutScreen;
            }

            getInputHolder() {
                return this.userInput;
            }

            setLoadingMessage(loadMessage){
                $('.loading-info').html('<h1>' + loadMessage + "</h1>");
            }





        }

        /**
         * Pseudo checkout screen
         * Handles rotations.
         */
        class CheckoutScreen {

            constructor() {
                this.loadedPanels = 0;
                this.totalPanelsToLoad = 0;
                this.currentPanel = 0;
                this.canClick = true;
                this.loaderMessages = [];
                this.panelIDList = [
                    "greeting-checkout",
                    "checkout-question-anchor",
                    "checkout-data-form-container",
                ];
            }



            setCanClick()
            {
                this.canClick = true;
            }

            getCanMovePanel()
            {
                return this.canClick;
            }

            handleMovePanelClick()
            {
                this.canClick = false;
                setTimeout(function(e){
                    checkout.getCheckoutScreen().setCanClick();
                }, SPAM_TIMEOUT);
            }


            getLoaderMessages()
            {

            }

            /**
             * Get the loaded panels currently.
             * @returns {number}
             */
            getLoadedPanels()
            {
                return parseInt(this.loadedPanels);
            }


            getPanelsToLoad()
            {
                return parseInt(this.totalPanelsToLoad);
            }

            /**
             * Every time ajax loads a new panel, this is incremented.
             */
            callPanelLoad()
            {
                this.loadedPanels++;
                console.log("Current loaded panels " + this.getLoadedPanels());
                console.log("Need to load " + this.getPanelsToLoad());
                let canUnlockApplication = this.getLoadedPanels() === this.getPanelsToLoad();
                if(canUnlockApplication)
                {
                    this.getPanelIDList().push("checkout-final-page");
                    let loader = $('.loading-screen-wrapper');
                    let checkoutFormContainer = $('.checkout-form-container');
                    loader.effect("drop", 800, e => {
                       loader.fadeOut();
                       let formContainer = $('.checkout-form-container');
                       formContainer.css('display', 'block');
                       $('.checkout-application-wrapper').fadeIn();
                       this.currentPanel = 3;
                       let firstQuestionPanel = $(formContainer.children()[0]);
                       firstQuestionPanel.fadeIn();
                       firstQuestionPanel.css('display', 'inline-flex');
                       this.updateStepCounter();
                       //this.transitionTo(true);
                    });
                }
            }



            /**
             * Get the current panel index.
             * @returns {number} current panel index.
             */
            getCurrentPanel() {
                return parseInt(this.currentPanel);
            }

            /**
             * Gets the current panel element.
             * @returns {*|jQuery|HTMLElement}
             */
            getCurrentPanelElement() {
                return $('#' + this.getPanelIDList()[this.getCurrentPanel()]);
            }

            /**
             * Get the list of transition panels.
             * @returns {[]|Array} of
             */
            getPanelIDList() {
                return this.panelIDList;
            }

            getTotalPanels() {
                return shouldDoAnchors ? parseInt((this.getPanelIDList().length)) : parseInt(this.getPanelIDList().length) - Number(1);
            }



            updateStepCounter() {
                console.log("Updating step counter: ");
                console.log("Current panel is " + this.currentPanel);
                let toAppend = ("Step " + (this.currentPanel + Number(1))) + " / " + this.getTotalPanels();
                $('#checkout-counter').html(toAppend);
            }


            /**
             *  Generate the set of question elements
             *  and pushes them to
             */

            generateQuestionSetElements() {
                let checkoutDataTokens = checkoutData.split("~");
                if (checkoutDataTokens.length > 0) {
                    this.totalPanelsToLoad = (Number(checkoutDataTokens.length) - 1);
                    console.log("Got to load a total of " + this.getPanelsToLoad());
                    //TODO set loading screen and also thank you screen
                    for (let i = 0; i < checkoutDataTokens.length; i++) {
                        let currentTarget = checkoutDataTokens[i];
                        let targetTokens = currentTarget.split("#");
                        if (targetTokens.length === 2) {
                            let inputSet = new ItemInterpreter(currentTarget);
                        } else {
                            console.error("Couldn't split data tokens for " + currentTarget);
                        }
                    }

                    //TODO generate the thank you component.

                } else {
                    console.error("Nothing to do?");
                    //TODO handle
                }
                this.updateStepCounter();

            }


            handleReviewClick()
            {
                let firstPanelIndex = shouldDoAnchors ? 3 : 2;
                this.currentPanel = firstPanelIndex;
                this.updateStepCounter();
                let formContainer = $('.checkout-form-container');
                formContainer.css('display', 'block');
                let childrenOfContainer = formContainer.children();
                let firstChild = $(childrenOfContainer[0]);
                let arrowSection = $('.checkout-arrows-wrapper');
                arrowSection.fadeIn();
                let backwardsArrow = $('#arrow-backward');
                backwardsArrow.css('display', 'block');
                $('#checkout-final-page').effect("drop", 400, callback => {
                    firstChild.fadeIn();
                    firstChild.css('display', 'inline-flex');
                });
            }

            /**
             * Handles the rotation of the screen.
             *
             * THIS GOT TO MESSY AND WILL BE RE CODED ONCE IT CAN
             * BE
             * @param forward boolean as to whether to go backwards or not,.
             */
            transitionTo(forward) {
                let nextStep = !forward ? this.getCurrentPanel() - 1 : this.getCurrentPanel() + 1;
                if (nextStep >= 0 && nextStep < (this.getPanelIDList().length)) {
                    let nextElementID = undefined;
                    let backwardsArrow = $('#arrow-backward');
                    let arrowSection = $('.checkout-arrows-wrapper');
                    let checkoutFormContainer = $('.checkout-form-container');
                    let isLastPanel = false;
                    if (forward) {
                        console.log("Next step is " + nextStep);
                        if (nextStep === 1) { //Should be the anchor step.
                            backwardsArrow.fadeIn();
                            nextStep = shouldDoAnchors ? nextStep : 2;
                            if (nextStep === 1) arrowSection.fadeOut() ;
                            nextElementID = this.getPanelIDList()[nextStep];
                        } else {
                            if (nextStep === 2) {
                                arrowSection.fadeIn();
                                checkoutFormContainer.css('display', 'block');
                                nextStep = 3;
                            }
                            nextElementID = this.getPanelIDList()[nextStep];
                            console.log("NEXT ELEMENT ID IS " + nextElementID);


                            //Check if it's the last panel, hide forward arrow
                            //Then hide the wrapper thing.
                            let lastPanel = (this.getPanelIDList().length - 1);
                            if(nextStep === lastPanel) {
                                this.getCurrentPanelElement().fadeOut();
                                isLastPanel = true; //So it knows what to do.
                                backwardsArrow.css('display', 'none'); //Already been
                                arrowSection.fadeOut();

                                checkout.createDataWizard();
                                console.log(checkout.getDataWizard().getFullDataContent());
                            }

                        }
                    } else {
                        //TODO handle going backwards.
                        if (nextStep === 0) {
                            backwardsArrow.fadeOut();
                            nextElementID = this.getPanelIDList()[nextStep];
                        } else if (nextStep === 1) {
                            nextStep = shouldDoAnchors ? nextStep : 0;
                            if (nextStep === 0) backwardsArrow.fadeOut();
                            if (nextStep === 1) arrowSection.fadeOut();
                            nextElementID = this.getPanelIDList()[nextStep];
                        }
                        else if(nextStep === this.getPanelIDList().length-2) {
                           console.log("Going back, need to");
                            arrowSection.fadeIn();
                            checkoutFormContainer.css('display', 'block');
                        }
                        else {
                            nextElementID = this.getPanelIDList()[nextStep];
                        }

                    }

                    console.log("Next index is " + nextStep);
                    console.log("So next index ID is " + nextElementID);

                    //Basically selects the parent generated form wrapper instead of the actual inner element for the last panel.
                    let transitionFrom = isLastPanel ? this.getCurrentPanelElement().parent() :
                        this.getCurrentPanelElement();

                    transition(transitionFrom, nextElementID);
                    this.currentPanel = nextStep;
                    if(!isLastPanel) {
                        this.updateStepCounter();
                    } else {
                        $('#checkout-counter').html('');
                    }
                } else {
                    showAlert(ALERT_TYPE.COULD_NOT_TRANSITION);
                }

                /**
                 * Transitions to the next panel with fade and drop
                 * @param currentElement
                 * @param nextElementID
                 */
                function transition(currentElement, nextElementID) {
                    let nextElement = $('#' + nextElementID);
                    console.log(nextElement.attr('id'));
                    currentElement.effect("drop", 400, callback => {
                        nextElement.fadeIn();
                        let display = nextElementID === "checkout-final-page" ? 'block' : 'inline-flex';
                        nextElement.css('display', display);
                        //checkout.getTipHandler().handleRotationCall();
                    });
                }



            }

        }


        class TipHandler {

            constructor()
            {
                this.firstTipShown = false;
                this.tipMessages = {
                    USE_ENTER :  "Remember to hit enter to move to the next step",
                    USE_AUTOFILL : "Duplicate your inputs quick using the auto fill button",
                };
                this.calledMessages = []; //used for stopping showing them twice.
            }

            getTipMessages()
            {
                return this.tipMessages;
            }

            firstTipShown()
            {
                return this.firstTipShown();
            }

            /**
             * Gets the tip section element itself
             * @returns {*|jQuery|HTMLElement}
             */
            getTipSectionElement()
            {
                return $('.checkout-tip-section');
            }

            setTipText(tipMessage){
                let innerTipElement = $('.checkout-tip');
                innerTipElement.html('<h3>' + tipMessage + '</h3>');
            }

            /**
             * Shows the tip to the user and fades it out
             * @param tipMessage of the pre defined ones in the constructor.
             */
            showAndFadeTip(tipMessage)
            {
                this.setTipText(tipMessage);
                this.getTipSectionElement().fadeIn();
                setTimeout(function (callback) {
                    $('.checkout-tip-section').fadeOut();
                },3500);
            }

            getPanelType()
            {

            }

            /**
             * Handles during the rotation, checks to show certain
             * tips on certain times.
             */


            log(msg) {
                console.log("[NOTIFICATIONS] " + msg)
            }


        }


        /**
         * Pseudo information holder for checkout session
         */
        class UserInputSettings {

            constructor() {
                this.doAnchors = false;
            }

            /**
             * Gets whether or not the user want
             * @returns {boolean}
             */
            getDoAnchors() {
                return this.doAnchors;
            }

            getDoAnchorsAjax()
            {
                return this.getDoAnchors() ? "TRUE" : "FALSE";
            }

            setDoAnchors(doAnchors) {
                this.doAnchors = doAnchors;
            }

        }

        class LinkAnchorStorage {

            constructor(anchorInputSet) {
                this.storageList = [];
                this.inputSetInstance = anchorInputSet;
            }



        }


        /**
         * Skeleton class for a form input set that
         * should be linked.
         */
        class FormInputSet {

            /**
             * @param parentNodeID - The parent node to append the input set to.
             * @param parentProduct - Product name.
             * @param currentQuantity - Current quantity iteration product is on
             * @param maxReplications - The maximum amount of times the user can "add" new set.
             */
            constructor(parentNodeID = PARENT_NODE_ID, parentProduct, currentQuantity, maxReplications = 1) {
                this.parent = parentProduct;
                this.parentNodeID = parentNodeID;
                this.maximumReplications = maxReplications;
                this.quantityNumber = currentQuantity;
                this.currentReplications = 1;
                let volatileWrapperComponent = parentProduct.replace(/ /g, '');
                volatileWrapperComponent = removeSpecials(volatileWrapperComponent);
                this.wrapperID = volatileWrapperComponent + "_" + maxReplications; //Because the JS gods won't let me trim it.
                this.formSetType = formSetType.UNSET;
                this.formSet;
                this.genWrapper();
            }

            getParentNodeID() {
                return this.parentNodeID;
            }

            getFormSetType() {
                return this.formSetType;
            }

            setFormSetType(formSetType) {
                this.formSetType = formSetType;
            }

            /**
             * Get the current quantity number
             * of item for the input box.
             * @returns string The current quantity number.
             */
            getCurrentQuantityNumber() {
                return this.quantityNumber;
            }

            getCurrentReplications() {
                return this.currentReplications;
            }

            getMaximumReplications() {
                return this.maximumReplications;
            }

            /**
             * Get if the box can be replicated.
             * @returns boolean the box can be added again (new set of input).
             */
            getCanReplicate() {
                return this.getMaximumReplications() === 1 ? false :
                    this.getCurrentReplications() <= this.getMaximumReplications();
            }

            increaseCurrentReplications() {
                this.currentReplications++;
            }

            getFormQuantity() {
                return this.formSet.length;
            }

            /**
             * Get the wrapper div ID dependent on the replication index.
             * @param replicationIndex current replication index to target
             * @returns The wrapper ID depending on the replication index.
             */
            getWrapperDivID(replicationIndex) {
                return this.wrapperID + "_" + replicationIndex;
            }

            getWrapperVanillaElement(replicationIndex) {
                return document.getElementById(this.getWrapperDivID(replicationIndex));
            }

            getWrapperJQueryElement(replicationIndex) {
                return $('#' + this.getWrapperDivID(replicationIndex));
            }

            /**
             * Get the parent product name.
             * @returns the name of the parent product.
             */
            getParentProduct() {
                return this.parent;
            }

            getFormSet() {
                return this.formSet;
            }

            /**
             * Gets the actual parent node element.
             * (JQuery)
             * @returns {*|jQuery|HTMLElement}
             */
            getParentNodeElementJQuery() {
                return $('#' + this.getParentNodeID());
            }

            /**
             * Get the vanilla parent node.
             * @returns {*}
             */
            getParentNodeElementVanilla() {
                return document.getElementByID(this.getParentNodeID());
            }


            genWrapper() {

                let actualWrapper = document.createElement('div');
                actualWrapper.setAttribute('class', 'checkout-form-wrapper');
                actualWrapper.setAttribute('id', this.getWrapperDivID(this.getCurrentReplications()));

                let parent = document.getElementById(PARENT_NODE_ID);
                parent.appendChild(actualWrapper);

            }


        }

        /**
         * Most basic input set [Anchor, URL].
         * IS possible to be replicated.
         *
         * Uses Key => Value set to pair the two
         */
        class LinkAndAnchorInputSet extends FormInputSet {

            constructor(parentNodeID, productName, maxReplications, currentQuantity = 1) {
                super(parentNodeID, productName, currentQuantity, maxReplications);
                super.setFormSetType(formSetType.LINKANDANCHOR); //Set to link and anchor.
                this.handleGeneration();
                this.storage = new LinkAnchorStorage(this);
            }

            getStorage() {
                return this.storage;
            }


            handleGeneration() {
                if (super.getCanReplicate()) {
                    this.buildMultipleBoxesAndHeaders();
                } else {
                    this.buildStandaloneBoxesAndHeaders();
                }
            }


            buildMultipleBoxesAndHeaders() {
                console.log("Trying to build multiple boxes and headers");

                let ajaxHeader = {
                    action: 'generate_multiple_product_form',
                    product_name: this.getParentProduct(),
                    targetID: this.getWrapperDivID(this.getCurrentReplications()),
                    totalSets: this.getMaximumReplications(),
                    wantsAnchors : checkout.getInputHolder().getDoAnchorsAjax(),
                };

                let wrapperID = this.getWrapperDivID(this.getCurrentReplications());

                $.ajax({
                    url: checkout_object.checkouturl,
                    type: 'get',
                    data: ajaxHeader,
                    success: function (htmlResponse) {
                        let wrapper = $('#' + wrapperID);
                        wrapper.html(htmlResponse);
                        checkout.getCheckoutScreen().callPanelLoad();
                    },
                    error: function (xhr, ajaxOptions, thrownData) {
                        console.log(xhr);
                        console.log(ajaxOptions);
                        console.log(thrownData);
                    },
                });

                checkout.getCheckoutScreen().getPanelIDList().push(this.getWrapperDivID(this.getCurrentReplications())); //Add to the wrapper list.

            }

            buildStandaloneBoxesAndHeaders() {
                console.log("TRIED TO FIRE AJAX");

                let ajaxData = {
                    action: 'generate_singular_product_form',
                    product_name: this.getParentProduct(),
                    targetID: this.getWrapperDivID(this.getCurrentReplications()),
                    wantsAnchors : checkout.getInputHolder().getDoAnchorsAjax(),
                };

                let wrapperID = this.getWrapperDivID(this.getCurrentReplications());

                $.ajax({
                    url: checkout_object.checkouturl,
                    type: 'get',
                    data: ajaxData,
                    success: function (htmlResponse) {
                        let wrapper = $('#' + wrapperID);
                        wrapper.html(htmlResponse);
                        checkout.getCheckoutScreen().callPanelLoad();
                    },
                    error: function (xhr, ajaxOptions, thrownData) {
                        console.log(xhr);
                        console.log(ajaxOptions);
                        console.log(thrownData);
                    },
                });

                checkout.getCheckoutScreen().getPanelIDList().push(this.getWrapperDivID(this.getCurrentReplications())); //Add to the wrapper list.
                console.log("New size is " + checkout.getCheckoutScreen().getPanelIDList().length);

            }


        }

        class PackageInputSet extends FormInputSet {

            constructor(parentNodeID, productName, maxReplications, currentQuantity = 1) {
                super(parentNodeID, productName, currentQuantity, maxReplications);
                super.setFormSetType(formSetType.PACKAGE);
                this.contentList = [];
                this.decideContent();
                this.handleGeneration();
            }

            decideContent() {
                console.log("Deciding content");
                console.log(this.getParentProduct());
                this.contentList = decidePackageContents(this.getParentProduct());
                console.log(this.contentList.length);
            }

            handleGeneration() {
                let ajaxData = {
                    action: 'generate_package_product_form',
                    product_name: this.getParentProduct(),
                    dataTarget: this.contentList,
                    wantsAnchors : checkout.getInputHolder().getDoAnchorsAjax(),
                };

                let wrapperID = this.getWrapperDivID(this.getCurrentReplications());

                $.ajax({
                    url: checkout_object.checkouturl,
                    type: 'get',
                    data: ajaxData,
                    success: function (htmlResponse) {
                        let wrapper = $('#' + wrapperID);
                        wrapper.html(htmlResponse);
                        checkout.getCheckoutScreen().callPanelLoad();
                    },
                    error: function (xhr, ajaxOptions, thrownData) {
                        console.log(xhr);
                        console.log(ajaxOptions);
                        console.log(thrownData);
                    },
                });

                checkout.getCheckoutScreen().getPanelIDList().push(this.getWrapperDivID(this.getCurrentReplications()));

            }

        }

        class FixedFieldInputSet extends FormInputSet {

            constructor(parentNodeID, productName, maxReplications, currentQuantity = 1, formType) {
                super(parentNodeID, productName, currentQuantity, maxReplications);
                super.setFormSetType(formSetType.FIXEDFIELDS);
                this.contentType = formType;
                this.handleGeneration();
            }

            handleGeneration() {
                let ajaxData = {
                    action: 'generate_fixed_fields',
                    targetID: this.getWrapperDivID(this.getCurrentReplications()),
                    product_name: this.getParentProduct(),
                    dataTarget: this.contentType,
                };

                let wrapperID = this.getWrapperDivID(this.getCurrentReplications());

                $.ajax({
                    url: checkout_object.checkouturl,
                    type: 'get',
                    data: ajaxData,
                    success: function (htmlResponse) {
                        let wrapper = $('#' + wrapperID);
                        wrapper.html(htmlResponse);
                        checkout.getCheckoutScreen().callPanelLoad();

                    },
                    error: function (xhr, ajaxOptions, thrownData) {
                        console.log(xhr);
                        console.log(ajaxOptions);
                        console.log(thrownData);
                    },
                });

                checkout.getCheckoutScreen().getPanelIDList().push(this.getWrapperDivID(this.getCurrentReplications()));
            }
        }

        /**
         * Interprets checkout data fragment
         * Splits it up and deploys the relevant forms.
         */
        class ItemInterpreter {

            constructor(checkoutDataFragment) {
                this.formType = undefined;
                this.rawData = checkoutDataFragment;
                this.productName = undefined;
                this.maxVariations = undefined;
                this.init();
            }

            /**
             * Initialises functions for the item interpreter
             * one at a time.
             */
            init() {
                this.initInterpretation();
                this.generatePhysicalComponents();
            }

            getFormType() {
                return this.formType;
            }

            getName() {
                return this.productName;
            }

            getMaxVariations() {
                return this.maxVariations;
            }

            /**
             * Start the splitting and setting
             */
            initInterpretation() {
                let tokens = this.rawData.split("#");
                let productName = tokens[0];
                this.maxVariations = parseInt(tokens[1]);
                this.productName = productName;
                this.formType = this.determineFormType();
            }

            /**
             * Build the specific fields.
             */
            generatePhysicalComponents() {
                if (this.formType !== undefined) {
                    switch (this.getFormType()) {
                        case(formSetType.LINKANDANCHOR):
                            new LinkAndAnchorInputSet(undefined, this.getName(), this.getMaxVariations(), undefined);
                            break;
                        case(formSetType.FIXEDFIELDS):
                            let fieldType = this.getName().includes("GMB") ? FIXED_FIELD_TYPE.GMB : this.getName().includes("Press Release") ? FIXED_FIELD_TYPE.PRESS_RELEASE : FIXED_FIELD_TYPE.CITATION;
                            new FixedFieldInputSet(undefined, this.getName(), this.getMaxVariations(), undefined, fieldType);
                            break;
                        case(formSetType.PACKAGE):
                            new PackageInputSet(undefined, this.getName(), this.getMaxVariations(), undefined);
                            break;
                    }
                } else {
                    console.error("Undefined form type for " + this.getName());
                }
            }

            /**
             * Determine the form object type
             * to be generated.
             */
            determineFormType() {


                if (this.getName().includes("Package")) {
                    return formSetType.PACKAGE;
                }

                let anchorURLTargets = ["DR", "RD", "PBN", "Silver", "Gold"];
                for (let i = 0; i < anchorURLTargets.length; ++i) {
                    let current = anchorURLTargets[i];
                    if (this.getName().includes(current)) {
                        return formSetType.LINKANDANCHOR;
                    }
                }

                let fixedFormURLTargets = ["GMB", "Citation", "Press Release"];

                for (let i = 0; i < fixedFormURLTargets.length; i++) {
                    let current = fixedFormURLTargets[i];
                    if (this.getName().includes(current)) {
                        return formSetType.FIXEDFIELDS;
                    }
                }
                return undefined;
            }
        }


        function test_ajax_call() {

            var data = {
                'action' : 'test_upload_ajax_call',
                'sheet_name': 'test Sheet m9',
            };


            $.ajax({
                url: checkout_object.checkouturl,
                method: 'GET',
                data : data,
                success: function (response) {
                    console.log("Succeeded:");
                    console.log(response);
                },
                error: function (xhr, ajaxOptions, thrownData) {
                    console.log(xhr);
                },
            });



        }


        // print the returned data

            window.addEventListener('fetch', event => {
                console.log("Firing fetch");
                event.respondWith(handle(event.request))
            });

            async function handle(request) {
                if (request.method === "OPTIONS") {
                    return handleOptions(request)
                } else if (request.method === "GET" ||
                    request.method === "HEAD" ||
                    request.method === "POST") {
                    // Pass-through to origin.
                    return fetch(request)
                } else {
                    return new Response(null, {
                        status: 405,
                        statusText: "Method Not Allowed",
                    })
                }
            }


            const corsHeaders = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            };

            function handleOptions(request) {
                if (request.headers.get("Origin") !== null &&
                    request.headers.get("Access-Control-Request-Method") !== null &&
                    request.headers.get("Access-Control-Request-Headers") !== null) {
                    // Handle CORS pre-flight request.
                    return new Response(null, {
                        headers: corsHeaders
                    })
                } else {
                    // Handle standard OPTIONS request.
                    return new Response(null, {
                        headers: {
                            "Allow": "GET, HEAD, POST, OPTIONS",
                        }
                    })
                }
            }


            /*
             * Collects and formats all form data.
             */
            class CheckoutDataWizard {

                constructor() {
                    this.fullDataContent = ""; //Full content.
                    this.currentSectionContent = ""; //current content to append
                    this.headerList = [];
                    this.init();
                }

                getHeaderList()
                {
                    return this.headerList;
                }

                getFullDataContent() {
                    return this.fullDataContent;
                }

                getCurrentSectionContent() {
                    return this.currentSectionContent;
                }

                /**
                 * Append to the current section
                 * content.
                 * @param toAppend
                 */
                appendToCurrent(toAppend) {
                    this.currentSectionContent += toAppend +"\n";
                }

                append(toAppend){
                    this.currentSectionContent +=toAppend;
                }

                appendToCurrentPair(toAppend) {
                    this.currentSectionContent += toAppend + "   ";
                }

                appendNewLine() {
                    this.currentSectionContent += "\n";
                }

                appendPackageSectionHeader(toAppend){
                    this.appendToCurrent(toAppend);
                }

                /**
                 * Append to the current header
                 * @param header
                 */
                appendCurrentHeader(header) {
                    this.currentSectionContent += header + "\n";
                }

                appendAndMoveToNextSection()
                {
                    this.fullDataContent += this.currentSectionContent +"\n";
                    this.currentSectionContent =  "";
                }


                /**
                 * Get the main section we'll be iterating
                 */
                getMainTargetWrapper() {
                    return $('.checkout-form-container');
                }


                init() {
                    this.readAndSummariseInput();
                }



                /**
                 * This reads all the inputs from the user and formats
                 * them to something nice and human readable.
                 * I AM FULLY AWARE THAT I'M CONSTANTLY FINDING THE NEAREST CHILD ELEMENT
                 * BUT THEY WERE DYNAMICALLY GENERATED AND BECOMING UNDEFINED UNLESS I LET THE BROWSER
                 * KNOW THEY ACTUALLY EXISTED
                 *
                 * EDIT - FORGIVE ME LORD FOR I HAVE SINNED, FML
                 *
                 * EDIT - 19/11/2019 Oh ffs.
                 */
                readAndSummariseInput()
                {
                    let childWrapperElements = this.getMainTargetWrapper().children();
                    for(let i = 0 ; i < childWrapperElements.length ; ++i)
                    {
                        let currentElementID = $(childWrapperElements[i]).attr('id');
                        log(currentElementID);
                        let currentWrapper = $(currentElementID);
                        let splitWrapperID = currentElementID.split("_");
                        let identifierNumber = parseInt(splitWrapperID[1]);

                        let currentItemName = splitWrapperID[0];
                        this.appendCurrentHeader(currentItemName); //Set tht current header

                        if(currentItemName.toLowerCase().includes("package"))
                        { //We know it's a package and can go through accordingly.
                            this.appendNewLine();
                            log("It's a package");
                            let initialPackageWrapper = $('#' + currentElementID);
                            let formMultipleWrapper = $(initialPackageWrapper.find('.form-multiple-wrapper'));
                            let formMultipleInputWrapper = $(formMultipleWrapper.find('.form-multiple-input-wrapper'));
                            let multipleInputPackageInnerWrapper = $(formMultipleInputWrapper.find('.multiple-input-package-inner-wrapper'));
                            log("There are " + multipleInputPackageInnerWrapper.children().length + "Children");
                            let wrapperChildren = multipleInputPackageInnerWrapper.children();
                            //Now we iterate over the package components.
                            for(let m = 0 ; m < wrapperChildren.length ; ++m)
                            {
                                let packageComponentWrapper = $(wrapperChildren[m]);
                                let headerWrapper = $(packageComponentWrapper.find('.info-header'));
                                let header = headerWrapper.text();
                                this.appendPackageSectionHeader(header);

                                //Right, time to deal with citations.



                                    let inputWrapper = $(packageComponentWrapper.find('.actual-input-wrapper'));

                                    if(header.toLowerCase().includes("citation") || (header.toLowerCase().includes("press release")) || header.toLowerCase().includes("gmb")) { //If it's citations, needs different parsing.
                                        let actualCitationBoxWrapper = $(inputWrapper.find('.checkout-box-wrapper-citations'));
                                        let childBoxes = actualCitationBoxWrapper.children();
                                        for(let g = 1 ; g <= childBoxes.length ; ++g) {
                                            let c = $(childBoxes[g-1]);
                                            let key = c.attr('placeholder');
                                            let value = c.val();
                                            value = value === "" ? "Not Given" : value;
                                            this.appendToCurrent(key + ": " + value);
                                        }

                                        this.appendAndMoveToNextSection();
                                        continue;
                                    }


                                    let inputChildren = $(inputWrapper.children());
                                    for(let k = 1 ; k <= inputChildren.length ; ++k) //Go over each input wrapper
                                    {
                                        let currentTargetInputWrapper = $(inputChildren[k-1]);
                                        if(currentTargetInputWrapper.attr('class').includes("checkout-box-wrapper")){
                                            let boxURLChildren = $(currentTargetInputWrapper.children());
                                            let urlBox = $(boxURLChildren[0]);
                                            let linkBox = $(boxURLChildren[1]);
                                            this.appendToCurrent("Target URL: " + urlBox.val());
                                            if(!checkout.getInputHolder().getDoAnchors()) {
                                                this.appendToCurrent("Anchor Text: " + linkBox.val());
                                            } else {
                                                this.appendToCurrent("Anchor Text: Done For You");
                                            }
                                        }
                                        this.appendNewLine();
                                    }

                                this.appendNewLine();
                            }

                            this.appendAndMoveToNextSection();
                        }
                        else if(currentItemName.toLowerCase().includes("gmb"))
                        {
                            this.appendNewLine();
                            let initialPackageWrapper = $('#' + currentElementID);
                            let formMultipleWrapper = $(initialPackageWrapper.find('.form-multiple-wrapper'));
                            let formMultipleInputWrapper = $(formMultipleWrapper.find('.form-multiple-input-wrapper'));
                            let componentWrapper = $(formMultipleInputWrapper.find('.checkout-box-wrapper-citations'));
                            let inputBoxes = $(componentWrapper.children());
                            log("For GMB there are " + inputBoxes.length + " children");
                            for(let x = 1 ; x <= inputBoxes.length ; ++x)
                            {
                                let c = $(inputBoxes[x-1]);
                                let key = c.attr('placeholder');
                                let value = c.val();
                                value = value === "" ? "Not Given" : value;
                                this.appendToCurrent(key + ": " + value);
                            }

                            this.appendAndMoveToNextSection();


                        }
                        else {
                            let isCitationMulti = false;
                            if(identifierNumber > parseInt(1))
                            { //We know it's multi, THIS INCLUDES CITATIONS.
                                log("it's a multi");

                                isCitationMulti = currentItemName.toLowerCase().includes("citation");

                                log("IS citation? " + isCitationMulti);

                                let multipleWrapper = $("#" + currentElementID);
                                let inputParentWrapper = $(multipleWrapper.find(".form-multiple-input-wrapper"));
                                let inputInnerParentWrapper = $(inputParentWrapper.find('.multiple-input-inner-wrapper'));
                                let actualInputContainerParent = $(inputInnerParentWrapper.find('.actual-input-wrapper'));

                                if(isCitationMulti) { //Dealing with this input
                                    log("It's citation multi");
                                    this.appendNewLine();
                                    let initialPackageWrapper = $('#' + currentElementID);
                                    let formMultipleWrapper = $(initialPackageWrapper.find('.form-multiple-wrapper'));
                                    let formMultipleInputWrapper = $(formMultipleWrapper.find('.form-multiple-input-wrapper'));
                                    let actualInputWrapper = $(formMultipleInputWrapper.find('.actual-input-wrapper'));
                                    let actualCitationBoxWrapper = $(actualInputWrapper.find('.checkout-box-wrapper-citations'));
                                    let childBoxes = actualCitationBoxWrapper.children();
                                    for(let g = 1 ; g <= childBoxes.length ; ++g) {
                                        let c = $(childBoxes[g-1]);
                                        let key = c.attr('placeholder');
                                        let value = c.val();
                                        value = value === "" ? "Not Given" : value;
                                        this.appendToCurrent(key + ": " + value);
                                    }

                                    this.appendAndMoveToNextSection();

                                    continue; //Don't break the loop but let it go over.
                                }


                                //now we iterate over them and we store them.
                                //this.appendNewLine(); //Just under text header
                                for(let m = 0 ; m < actualInputContainerParent.children().length ; ++m)
                                {
                                    let currentInputWrapperChildren = actualInputContainerParent.children();
                                    let currentInputWrapper = $(currentInputWrapperChildren[m]);//This is the box wrapper
                                    let physicalURLBox = $(currentInputWrapper.children()[0]);
                                    let physicalAnchorBox = $(currentInputWrapper.children()[1]);
                                    let urlBoxID = physicalURLBox.attr('id');
                                    console.log("URL BOX ID: " + urlBoxID);
                                    this.appendToCurrent("Target Link: " + physicalURLBox.val());
                                    if(!checkout.getInputHolder().getDoAnchors()) {
                                        this.appendToCurrent("Anchor Text: " + physicalAnchorBox.val());
                                    } else {
                                        this.appendToCurrent("Anchor Text: Done For you");
                                    }


                                }
                                this.appendNewLine();

                                this.appendAndMoveToNextSection();

                            } else {
                                //THIS IS NOW SOUND, DON'T FUCKING TOUCH.
                                let boxWrapper = $("#" + currentElementID);
                                let internalWrapper = boxWrapper.find('.form-internal-wrapper');
                                let inputWrapper = internalWrapper.find('.checkout-box-wrapper');
                                let inputSection = inputWrapper.children();
                                let urlInputBox = $(inputSection[0]);
                                let anchorBox = $(inputSection[1]);
                                this.appendToCurrent("Target Link: " + urlInputBox.val());
                                if(!checkout.getInputHolder().getDoAnchors()) {
                                    this.appendToCurrent("Anchor Text: " + anchorBox.val());
                                } else {
                                    this.appendToCurrent("Anchor Text: Done For You");
                                }
                                this.appendNewLine();
                                this.appendAndMoveToNextSection(); //Move to the next section.

                            } //Standard link : anchor panel.
                        }
                    }

                    function log(msg){
                        console.log("INPUTREADER DEBUG: " + msg);
                    }



                    $('.checkout-overview-content').html(this.getFullDataContent());

                }


            }






        /**
         * Handling the use of the "lazy fill" button
         * Shit got weird due to the dynamically generated objects etc,
         * so bare with me.
         */

        var linkTextToCopy = "";
        var anchorTextToCopy = "";

        $(document).on("click", ".btn-fill", function(){
                let buttonElement = $(this);

                let multipleClassSelector = '.multiple-input-inner-wrapper';
                let packageClassSelector = ".package-component-wrapper";

                let stepsTillMultiple = buttonElement.parentsUntil('.multiple-input-inner-wrapper').length;
                let stepsTillPackage = buttonElement.parentsUntil('.package-component-wrapper').length;

                closestParentTarget = stepsTillMultiple < stepsTillPackage ? multipleClassSelector : packageClassSelector;


                let closestParent = buttonElement.closest(closestParentTarget);
                let inputWrapperElement = closestParent.find('.actual-input-wrapper');
                let children = inputWrapperElement.children();

                linkTextToCopy = "";
                anchorTextToCopy = "";

                for(let i = 0 ; i < children.length ; i++)
                {
                    //Check if we should fill first.
                    let currentWrapper = $(children[i]);
                    let innerChildren = currentWrapper.children();
                    let firstLink = $(innerChildren[0]);
                    let secondAnchor = $(innerChildren[1]);
                    let firstLinkText = $(innerChildren[0]).val();
                    let secondAnchorText = $(innerChildren[1]).val();
                    //I have to re instantiate the element before getting the value as its
                    //Dynamically generated ¬_¬
                    if(i === 0) { //First iteration, got to do check to see if we bother.
                        if ((firstLinkText || secondAnchorText) === "") {
                            makeRedBorderTemp(firstLink);
                            makeRedBorderTemp(secondAnchor);
                            break;
                        } else {
                            //Set the values to copy over.
                            console.log("Setting to copy");
                            linkTextToCopy = firstLinkText;
                            anchorTextToCopy = secondAnchorText;
                        }
                    } else {
                        //Managed to get past the first check.
                        if(firstLinkText === "") { //If there's nothing there to be filled.
                            firstLink.val(linkTextToCopy);
                        }
                        if(secondAnchorText === "") {
                            secondAnchor.val(anchorTextToCopy);
                        }
                    }
                }


                /**
                 * Sets the border of element to red for two seconds to indicate to
                 * put something there.
                 * @param element
                 */
                function makeRedBorderTemp(element)
                {
                    element.css('border', '2px red solid');
                    setTimeout(function(){
                        element.css('border', '1px #ece9e9 solid')
                    }, 2000);
                }

            });


            /**
             * Util methods
             */

            /**
             * Because of using the cursed | character
             * in product names I had to write this.
             * Regex just won't remove the bloody thing.
             * @param str string to compare
             * @returns {string} of removed specials
             */
            function removeSpecials(str) {
                var lower = str.toLowerCase();
                var upper = str.toUpperCase();
                var res = "";
                for (var i = 0; i < lower.length; i++) {
                    if ((lower[i] !== upper[i] || lower[i].trim() === '') || (!isNaN(lower[i]))) {
                        res += str[i];
                    }
                }
                return res;
            }


            /**
             *  Actual program implementation
             */

            var checkout = new Checkout();
            //checkout.getCheckoutScreen().generateQuestionSetElements(); //Generate the given elements.

            console.log(checkoutData);




        /**
         *  EVENT LISTENERS.
         */

        /**
         * Handle the initial begin click.
         */
        $('.btn-begin').click(e => {
            test_ajax_call();
            checkout.getCheckoutScreen().transitionTo(true);
        });


        $('#arrow-backward').click(e => {
            if(checkout.getCheckoutScreen().getCanMovePanel()) {
                checkout.getCheckoutScreen().handleMovePanelClick();
                checkout.getCheckoutScreen().transitionTo(false);
            }
        });

        $('#arrow-forward').click(e => {
            if(checkout.getCheckoutScreen().getCanMovePanel()) {
                checkout.getCheckoutScreen().handleMovePanelClick();
                checkout.getCheckoutScreen().transitionTo(true);
            } else {
                console.log("not yet mate");
            }
        });


        $('#yes-anchors').click(e => {
            checkout.setLoadingMessage("Good choice my friend! Just a second whilst we prepare!");
            checkout.getInputHolder().setDoAnchors(true);
            $('.checkout-application-wrapper').effect("blind", callback => {
                $('.loading-screen-wrapper').fadeIn();
                checkout.getCheckoutScreen().generateQuestionSetElements();
            });
        });

        $('#no-anchors').click(e => {
            checkout.setLoadingMessage("Fair enough, Just a second whilst we prepare!");
            checkout.getInputHolder().setDoAnchors(false);
            $('.checkout-application-wrapper').effect("blind", callback => {
                $('.loading-screen-wrapper').fadeIn();
                checkout.getCheckoutScreen().generateQuestionSetElements();
            });
        });


        $('#btn-confirm').click(e => {
            let applicationWrapper = $('.confirm-internal-wrapper');
            applicationWrapper.effect("blind", 500, callback => {
                $('.confirm-proceed-payment-wrapper').fadeIn();
            });
        });

        $('#btn-download').click(e => {

            download("Report.txt", checkout.getDataWizard().getFullDataContent());

            function download(filename, text) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);

                $('.application-checkout').effect("blind", 500);

            }


        });

        $('#btn-review').click(e => {
            checkout.getCheckoutScreen().handleReviewClick();
        });


        $('.checkout-url-box').focus(function(){
           console.log("THIS FIRED");
        });

        $(document.body).on('focus', '.checkout-url-box', function () {
            console.log("This fired");
        });

        $(document.body).on('focus', '.checkout-url-box', function(){
           //
        });

        /**
         * Handling lazy fill
         */


        /**
         * Handling use of the enter key.
         */

        $('#checkout-application').on("keyup", function(e) {
                if(e.which === 13) {
                    let formWrapper = $('.checkout-form-container');
                    if(formWrapper.css('display') === 'block') { //It's ok to go gurther
                        if(checkout.getCheckoutScreen().getCanMovePanel()) {
                            checkout.getCheckoutScreen().handleMovePanelClick();
                            checkout.getCheckoutScreen().transitionTo(true);
                        }
                    }

                }
        });




    }

    });

