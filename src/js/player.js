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