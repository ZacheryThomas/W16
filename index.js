let currentActive = undefined

for(let num in $('li')){
    jqEle = $('li').eq(num)
    if (jqEle.hasClass('active')){
        currentActive = jqEle
        console.log(currentActive)
    }
}

$('li').click(function(){
    currentActive.removeClass('active')
    currentActive = $(this)
    currentActive.addClass('active')
})