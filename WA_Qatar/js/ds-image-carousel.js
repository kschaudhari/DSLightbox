function setImageCarousel(imageContainer, bulletContainer, nextButton, prevButton)
{
    var images = $(imageContainer).find(".image-item");
    
    if (images.length <= 1)
    {
        $(bulletContainer).closest(".image-carousel-controls").hide();
        return;
    }
    $(bulletContainer).closest(".image-carousel-controls").show();
    $(bulletContainer).html('');
    for(var index = 0; index < images.length; index++)
    {
        $(bulletContainer).append("<span class='carousel-bullet-item'></span>");
    }

    $(nextButton).off("click");
    $(nextButton).click(function (e) {
        var index = $(imageContainer).find(".image-item.current").index();
        index += 1;
        if (index >= images.length)
            index = 0;
        setActiveImage(imageContainer, bulletContainer, index);
    });

    $(prevButton).off("click");
    $(prevButton).click(function (e) {
        var index = $(imageContainer).find(".image-item.current").index();
        index -= 1;
        if (index < 0)
            index = images.length - 1;
        setActiveImage(imageContainer, bulletContainer, index);
    });

    $(bulletContainer).find(".carousel-bullet-item").click(function (e) {
        var $this = $(this);
        if ($this.hasClass("current"))
            return;
        setActiveImage(imageContainer, bulletContainer, $this.index());
    });
    setActiveImage(imageContainer, bulletContainer, 0);
}

function setActiveImage(imageContainer, bulletContainer, imageIndex)
{
    var $images = $(imageContainer).find(".image-item");
    $current = $images.eq(imageIndex);
    $images.fadeOut();
    $images.removeClass("current");
    $current.addClass("current");
    $current.stop().fadeIn();

    $bullets = $(bulletContainer).find('.carousel-bullet-item');
    $currentBullet = $bullets.eq(imageIndex);
    $bullets.removeClass("current");
    $currentBullet.addClass("current");

}