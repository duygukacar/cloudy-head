import randomColor from 'randomcolor';
import 'gsap';

function renderIntro() {
  var logotype = document.querySelector('.js-logotype');
  var logomark = document.querySelector('.js-logomark');
  var logoNodes = logomark.childNodes;
  var tl = new TimelineMax();
  var shapes = [];

  for (var i in logoNodes) {
    var n = logoNodes[i];
    if (n.attributes) {
      shapes.push(n);
    };
  };

  var backgrounds = randomColor({
    count: shapes.length,
    luminosity: 'light'
  });

  for (var i in shapes) {
    var shape = shapes[i];
    shape.setAttribute('fill', backgrounds[i]);
  };

  tl.staggerTo(
    shapes, 1, {
      delay: 0.25,
      opacity: 0.75,
      ease: Elastic.easeOut
    }, 0.05
  );

  var tween = TweenMax.to(
    logotype, 1, {
      delay: 0.5,
      opacity: 1,
      y: 0,
      ease: Elastic.easeOut
    }, 0.05
  );
};

document.addEventListener("DOMContentLoaded", function(event) {
  renderIntro();
});
