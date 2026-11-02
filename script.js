(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Split the company name into letters so each one can bounce
  var brand = document.getElementById("brand");
  var text = brand.textContent.trim();
  brand.textContent = "";
  text.split("").forEach(function (ch, i) {
    var span = document.createElement("span");
    span.textContent = ch;
    span.style.setProperty("--i", i);
    span.setAttribute("aria-hidden", "true");
    brand.appendChild(span);
  });

  // 1b. Fit the whole scene on narrow / tall screens instead of cropping the sides
  var scene = document.getElementById("scene");
  function fitScene() {
    var ratio = window.innerWidth / window.innerHeight;
    var compact = ratio < 1.55;
    scene.setAttribute("viewBox", compact ? "100 0 1000 600" : "0 0 1200 600");
    scene.setAttribute("preserveAspectRatio", compact ? "xMidYMax meet" : "xMidYMax slice");
  }
  fitScene();
  window.addEventListener("resize", fitScene);

  // 2. Click / tap a character and it hops
  document.querySelectorAll("[data-hop]").forEach(function (char) {
    var hopper = char.querySelector(".hopper");
    char.addEventListener("click", function () {
      hopper.classList.remove("hop");
      void hopper.getBoundingClientRect(); // restart animation
      hopper.classList.add("hop");
    });
    hopper.addEventListener("animationend", function (e) {
      if (e.animationName === "hop") hopper.classList.remove("hop");
    });
  });

  // 3. Soft parallax on the clouds
  var clouds = document.getElementById("clouds");
  if (!reduce) {
    window.addEventListener("pointermove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 24;
      var y = (e.clientY / window.innerHeight - 0.5) * 12;
      clouds.style.setProperty("--px", x.toFixed(1) + "px");
      clouds.style.setProperty("--py", y.toFixed(1) + "px");
    });
  }

  // 4. Gently falling leaves (mostly green, with a few colourful ones)
  var leaves = document.getElementById("leaves");
  var palette = ["#58b226", "#58b226", "#7bd13f", "#7bd13f", "#29a3e0", "#ffc93c", "#ff8a3d"];
  function spawnLeaf() {
    var leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.left = Math.random() * 100 + "vw";
    leaf.style.setProperty("--s", 9 + Math.random() * 12 + "px");
    leaf.style.setProperty("--d", 8 + Math.random() * 7 + "s");
    leaf.style.setProperty("--c", palette[Math.floor(Math.random() * palette.length)]);
    leaves.appendChild(leaf);
    leaf.addEventListener("animationend", function () { leaf.remove(); });
  }
  if (!reduce) {
    for (var i = 0; i < 4; i++) setTimeout(spawnLeaf, i * 600);
    setInterval(spawnLeaf, 1800);
  }
})();
