const validateFields = (form , fieldsArray) => {
    
  fieldsArray.forEach((field) => {
    field.removeClass('input-error');
    if (field.val().trim() === "") {
      field.addClass('input-error');
    } 
  });

  const errorFields = form.find('.input-error');

  return errorFields.length === 0;
}

$('.form').submit(e => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $('#form-modal');
  const content = modal.find('.form-modal__content p');
  
  modal.removeClass('error-modal');
  
  const isValid = validateFields(form , [name , phone , comment , to]);


  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val(),
      }
    });
    request.done(data => {
      content.text(data.message);
  });

    request.fail(data => {
      const message = data.statusText;
      if (message === 'error') {
       content.text("Что-то пошло не так! Попробуйте cнова.");
      modal.addClass('error-modal');
    }
  })

    request.always(() => {
      $.fancybox.open({
        src: "#form-modal",
        type: "inline", 
    });
    })
  }
})

$('.app-close-btn').click(e => {
  e.preventDefault();

  $.fancybox.close();
});


/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.18
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

!function(factory){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],factory):factory("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(options){return!options||void 0!==options.allowPageScroll||void 0===options.swipe&&void 0===options.swipeStatus||(options.allowPageScroll=NONE),void 0!==options.click&&void 0===options.tap&&(options.tap=options.click),options||(options={}),options=$.extend({},$.fn.swipe.defaults,options),this.each(function(){var $this=$(this),plugin=$this.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,options),$this.data(PLUGIN_NS,plugin))})}function TouchSwipe(element,options){function touchStart(jqEvent){if(!(getTouchInProgress()||$(jqEvent.target).closest(options.excludedElements,$element).length>0)){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(!event.pointerType||"mouse"!=event.pointerType||0!=options.fallbackToMouseEvents){var ret,touches=event.touches,evt=touches?touches[0]:event;return phase=PHASE_START,touches?fingerCount=touches.length:options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===options.fingers||options.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(options.swipeStatus||options.pinchStatus)&&(ret=triggerHandler(event,phase))):ret=!1,ret===!1?(phase=PHASE_CANCEL,triggerHandler(event,phase),ret):(options.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[event.target]),options.hold&&(ret=options.hold.call($element,event,event.target))},this),options.longTapThreshold)),setTouchInProgress(!0),null)}}}function touchMove(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var ret,touches=event.touches,evt=touches?touches[0]:event,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),options.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===options.fingers||options.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(jqEvent,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),ret=triggerHandler(event,phase),!options.triggerOnTouchEnd||options.triggerOnTouchLeave){var inBounds=!0;if(options.triggerOnTouchLeave){var bounds=getbounds(this);inBounds=isInBounds(currentFinger.end,bounds)}!options.triggerOnTouchEnd&&inBounds?phase=getNextPhase(PHASE_MOVE):options.triggerOnTouchLeave&&!inBounds&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(event,phase)}}else phase=PHASE_CANCEL,triggerHandler(event,phase);ret===!1&&(phase=PHASE_CANCEL,triggerHandler(event,phase))}}function touchEnd(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(event),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(event,phase)):options.triggerOnTouchEnd||options.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),phase=PHASE_END,triggerHandler(event,phase)):!options.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(event,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(event,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;options.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(event,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(currentPhase){var nextPhase=currentPhase,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?nextPhase=PHASE_CANCEL:!validDistance||currentPhase!=PHASE_MOVE||options.triggerOnTouchEnd&&!options.triggerOnTouchLeave?!validDistance&&currentPhase==PHASE_END&&options.triggerOnTouchLeave&&(nextPhase=PHASE_CANCEL):nextPhase=PHASE_END,nextPhase}function triggerHandler(event,phase){var ret,touches=event.touches;return(didSwipe()||hasSwipes())&&(ret=triggerHandlerForGesture(event,phase,SWIPE)),(didPinch()||hasPinches())&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,PINCH)),didDoubleTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,DOUBLE_TAP):didLongTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,LONG_TAP):didTap()&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,TAP)),phase===PHASE_CANCEL&&touchCancel(event),phase===PHASE_END&&(touches?touches.length||touchCancel(event):touchCancel(event)),ret}function triggerHandlerForGesture(event,phase,gesture){var ret;if(gesture==SWIPE){if($element.trigger("swipeStatus",[phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),options.swipeStatus&&(ret=options.swipeStatus.call($element,event,phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),ret===!1))return!1;if(phase==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipe&&(ret=options.swipe.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection),ret===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeLeft&&(ret=options.swipeLeft.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeRight&&(ret=options.swipeRight.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeUp&&(ret=options.swipeUp.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeDown&&(ret=options.swipeDown.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(gesture==PINCH){if($element.trigger("pinchStatus",[phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchStatus&&(ret=options.pinchStatus.call($element,event,phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),ret===!1))return!1;if(phase==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchIn&&(ret=options.pinchIn.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchOut&&(ret=options.pinchOut.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return gesture==TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target))},this),options.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target)))):gesture==DOUBLE_TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[event.target]),options.doubleTap&&(ret=options.doubleTap.call($element,event,event.target))):gesture==LONG_TAP&&(phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[event.target]),options.longTap&&(ret=options.longTap.call($element,event,event.target)))),ret}function validateSwipeDistance(){var valid=!0;return null!==options.threshold&&(valid=distance>=options.threshold),valid}function didSwipeBackToCancel(){var cancelled=!1;return null!==options.cancelThreshold&&null!==direction&&(cancelled=getMaxDistance(direction)-distance>=options.cancelThreshold),cancelled}function validatePinchDistance(){return null===options.pinchThreshold||pinchDistance>=options.pinchThreshold}function validateSwipeTime(){var result;return result=!options.maxTimeThreshold||!(duration>=options.maxTimeThreshold)}function validateDefaultEvent(jqEvent,direction){if(options.preventDefaultEvents!==!1)if(options.allowPageScroll===NONE)jqEvent.preventDefault();else{var auto=options.allowPageScroll===AUTO;switch(direction){case LEFT:(options.swipeLeft&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case RIGHT:(options.swipeRight&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case UP:(options.swipeUp&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case DOWN:(options.swipeDown&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case NONE:}}}function validatePinch(){var hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return hasCorrectFingerCount&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(options.pinchStatus||options.pinchIn||options.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var hasValidTime=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&hasValidTime;return valid}function hasSwipes(){return!!(options.swipe||options.swipeStatus||options.swipeLeft||options.swipeRight||options.swipeUp||options.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===options.fingers||options.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!options.tap}function hasDoubleTap(){return!!options.doubleTap}function hasLongTap(){return!!options.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var now=getTimeStamp();return hasDoubleTap()&&now-doubleTapStartTime<=options.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<options.threshold)}function validateLongTap(){return duration>options.longTapThreshold&&distance<DOUBLE_TAP_THRESHOLD}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(event){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=event.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var withinThreshold=!1;if(previousTouchEndTime){var diff=getTimeStamp()-previousTouchEndTime;diff<=options.fingerReleaseThreshold&&(withinThreshold=!0)}return withinThreshold}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(val){$element&&(val===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",val===!0))}function createFingerData(id,evt){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=evt.pageX||evt.clientX,f.start.y=f.last.y=f.end.y=evt.pageY||evt.clientY,fingerData[id]=f,f}function updateFingerData(evt){var id=void 0!==evt.identifier?evt.identifier:0,f=getFingerData(id);return null===f&&(f=createFingerData(id,evt)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=evt.pageX||evt.clientX,f.end.y=evt.pageY||evt.clientY,f}function getFingerData(id){return fingerData[id]||null}function setMaxDistance(direction,distance){direction!=NONE&&(distance=Math.max(distance,getMaxDistance(direction)),maximumsMap[direction].distance=distance)}function getMaxDistance(direction){if(maximumsMap[direction])return maximumsMap[direction].distance}function createMaximumsData(){var maxData={};return maxData[LEFT]=createMaximumVO(LEFT),maxData[RIGHT]=createMaximumVO(RIGHT),maxData[UP]=createMaximumVO(UP),maxData[DOWN]=createMaximumVO(DOWN),maxData}function createMaximumVO(dir){return{direction:dir,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(startPoint,endPoint){var diffX=Math.abs(startPoint.x-endPoint.x),diffY=Math.abs(startPoint.y-endPoint.y);return Math.round(Math.sqrt(diffX*diffX+diffY*diffY))}function calculatePinchZoom(startDistance,endDistance){var percent=endDistance/startDistance*1;return percent.toFixed(2)}function calculatePinchDirection(){return pinchZoom<1?OUT:IN}function calculateDistance(startPoint,endPoint){return Math.round(Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))}function calculateAngle(startPoint,endPoint){var x=startPoint.x-endPoint.x,y=endPoint.y-startPoint.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return angle<0&&(angle=360-Math.abs(angle)),angle}function calculateDirection(startPoint,endPoint){if(comparePoints(startPoint,endPoint))return NONE;var angle=calculateAngle(startPoint,endPoint);return angle<=45&&angle>=0?LEFT:angle<=360&&angle>=315?LEFT:angle>=135&&angle<=225?RIGHT:angle>45&&angle<135?DOWN:UP}function getTimeStamp(){var now=new Date;return now.getTime()}function getbounds(el){el=$(el);var offset=el.offset(),bounds={left:offset.left,right:offset.left+el.outerWidth(),top:offset.top,bottom:offset.top+el.outerHeight()};return bounds}function isInBounds(point,bounds){return point.x>bounds.left&&point.x<bounds.right&&point.y>bounds.top&&point.y<bounds.bottom}function comparePoints(pointA,pointB){return pointA.x==pointB.x&&pointA.y==pointB.y}var options=$.extend({},options),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!options.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(element),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(property,value){if("object"==typeof property)options=$.extend(options,property);else if(void 0!==options[property]){if(void 0===value)return options[property];options[property]=value}else{if(!property)return options;$.error("Option "+property+" does not exist on jQuery.swipe.options")}return null}}var VERSION="1.6.18",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.PointerEvent&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.PointerEvent||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:".noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(method){var $this=$(this),plugin=$this.data(PLUGIN_NS);if(plugin&&"string"==typeof method){if(plugin[method])return plugin[method].apply(plugin,Array.prototype.slice.call(arguments,1));$.error("Method "+method+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof method)plugin.option.apply(plugin,arguments);else if(!(plugin||"object"!=typeof method&&method))return init.apply(this,arguments);return $this},$.fn.swipe.version=VERSION,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});


let map;

    DG.then(function () {
        map = DG.map('map', {
            center: [55.752004, 37.576133],
            zoom: 17
        });

        myIcon = DG.icon({
          iconUrl: './img/map-mark.svg',
          iconSize: [48, 48]
      });

      DG.marker([55.752004, 37.576133], {
        icon: myIcon
    }).addTo(map);
  });

const burgerMenu = document.querySelector('.burger-menu');
const menuModal = document.querySelector('.menu-modal');
const computedStyles = getComputedStyle(menuModal);
const closeButton = document.querySelector('.menu-modal__close');
const wrapper = document.querySelector('.wrapper');

burgerMenu.addEventListener('click' , e => {
   
  e.preventDefault();

  menuModal.style.display = 'flex';
  wrapper.style.height = `${100}%`;
  

})

closeButton.addEventListener('click' , e => {

  e.preventDefault();

  menuModal.style.display = 'none';
})
const sections = $('section');
const display = $('.maincontent');
const sideMenu = $('.fixed-menu');
const menuItems = sideMenu.find('.fixed-menu__item');

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

let inScroll = false;

sections.first().addClass('active');

const countSectionPosition = sectionEq => {
  
  const position = sectionEq * -100;

  if(isNaN(position)) {
    console.error('передано неверное значение в countSectionPosition');
    return 0;
  }
  
  return position;
};

const changeMenuTheme = sectionEq => {

    const currentSection = sections.eq(sectionEq);
    const menuTheme = currentSection.attr('data-menu-theme');
    const activeClass = 'fixed-menu--black';

    if (menuTheme === 'black') {
      sideMenu.addClass(activeClass); 
    } else {
      sideMenu.removeClass(activeClass);
    }
};

const resetActiveClassForItem = (items , itemEq , activeClass) => {
  items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
};

const performTransition = (sectionEq) => {

  if (inScroll) return;

  const transitionOver = 1000;
  const mouseInertiaOver = 300;
  
  inScroll = true;

  const position = countSectionPosition(sectionEq);

  changeMenuTheme(sectionEq);

  display.css({
    transform: `translateY(${position}%)`,
  });

  resetActiveClassForItem(sections , sectionEq , 'active');

  setTimeout(() => {
    inScroll = false;

    resetActiveClassForItem(menuItems , sectionEq , 'active');

  }, transitionOver + mouseInertiaOver)
  };

const viewportScroller = () => {
  const activeSection = sections.filter('.active');
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) {
        performTransition(nextSection.index());
      }
    },

    prev() {
      if (prevSection.length) {
        performTransition(prevSection.index());
      }
    }
  }
};

$(window).on('wheel' , e => {
  const deltaY = e.originalEvent.deltaY;
  const scroller = viewportScroller();

  if (deltaY > 0) {
    scroller.next();
  } 
  
  if (deltaY < 0) {
    scroller.prev();
  }
});

$(window).on('keydown' , e => {

  const tagName = e.target.tagName.toLowerCase();
  const userTypingInInputs = tagName === 'input' || tagName === 'textarea' ;
  const scroller = viewportScroller();

  if (userTypingInInputs) return;
  
    switch (e.keyCode) {
      case 38:
        scroller.prev();
      break;
  
      case 40:
        scroller.next();
      break;
    }
  });

  $('.wrapper').on('touchmove' , e => {
    e.preventDefault();
  })

$('[data-scroll-to]').on('click' , e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr('data-scroll-to');
  const reqSection = $(`[data-section-id=${target}]`);

  performTransition(reqSection.index());

});

if (isMobile) {
    $("body").swipe({
      swipe:function(event, direction) {
        const scroller = viewportScroller();
        let scrollDirection = '';
  
        if (direction === 'up') scrollDirection = 'next';
        if (direction === 'down') scrollDirection = 'prev';
        scroller[scrollDirection]();
      }
    });
  }



const video = $('#video');

$('.btnPlay').on('click', function() {
  if(video[0].paused) {
      video[0].play();
      $('.pause-icon').css('display', 'block');
      $('.play-icon').css('display' , 'none');
  }
  else {
      video[0].pause();
      $('.pause-icon').css('display', 'none');
      $('.play-icon').css('display', 'block');
  }
  return false;
});

const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);
  
  const minutes = addZero(Math.floor(roundTime / 60));
  const seconds = addZero(roundTime - minutes * 60);
  
  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }
  
  return `${minutes} : ${seconds}`;
 };

 $(document).ready(function(){
  $(video).on( "timeupdate", function(){
    $('.duration').text(formatTime(video[0].duration));
    });
    video.on('timeupdate', function() {
      $('.current').text(formatTime(video[0].currentTime));
    });
});



video.on('timeupdate', function() {
  const currentPos = video[0].currentTime; 
  const maxduration = video[0].duration; 
  const percentage = 100 * currentPos / maxduration; 
  $('.timeBar').css('width', percentage+'%');
  $('.timeBar__point').css('left' , percentage -1 + '%');

  if (percentage === 100) {
    video[0].pause();
      $('.pause-icon').css('display' , 'none');
      $('.play-icon').css('display', 'block');
  }
});

let timeDrag = false;  
$('.progressBar').mousedown(function(e) {
    timeDrag = true;
    updatebar(e.pageX);
});
$(document).mouseup(function(e) {
    if(timeDrag) {
        timeDrag = false;
        updatebar(e.pageX);
    }
});
$(document).mousemove(function(e) {
    if(timeDrag) {
        updatebar(e.pageX);
    }
});
 
const updatebar = function(x) {
    const progress = $('.progressBar');
    const maxduration = video[0].duration; 
    const position = x - progress.offset().left;
    let percentage = 100 * position / progress.width();
 
    if (percentage > 100) {
        percentage = 100;
    }
    if (percentage < 0) {
        percentage = 0;
    }

    $('.timeBar').css('width', percentage+'%');
    video[0].currentTime = maxduration * percentage / 100;
}; 

const measureWidth = item => {

  let reqItemWidth = 0;

  const screenWidth = $(window).width();
  const container = item.closest('.products-menu');
  const menuItems = container.find('.products-menu__item');
  const menuItemsWidth = menuItems.width() * menuItems.length;

  const textContainer = item.find('.products-menu__container');
  const paddingLeft = parseInt(textContainer.css('padding-left'));
  const paddingRight = parseInt(textContainer.css('padding-right'));


  const isTablet = window.matchMedia("(max-width: 768px)").matches;
  
  if (isTablet) {
    
    reqItemWidth = screenWidth - menuItemsWidth;

  } else {
    
    reqItemWidth = 500;
  
  }

  return {
    container: reqItemWidth,
    textContainer: reqItemWidth - paddingLeft - paddingRight
  }; 
}; 


const foldEveryItem = container => {
  const items = container.find('.products-menu__item');
  const content = container.find('.products-menu__content');
  
  items.removeClass('active');
  content.width(0);
}

const unfoldItem = item => {
  const hiddenContent = item.find('.products-menu__content');
  const reqWidth = measureWidth(hiddenContent);
  const textBlock = item.find('.products-menu__container');

  item.addClass('active');
  hiddenContent.width(reqWidth.container);
  textBlock.width(reqWidth.textContainer);
  

}

$('.products-menu__title').on('click' , e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const item = $this.closest('.products-menu__item');
  const itemOpened = item.hasClass('active');
  const container = $this.closest('.products-menu');

  if (itemOpened) {
    
    foldEveryItem(container);
  
  } else {
    
    foldEveryItem(container);
    unfoldItem(item);
  
  }
})

const findBlockByAlias = alias => {
  return $('.review').filter((ndx , item) => {
    return $(item).attr('data-linked-with') === alias
  })
}

$('.interactive-avatar__link').click(e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr('data-open');
  const itemToShow = findBlockByAlias(target);
  const curItem = $this.closest('.reviews__switcher-elem');
  
  itemToShow.addClass('active').siblings().removeClass('active');
  curItem.addClass('active').siblings().removeClass('active');
})
const slider = $(".products").bxSlider({
  pager: false,
  controls: false
});

$('.product-slider__arrow--prev').click (e => {
  e.preventDefault();
  slider.goToPrevSlide();
})

$('.product-slider__arrow--next').click (e => {
  e.preventDefault();
  slider.goToNextSlide();
})
  const openItem = item => {
  
  const memberCard = item.closest('.team__item');
  const detailsWindow = memberCard.find('.details__window');
  const arrow = memberCard.find('.details__icon');
  const arrowIconActive = memberCard.find('.arrow-unfold--active');
  const arrowIcon = memberCard.find('.arrow-unfold');
  const memberImg = memberCard.find('.member__img');
  const memberInfoName = memberCard.find('.details')
  const memberImgClone = memberImg.clone();

  memberImgClone.removeClass('member__img').addClass('member__img-tablet');
  $(memberInfoName).after(memberImgClone);

  if (window.innerWidth <= 768) {
    memberImgClone.css('display' , 'flex');
  }

  memberCard.addClass('active');
  detailsWindow.slideToggle();
  arrow.addClass('arrow-active');
  
  if (arrow.hasClass('arrow-active')) {
    arrowIconActive.css('display', 'block');
    arrowIcon.css('display', 'none');
  }
  
}


const closeEveryItem = memberCard => {

  const items = memberCard.find('.details__window');
  const imgs = memberCard.find('.member__img-tablet');
  const itemContainer = memberCard.find('.team__item');
  const arrow = memberCard.find('.details__icon');

  itemContainer.removeClass("active");
  items.css('display' , 'none');
  imgs.css('display' , 'none');
  
  if (arrow.hasClass('arrow-active')) {
    arrow.removeClass('arrow-active');
  }
  
}


$('.member__details-button').click(e => {

  const $this = $(e.currentTarget);
  const memberCard = $this.closest('.team__list');
  const itemContainer = $this.closest('.team__item');
  const detailsWindow = memberCard.find('.details__window');
  const arrow = memberCard.find('.details__icon');
  const arrowIconActive = memberCard.find('.arrow-unfold--active');
  const arrowIcon = memberCard.find('.arrow-unfold');
  const memberImgClone = memberCard.find('.member__img-tablet');
  const memberImgCloneDisplay = memberImgClone.css('display');

  if (itemContainer.hasClass('active') && arrow.hasClass('arrow-active')) {
    detailsWindow.css('display' , 'none');
    arrow.removeClass('arrow-active');
    memberImgClone.remove();
    arrowIconActive.css('display','none');
    arrowIcon.css('display','block');

  } else {
    closeEveryItem(memberCard);
    openItem($this);
  }
})


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1Nb2RhbC5qcyIsImpxdWVyeS50b3VjaFN3aXBlLm1pbi5qcyIsIm1hcC5qcyIsIm1vZGFsLmpzIiwib3BzLmpzIiwicGxheWVyLmpzIiwicHJvZHVjdHNNZW51LmpzIiwicmV2aWV3LmpzIiwic2xpZGVyLmpzIiwidGVhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgdmFsaWRhdGVGaWVsZHMgPSAoZm9ybSAsIGZpZWxkc0FycmF5KSA9PiB7XHJcbiAgICBcclxuICBmaWVsZHNBcnJheS5mb3JFYWNoKChmaWVsZCkgPT4ge1xyXG4gICAgZmllbGQucmVtb3ZlQ2xhc3MoJ2lucHV0LWVycm9yJyk7XHJcbiAgICBpZiAoZmllbGQudmFsKCkudHJpbSgpID09PSBcIlwiKSB7XHJcbiAgICAgIGZpZWxkLmFkZENsYXNzKCdpbnB1dC1lcnJvcicpO1xyXG4gICAgfSBcclxuICB9KTtcclxuXHJcbiAgY29uc3QgZXJyb3JGaWVsZHMgPSBmb3JtLmZpbmQoJy5pbnB1dC1lcnJvcicpO1xyXG5cclxuICByZXR1cm4gZXJyb3JGaWVsZHMubGVuZ3RoID09PSAwO1xyXG59XHJcblxyXG4kKCcuZm9ybScpLnN1Ym1pdChlID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIGNvbnN0IGZvcm0gPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgY29uc3QgbmFtZSA9IGZvcm0uZmluZChcIltuYW1lPSduYW1lJ11cIik7XHJcbiAgY29uc3QgcGhvbmUgPSBmb3JtLmZpbmQoXCJbbmFtZT0ncGhvbmUnXVwiKTtcclxuICBjb25zdCBjb21tZW50ID0gZm9ybS5maW5kKFwiW25hbWU9J2NvbW1lbnQnXVwiKTtcclxuICBjb25zdCB0byA9IGZvcm0uZmluZChcIltuYW1lPSd0byddXCIpO1xyXG5cclxuICBjb25zdCBtb2RhbCA9ICQoJyNmb3JtLW1vZGFsJyk7XHJcbiAgY29uc3QgY29udGVudCA9IG1vZGFsLmZpbmQoJy5mb3JtLW1vZGFsX19jb250ZW50IHAnKTtcclxuICBcclxuICBtb2RhbC5yZW1vdmVDbGFzcygnZXJyb3ItbW9kYWwnKTtcclxuICBcclxuICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVGaWVsZHMoZm9ybSAsIFtuYW1lICwgcGhvbmUgLCBjb21tZW50ICwgdG9dKTtcclxuXHJcblxyXG4gIGlmIChpc1ZhbGlkKSB7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0gJC5hamF4KHtcclxuICAgICAgdXJsOiBcImh0dHBzOi8vd2ViZGV2LWFwaS5sb2Z0c2Nob29sLmNvbS9zZW5kbWFpbFwiLFxyXG4gICAgICBtZXRob2Q6IFwicG9zdFwiLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgbmFtZTogbmFtZS52YWwoKSxcclxuICAgICAgICBwaG9uZTogcGhvbmUudmFsKCksXHJcbiAgICAgICAgY29tbWVudDogY29tbWVudC52YWwoKSxcclxuICAgICAgICB0bzogdG8udmFsKCksXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmVxdWVzdC5kb25lKGRhdGEgPT4ge1xyXG4gICAgICBjb250ZW50LnRleHQoZGF0YS5tZXNzYWdlKTtcclxuICB9KTtcclxuXHJcbiAgICByZXF1ZXN0LmZhaWwoZGF0YSA9PiB7XHJcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkYXRhLnN0YXR1c1RleHQ7XHJcbiAgICAgIGlmIChtZXNzYWdlID09PSAnZXJyb3InKSB7XHJcbiAgICAgICBjb250ZW50LnRleHQoXCLQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6ISDQn9C+0L/RgNC+0LHRg9C50YLQtSBj0L3QvtCy0LAuXCIpO1xyXG4gICAgICBtb2RhbC5hZGRDbGFzcygnZXJyb3ItbW9kYWwnKTtcclxuICAgIH1cclxuICB9KVxyXG5cclxuICAgIHJlcXVlc3QuYWx3YXlzKCgpID0+IHtcclxuICAgICAgJC5mYW5jeWJveC5vcGVuKHtcclxuICAgICAgICBzcmM6IFwiI2Zvcm0tbW9kYWxcIixcclxuICAgICAgICB0eXBlOiBcImlubGluZVwiLCBcclxuICAgIH0pO1xyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcblxyXG4kKCcuYXBwLWNsb3NlLWJ0bicpLmNsaWNrKGUgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgJC5mYW5jeWJveC5jbG9zZSgpO1xyXG59KTtcclxuXHJcbiIsIi8qIVxuICogQGZpbGVPdmVydmlldyBUb3VjaFN3aXBlIC0galF1ZXJ5IFBsdWdpblxuICogQHZlcnNpb24gMS42LjE4XG4gKlxuICogQGF1dGhvciBNYXR0IEJyeXNvbiBodHRwOi8vd3d3LmdpdGh1Yi5jb20vbWF0dGJyeXNvblxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWF0dGJyeXNvbi9Ub3VjaFN3aXBlLUpxdWVyeS1QbHVnaW5cbiAqIEBzZWUgaHR0cDovL2xhYnMucmFtcGludGVyYWN0aXZlLmNvLnVrL3RvdWNoU3dpcGUvXG4gKiBAc2VlIGh0dHA6Ly9wbHVnaW5zLmpxdWVyeS5jb20vcHJvamVjdC90b3VjaFN3aXBlXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDEwLTIwMTUgTWF0dCBCcnlzb25cbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBvciBHUEwgVmVyc2lvbiAyIGxpY2Vuc2VzLlxuICpcbiAqL1xuXG4hZnVuY3Rpb24oZmFjdG9yeSl7XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kJiZkZWZpbmUuYW1kLmpRdWVyeT9kZWZpbmUoW1wianF1ZXJ5XCJdLGZhY3RvcnkpOmZhY3RvcnkoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/cmVxdWlyZShcImpxdWVyeVwiKTpqUXVlcnkpfShmdW5jdGlvbigkKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBpbml0KG9wdGlvbnMpe3JldHVybiFvcHRpb25zfHx2b2lkIDAhPT1vcHRpb25zLmFsbG93UGFnZVNjcm9sbHx8dm9pZCAwPT09b3B0aW9ucy5zd2lwZSYmdm9pZCAwPT09b3B0aW9ucy5zd2lwZVN0YXR1c3x8KG9wdGlvbnMuYWxsb3dQYWdlU2Nyb2xsPU5PTkUpLHZvaWQgMCE9PW9wdGlvbnMuY2xpY2smJnZvaWQgMD09PW9wdGlvbnMudGFwJiYob3B0aW9ucy50YXA9b3B0aW9ucy5jbGljayksb3B0aW9uc3x8KG9wdGlvbnM9e30pLG9wdGlvbnM9JC5leHRlbmQoe30sJC5mbi5zd2lwZS5kZWZhdWx0cyxvcHRpb25zKSx0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgJHRoaXM9JCh0aGlzKSxwbHVnaW49JHRoaXMuZGF0YShQTFVHSU5fTlMpO3BsdWdpbnx8KHBsdWdpbj1uZXcgVG91Y2hTd2lwZSh0aGlzLG9wdGlvbnMpLCR0aGlzLmRhdGEoUExVR0lOX05TLHBsdWdpbikpfSl9ZnVuY3Rpb24gVG91Y2hTd2lwZShlbGVtZW50LG9wdGlvbnMpe2Z1bmN0aW9uIHRvdWNoU3RhcnQoanFFdmVudCl7aWYoIShnZXRUb3VjaEluUHJvZ3Jlc3MoKXx8JChqcUV2ZW50LnRhcmdldCkuY2xvc2VzdChvcHRpb25zLmV4Y2x1ZGVkRWxlbWVudHMsJGVsZW1lbnQpLmxlbmd0aD4wKSl7dmFyIGV2ZW50PWpxRXZlbnQub3JpZ2luYWxFdmVudD9qcUV2ZW50Lm9yaWdpbmFsRXZlbnQ6anFFdmVudDtpZighZXZlbnQucG9pbnRlclR5cGV8fFwibW91c2VcIiE9ZXZlbnQucG9pbnRlclR5cGV8fDAhPW9wdGlvbnMuZmFsbGJhY2tUb01vdXNlRXZlbnRzKXt2YXIgcmV0LHRvdWNoZXM9ZXZlbnQudG91Y2hlcyxldnQ9dG91Y2hlcz90b3VjaGVzWzBdOmV2ZW50O3JldHVybiBwaGFzZT1QSEFTRV9TVEFSVCx0b3VjaGVzP2ZpbmdlckNvdW50PXRvdWNoZXMubGVuZ3RoOm9wdGlvbnMucHJldmVudERlZmF1bHRFdmVudHMhPT0hMSYmanFFdmVudC5wcmV2ZW50RGVmYXVsdCgpLGRpc3RhbmNlPTAsZGlyZWN0aW9uPW51bGwsY3VycmVudERpcmVjdGlvbj1udWxsLHBpbmNoRGlyZWN0aW9uPW51bGwsZHVyYXRpb249MCxzdGFydFRvdWNoZXNEaXN0YW5jZT0wLGVuZFRvdWNoZXNEaXN0YW5jZT0wLHBpbmNoWm9vbT0xLHBpbmNoRGlzdGFuY2U9MCxtYXhpbXVtc01hcD1jcmVhdGVNYXhpbXVtc0RhdGEoKSxjYW5jZWxNdWx0aUZpbmdlclJlbGVhc2UoKSxjcmVhdGVGaW5nZXJEYXRhKDAsZXZ0KSwhdG91Y2hlc3x8ZmluZ2VyQ291bnQ9PT1vcHRpb25zLmZpbmdlcnN8fG9wdGlvbnMuZmluZ2Vycz09PUFMTF9GSU5HRVJTfHxoYXNQaW5jaGVzKCk/KHN0YXJ0VGltZT1nZXRUaW1lU3RhbXAoKSwyPT1maW5nZXJDb3VudCYmKGNyZWF0ZUZpbmdlckRhdGEoMSx0b3VjaGVzWzFdKSxzdGFydFRvdWNoZXNEaXN0YW5jZT1lbmRUb3VjaGVzRGlzdGFuY2U9Y2FsY3VsYXRlVG91Y2hlc0Rpc3RhbmNlKGZpbmdlckRhdGFbMF0uc3RhcnQsZmluZ2VyRGF0YVsxXS5zdGFydCkpLChvcHRpb25zLnN3aXBlU3RhdHVzfHxvcHRpb25zLnBpbmNoU3RhdHVzKSYmKHJldD10cmlnZ2VySGFuZGxlcihldmVudCxwaGFzZSkpKTpyZXQ9ITEscmV0PT09ITE/KHBoYXNlPVBIQVNFX0NBTkNFTCx0cmlnZ2VySGFuZGxlcihldmVudCxwaGFzZSkscmV0KToob3B0aW9ucy5ob2xkJiYoaG9sZFRpbWVvdXQ9c2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uKCl7JGVsZW1lbnQudHJpZ2dlcihcImhvbGRcIixbZXZlbnQudGFyZ2V0XSksb3B0aW9ucy5ob2xkJiYocmV0PW9wdGlvbnMuaG9sZC5jYWxsKCRlbGVtZW50LGV2ZW50LGV2ZW50LnRhcmdldCkpfSx0aGlzKSxvcHRpb25zLmxvbmdUYXBUaHJlc2hvbGQpKSxzZXRUb3VjaEluUHJvZ3Jlc3MoITApLG51bGwpfX19ZnVuY3Rpb24gdG91Y2hNb3ZlKGpxRXZlbnQpe3ZhciBldmVudD1qcUV2ZW50Lm9yaWdpbmFsRXZlbnQ/anFFdmVudC5vcmlnaW5hbEV2ZW50OmpxRXZlbnQ7aWYocGhhc2UhPT1QSEFTRV9FTkQmJnBoYXNlIT09UEhBU0VfQ0FOQ0VMJiYhaW5NdWx0aUZpbmdlclJlbGVhc2UoKSl7dmFyIHJldCx0b3VjaGVzPWV2ZW50LnRvdWNoZXMsZXZ0PXRvdWNoZXM/dG91Y2hlc1swXTpldmVudCxjdXJyZW50RmluZ2VyPXVwZGF0ZUZpbmdlckRhdGEoZXZ0KTtpZihlbmRUaW1lPWdldFRpbWVTdGFtcCgpLHRvdWNoZXMmJihmaW5nZXJDb3VudD10b3VjaGVzLmxlbmd0aCksb3B0aW9ucy5ob2xkJiZjbGVhclRpbWVvdXQoaG9sZFRpbWVvdXQpLHBoYXNlPVBIQVNFX01PVkUsMj09ZmluZ2VyQ291bnQmJigwPT1zdGFydFRvdWNoZXNEaXN0YW5jZT8oY3JlYXRlRmluZ2VyRGF0YSgxLHRvdWNoZXNbMV0pLHN0YXJ0VG91Y2hlc0Rpc3RhbmNlPWVuZFRvdWNoZXNEaXN0YW5jZT1jYWxjdWxhdGVUb3VjaGVzRGlzdGFuY2UoZmluZ2VyRGF0YVswXS5zdGFydCxmaW5nZXJEYXRhWzFdLnN0YXJ0KSk6KHVwZGF0ZUZpbmdlckRhdGEodG91Y2hlc1sxXSksZW5kVG91Y2hlc0Rpc3RhbmNlPWNhbGN1bGF0ZVRvdWNoZXNEaXN0YW5jZShmaW5nZXJEYXRhWzBdLmVuZCxmaW5nZXJEYXRhWzFdLmVuZCkscGluY2hEaXJlY3Rpb249Y2FsY3VsYXRlUGluY2hEaXJlY3Rpb24oZmluZ2VyRGF0YVswXS5lbmQsZmluZ2VyRGF0YVsxXS5lbmQpKSxwaW5jaFpvb209Y2FsY3VsYXRlUGluY2hab29tKHN0YXJ0VG91Y2hlc0Rpc3RhbmNlLGVuZFRvdWNoZXNEaXN0YW5jZSkscGluY2hEaXN0YW5jZT1NYXRoLmFicyhzdGFydFRvdWNoZXNEaXN0YW5jZS1lbmRUb3VjaGVzRGlzdGFuY2UpKSxmaW5nZXJDb3VudD09PW9wdGlvbnMuZmluZ2Vyc3x8b3B0aW9ucy5maW5nZXJzPT09QUxMX0ZJTkdFUlN8fCF0b3VjaGVzfHxoYXNQaW5jaGVzKCkpe2lmKGRpcmVjdGlvbj1jYWxjdWxhdGVEaXJlY3Rpb24oY3VycmVudEZpbmdlci5zdGFydCxjdXJyZW50RmluZ2VyLmVuZCksY3VycmVudERpcmVjdGlvbj1jYWxjdWxhdGVEaXJlY3Rpb24oY3VycmVudEZpbmdlci5sYXN0LGN1cnJlbnRGaW5nZXIuZW5kKSx2YWxpZGF0ZURlZmF1bHRFdmVudChqcUV2ZW50LGN1cnJlbnREaXJlY3Rpb24pLGRpc3RhbmNlPWNhbGN1bGF0ZURpc3RhbmNlKGN1cnJlbnRGaW5nZXIuc3RhcnQsY3VycmVudEZpbmdlci5lbmQpLGR1cmF0aW9uPWNhbGN1bGF0ZUR1cmF0aW9uKCksc2V0TWF4RGlzdGFuY2UoZGlyZWN0aW9uLGRpc3RhbmNlKSxyZXQ9dHJpZ2dlckhhbmRsZXIoZXZlbnQscGhhc2UpLCFvcHRpb25zLnRyaWdnZXJPblRvdWNoRW5kfHxvcHRpb25zLnRyaWdnZXJPblRvdWNoTGVhdmUpe3ZhciBpbkJvdW5kcz0hMDtpZihvcHRpb25zLnRyaWdnZXJPblRvdWNoTGVhdmUpe3ZhciBib3VuZHM9Z2V0Ym91bmRzKHRoaXMpO2luQm91bmRzPWlzSW5Cb3VuZHMoY3VycmVudEZpbmdlci5lbmQsYm91bmRzKX0hb3B0aW9ucy50cmlnZ2VyT25Ub3VjaEVuZCYmaW5Cb3VuZHM/cGhhc2U9Z2V0TmV4dFBoYXNlKFBIQVNFX01PVkUpOm9wdGlvbnMudHJpZ2dlck9uVG91Y2hMZWF2ZSYmIWluQm91bmRzJiYocGhhc2U9Z2V0TmV4dFBoYXNlKFBIQVNFX0VORCkpLHBoYXNlIT1QSEFTRV9DQU5DRUwmJnBoYXNlIT1QSEFTRV9FTkR8fHRyaWdnZXJIYW5kbGVyKGV2ZW50LHBoYXNlKX19ZWxzZSBwaGFzZT1QSEFTRV9DQU5DRUwsdHJpZ2dlckhhbmRsZXIoZXZlbnQscGhhc2UpO3JldD09PSExJiYocGhhc2U9UEhBU0VfQ0FOQ0VMLHRyaWdnZXJIYW5kbGVyKGV2ZW50LHBoYXNlKSl9fWZ1bmN0aW9uIHRvdWNoRW5kKGpxRXZlbnQpe3ZhciBldmVudD1qcUV2ZW50Lm9yaWdpbmFsRXZlbnQ/anFFdmVudC5vcmlnaW5hbEV2ZW50OmpxRXZlbnQsdG91Y2hlcz1ldmVudC50b3VjaGVzO2lmKHRvdWNoZXMpe2lmKHRvdWNoZXMubGVuZ3RoJiYhaW5NdWx0aUZpbmdlclJlbGVhc2UoKSlyZXR1cm4gc3RhcnRNdWx0aUZpbmdlclJlbGVhc2UoZXZlbnQpLCEwO2lmKHRvdWNoZXMubGVuZ3RoJiZpbk11bHRpRmluZ2VyUmVsZWFzZSgpKXJldHVybiEwfXJldHVybiBpbk11bHRpRmluZ2VyUmVsZWFzZSgpJiYoZmluZ2VyQ291bnQ9ZmluZ2VyQ291bnRBdFJlbGVhc2UpLGVuZFRpbWU9Z2V0VGltZVN0YW1wKCksZHVyYXRpb249Y2FsY3VsYXRlRHVyYXRpb24oKSxkaWRTd2lwZUJhY2tUb0NhbmNlbCgpfHwhdmFsaWRhdGVTd2lwZURpc3RhbmNlKCk/KHBoYXNlPVBIQVNFX0NBTkNFTCx0cmlnZ2VySGFuZGxlcihldmVudCxwaGFzZSkpOm9wdGlvbnMudHJpZ2dlck9uVG91Y2hFbmR8fG9wdGlvbnMudHJpZ2dlck9uVG91Y2hFbmQ9PT0hMSYmcGhhc2U9PT1QSEFTRV9NT1ZFPyhvcHRpb25zLnByZXZlbnREZWZhdWx0RXZlbnRzIT09ITEmJmpxRXZlbnQucHJldmVudERlZmF1bHQoKSxwaGFzZT1QSEFTRV9FTkQsdHJpZ2dlckhhbmRsZXIoZXZlbnQscGhhc2UpKTohb3B0aW9ucy50cmlnZ2VyT25Ub3VjaEVuZCYmaGFzVGFwKCk/KHBoYXNlPVBIQVNFX0VORCx0cmlnZ2VySGFuZGxlckZvckdlc3R1cmUoZXZlbnQscGhhc2UsVEFQKSk6cGhhc2U9PT1QSEFTRV9NT1ZFJiYocGhhc2U9UEhBU0VfQ0FOQ0VMLHRyaWdnZXJIYW5kbGVyKGV2ZW50LHBoYXNlKSksc2V0VG91Y2hJblByb2dyZXNzKCExKSxudWxsfWZ1bmN0aW9uIHRvdWNoQ2FuY2VsKCl7ZmluZ2VyQ291bnQ9MCxlbmRUaW1lPTAsc3RhcnRUaW1lPTAsc3RhcnRUb3VjaGVzRGlzdGFuY2U9MCxlbmRUb3VjaGVzRGlzdGFuY2U9MCxwaW5jaFpvb209MSxjYW5jZWxNdWx0aUZpbmdlclJlbGVhc2UoKSxzZXRUb3VjaEluUHJvZ3Jlc3MoITEpfWZ1bmN0aW9uIHRvdWNoTGVhdmUoanFFdmVudCl7dmFyIGV2ZW50PWpxRXZlbnQub3JpZ2luYWxFdmVudD9qcUV2ZW50Lm9yaWdpbmFsRXZlbnQ6anFFdmVudDtvcHRpb25zLnRyaWdnZXJPblRvdWNoTGVhdmUmJihwaGFzZT1nZXROZXh0UGhhc2UoUEhBU0VfRU5EKSx0cmlnZ2VySGFuZGxlcihldmVudCxwaGFzZSkpfWZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycygpeyRlbGVtZW50LnVuYmluZChTVEFSVF9FVix0b3VjaFN0YXJ0KSwkZWxlbWVudC51bmJpbmQoQ0FOQ0VMX0VWLHRvdWNoQ2FuY2VsKSwkZWxlbWVudC51bmJpbmQoTU9WRV9FVix0b3VjaE1vdmUpLCRlbGVtZW50LnVuYmluZChFTkRfRVYsdG91Y2hFbmQpLExFQVZFX0VWJiYkZWxlbWVudC51bmJpbmQoTEVBVkVfRVYsdG91Y2hMZWF2ZSksc2V0VG91Y2hJblByb2dyZXNzKCExKX1mdW5jdGlvbiBnZXROZXh0UGhhc2UoY3VycmVudFBoYXNlKXt2YXIgbmV4dFBoYXNlPWN1cnJlbnRQaGFzZSx2YWxpZFRpbWU9dmFsaWRhdGVTd2lwZVRpbWUoKSx2YWxpZERpc3RhbmNlPXZhbGlkYXRlU3dpcGVEaXN0YW5jZSgpLGRpZENhbmNlbD1kaWRTd2lwZUJhY2tUb0NhbmNlbCgpO3JldHVybiF2YWxpZFRpbWV8fGRpZENhbmNlbD9uZXh0UGhhc2U9UEhBU0VfQ0FOQ0VMOiF2YWxpZERpc3RhbmNlfHxjdXJyZW50UGhhc2UhPVBIQVNFX01PVkV8fG9wdGlvbnMudHJpZ2dlck9uVG91Y2hFbmQmJiFvcHRpb25zLnRyaWdnZXJPblRvdWNoTGVhdmU/IXZhbGlkRGlzdGFuY2UmJmN1cnJlbnRQaGFzZT09UEhBU0VfRU5EJiZvcHRpb25zLnRyaWdnZXJPblRvdWNoTGVhdmUmJihuZXh0UGhhc2U9UEhBU0VfQ0FOQ0VMKTpuZXh0UGhhc2U9UEhBU0VfRU5ELG5leHRQaGFzZX1mdW5jdGlvbiB0cmlnZ2VySGFuZGxlcihldmVudCxwaGFzZSl7dmFyIHJldCx0b3VjaGVzPWV2ZW50LnRvdWNoZXM7cmV0dXJuKGRpZFN3aXBlKCl8fGhhc1N3aXBlcygpKSYmKHJldD10cmlnZ2VySGFuZGxlckZvckdlc3R1cmUoZXZlbnQscGhhc2UsU1dJUEUpKSwoZGlkUGluY2goKXx8aGFzUGluY2hlcygpKSYmcmV0IT09ITEmJihyZXQ9dHJpZ2dlckhhbmRsZXJGb3JHZXN0dXJlKGV2ZW50LHBoYXNlLFBJTkNIKSksZGlkRG91YmxlVGFwKCkmJnJldCE9PSExP3JldD10cmlnZ2VySGFuZGxlckZvckdlc3R1cmUoZXZlbnQscGhhc2UsRE9VQkxFX1RBUCk6ZGlkTG9uZ1RhcCgpJiZyZXQhPT0hMT9yZXQ9dHJpZ2dlckhhbmRsZXJGb3JHZXN0dXJlKGV2ZW50LHBoYXNlLExPTkdfVEFQKTpkaWRUYXAoKSYmcmV0IT09ITEmJihyZXQ9dHJpZ2dlckhhbmRsZXJGb3JHZXN0dXJlKGV2ZW50LHBoYXNlLFRBUCkpLHBoYXNlPT09UEhBU0VfQ0FOQ0VMJiZ0b3VjaENhbmNlbChldmVudCkscGhhc2U9PT1QSEFTRV9FTkQmJih0b3VjaGVzP3RvdWNoZXMubGVuZ3RofHx0b3VjaENhbmNlbChldmVudCk6dG91Y2hDYW5jZWwoZXZlbnQpKSxyZXR9ZnVuY3Rpb24gdHJpZ2dlckhhbmRsZXJGb3JHZXN0dXJlKGV2ZW50LHBoYXNlLGdlc3R1cmUpe3ZhciByZXQ7aWYoZ2VzdHVyZT09U1dJUEUpe2lmKCRlbGVtZW50LnRyaWdnZXIoXCJzd2lwZVN0YXR1c1wiLFtwaGFzZSxkaXJlY3Rpb258fG51bGwsZGlzdGFuY2V8fDAsZHVyYXRpb258fDAsZmluZ2VyQ291bnQsZmluZ2VyRGF0YSxjdXJyZW50RGlyZWN0aW9uXSksb3B0aW9ucy5zd2lwZVN0YXR1cyYmKHJldD1vcHRpb25zLnN3aXBlU3RhdHVzLmNhbGwoJGVsZW1lbnQsZXZlbnQscGhhc2UsZGlyZWN0aW9ufHxudWxsLGRpc3RhbmNlfHwwLGR1cmF0aW9ufHwwLGZpbmdlckNvdW50LGZpbmdlckRhdGEsY3VycmVudERpcmVjdGlvbikscmV0PT09ITEpKXJldHVybiExO2lmKHBoYXNlPT1QSEFTRV9FTkQmJnZhbGlkYXRlU3dpcGUoKSl7aWYoY2xlYXJUaW1lb3V0KHNpbmdsZVRhcFRpbWVvdXQpLGNsZWFyVGltZW91dChob2xkVGltZW91dCksJGVsZW1lbnQudHJpZ2dlcihcInN3aXBlXCIsW2RpcmVjdGlvbixkaXN0YW5jZSxkdXJhdGlvbixmaW5nZXJDb3VudCxmaW5nZXJEYXRhLGN1cnJlbnREaXJlY3Rpb25dKSxvcHRpb25zLnN3aXBlJiYocmV0PW9wdGlvbnMuc3dpcGUuY2FsbCgkZWxlbWVudCxldmVudCxkaXJlY3Rpb24sZGlzdGFuY2UsZHVyYXRpb24sZmluZ2VyQ291bnQsZmluZ2VyRGF0YSxjdXJyZW50RGlyZWN0aW9uKSxyZXQ9PT0hMSkpcmV0dXJuITE7c3dpdGNoKGRpcmVjdGlvbil7Y2FzZSBMRUZUOiRlbGVtZW50LnRyaWdnZXIoXCJzd2lwZUxlZnRcIixbZGlyZWN0aW9uLGRpc3RhbmNlLGR1cmF0aW9uLGZpbmdlckNvdW50LGZpbmdlckRhdGEsY3VycmVudERpcmVjdGlvbl0pLG9wdGlvbnMuc3dpcGVMZWZ0JiYocmV0PW9wdGlvbnMuc3dpcGVMZWZ0LmNhbGwoJGVsZW1lbnQsZXZlbnQsZGlyZWN0aW9uLGRpc3RhbmNlLGR1cmF0aW9uLGZpbmdlckNvdW50LGZpbmdlckRhdGEsY3VycmVudERpcmVjdGlvbikpO2JyZWFrO2Nhc2UgUklHSFQ6JGVsZW1lbnQudHJpZ2dlcihcInN3aXBlUmlnaHRcIixbZGlyZWN0aW9uLGRpc3RhbmNlLGR1cmF0aW9uLGZpbmdlckNvdW50LGZpbmdlckRhdGEsY3VycmVudERpcmVjdGlvbl0pLG9wdGlvbnMuc3dpcGVSaWdodCYmKHJldD1vcHRpb25zLnN3aXBlUmlnaHQuY2FsbCgkZWxlbWVudCxldmVudCxkaXJlY3Rpb24sZGlzdGFuY2UsZHVyYXRpb24sZmluZ2VyQ291bnQsZmluZ2VyRGF0YSxjdXJyZW50RGlyZWN0aW9uKSk7YnJlYWs7Y2FzZSBVUDokZWxlbWVudC50cmlnZ2VyKFwic3dpcGVVcFwiLFtkaXJlY3Rpb24sZGlzdGFuY2UsZHVyYXRpb24sZmluZ2VyQ291bnQsZmluZ2VyRGF0YSxjdXJyZW50RGlyZWN0aW9uXSksb3B0aW9ucy5zd2lwZVVwJiYocmV0PW9wdGlvbnMuc3dpcGVVcC5jYWxsKCRlbGVtZW50LGV2ZW50LGRpcmVjdGlvbixkaXN0YW5jZSxkdXJhdGlvbixmaW5nZXJDb3VudCxmaW5nZXJEYXRhLGN1cnJlbnREaXJlY3Rpb24pKTticmVhaztjYXNlIERPV046JGVsZW1lbnQudHJpZ2dlcihcInN3aXBlRG93blwiLFtkaXJlY3Rpb24sZGlzdGFuY2UsZHVyYXRpb24sZmluZ2VyQ291bnQsZmluZ2VyRGF0YSxjdXJyZW50RGlyZWN0aW9uXSksb3B0aW9ucy5zd2lwZURvd24mJihyZXQ9b3B0aW9ucy5zd2lwZURvd24uY2FsbCgkZWxlbWVudCxldmVudCxkaXJlY3Rpb24sZGlzdGFuY2UsZHVyYXRpb24sZmluZ2VyQ291bnQsZmluZ2VyRGF0YSxjdXJyZW50RGlyZWN0aW9uKSl9fX1pZihnZXN0dXJlPT1QSU5DSCl7aWYoJGVsZW1lbnQudHJpZ2dlcihcInBpbmNoU3RhdHVzXCIsW3BoYXNlLHBpbmNoRGlyZWN0aW9ufHxudWxsLHBpbmNoRGlzdGFuY2V8fDAsZHVyYXRpb258fDAsZmluZ2VyQ291bnQscGluY2hab29tLGZpbmdlckRhdGFdKSxvcHRpb25zLnBpbmNoU3RhdHVzJiYocmV0PW9wdGlvbnMucGluY2hTdGF0dXMuY2FsbCgkZWxlbWVudCxldmVudCxwaGFzZSxwaW5jaERpcmVjdGlvbnx8bnVsbCxwaW5jaERpc3RhbmNlfHwwLGR1cmF0aW9ufHwwLGZpbmdlckNvdW50LHBpbmNoWm9vbSxmaW5nZXJEYXRhKSxyZXQ9PT0hMSkpcmV0dXJuITE7aWYocGhhc2U9PVBIQVNFX0VORCYmdmFsaWRhdGVQaW5jaCgpKXN3aXRjaChwaW5jaERpcmVjdGlvbil7Y2FzZSBJTjokZWxlbWVudC50cmlnZ2VyKFwicGluY2hJblwiLFtwaW5jaERpcmVjdGlvbnx8bnVsbCxwaW5jaERpc3RhbmNlfHwwLGR1cmF0aW9ufHwwLGZpbmdlckNvdW50LHBpbmNoWm9vbSxmaW5nZXJEYXRhXSksb3B0aW9ucy5waW5jaEluJiYocmV0PW9wdGlvbnMucGluY2hJbi5jYWxsKCRlbGVtZW50LGV2ZW50LHBpbmNoRGlyZWN0aW9ufHxudWxsLHBpbmNoRGlzdGFuY2V8fDAsZHVyYXRpb258fDAsZmluZ2VyQ291bnQscGluY2hab29tLGZpbmdlckRhdGEpKTticmVhaztjYXNlIE9VVDokZWxlbWVudC50cmlnZ2VyKFwicGluY2hPdXRcIixbcGluY2hEaXJlY3Rpb258fG51bGwscGluY2hEaXN0YW5jZXx8MCxkdXJhdGlvbnx8MCxmaW5nZXJDb3VudCxwaW5jaFpvb20sZmluZ2VyRGF0YV0pLG9wdGlvbnMucGluY2hPdXQmJihyZXQ9b3B0aW9ucy5waW5jaE91dC5jYWxsKCRlbGVtZW50LGV2ZW50LHBpbmNoRGlyZWN0aW9ufHxudWxsLHBpbmNoRGlzdGFuY2V8fDAsZHVyYXRpb258fDAsZmluZ2VyQ291bnQscGluY2hab29tLGZpbmdlckRhdGEpKX19cmV0dXJuIGdlc3R1cmU9PVRBUD9waGFzZSE9PVBIQVNFX0NBTkNFTCYmcGhhc2UhPT1QSEFTRV9FTkR8fChjbGVhclRpbWVvdXQoc2luZ2xlVGFwVGltZW91dCksY2xlYXJUaW1lb3V0KGhvbGRUaW1lb3V0KSxoYXNEb3VibGVUYXAoKSYmIWluRG91YmxlVGFwKCk/KGRvdWJsZVRhcFN0YXJ0VGltZT1nZXRUaW1lU3RhbXAoKSxzaW5nbGVUYXBUaW1lb3V0PXNldFRpbWVvdXQoJC5wcm94eShmdW5jdGlvbigpe2RvdWJsZVRhcFN0YXJ0VGltZT1udWxsLCRlbGVtZW50LnRyaWdnZXIoXCJ0YXBcIixbZXZlbnQudGFyZ2V0XSksb3B0aW9ucy50YXAmJihyZXQ9b3B0aW9ucy50YXAuY2FsbCgkZWxlbWVudCxldmVudCxldmVudC50YXJnZXQpKX0sdGhpcyksb3B0aW9ucy5kb3VibGVUYXBUaHJlc2hvbGQpKTooZG91YmxlVGFwU3RhcnRUaW1lPW51bGwsJGVsZW1lbnQudHJpZ2dlcihcInRhcFwiLFtldmVudC50YXJnZXRdKSxvcHRpb25zLnRhcCYmKHJldD1vcHRpb25zLnRhcC5jYWxsKCRlbGVtZW50LGV2ZW50LGV2ZW50LnRhcmdldCkpKSk6Z2VzdHVyZT09RE9VQkxFX1RBUD9waGFzZSE9PVBIQVNFX0NBTkNFTCYmcGhhc2UhPT1QSEFTRV9FTkR8fChjbGVhclRpbWVvdXQoc2luZ2xlVGFwVGltZW91dCksY2xlYXJUaW1lb3V0KGhvbGRUaW1lb3V0KSxkb3VibGVUYXBTdGFydFRpbWU9bnVsbCwkZWxlbWVudC50cmlnZ2VyKFwiZG91YmxldGFwXCIsW2V2ZW50LnRhcmdldF0pLG9wdGlvbnMuZG91YmxlVGFwJiYocmV0PW9wdGlvbnMuZG91YmxlVGFwLmNhbGwoJGVsZW1lbnQsZXZlbnQsZXZlbnQudGFyZ2V0KSkpOmdlc3R1cmU9PUxPTkdfVEFQJiYocGhhc2UhPT1QSEFTRV9DQU5DRUwmJnBoYXNlIT09UEhBU0VfRU5EfHwoY2xlYXJUaW1lb3V0KHNpbmdsZVRhcFRpbWVvdXQpLGRvdWJsZVRhcFN0YXJ0VGltZT1udWxsLCRlbGVtZW50LnRyaWdnZXIoXCJsb25ndGFwXCIsW2V2ZW50LnRhcmdldF0pLG9wdGlvbnMubG9uZ1RhcCYmKHJldD1vcHRpb25zLmxvbmdUYXAuY2FsbCgkZWxlbWVudCxldmVudCxldmVudC50YXJnZXQpKSkpLHJldH1mdW5jdGlvbiB2YWxpZGF0ZVN3aXBlRGlzdGFuY2UoKXt2YXIgdmFsaWQ9ITA7cmV0dXJuIG51bGwhPT1vcHRpb25zLnRocmVzaG9sZCYmKHZhbGlkPWRpc3RhbmNlPj1vcHRpb25zLnRocmVzaG9sZCksdmFsaWR9ZnVuY3Rpb24gZGlkU3dpcGVCYWNrVG9DYW5jZWwoKXt2YXIgY2FuY2VsbGVkPSExO3JldHVybiBudWxsIT09b3B0aW9ucy5jYW5jZWxUaHJlc2hvbGQmJm51bGwhPT1kaXJlY3Rpb24mJihjYW5jZWxsZWQ9Z2V0TWF4RGlzdGFuY2UoZGlyZWN0aW9uKS1kaXN0YW5jZT49b3B0aW9ucy5jYW5jZWxUaHJlc2hvbGQpLGNhbmNlbGxlZH1mdW5jdGlvbiB2YWxpZGF0ZVBpbmNoRGlzdGFuY2UoKXtyZXR1cm4gbnVsbD09PW9wdGlvbnMucGluY2hUaHJlc2hvbGR8fHBpbmNoRGlzdGFuY2U+PW9wdGlvbnMucGluY2hUaHJlc2hvbGR9ZnVuY3Rpb24gdmFsaWRhdGVTd2lwZVRpbWUoKXt2YXIgcmVzdWx0O3JldHVybiByZXN1bHQ9IW9wdGlvbnMubWF4VGltZVRocmVzaG9sZHx8IShkdXJhdGlvbj49b3B0aW9ucy5tYXhUaW1lVGhyZXNob2xkKX1mdW5jdGlvbiB2YWxpZGF0ZURlZmF1bHRFdmVudChqcUV2ZW50LGRpcmVjdGlvbil7aWYob3B0aW9ucy5wcmV2ZW50RGVmYXVsdEV2ZW50cyE9PSExKWlmKG9wdGlvbnMuYWxsb3dQYWdlU2Nyb2xsPT09Tk9ORSlqcUV2ZW50LnByZXZlbnREZWZhdWx0KCk7ZWxzZXt2YXIgYXV0bz1vcHRpb25zLmFsbG93UGFnZVNjcm9sbD09PUFVVE87c3dpdGNoKGRpcmVjdGlvbil7Y2FzZSBMRUZUOihvcHRpb25zLnN3aXBlTGVmdCYmYXV0b3x8IWF1dG8mJm9wdGlvbnMuYWxsb3dQYWdlU2Nyb2xsIT1IT1JJWk9OVEFMKSYmanFFdmVudC5wcmV2ZW50RGVmYXVsdCgpO2JyZWFrO2Nhc2UgUklHSFQ6KG9wdGlvbnMuc3dpcGVSaWdodCYmYXV0b3x8IWF1dG8mJm9wdGlvbnMuYWxsb3dQYWdlU2Nyb2xsIT1IT1JJWk9OVEFMKSYmanFFdmVudC5wcmV2ZW50RGVmYXVsdCgpO2JyZWFrO2Nhc2UgVVA6KG9wdGlvbnMuc3dpcGVVcCYmYXV0b3x8IWF1dG8mJm9wdGlvbnMuYWxsb3dQYWdlU2Nyb2xsIT1WRVJUSUNBTCkmJmpxRXZlbnQucHJldmVudERlZmF1bHQoKTticmVhaztjYXNlIERPV046KG9wdGlvbnMuc3dpcGVEb3duJiZhdXRvfHwhYXV0byYmb3B0aW9ucy5hbGxvd1BhZ2VTY3JvbGwhPVZFUlRJQ0FMKSYmanFFdmVudC5wcmV2ZW50RGVmYXVsdCgpO2JyZWFrO2Nhc2UgTk9ORTp9fX1mdW5jdGlvbiB2YWxpZGF0ZVBpbmNoKCl7dmFyIGhhc0NvcnJlY3RGaW5nZXJDb3VudD12YWxpZGF0ZUZpbmdlcnMoKSxoYXNFbmRQb2ludD12YWxpZGF0ZUVuZFBvaW50KCksaGFzQ29ycmVjdERpc3RhbmNlPXZhbGlkYXRlUGluY2hEaXN0YW5jZSgpO3JldHVybiBoYXNDb3JyZWN0RmluZ2VyQ291bnQmJmhhc0VuZFBvaW50JiZoYXNDb3JyZWN0RGlzdGFuY2V9ZnVuY3Rpb24gaGFzUGluY2hlcygpe3JldHVybiEhKG9wdGlvbnMucGluY2hTdGF0dXN8fG9wdGlvbnMucGluY2hJbnx8b3B0aW9ucy5waW5jaE91dCl9ZnVuY3Rpb24gZGlkUGluY2goKXtyZXR1cm4hKCF2YWxpZGF0ZVBpbmNoKCl8fCFoYXNQaW5jaGVzKCkpfWZ1bmN0aW9uIHZhbGlkYXRlU3dpcGUoKXt2YXIgaGFzVmFsaWRUaW1lPXZhbGlkYXRlU3dpcGVUaW1lKCksaGFzVmFsaWREaXN0YW5jZT12YWxpZGF0ZVN3aXBlRGlzdGFuY2UoKSxoYXNDb3JyZWN0RmluZ2VyQ291bnQ9dmFsaWRhdGVGaW5nZXJzKCksaGFzRW5kUG9pbnQ9dmFsaWRhdGVFbmRQb2ludCgpLGRpZENhbmNlbD1kaWRTd2lwZUJhY2tUb0NhbmNlbCgpLHZhbGlkPSFkaWRDYW5jZWwmJmhhc0VuZFBvaW50JiZoYXNDb3JyZWN0RmluZ2VyQ291bnQmJmhhc1ZhbGlkRGlzdGFuY2UmJmhhc1ZhbGlkVGltZTtyZXR1cm4gdmFsaWR9ZnVuY3Rpb24gaGFzU3dpcGVzKCl7cmV0dXJuISEob3B0aW9ucy5zd2lwZXx8b3B0aW9ucy5zd2lwZVN0YXR1c3x8b3B0aW9ucy5zd2lwZUxlZnR8fG9wdGlvbnMuc3dpcGVSaWdodHx8b3B0aW9ucy5zd2lwZVVwfHxvcHRpb25zLnN3aXBlRG93bil9ZnVuY3Rpb24gZGlkU3dpcGUoKXtyZXR1cm4hKCF2YWxpZGF0ZVN3aXBlKCl8fCFoYXNTd2lwZXMoKSl9ZnVuY3Rpb24gdmFsaWRhdGVGaW5nZXJzKCl7cmV0dXJuIGZpbmdlckNvdW50PT09b3B0aW9ucy5maW5nZXJzfHxvcHRpb25zLmZpbmdlcnM9PT1BTExfRklOR0VSU3x8IVNVUFBPUlRTX1RPVUNIfWZ1bmN0aW9uIHZhbGlkYXRlRW5kUG9pbnQoKXtyZXR1cm4gMCE9PWZpbmdlckRhdGFbMF0uZW5kLnh9ZnVuY3Rpb24gaGFzVGFwKCl7cmV0dXJuISFvcHRpb25zLnRhcH1mdW5jdGlvbiBoYXNEb3VibGVUYXAoKXtyZXR1cm4hIW9wdGlvbnMuZG91YmxlVGFwfWZ1bmN0aW9uIGhhc0xvbmdUYXAoKXtyZXR1cm4hIW9wdGlvbnMubG9uZ1RhcH1mdW5jdGlvbiB2YWxpZGF0ZURvdWJsZVRhcCgpe2lmKG51bGw9PWRvdWJsZVRhcFN0YXJ0VGltZSlyZXR1cm4hMTt2YXIgbm93PWdldFRpbWVTdGFtcCgpO3JldHVybiBoYXNEb3VibGVUYXAoKSYmbm93LWRvdWJsZVRhcFN0YXJ0VGltZTw9b3B0aW9ucy5kb3VibGVUYXBUaHJlc2hvbGR9ZnVuY3Rpb24gaW5Eb3VibGVUYXAoKXtyZXR1cm4gdmFsaWRhdGVEb3VibGVUYXAoKX1mdW5jdGlvbiB2YWxpZGF0ZVRhcCgpe3JldHVybigxPT09ZmluZ2VyQ291bnR8fCFTVVBQT1JUU19UT1VDSCkmJihpc05hTihkaXN0YW5jZSl8fGRpc3RhbmNlPG9wdGlvbnMudGhyZXNob2xkKX1mdW5jdGlvbiB2YWxpZGF0ZUxvbmdUYXAoKXtyZXR1cm4gZHVyYXRpb24+b3B0aW9ucy5sb25nVGFwVGhyZXNob2xkJiZkaXN0YW5jZTxET1VCTEVfVEFQX1RIUkVTSE9MRH1mdW5jdGlvbiBkaWRUYXAoKXtyZXR1cm4hKCF2YWxpZGF0ZVRhcCgpfHwhaGFzVGFwKCkpfWZ1bmN0aW9uIGRpZERvdWJsZVRhcCgpe3JldHVybiEoIXZhbGlkYXRlRG91YmxlVGFwKCl8fCFoYXNEb3VibGVUYXAoKSl9ZnVuY3Rpb24gZGlkTG9uZ1RhcCgpe3JldHVybiEoIXZhbGlkYXRlTG9uZ1RhcCgpfHwhaGFzTG9uZ1RhcCgpKX1mdW5jdGlvbiBzdGFydE11bHRpRmluZ2VyUmVsZWFzZShldmVudCl7cHJldmlvdXNUb3VjaEVuZFRpbWU9Z2V0VGltZVN0YW1wKCksZmluZ2VyQ291bnRBdFJlbGVhc2U9ZXZlbnQudG91Y2hlcy5sZW5ndGgrMX1mdW5jdGlvbiBjYW5jZWxNdWx0aUZpbmdlclJlbGVhc2UoKXtwcmV2aW91c1RvdWNoRW5kVGltZT0wLGZpbmdlckNvdW50QXRSZWxlYXNlPTB9ZnVuY3Rpb24gaW5NdWx0aUZpbmdlclJlbGVhc2UoKXt2YXIgd2l0aGluVGhyZXNob2xkPSExO2lmKHByZXZpb3VzVG91Y2hFbmRUaW1lKXt2YXIgZGlmZj1nZXRUaW1lU3RhbXAoKS1wcmV2aW91c1RvdWNoRW5kVGltZTtkaWZmPD1vcHRpb25zLmZpbmdlclJlbGVhc2VUaHJlc2hvbGQmJih3aXRoaW5UaHJlc2hvbGQ9ITApfXJldHVybiB3aXRoaW5UaHJlc2hvbGR9ZnVuY3Rpb24gZ2V0VG91Y2hJblByb2dyZXNzKCl7cmV0dXJuISgkZWxlbWVudC5kYXRhKFBMVUdJTl9OUytcIl9pbnRvdWNoXCIpIT09ITApfWZ1bmN0aW9uIHNldFRvdWNoSW5Qcm9ncmVzcyh2YWwpeyRlbGVtZW50JiYodmFsPT09ITA/KCRlbGVtZW50LmJpbmQoTU9WRV9FVix0b3VjaE1vdmUpLCRlbGVtZW50LmJpbmQoRU5EX0VWLHRvdWNoRW5kKSxMRUFWRV9FViYmJGVsZW1lbnQuYmluZChMRUFWRV9FVix0b3VjaExlYXZlKSk6KCRlbGVtZW50LnVuYmluZChNT1ZFX0VWLHRvdWNoTW92ZSwhMSksJGVsZW1lbnQudW5iaW5kKEVORF9FVix0b3VjaEVuZCwhMSksTEVBVkVfRVYmJiRlbGVtZW50LnVuYmluZChMRUFWRV9FVix0b3VjaExlYXZlLCExKSksJGVsZW1lbnQuZGF0YShQTFVHSU5fTlMrXCJfaW50b3VjaFwiLHZhbD09PSEwKSl9ZnVuY3Rpb24gY3JlYXRlRmluZ2VyRGF0YShpZCxldnQpe3ZhciBmPXtzdGFydDp7eDowLHk6MH0sbGFzdDp7eDowLHk6MH0sZW5kOnt4OjAseTowfX07cmV0dXJuIGYuc3RhcnQueD1mLmxhc3QueD1mLmVuZC54PWV2dC5wYWdlWHx8ZXZ0LmNsaWVudFgsZi5zdGFydC55PWYubGFzdC55PWYuZW5kLnk9ZXZ0LnBhZ2VZfHxldnQuY2xpZW50WSxmaW5nZXJEYXRhW2lkXT1mLGZ9ZnVuY3Rpb24gdXBkYXRlRmluZ2VyRGF0YShldnQpe3ZhciBpZD12b2lkIDAhPT1ldnQuaWRlbnRpZmllcj9ldnQuaWRlbnRpZmllcjowLGY9Z2V0RmluZ2VyRGF0YShpZCk7cmV0dXJuIG51bGw9PT1mJiYoZj1jcmVhdGVGaW5nZXJEYXRhKGlkLGV2dCkpLGYubGFzdC54PWYuZW5kLngsZi5sYXN0Lnk9Zi5lbmQueSxmLmVuZC54PWV2dC5wYWdlWHx8ZXZ0LmNsaWVudFgsZi5lbmQueT1ldnQucGFnZVl8fGV2dC5jbGllbnRZLGZ9ZnVuY3Rpb24gZ2V0RmluZ2VyRGF0YShpZCl7cmV0dXJuIGZpbmdlckRhdGFbaWRdfHxudWxsfWZ1bmN0aW9uIHNldE1heERpc3RhbmNlKGRpcmVjdGlvbixkaXN0YW5jZSl7ZGlyZWN0aW9uIT1OT05FJiYoZGlzdGFuY2U9TWF0aC5tYXgoZGlzdGFuY2UsZ2V0TWF4RGlzdGFuY2UoZGlyZWN0aW9uKSksbWF4aW11bXNNYXBbZGlyZWN0aW9uXS5kaXN0YW5jZT1kaXN0YW5jZSl9ZnVuY3Rpb24gZ2V0TWF4RGlzdGFuY2UoZGlyZWN0aW9uKXtpZihtYXhpbXVtc01hcFtkaXJlY3Rpb25dKXJldHVybiBtYXhpbXVtc01hcFtkaXJlY3Rpb25dLmRpc3RhbmNlfWZ1bmN0aW9uIGNyZWF0ZU1heGltdW1zRGF0YSgpe3ZhciBtYXhEYXRhPXt9O3JldHVybiBtYXhEYXRhW0xFRlRdPWNyZWF0ZU1heGltdW1WTyhMRUZUKSxtYXhEYXRhW1JJR0hUXT1jcmVhdGVNYXhpbXVtVk8oUklHSFQpLG1heERhdGFbVVBdPWNyZWF0ZU1heGltdW1WTyhVUCksbWF4RGF0YVtET1dOXT1jcmVhdGVNYXhpbXVtVk8oRE9XTiksbWF4RGF0YX1mdW5jdGlvbiBjcmVhdGVNYXhpbXVtVk8oZGlyKXtyZXR1cm57ZGlyZWN0aW9uOmRpcixkaXN0YW5jZTowfX1mdW5jdGlvbiBjYWxjdWxhdGVEdXJhdGlvbigpe3JldHVybiBlbmRUaW1lLXN0YXJ0VGltZX1mdW5jdGlvbiBjYWxjdWxhdGVUb3VjaGVzRGlzdGFuY2Uoc3RhcnRQb2ludCxlbmRQb2ludCl7dmFyIGRpZmZYPU1hdGguYWJzKHN0YXJ0UG9pbnQueC1lbmRQb2ludC54KSxkaWZmWT1NYXRoLmFicyhzdGFydFBvaW50LnktZW5kUG9pbnQueSk7cmV0dXJuIE1hdGgucm91bmQoTWF0aC5zcXJ0KGRpZmZYKmRpZmZYK2RpZmZZKmRpZmZZKSl9ZnVuY3Rpb24gY2FsY3VsYXRlUGluY2hab29tKHN0YXJ0RGlzdGFuY2UsZW5kRGlzdGFuY2Upe3ZhciBwZXJjZW50PWVuZERpc3RhbmNlL3N0YXJ0RGlzdGFuY2UqMTtyZXR1cm4gcGVyY2VudC50b0ZpeGVkKDIpfWZ1bmN0aW9uIGNhbGN1bGF0ZVBpbmNoRGlyZWN0aW9uKCl7cmV0dXJuIHBpbmNoWm9vbTwxP09VVDpJTn1mdW5jdGlvbiBjYWxjdWxhdGVEaXN0YW5jZShzdGFydFBvaW50LGVuZFBvaW50KXtyZXR1cm4gTWF0aC5yb3VuZChNYXRoLnNxcnQoTWF0aC5wb3coZW5kUG9pbnQueC1zdGFydFBvaW50LngsMikrTWF0aC5wb3coZW5kUG9pbnQueS1zdGFydFBvaW50LnksMikpKX1mdW5jdGlvbiBjYWxjdWxhdGVBbmdsZShzdGFydFBvaW50LGVuZFBvaW50KXt2YXIgeD1zdGFydFBvaW50LngtZW5kUG9pbnQueCx5PWVuZFBvaW50Lnktc3RhcnRQb2ludC55LHI9TWF0aC5hdGFuMih5LHgpLGFuZ2xlPU1hdGgucm91bmQoMTgwKnIvTWF0aC5QSSk7cmV0dXJuIGFuZ2xlPDAmJihhbmdsZT0zNjAtTWF0aC5hYnMoYW5nbGUpKSxhbmdsZX1mdW5jdGlvbiBjYWxjdWxhdGVEaXJlY3Rpb24oc3RhcnRQb2ludCxlbmRQb2ludCl7aWYoY29tcGFyZVBvaW50cyhzdGFydFBvaW50LGVuZFBvaW50KSlyZXR1cm4gTk9ORTt2YXIgYW5nbGU9Y2FsY3VsYXRlQW5nbGUoc3RhcnRQb2ludCxlbmRQb2ludCk7cmV0dXJuIGFuZ2xlPD00NSYmYW5nbGU+PTA/TEVGVDphbmdsZTw9MzYwJiZhbmdsZT49MzE1P0xFRlQ6YW5nbGU+PTEzNSYmYW5nbGU8PTIyNT9SSUdIVDphbmdsZT40NSYmYW5nbGU8MTM1P0RPV046VVB9ZnVuY3Rpb24gZ2V0VGltZVN0YW1wKCl7dmFyIG5vdz1uZXcgRGF0ZTtyZXR1cm4gbm93LmdldFRpbWUoKX1mdW5jdGlvbiBnZXRib3VuZHMoZWwpe2VsPSQoZWwpO3ZhciBvZmZzZXQ9ZWwub2Zmc2V0KCksYm91bmRzPXtsZWZ0Om9mZnNldC5sZWZ0LHJpZ2h0Om9mZnNldC5sZWZ0K2VsLm91dGVyV2lkdGgoKSx0b3A6b2Zmc2V0LnRvcCxib3R0b206b2Zmc2V0LnRvcCtlbC5vdXRlckhlaWdodCgpfTtyZXR1cm4gYm91bmRzfWZ1bmN0aW9uIGlzSW5Cb3VuZHMocG9pbnQsYm91bmRzKXtyZXR1cm4gcG9pbnQueD5ib3VuZHMubGVmdCYmcG9pbnQueDxib3VuZHMucmlnaHQmJnBvaW50Lnk+Ym91bmRzLnRvcCYmcG9pbnQueTxib3VuZHMuYm90dG9tfWZ1bmN0aW9uIGNvbXBhcmVQb2ludHMocG9pbnRBLHBvaW50Qil7cmV0dXJuIHBvaW50QS54PT1wb2ludEIueCYmcG9pbnRBLnk9PXBvaW50Qi55fXZhciBvcHRpb25zPSQuZXh0ZW5kKHt9LG9wdGlvbnMpLHVzZVRvdWNoRXZlbnRzPVNVUFBPUlRTX1RPVUNIfHxTVVBQT1JUU19QT0lOVEVSfHwhb3B0aW9ucy5mYWxsYmFja1RvTW91c2VFdmVudHMsU1RBUlRfRVY9dXNlVG91Y2hFdmVudHM/U1VQUE9SVFNfUE9JTlRFUj9TVVBQT1JUU19QT0lOVEVSX0lFMTA/XCJNU1BvaW50ZXJEb3duXCI6XCJwb2ludGVyZG93blwiOlwidG91Y2hzdGFydFwiOlwibW91c2Vkb3duXCIsTU9WRV9FVj11c2VUb3VjaEV2ZW50cz9TVVBQT1JUU19QT0lOVEVSP1NVUFBPUlRTX1BPSU5URVJfSUUxMD9cIk1TUG9pbnRlck1vdmVcIjpcInBvaW50ZXJtb3ZlXCI6XCJ0b3VjaG1vdmVcIjpcIm1vdXNlbW92ZVwiLEVORF9FVj11c2VUb3VjaEV2ZW50cz9TVVBQT1JUU19QT0lOVEVSP1NVUFBPUlRTX1BPSU5URVJfSUUxMD9cIk1TUG9pbnRlclVwXCI6XCJwb2ludGVydXBcIjpcInRvdWNoZW5kXCI6XCJtb3VzZXVwXCIsTEVBVkVfRVY9dXNlVG91Y2hFdmVudHM/U1VQUE9SVFNfUE9JTlRFUj9cIm1vdXNlbGVhdmVcIjpudWxsOlwibW91c2VsZWF2ZVwiLENBTkNFTF9FVj1TVVBQT1JUU19QT0lOVEVSP1NVUFBPUlRTX1BPSU5URVJfSUUxMD9cIk1TUG9pbnRlckNhbmNlbFwiOlwicG9pbnRlcmNhbmNlbFwiOlwidG91Y2hjYW5jZWxcIixkaXN0YW5jZT0wLGRpcmVjdGlvbj1udWxsLGN1cnJlbnREaXJlY3Rpb249bnVsbCxkdXJhdGlvbj0wLHN0YXJ0VG91Y2hlc0Rpc3RhbmNlPTAsZW5kVG91Y2hlc0Rpc3RhbmNlPTAscGluY2hab29tPTEscGluY2hEaXN0YW5jZT0wLHBpbmNoRGlyZWN0aW9uPTAsbWF4aW11bXNNYXA9bnVsbCwkZWxlbWVudD0kKGVsZW1lbnQpLHBoYXNlPVwic3RhcnRcIixmaW5nZXJDb3VudD0wLGZpbmdlckRhdGE9e30sc3RhcnRUaW1lPTAsZW5kVGltZT0wLHByZXZpb3VzVG91Y2hFbmRUaW1lPTAsZmluZ2VyQ291bnRBdFJlbGVhc2U9MCxkb3VibGVUYXBTdGFydFRpbWU9MCxzaW5nbGVUYXBUaW1lb3V0PW51bGwsaG9sZFRpbWVvdXQ9bnVsbDt0cnl7JGVsZW1lbnQuYmluZChTVEFSVF9FVix0b3VjaFN0YXJ0KSwkZWxlbWVudC5iaW5kKENBTkNFTF9FVix0b3VjaENhbmNlbCl9Y2F0Y2goZSl7JC5lcnJvcihcImV2ZW50cyBub3Qgc3VwcG9ydGVkIFwiK1NUQVJUX0VWK1wiLFwiK0NBTkNFTF9FVitcIiBvbiBqUXVlcnkuc3dpcGVcIil9dGhpcy5lbmFibGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kaXNhYmxlKCksJGVsZW1lbnQuYmluZChTVEFSVF9FVix0b3VjaFN0YXJ0KSwkZWxlbWVudC5iaW5kKENBTkNFTF9FVix0b3VjaENhbmNlbCksJGVsZW1lbnR9LHRoaXMuZGlzYWJsZT1mdW5jdGlvbigpe3JldHVybiByZW1vdmVMaXN0ZW5lcnMoKSwkZWxlbWVudH0sdGhpcy5kZXN0cm95PWZ1bmN0aW9uKCl7cmVtb3ZlTGlzdGVuZXJzKCksJGVsZW1lbnQuZGF0YShQTFVHSU5fTlMsbnVsbCksJGVsZW1lbnQ9bnVsbH0sdGhpcy5vcHRpb249ZnVuY3Rpb24ocHJvcGVydHksdmFsdWUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBwcm9wZXJ0eSlvcHRpb25zPSQuZXh0ZW5kKG9wdGlvbnMscHJvcGVydHkpO2Vsc2UgaWYodm9pZCAwIT09b3B0aW9uc1twcm9wZXJ0eV0pe2lmKHZvaWQgMD09PXZhbHVlKXJldHVybiBvcHRpb25zW3Byb3BlcnR5XTtvcHRpb25zW3Byb3BlcnR5XT12YWx1ZX1lbHNle2lmKCFwcm9wZXJ0eSlyZXR1cm4gb3B0aW9uczskLmVycm9yKFwiT3B0aW9uIFwiK3Byb3BlcnR5K1wiIGRvZXMgbm90IGV4aXN0IG9uIGpRdWVyeS5zd2lwZS5vcHRpb25zXCIpfXJldHVybiBudWxsfX12YXIgVkVSU0lPTj1cIjEuNi4xOFwiLExFRlQ9XCJsZWZ0XCIsUklHSFQ9XCJyaWdodFwiLFVQPVwidXBcIixET1dOPVwiZG93blwiLElOPVwiaW5cIixPVVQ9XCJvdXRcIixOT05FPVwibm9uZVwiLEFVVE89XCJhdXRvXCIsU1dJUEU9XCJzd2lwZVwiLFBJTkNIPVwicGluY2hcIixUQVA9XCJ0YXBcIixET1VCTEVfVEFQPVwiZG91YmxldGFwXCIsTE9OR19UQVA9XCJsb25ndGFwXCIsSE9SSVpPTlRBTD1cImhvcml6b250YWxcIixWRVJUSUNBTD1cInZlcnRpY2FsXCIsQUxMX0ZJTkdFUlM9XCJhbGxcIixET1VCTEVfVEFQX1RIUkVTSE9MRD0xMCxQSEFTRV9TVEFSVD1cInN0YXJ0XCIsUEhBU0VfTU9WRT1cIm1vdmVcIixQSEFTRV9FTkQ9XCJlbmRcIixQSEFTRV9DQU5DRUw9XCJjYW5jZWxcIixTVVBQT1JUU19UT1VDSD1cIm9udG91Y2hzdGFydFwiaW4gd2luZG93LFNVUFBPUlRTX1BPSU5URVJfSUUxMD13aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQmJiF3aW5kb3cuUG9pbnRlckV2ZW50JiYhU1VQUE9SVFNfVE9VQ0gsU1VQUE9SVFNfUE9JTlRFUj0od2luZG93LlBvaW50ZXJFdmVudHx8d2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSYmIVNVUFBPUlRTX1RPVUNILFBMVUdJTl9OUz1cIlRvdWNoU3dpcGVcIixkZWZhdWx0cz17ZmluZ2VyczoxLHRocmVzaG9sZDo3NSxjYW5jZWxUaHJlc2hvbGQ6bnVsbCxwaW5jaFRocmVzaG9sZDoyMCxtYXhUaW1lVGhyZXNob2xkOm51bGwsZmluZ2VyUmVsZWFzZVRocmVzaG9sZDoyNTAsbG9uZ1RhcFRocmVzaG9sZDo1MDAsZG91YmxlVGFwVGhyZXNob2xkOjIwMCxzd2lwZTpudWxsLHN3aXBlTGVmdDpudWxsLHN3aXBlUmlnaHQ6bnVsbCxzd2lwZVVwOm51bGwsc3dpcGVEb3duOm51bGwsc3dpcGVTdGF0dXM6bnVsbCxwaW5jaEluOm51bGwscGluY2hPdXQ6bnVsbCxwaW5jaFN0YXR1czpudWxsLGNsaWNrOm51bGwsdGFwOm51bGwsZG91YmxlVGFwOm51bGwsbG9uZ1RhcDpudWxsLGhvbGQ6bnVsbCx0cmlnZ2VyT25Ub3VjaEVuZDohMCx0cmlnZ2VyT25Ub3VjaExlYXZlOiExLGFsbG93UGFnZVNjcm9sbDpcImF1dG9cIixmYWxsYmFja1RvTW91c2VFdmVudHM6ITAsZXhjbHVkZWRFbGVtZW50czpcIi5ub1N3aXBlXCIscHJldmVudERlZmF1bHRFdmVudHM6ITB9OyQuZm4uc3dpcGU9ZnVuY3Rpb24obWV0aG9kKXt2YXIgJHRoaXM9JCh0aGlzKSxwbHVnaW49JHRoaXMuZGF0YShQTFVHSU5fTlMpO2lmKHBsdWdpbiYmXCJzdHJpbmdcIj09dHlwZW9mIG1ldGhvZCl7aWYocGx1Z2luW21ldGhvZF0pcmV0dXJuIHBsdWdpblttZXRob2RdLmFwcGx5KHBsdWdpbixBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkpOyQuZXJyb3IoXCJNZXRob2QgXCIrbWV0aG9kK1wiIGRvZXMgbm90IGV4aXN0IG9uIGpRdWVyeS5zd2lwZVwiKX1lbHNlIGlmKHBsdWdpbiYmXCJvYmplY3RcIj09dHlwZW9mIG1ldGhvZClwbHVnaW4ub3B0aW9uLmFwcGx5KHBsdWdpbixhcmd1bWVudHMpO2Vsc2UgaWYoIShwbHVnaW58fFwib2JqZWN0XCIhPXR5cGVvZiBtZXRob2QmJm1ldGhvZCkpcmV0dXJuIGluaXQuYXBwbHkodGhpcyxhcmd1bWVudHMpO3JldHVybiAkdGhpc30sJC5mbi5zd2lwZS52ZXJzaW9uPVZFUlNJT04sJC5mbi5zd2lwZS5kZWZhdWx0cz1kZWZhdWx0cywkLmZuLnN3aXBlLnBoYXNlcz17UEhBU0VfU1RBUlQ6UEhBU0VfU1RBUlQsUEhBU0VfTU9WRTpQSEFTRV9NT1ZFLFBIQVNFX0VORDpQSEFTRV9FTkQsUEhBU0VfQ0FOQ0VMOlBIQVNFX0NBTkNFTH0sJC5mbi5zd2lwZS5kaXJlY3Rpb25zPXtMRUZUOkxFRlQsUklHSFQ6UklHSFQsVVA6VVAsRE9XTjpET1dOLElOOklOLE9VVDpPVVR9LCQuZm4uc3dpcGUucGFnZVNjcm9sbD17Tk9ORTpOT05FLEhPUklaT05UQUw6SE9SSVpPTlRBTCxWRVJUSUNBTDpWRVJUSUNBTCxBVVRPOkFVVE99LCQuZm4uc3dpcGUuZmluZ2Vycz17T05FOjEsVFdPOjIsVEhSRUU6MyxGT1VSOjQsRklWRTo1LEFMTDpBTExfRklOR0VSU319KTtcblxuIiwibGV0IG1hcDtcclxuXHJcbiAgICBERy50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBtYXAgPSBERy5tYXAoJ21hcCcsIHtcclxuICAgICAgICAgICAgY2VudGVyOiBbNTUuNzUyMDA0LCAzNy41NzYxMzNdLFxyXG4gICAgICAgICAgICB6b29tOiAxN1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBteUljb24gPSBERy5pY29uKHtcclxuICAgICAgICAgIGljb25Vcmw6ICcuL2ltZy9tYXAtbWFyay5zdmcnLFxyXG4gICAgICAgICAgaWNvblNpemU6IFs0OCwgNDhdXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgREcubWFya2VyKFs1NS43NTIwMDQsIDM3LjU3NjEzM10sIHtcclxuICAgICAgICBpY29uOiBteUljb25cclxuICAgIH0pLmFkZFRvKG1hcCk7XHJcbiAgfSk7XHJcbiIsImNvbnN0IGJ1cmdlck1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyLW1lbnUnKTtcclxuY29uc3QgbWVudU1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUtbW9kYWwnKTtcclxuY29uc3QgY29tcHV0ZWRTdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKG1lbnVNb2RhbCk7XHJcbmNvbnN0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUtbW9kYWxfX2Nsb3NlJyk7XHJcbmNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud3JhcHBlcicpO1xyXG5cclxuYnVyZ2VyTWVudS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycgLCBlID0+IHtcclxuICAgXHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICBtZW51TW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICB3cmFwcGVyLnN0eWxlLmhlaWdodCA9IGAkezEwMH0lYDtcclxuICBcclxuXHJcbn0pXHJcblxyXG5jbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycgLCBlID0+IHtcclxuXHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICBtZW51TW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxufSkiLCJjb25zdCBzZWN0aW9ucyA9ICQoJ3NlY3Rpb24nKTtcclxuY29uc3QgZGlzcGxheSA9ICQoJy5tYWluY29udGVudCcpO1xyXG5jb25zdCBzaWRlTWVudSA9ICQoJy5maXhlZC1tZW51Jyk7XHJcbmNvbnN0IG1lbnVJdGVtcyA9IHNpZGVNZW51LmZpbmQoJy5maXhlZC1tZW51X19pdGVtJyk7XHJcblxyXG5jb25zdCBtb2JpbGVEZXRlY3QgPSBuZXcgTW9iaWxlRGV0ZWN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcclxuY29uc3QgaXNNb2JpbGUgPSBtb2JpbGVEZXRlY3QubW9iaWxlKCk7XHJcblxyXG5sZXQgaW5TY3JvbGwgPSBmYWxzZTtcclxuXHJcbnNlY3Rpb25zLmZpcnN0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuY29uc3QgY291bnRTZWN0aW9uUG9zaXRpb24gPSBzZWN0aW9uRXEgPT4ge1xyXG4gIFxyXG4gIGNvbnN0IHBvc2l0aW9uID0gc2VjdGlvbkVxICogLTEwMDtcclxuXHJcbiAgaWYoaXNOYU4ocG9zaXRpb24pKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCfQv9C10YDQtdC00LDQvdC+INC90LXQstC10YDQvdC+0LUg0LfQvdCw0YfQtdC90LjQtSDQsiBjb3VudFNlY3Rpb25Qb3NpdGlvbicpO1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG4gIFxyXG4gIHJldHVybiBwb3NpdGlvbjtcclxufTtcclxuXHJcbmNvbnN0IGNoYW5nZU1lbnVUaGVtZSA9IHNlY3Rpb25FcSA9PiB7XHJcblxyXG4gICAgY29uc3QgY3VycmVudFNlY3Rpb24gPSBzZWN0aW9ucy5lcShzZWN0aW9uRXEpO1xyXG4gICAgY29uc3QgbWVudVRoZW1lID0gY3VycmVudFNlY3Rpb24uYXR0cignZGF0YS1tZW51LXRoZW1lJyk7XHJcbiAgICBjb25zdCBhY3RpdmVDbGFzcyA9ICdmaXhlZC1tZW51LS1ibGFjayc7XHJcblxyXG4gICAgaWYgKG1lbnVUaGVtZSA9PT0gJ2JsYWNrJykge1xyXG4gICAgICBzaWRlTWVudS5hZGRDbGFzcyhhY3RpdmVDbGFzcyk7IFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2lkZU1lbnUucmVtb3ZlQ2xhc3MoYWN0aXZlQ2xhc3MpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgcmVzZXRBY3RpdmVDbGFzc0Zvckl0ZW0gPSAoaXRlbXMgLCBpdGVtRXEgLCBhY3RpdmVDbGFzcykgPT4ge1xyXG4gIGl0ZW1zLmVxKGl0ZW1FcSkuYWRkQ2xhc3MoYWN0aXZlQ2xhc3MpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoYWN0aXZlQ2xhc3MpO1xyXG59O1xyXG5cclxuY29uc3QgcGVyZm9ybVRyYW5zaXRpb24gPSAoc2VjdGlvbkVxKSA9PiB7XHJcblxyXG4gIGlmIChpblNjcm9sbCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCB0cmFuc2l0aW9uT3ZlciA9IDEwMDA7XHJcbiAgY29uc3QgbW91c2VJbmVydGlhT3ZlciA9IDMwMDtcclxuICBcclxuICBpblNjcm9sbCA9IHRydWU7XHJcblxyXG4gIGNvbnN0IHBvc2l0aW9uID0gY291bnRTZWN0aW9uUG9zaXRpb24oc2VjdGlvbkVxKTtcclxuXHJcbiAgY2hhbmdlTWVudVRoZW1lKHNlY3Rpb25FcSk7XHJcblxyXG4gIGRpc3BsYXkuY3NzKHtcclxuICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZVkoJHtwb3NpdGlvbn0lKWAsXHJcbiAgfSk7XHJcblxyXG4gIHJlc2V0QWN0aXZlQ2xhc3NGb3JJdGVtKHNlY3Rpb25zICwgc2VjdGlvbkVxICwgJ2FjdGl2ZScpO1xyXG5cclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGluU2Nyb2xsID0gZmFsc2U7XHJcblxyXG4gICAgcmVzZXRBY3RpdmVDbGFzc0Zvckl0ZW0obWVudUl0ZW1zICwgc2VjdGlvbkVxICwgJ2FjdGl2ZScpO1xyXG5cclxuICB9LCB0cmFuc2l0aW9uT3ZlciArIG1vdXNlSW5lcnRpYU92ZXIpXHJcbiAgfTtcclxuXHJcbmNvbnN0IHZpZXdwb3J0U2Nyb2xsZXIgPSAoKSA9PiB7XHJcbiAgY29uc3QgYWN0aXZlU2VjdGlvbiA9IHNlY3Rpb25zLmZpbHRlcignLmFjdGl2ZScpO1xyXG4gIGNvbnN0IG5leHRTZWN0aW9uID0gYWN0aXZlU2VjdGlvbi5uZXh0KCk7XHJcbiAgY29uc3QgcHJldlNlY3Rpb24gPSBhY3RpdmVTZWN0aW9uLnByZXYoKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG5leHQoKSB7XHJcbiAgICAgIGlmIChuZXh0U2VjdGlvbi5sZW5ndGgpIHtcclxuICAgICAgICBwZXJmb3JtVHJhbnNpdGlvbihuZXh0U2VjdGlvbi5pbmRleCgpKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBwcmV2KCkge1xyXG4gICAgICBpZiAocHJldlNlY3Rpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgcGVyZm9ybVRyYW5zaXRpb24ocHJldlNlY3Rpb24uaW5kZXgoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4kKHdpbmRvdykub24oJ3doZWVsJyAsIGUgPT4ge1xyXG4gIGNvbnN0IGRlbHRhWSA9IGUub3JpZ2luYWxFdmVudC5kZWx0YVk7XHJcbiAgY29uc3Qgc2Nyb2xsZXIgPSB2aWV3cG9ydFNjcm9sbGVyKCk7XHJcblxyXG4gIGlmIChkZWx0YVkgPiAwKSB7XHJcbiAgICBzY3JvbGxlci5uZXh0KCk7XHJcbiAgfSBcclxuICBcclxuICBpZiAoZGVsdGFZIDwgMCkge1xyXG4gICAgc2Nyb2xsZXIucHJldigpO1xyXG4gIH1cclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oJ2tleWRvd24nICwgZSA9PiB7XHJcblxyXG4gIGNvbnN0IHRhZ05hbWUgPSBlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgY29uc3QgdXNlclR5cGluZ0luSW5wdXRzID0gdGFnTmFtZSA9PT0gJ2lucHV0JyB8fCB0YWdOYW1lID09PSAndGV4dGFyZWEnIDtcclxuICBjb25zdCBzY3JvbGxlciA9IHZpZXdwb3J0U2Nyb2xsZXIoKTtcclxuXHJcbiAgaWYgKHVzZXJUeXBpbmdJbklucHV0cykgcmV0dXJuO1xyXG4gIFxyXG4gICAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgICAgY2FzZSAzODpcclxuICAgICAgICBzY3JvbGxlci5wcmV2KCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIFxyXG4gICAgICBjYXNlIDQwOlxyXG4gICAgICAgIHNjcm9sbGVyLm5leHQoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoJy53cmFwcGVyJykub24oJ3RvdWNobW92ZScgLCBlID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICB9KVxyXG5cclxuJCgnW2RhdGEtc2Nyb2xsLXRvXScpLm9uKCdjbGljaycgLCBlID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIGNvbnN0ICR0aGlzID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gIGNvbnN0IHRhcmdldCA9ICR0aGlzLmF0dHIoJ2RhdGEtc2Nyb2xsLXRvJyk7XHJcbiAgY29uc3QgcmVxU2VjdGlvbiA9ICQoYFtkYXRhLXNlY3Rpb24taWQ9JHt0YXJnZXR9XWApO1xyXG5cclxuICBwZXJmb3JtVHJhbnNpdGlvbihyZXFTZWN0aW9uLmluZGV4KCkpO1xyXG5cclxufSk7XHJcblxyXG5pZiAoaXNNb2JpbGUpIHtcclxuICAgICQoXCJib2R5XCIpLnN3aXBlKHtcclxuICAgICAgc3dpcGU6ZnVuY3Rpb24oZXZlbnQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbGVyID0gdmlld3BvcnRTY3JvbGxlcigpO1xyXG4gICAgICAgIGxldCBzY3JvbGxEaXJlY3Rpb24gPSAnJztcclxuICBcclxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAndXAnKSBzY3JvbGxEaXJlY3Rpb24gPSAnbmV4dCc7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24nKSBzY3JvbGxEaXJlY3Rpb24gPSAncHJldic7XHJcbiAgICAgICAgc2Nyb2xsZXJbc2Nyb2xsRGlyZWN0aW9uXSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuIiwiY29uc3QgdmlkZW8gPSAkKCcjdmlkZW8nKTtcclxuXHJcbiQoJy5idG5QbGF5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgaWYodmlkZW9bMF0ucGF1c2VkKSB7XHJcbiAgICAgIHZpZGVvWzBdLnBsYXkoKTtcclxuICAgICAgJCgnLnBhdXNlLWljb24nKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgICAgJCgnLnBsYXktaWNvbicpLmNzcygnZGlzcGxheScgLCAnbm9uZScpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgICAgdmlkZW9bMF0ucGF1c2UoKTtcclxuICAgICAgJCgnLnBhdXNlLWljb24nKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgICAkKCcucGxheS1pY29uJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufSk7XHJcblxyXG5jb25zdCBmb3JtYXRUaW1lID0gdGltZVNlYyA9PiB7XHJcbiAgY29uc3Qgcm91bmRUaW1lID0gTWF0aC5yb3VuZCh0aW1lU2VjKTtcclxuICBcclxuICBjb25zdCBtaW51dGVzID0gYWRkWmVybyhNYXRoLmZsb29yKHJvdW5kVGltZSAvIDYwKSk7XHJcbiAgY29uc3Qgc2Vjb25kcyA9IGFkZFplcm8ocm91bmRUaW1lIC0gbWludXRlcyAqIDYwKTtcclxuICBcclxuICBmdW5jdGlvbiBhZGRaZXJvKG51bSkge1xyXG4gICAgcmV0dXJuIG51bSA8IDEwID8gYDAke251bX1gIDogbnVtO1xyXG4gIH1cclxuICBcclxuICByZXR1cm4gYCR7bWludXRlc30gOiAke3NlY29uZHN9YDtcclxuIH07XHJcblxyXG4gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAkKHZpZGVvKS5vbiggXCJ0aW1ldXBkYXRlXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICAkKCcuZHVyYXRpb24nKS50ZXh0KGZvcm1hdFRpbWUodmlkZW9bMF0uZHVyYXRpb24pKTtcclxuICAgIH0pO1xyXG4gICAgdmlkZW8ub24oJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgJCgnLmN1cnJlbnQnKS50ZXh0KGZvcm1hdFRpbWUodmlkZW9bMF0uY3VycmVudFRpbWUpKTtcclxuICAgIH0pO1xyXG59KTtcclxuXHJcblxyXG5cclxudmlkZW8ub24oJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICBjb25zdCBjdXJyZW50UG9zID0gdmlkZW9bMF0uY3VycmVudFRpbWU7IFxyXG4gIGNvbnN0IG1heGR1cmF0aW9uID0gdmlkZW9bMF0uZHVyYXRpb247IFxyXG4gIGNvbnN0IHBlcmNlbnRhZ2UgPSAxMDAgKiBjdXJyZW50UG9zIC8gbWF4ZHVyYXRpb247IFxyXG4gICQoJy50aW1lQmFyJykuY3NzKCd3aWR0aCcsIHBlcmNlbnRhZ2UrJyUnKTtcclxuICAkKCcudGltZUJhcl9fcG9pbnQnKS5jc3MoJ2xlZnQnICwgcGVyY2VudGFnZSAtMSArICclJyk7XHJcblxyXG4gIGlmIChwZXJjZW50YWdlID09PSAxMDApIHtcclxuICAgIHZpZGVvWzBdLnBhdXNlKCk7XHJcbiAgICAgICQoJy5wYXVzZS1pY29uJykuY3NzKCdkaXNwbGF5JyAsICdub25lJyk7XHJcbiAgICAgICQoJy5wbGF5LWljb24nKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICB9XHJcbn0pO1xyXG5cclxubGV0IHRpbWVEcmFnID0gZmFsc2U7ICBcclxuJCgnLnByb2dyZXNzQmFyJykubW91c2Vkb3duKGZ1bmN0aW9uKGUpIHtcclxuICAgIHRpbWVEcmFnID0gdHJ1ZTtcclxuICAgIHVwZGF0ZWJhcihlLnBhZ2VYKTtcclxufSk7XHJcbiQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24oZSkge1xyXG4gICAgaWYodGltZURyYWcpIHtcclxuICAgICAgICB0aW1lRHJhZyA9IGZhbHNlO1xyXG4gICAgICAgIHVwZGF0ZWJhcihlLnBhZ2VYKTtcclxuICAgIH1cclxufSk7XHJcbiQoZG9jdW1lbnQpLm1vdXNlbW92ZShmdW5jdGlvbihlKSB7XHJcbiAgICBpZih0aW1lRHJhZykge1xyXG4gICAgICAgIHVwZGF0ZWJhcihlLnBhZ2VYKTtcclxuICAgIH1cclxufSk7XHJcbiBcclxuY29uc3QgdXBkYXRlYmFyID0gZnVuY3Rpb24oeCkge1xyXG4gICAgY29uc3QgcHJvZ3Jlc3MgPSAkKCcucHJvZ3Jlc3NCYXInKTtcclxuICAgIGNvbnN0IG1heGR1cmF0aW9uID0gdmlkZW9bMF0uZHVyYXRpb247IFxyXG4gICAgY29uc3QgcG9zaXRpb24gPSB4IC0gcHJvZ3Jlc3Mub2Zmc2V0KCkubGVmdDtcclxuICAgIGxldCBwZXJjZW50YWdlID0gMTAwICogcG9zaXRpb24gLyBwcm9ncmVzcy53aWR0aCgpO1xyXG4gXHJcbiAgICBpZiAocGVyY2VudGFnZSA+IDEwMCkge1xyXG4gICAgICAgIHBlcmNlbnRhZ2UgPSAxMDA7XHJcbiAgICB9XHJcbiAgICBpZiAocGVyY2VudGFnZSA8IDApIHtcclxuICAgICAgICBwZXJjZW50YWdlID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAkKCcudGltZUJhcicpLmNzcygnd2lkdGgnLCBwZXJjZW50YWdlKyclJyk7XHJcbiAgICB2aWRlb1swXS5jdXJyZW50VGltZSA9IG1heGR1cmF0aW9uICogcGVyY2VudGFnZSAvIDEwMDtcclxufTsgIiwiXHJcbmNvbnN0IG1lYXN1cmVXaWR0aCA9IGl0ZW0gPT4ge1xyXG5cclxuICBsZXQgcmVxSXRlbVdpZHRoID0gMDtcclxuXHJcbiAgY29uc3Qgc2NyZWVuV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICBjb25zdCBjb250YWluZXIgPSBpdGVtLmNsb3Nlc3QoJy5wcm9kdWN0cy1tZW51Jyk7XHJcbiAgY29uc3QgbWVudUl0ZW1zID0gY29udGFpbmVyLmZpbmQoJy5wcm9kdWN0cy1tZW51X19pdGVtJyk7XHJcbiAgY29uc3QgbWVudUl0ZW1zV2lkdGggPSBtZW51SXRlbXMud2lkdGgoKSAqIG1lbnVJdGVtcy5sZW5ndGg7XHJcblxyXG4gIGNvbnN0IHRleHRDb250YWluZXIgPSBpdGVtLmZpbmQoJy5wcm9kdWN0cy1tZW51X19jb250YWluZXInKTtcclxuICBjb25zdCBwYWRkaW5nTGVmdCA9IHBhcnNlSW50KHRleHRDb250YWluZXIuY3NzKCdwYWRkaW5nLWxlZnQnKSk7XHJcbiAgY29uc3QgcGFkZGluZ1JpZ2h0ID0gcGFyc2VJbnQodGV4dENvbnRhaW5lci5jc3MoJ3BhZGRpbmctcmlnaHQnKSk7XHJcblxyXG5cclxuICBjb25zdCBpc1RhYmxldCA9IHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLm1hdGNoZXM7XHJcbiAgXHJcbiAgaWYgKGlzVGFibGV0KSB7XHJcbiAgICBcclxuICAgIHJlcUl0ZW1XaWR0aCA9IHNjcmVlbldpZHRoIC0gbWVudUl0ZW1zV2lkdGg7XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICBcclxuICAgIHJlcUl0ZW1XaWR0aCA9IDUwMDtcclxuICBcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBjb250YWluZXI6IHJlcUl0ZW1XaWR0aCxcclxuICAgIHRleHRDb250YWluZXI6IHJlcUl0ZW1XaWR0aCAtIHBhZGRpbmdMZWZ0IC0gcGFkZGluZ1JpZ2h0XHJcbiAgfTsgXHJcbn07IFxyXG5cclxuXHJcbmNvbnN0IGZvbGRFdmVyeUl0ZW0gPSBjb250YWluZXIgPT4ge1xyXG4gIGNvbnN0IGl0ZW1zID0gY29udGFpbmVyLmZpbmQoJy5wcm9kdWN0cy1tZW51X19pdGVtJyk7XHJcbiAgY29uc3QgY29udGVudCA9IGNvbnRhaW5lci5maW5kKCcucHJvZHVjdHMtbWVudV9fY29udGVudCcpO1xyXG4gIFxyXG4gIGl0ZW1zLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICBjb250ZW50LndpZHRoKDApO1xyXG59XHJcblxyXG5jb25zdCB1bmZvbGRJdGVtID0gaXRlbSA9PiB7XHJcbiAgY29uc3QgaGlkZGVuQ29udGVudCA9IGl0ZW0uZmluZCgnLnByb2R1Y3RzLW1lbnVfX2NvbnRlbnQnKTtcclxuICBjb25zdCByZXFXaWR0aCA9IG1lYXN1cmVXaWR0aChoaWRkZW5Db250ZW50KTtcclxuICBjb25zdCB0ZXh0QmxvY2sgPSBpdGVtLmZpbmQoJy5wcm9kdWN0cy1tZW51X19jb250YWluZXInKTtcclxuXHJcbiAgaXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgaGlkZGVuQ29udGVudC53aWR0aChyZXFXaWR0aC5jb250YWluZXIpO1xyXG4gIHRleHRCbG9jay53aWR0aChyZXFXaWR0aC50ZXh0Q29udGFpbmVyKTtcclxuICBcclxuXHJcbn1cclxuXHJcbiQoJy5wcm9kdWN0cy1tZW51X190aXRsZScpLm9uKCdjbGljaycgLCBlID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIGNvbnN0ICR0aGlzID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gIGNvbnN0IGl0ZW0gPSAkdGhpcy5jbG9zZXN0KCcucHJvZHVjdHMtbWVudV9faXRlbScpO1xyXG4gIGNvbnN0IGl0ZW1PcGVuZWQgPSBpdGVtLmhhc0NsYXNzKCdhY3RpdmUnKTtcclxuICBjb25zdCBjb250YWluZXIgPSAkdGhpcy5jbG9zZXN0KCcucHJvZHVjdHMtbWVudScpO1xyXG5cclxuICBpZiAoaXRlbU9wZW5lZCkge1xyXG4gICAgXHJcbiAgICBmb2xkRXZlcnlJdGVtKGNvbnRhaW5lcik7XHJcbiAgXHJcbiAgfSBlbHNlIHtcclxuICAgIFxyXG4gICAgZm9sZEV2ZXJ5SXRlbShjb250YWluZXIpO1xyXG4gICAgdW5mb2xkSXRlbShpdGVtKTtcclxuICBcclxuICB9XHJcbn0pXHJcbiIsImNvbnN0IGZpbmRCbG9ja0J5QWxpYXMgPSBhbGlhcyA9PiB7XHJcbiAgcmV0dXJuICQoJy5yZXZpZXcnKS5maWx0ZXIoKG5keCAsIGl0ZW0pID0+IHtcclxuICAgIHJldHVybiAkKGl0ZW0pLmF0dHIoJ2RhdGEtbGlua2VkLXdpdGgnKSA9PT0gYWxpYXNcclxuICB9KVxyXG59XHJcblxyXG4kKCcuaW50ZXJhY3RpdmUtYXZhdGFyX19saW5rJykuY2xpY2soZSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICBjb25zdCAkdGhpcyA9ICQoZS5jdXJyZW50VGFyZ2V0KTtcclxuICBjb25zdCB0YXJnZXQgPSAkdGhpcy5hdHRyKCdkYXRhLW9wZW4nKTtcclxuICBjb25zdCBpdGVtVG9TaG93ID0gZmluZEJsb2NrQnlBbGlhcyh0YXJnZXQpO1xyXG4gIGNvbnN0IGN1ckl0ZW0gPSAkdGhpcy5jbG9zZXN0KCcucmV2aWV3c19fc3dpdGNoZXItZWxlbScpO1xyXG4gIFxyXG4gIGl0ZW1Ub1Nob3cuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gIGN1ckl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG59KSIsImNvbnN0IHNsaWRlciA9ICQoXCIucHJvZHVjdHNcIikuYnhTbGlkZXIoe1xyXG4gIHBhZ2VyOiBmYWxzZSxcclxuICBjb250cm9sczogZmFsc2VcclxufSk7XHJcblxyXG4kKCcucHJvZHVjdC1zbGlkZXJfX2Fycm93LS1wcmV2JykuY2xpY2sgKGUgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICBzbGlkZXIuZ29Ub1ByZXZTbGlkZSgpO1xyXG59KVxyXG5cclxuJCgnLnByb2R1Y3Qtc2xpZGVyX19hcnJvdy0tbmV4dCcpLmNsaWNrIChlID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgc2xpZGVyLmdvVG9OZXh0U2xpZGUoKTtcclxufSkiLCIgIGNvbnN0IG9wZW5JdGVtID0gaXRlbSA9PiB7XHJcbiAgXHJcbiAgY29uc3QgbWVtYmVyQ2FyZCA9IGl0ZW0uY2xvc2VzdCgnLnRlYW1fX2l0ZW0nKTtcclxuICBjb25zdCBkZXRhaWxzV2luZG93ID0gbWVtYmVyQ2FyZC5maW5kKCcuZGV0YWlsc19fd2luZG93Jyk7XHJcbiAgY29uc3QgYXJyb3cgPSBtZW1iZXJDYXJkLmZpbmQoJy5kZXRhaWxzX19pY29uJyk7XHJcbiAgY29uc3QgYXJyb3dJY29uQWN0aXZlID0gbWVtYmVyQ2FyZC5maW5kKCcuYXJyb3ctdW5mb2xkLS1hY3RpdmUnKTtcclxuICBjb25zdCBhcnJvd0ljb24gPSBtZW1iZXJDYXJkLmZpbmQoJy5hcnJvdy11bmZvbGQnKTtcclxuICBjb25zdCBtZW1iZXJJbWcgPSBtZW1iZXJDYXJkLmZpbmQoJy5tZW1iZXJfX2ltZycpO1xyXG4gIGNvbnN0IG1lbWJlckluZm9OYW1lID0gbWVtYmVyQ2FyZC5maW5kKCcuZGV0YWlscycpXHJcbiAgY29uc3QgbWVtYmVySW1nQ2xvbmUgPSBtZW1iZXJJbWcuY2xvbmUoKTtcclxuXHJcbiAgbWVtYmVySW1nQ2xvbmUucmVtb3ZlQ2xhc3MoJ21lbWJlcl9faW1nJykuYWRkQ2xhc3MoJ21lbWJlcl9faW1nLXRhYmxldCcpO1xyXG4gICQobWVtYmVySW5mb05hbWUpLmFmdGVyKG1lbWJlckltZ0Nsb25lKTtcclxuXHJcbiAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IDc2OCkge1xyXG4gICAgbWVtYmVySW1nQ2xvbmUuY3NzKCdkaXNwbGF5JyAsICdmbGV4Jyk7XHJcbiAgfVxyXG5cclxuICBtZW1iZXJDYXJkLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICBkZXRhaWxzV2luZG93LnNsaWRlVG9nZ2xlKCk7XHJcbiAgYXJyb3cuYWRkQ2xhc3MoJ2Fycm93LWFjdGl2ZScpO1xyXG4gIFxyXG4gIGlmIChhcnJvdy5oYXNDbGFzcygnYXJyb3ctYWN0aXZlJykpIHtcclxuICAgIGFycm93SWNvbkFjdGl2ZS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICAgIGFycm93SWNvbi5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gIH1cclxuICBcclxufVxyXG5cclxuXHJcbmNvbnN0IGNsb3NlRXZlcnlJdGVtID0gbWVtYmVyQ2FyZCA9PiB7XHJcblxyXG4gIGNvbnN0IGl0ZW1zID0gbWVtYmVyQ2FyZC5maW5kKCcuZGV0YWlsc19fd2luZG93Jyk7XHJcbiAgY29uc3QgaW1ncyA9IG1lbWJlckNhcmQuZmluZCgnLm1lbWJlcl9faW1nLXRhYmxldCcpO1xyXG4gIGNvbnN0IGl0ZW1Db250YWluZXIgPSBtZW1iZXJDYXJkLmZpbmQoJy50ZWFtX19pdGVtJyk7XHJcbiAgY29uc3QgYXJyb3cgPSBtZW1iZXJDYXJkLmZpbmQoJy5kZXRhaWxzX19pY29uJyk7XHJcblxyXG4gIGl0ZW1Db250YWluZXIucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgaXRlbXMuY3NzKCdkaXNwbGF5JyAsICdub25lJyk7XHJcbiAgaW1ncy5jc3MoJ2Rpc3BsYXknICwgJ25vbmUnKTtcclxuICBcclxuICBpZiAoYXJyb3cuaGFzQ2xhc3MoJ2Fycm93LWFjdGl2ZScpKSB7XHJcbiAgICBhcnJvdy5yZW1vdmVDbGFzcygnYXJyb3ctYWN0aXZlJyk7XHJcbiAgfVxyXG4gIFxyXG59XHJcblxyXG5cclxuJCgnLm1lbWJlcl9fZGV0YWlscy1idXR0b24nKS5jbGljayhlID0+IHtcclxuXHJcbiAgY29uc3QgJHRoaXMgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgY29uc3QgbWVtYmVyQ2FyZCA9ICR0aGlzLmNsb3Nlc3QoJy50ZWFtX19saXN0Jyk7XHJcbiAgY29uc3QgaXRlbUNvbnRhaW5lciA9ICR0aGlzLmNsb3Nlc3QoJy50ZWFtX19pdGVtJyk7XHJcbiAgY29uc3QgZGV0YWlsc1dpbmRvdyA9IG1lbWJlckNhcmQuZmluZCgnLmRldGFpbHNfX3dpbmRvdycpO1xyXG4gIGNvbnN0IGFycm93ID0gbWVtYmVyQ2FyZC5maW5kKCcuZGV0YWlsc19faWNvbicpO1xyXG4gIGNvbnN0IGFycm93SWNvbkFjdGl2ZSA9IG1lbWJlckNhcmQuZmluZCgnLmFycm93LXVuZm9sZC0tYWN0aXZlJyk7XHJcbiAgY29uc3QgYXJyb3dJY29uID0gbWVtYmVyQ2FyZC5maW5kKCcuYXJyb3ctdW5mb2xkJyk7XHJcbiAgY29uc3QgbWVtYmVySW1nQ2xvbmUgPSBtZW1iZXJDYXJkLmZpbmQoJy5tZW1iZXJfX2ltZy10YWJsZXQnKTtcclxuICBjb25zdCBtZW1iZXJJbWdDbG9uZURpc3BsYXkgPSBtZW1iZXJJbWdDbG9uZS5jc3MoJ2Rpc3BsYXknKTtcclxuXHJcbiAgaWYgKGl0ZW1Db250YWluZXIuaGFzQ2xhc3MoJ2FjdGl2ZScpICYmIGFycm93Lmhhc0NsYXNzKCdhcnJvdy1hY3RpdmUnKSkge1xyXG4gICAgZGV0YWlsc1dpbmRvdy5jc3MoJ2Rpc3BsYXknICwgJ25vbmUnKTtcclxuICAgIGFycm93LnJlbW92ZUNsYXNzKCdhcnJvdy1hY3RpdmUnKTtcclxuICAgIG1lbWJlckltZ0Nsb25lLnJlbW92ZSgpO1xyXG4gICAgYXJyb3dJY29uQWN0aXZlLmNzcygnZGlzcGxheScsJ25vbmUnKTtcclxuICAgIGFycm93SWNvbi5jc3MoJ2Rpc3BsYXknLCdibG9jaycpO1xyXG5cclxuICB9IGVsc2Uge1xyXG4gICAgY2xvc2VFdmVyeUl0ZW0obWVtYmVyQ2FyZCk7XHJcbiAgICBvcGVuSXRlbSgkdGhpcyk7XHJcbiAgfVxyXG59KVxyXG5cclxuIl19
