const slider = document.querySelector('.slider__line');
const sliderRow = document.querySelector('.slider__row');
const next = document.querySelector('.slider__button_next');
const prev = document.querySelector('.slider__button_prev');

console.log(111

)
let numberOfClick = 0;

window.addEventListener('resize', resetSlider);

function getWidthPerClick () {
    let visibleWidth = sliderRow.offsetWidth - 164;
    const totalWidth = slider.offsetWidth;

    let widthPerClick;

    if (window.innerWidth <= 768) {
        
        visibleWidth = sliderRow.offsetWidth - 16;
        widthPerClick = (totalWidth - visibleWidth) / 6;
        return widthPerClick;
    }

    widthPerClick = (totalWidth - visibleWidth) / 3;

    return widthPerClick;
}

function rollSlider () {
    const widthPerClick = getWidthPerClick();
    console.log(`widthPerClick: ${widthPerClick}`);
    slider.style.transform = 'translateX(-' + widthPerClick * numberOfClick + 'px';
}

function resetSlider () {
    slider.style.transform = 'translateX(0)';
    numberOfClick = 0;

    prev.setAttribute('disabled', '');
    prev.classList.add('button_inactive');

    next.classList.remove('button_inactive');
    next.removeAttribute('disabled');
}

next.addEventListener('click', () => {
    prev.classList.remove('button_inactive');
    prev.removeAttribute('disabled');

    if (window.innerWidth <= 768) {
        numberOfClick++;
        
        if (numberOfClick >= 6) {
            
            next.setAttribute('disabled', '');
            next.classList.add('button_inactive');
        }
        
        rollSlider();
        
       
    } else {
        numberOfClick++;

        if (numberOfClick >= 3) {
            next.setAttribute('disabled', '');
            next.classList.add('button_inactive');
        }
        
        rollSlider();
        
    }
});

prev.addEventListener('click', () => {
    numberOfClick--;

    next.classList.remove('button_inactive');
    next.removeAttribute('disabled');
    
    if (numberOfClick <= 0) {
        numberOfClick = 0;
        prev.setAttribute('disabled', '');
        prev.classList.add('button_inactive');
    }
    rollSlider();   
})