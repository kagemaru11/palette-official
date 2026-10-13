$(function () {
  /*=================================================
  ローディング画面
  ===================================================*/

  const loader = document.querySelector("#loader");

  if (loader) {
    const startTime = performance.now();
    const minimumDisplayTime = 1800;
    let isFinishing = false;

    function finishLoader() {
      if (isFinishing) return;
      isFinishing = true;

      const elapsed = performance.now() - startTime;
      const waitTime = Math.max(0, minimumDisplayTime - elapsed);

      setTimeout(() => {
        loader.classList.add("is-complete");

        setTimeout(() => {
          loader.classList.add("is-hidden");
        }, 400);
      }, waitTime);
    }

    window.addEventListener("load", finishLoader, { once: true });
    setTimeout(finishLoader, 8000);
  }

  /*=================================================
  ハンバーガーメニュー
  ===================================================*/

  $(".toggle__btn").on("click", function () {
    $("header").toggleClass("open");
  });

  $(".slick__list").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "10%",
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "14%",
        },
      },
    ],
  });

  // today-schedule
  const today = new Date();

  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const day = weekdays[today.getDay()];

  document.querySelector(".today-schedule__date-number").textContent =
    `${month}.${date}`;

  document.querySelector(".today-schedule__day").textContent = day;

  /*=================================================
  スクロール時の画像フェード表示
  ===================================================*/
  // スクロール時のイベント
  $(window).scroll(function () {
    // fadeinクラスに対して順に処理を行う
    $(".fadein").each(function () {
      // スクロールした距離
      let scroll = $(window).scrollTop();
      // fadeinクラスの要素までの距離
      let target = $(this).offset().top;
      // 画面の高さ
      let windowHeight = $(window).height();
      // fadeinクラスの要素が画面下にきてから200px通過した
      // したタイミングで要素を表示
      if (scroll > target - windowHeight + 200) {
        $(this).css("opacity", "1");
        $(this).css("transform", "translateY(0)");
      }
    });
  });

  /*=================================================
  スムーススクロール
  ===================================================*/
  $('a[href^="#"]').click(function () {
    $("header").removeClass("open");

    let href = $(this).attr("href");
    let target = $(href == "#" || href == "" ? "html" : href);

    const headerHeight = $(".header").outerHeight();
    let position = target.offset().top - headerHeight;

    $("html, body").animate(
      {
        scrollTop: position,
      },
      1000,
      "swing",
    );

    return false;
  });

  /*=================================================
  トップに戻る
  ===================================================*/
  const $pagetop = $(".pagetop");

  $pagetop.hide();

  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 700) {
      $pagetop.fadeIn();
    } else {
      $pagetop.fadeOut();
    }
  });

  $pagetop.on("click", function (event) {
    event.preventDefault();

    $("html, body").animate({ scrollTop: 0 }, 500);
  });

  /*=================================================
  カーソルフレーク
  ===================================================*/

  (() => {
    // 動きを減らす設定の利用者には、フレークを表示しない
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let previousX = null;
    let previousY = null;
    let activeFlakes = 0;

    const maxFlakes = 36;
    const colors = ["#c9c9f5", "#a9c7ef", "#f5d5e5", "#f5e7b0"];

    window.addEventListener(
      "pointermove",
      (event) => {
        // タッチ操作では生成しない
        if (event.pointerType === "touch") return;

        if (previousX !== null) {
          const distance = Math.hypot(
            event.clientX - previousX,
            event.clientY - previousY,
          );

          // カーソルが7px進むごとにフレークを生成
          if (distance < 10 || activeFlakes >= maxFlakes) return;
        }

        previousX = event.clientX;
        previousY = event.clientY;
        activeFlakes += 1;

        const flake = document.createElement("span");
        flake.className = "cursor-flake";
        flake.setAttribute("aria-hidden", "true");

        flake.style.left = `${event.clientX}px`;
        flake.style.top = `${event.clientY}px`;
        flake.style.setProperty("--flake-size", `${10 + Math.random() * 8}px`);
        flake.style.setProperty(
          "--flake-color",
          colors[Math.floor(Math.random() * colors.length)],
        );
        flake.style.setProperty("--flake-x", `${(Math.random() - 0.5) * 40}px`);
        flake.style.setProperty("--flake-y", `${15 + Math.random() * 40}px`);

        document.body.appendChild(flake);

        setTimeout(() => {
          flake.remove();
          activeFlakes -= 1;
        }, 1250);
      },
      { passive: true },
    );
  })();
});
