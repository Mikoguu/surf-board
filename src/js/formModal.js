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

