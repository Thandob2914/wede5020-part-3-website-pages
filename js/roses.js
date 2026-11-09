document.addEventListener("DOMContentLoaded", function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  // Creates a background of animated roses and shimmering sparkles
  var ROSE_COUNT_DESKTOP = 14;
  var ROSE_COUNT_MOBILE = 6;
  var SHIMMER_COUNT_DESKTOP = 32;
  var SHIMMER_COUNT_MOBILE = 14;
  var MIN_SIZE = 28;
  var MAX_SIZE = 64;
  var MIN_SPEED = 16;
  var MAX_SPEED = 30;
  var MIN_OPACITY = 0.25;
  var MAX_OPACITY = 0.55;

  var container = document.getElementById("bgRoseContainer");
  if (!container) {
    return;
  }
   // Determines the number of roses and shimmers based on the screen width
  var count = window.innerWidth < 600 ? ROSE_COUNT_MOBILE : ROSE_COUNT_DESKTOP;
  var shimmerCount = window.innerWidth < 600 ? SHIMMER_COUNT_MOBILE : SHIMMER_COUNT_DESKTOP;

  for (var i = 0; i < count; i++) {
    var rose = document.createElement("div");
    var size = random(MIN_SIZE, MAX_SIZE);
    var duration = random(MIN_SPEED, MAX_SPEED);
    // Sets the rose's class and styles for position, size, duration, delay, opacity, and sway
    rose.className = "gold-rose";
    rose.style.left = random(0, 95) + "%";
    rose.style.setProperty("--rose-size", size + "px");
    rose.style.setProperty("--rose-duration", duration + "s");
    rose.style.setProperty("--rose-delay", "-" + random(0, duration) + "s");
    rose.style.setProperty("--rose-opacity", random(MIN_OPACITY, MAX_OPACITY).toFixed(2));
    rose.style.setProperty("--rose-sway", random(-80, 80) + "px");

    container.appendChild(rose);
  }
  // Creates shimmering sparkles with random positions, sizes, durations, and delays
  for (var j = 0; j < shimmerCount; j++) {
    var shimmer = document.createElement("span");
    var shimmerDuration = random(2, 5);

    shimmer.className = "rose-shimmer";
    shimmer.style.left = random(0, 100) + "%";
    shimmer.style.top = random(0, 100) + "%";
    shimmer.style.setProperty("--sparkle-size", random(2, 4) + "px");
    shimmer.style.setProperty("--sparkle-duration", shimmerDuration + "s");
    shimmer.style.setProperty("--sparkle-delay", "-" + random(0, shimmerDuration) + "s");

    container.appendChild(shimmer);
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }
});
