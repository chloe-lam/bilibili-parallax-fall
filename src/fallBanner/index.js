import React, { useEffect, useRef } from "react";
import fairy from "../assets/banner/fairy.png";
import hill from "../assets/banner/hill.png";
import girlEyeOpen from "../assets/banner/girl-eye-open.png";
import girlNapping from "../assets/banner/girl-eye-napping.png";
import girlClosed from "../assets/banner/girl-eye-closed.png";
import leaf from "../assets/banner/leaf.png";
import foreground from "../assets/banner/foreground.png";
import background from "../assets/banner/background.png";
import logo from "../assets/banner/logo.png";
import "./fall.scss";

function FallBanner() {
  const animateBanner = useRef(null);
  const animateGirl = useRef(null);
  const initConfig = [
    {
      aspect: 1,
      blur: 4,
      x: 0,
      y: 0,
      rotate: 0,
      blurEffect: (blur, p) => blur + p * blur,
      parallaxX: (x, p) => x,
    },
    {
      aspect: 0.6,
      blur: 0,
      x: 0,
      y: 0,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(p * 10),
      parallaxX: (x, p) => (x || 0) - p * 10,
    },
    {
      aspect: 1,
      blur: 1,
      x: -50,
      y: 0,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(blur - p * 4),
      parallaxX: (x, p) => (x || 0) - p * 30,
    },
    {
      aspect: 0.6,
      blur: 4,
      x: 0,
      y: 4.2,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(blur - p * 8),
      parallaxX: (x, p) => (x || 0) - p * 45,
    },
    {
      aspect: 0.6,
      blur: 5,
      x: 0,
      y: -1.8,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(blur - p * 8),
      parallaxX: (x, p) => (x || 0) - p * 95,
    },
    {
      aspect: 0.65,
      blur: 6,
      x: 0,
      y: 0,
      rotate: 0,
      blurEffect: (blur, p) => Math.abs(blur - p * 4),
      parallaxX: (x, p) => x || 0 - p * 118,
    },
  ];
  const endpoint = { width: 0, x: 0 };

  const breakpoint = 1658;

  useEffect(() => {
    InitBannerImages(animateBanner);
    /**
     * Event Resize
     */
    window.addEventListener(
      "resize",
      () => {
        InitBannerImages(animateBanner);
      },
      false
    );
    if (animateBanner.current) {
      /**
       * Event mouseenter
       */
      animateBanner.current.addEventListener(
        "mouseenter",
        (event) => {
          const { width } = animateBanner.current.getBoundingClientRect();
          endpoint.x = event.clientX;
          endpoint.width = width;
        },
        false
      );
      /**
       * Event mousemove
       */
      animateBanner.current.addEventListener(
        "mousemove",
        (event) => {
          const parallax = event.clientX - endpoint.x;
          const parallaxRatio = parallax / endpoint.width;
          InitBannerImages(animateBanner, parallaxRatio);
        },
        false
      );
      /**
       * Event mouseout
       */
      animateBanner.current.addEventListener(
        "mouseout",
        (event) => {
          resetBannerImagesEffect(animateBanner);
        },
        false
      );
    }
  });
  const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };
  /**
   * Function makeBlink
   * @author Chloe Lam
   * @description using SetTimeout to make the girl blink the eyes continuously
   */
  const makeBlink = async () => {
    if (animateGirl.current) {
      const img = animateGirl.current.childNodes[0];
      await sleep(50);
      img.src = girlNapping;
      await sleep(50);
      img.src = girlClosed;
      await sleep(350);
      img.src = girlEyeOpen;
      setTimeout(makeBlink, 5000);
    }
  };
  setTimeout(makeBlink, 5000);
  /**
   * Function movementTemplate
   * @author Chloe Lam
   * @description using string template to make css3 template
   * @param {number} blur default 0
   * @param {number} x default 0
   * @param {number} y default 0
   * @param {number} rotate default 0
   * @param {boolean} isReset default false
   * @returns {object}
   */
  const movementTemplate = (
    blur = 0,
    x = 0,
    y = 0,
    rotate = 0,
    isReset = false
  ) => {
    return `filter: blur(${blur}px); transition-duration:${
      isReset ? "0.2s" : "0s"
    }; transform:translate(${x}px, ${y}px) rotate(${rotate}deg) translateZ(0);`;
  };

  /**
   * Function initEffect
   * @author Chloe Lam
   * @description the initiate function css3 template
   * @param {number} key - the element index
   * @param {number} isReset - reset switch
   * @returns {object}
   */
  const initEffect = (key, isReset) => {
    return movementTemplate(
      initConfig[key].blur,
      initConfig[key].x,
      initConfig[key].y,
      initConfig[key].rotate,
      isReset
    );
  };
  /**
   * Function InitBannerImages
   * @author Chloe Lam
   * @description boot up all elements image by logic.
   * @param {object} banner - the element index
   * @param {number} parallax - parallax px
   */
  const InitBannerImages = (banner, parallax) => {
    const bannerRect = banner.current.getBoundingClientRect();
    if (banner.current.childNodes && banner.current.childNodes.length > 0) {
      Array.from(banner.current.childNodes).forEach((item, key) => {
        const img = item.childNodes[0];
        if (bannerRect.width < breakpoint) {
          initRectSmallScreen(key, img, bannerRect);
        } else {
          initRectNormalScreen(key, img, bannerRect);
        }
        if (parallax) {
          makeBlurMoveEffect(img, key, parallax);
        }
      });
    }
  };
  /**
   * Function resetBannerImagesEffect
   * @author Chloe Lam
   * @description reset banner effect
   * @param {object} banner - the element index
   */
  const resetBannerImagesEffect = (banner) => {
    endpoint.width = 0;
    endpoint.x = 0;

    if (banner.current.childNodes && banner.current.childNodes.length > 0) {
      Array.from(banner.current.childNodes).forEach((item, key) => {
        const img = item.childNodes[0];
        img.style = initEffect(key, true);
      });
    }
  };
  /**
   * Function makeBlurMoveEffect
   * @author Chloe Lam
   * @description A function for make blur and moving effect by css3
   * @param {object} img - the element image
   * @param {number} key - the image index
   * @param {number} parallax - parallax px
   */
  const makeBlurMoveEffect = (img, key, parallax) => {
    const blur = initConfig[key].blurEffect(initConfig[key].blur, parallax);
    const x = initConfig[key].parallaxX(initConfig[key].x, parallax);
    img.style = movementTemplate(
      blur,
      x,
      initConfig[key].y,
      initConfig[key].rotate
    );
  };
  /**
   * Function initRectSmallScreen
   * @author Chloe Lam
   * @description A function for initiate basically under the breakpoint.
   * @param {number} key - the element image
   * @param {object} item - the image index
   * @param {object} bannerRect - the parent banner rectangle html element object
   */
  const initRectSmallScreen = (key, item, bannerRect) => {
    const originWidth = parseInt(item.dataset.width, 10);
    const originHeight = parseInt(item.dataset.height, 10);
    item.width = initConfig[key].aspect * originWidth;
    item.height = initConfig[key].aspect * originHeight;
    item.style = initEffect(key);
  };
  /**
   * Function initRectSmallScreen
   * @author Chloe Lam
   * @description A function for initiate basically above the breakpoint.
   * @param {number} key - the element image
   * @param {object} item - the image index
   * @param {object} bannerRect - the parent banner rectangle html element object
   */
  const initRectNormalScreen = (key, item, bannerRect) => {
    const originWidth = parseInt(item.dataset.width, 10);
    const originHeight = parseInt(item.dataset.height, 10);
    const screenWidth = parseInt(bannerRect.width, 10);
    const width = initConfig[key].aspect * originWidth;
    const height = initConfig[key].aspect * originHeight;

    item.width = width + parseInt((screenWidth - breakpoint) / 10) * 12;
    item.height = height + parseInt((screenWidth - breakpoint) / 10) * 1;
    item.style = initEffect(key);
  };

  return (
    <div>
      <div className="fall-banner">
        <div className="animate-banner" ref={animateBanner}>
          <div className="layer">
            <img
              src={background}
              data-width="3000"
              data-height="250"
              alt="background"
            />
          </div>
          <div className="layer" ref={animateGirl}>
            <img
              src={girlEyeOpen}
              data-width="3000"
              data-height="275"
              alt="girl"
            />
          </div>
          <div className="layer">
            <img src={hill} data-width="3000" data-height="250" alt="hill" />
          </div>
          <div className="layer">
            <img
              src={foreground}
              data-width="3000"
              data-height="250"
              alt="foreground"
            />
          </div>
          <div className="layer">
            <img src={fairy} data-width="3000" data-height="275" alt="fairy" />
          </div>
          <div className="layer">
            <img src={leaf} data-width="3000" data-height="275" alt="leaf" />
          </div>
        </div>
        <div className="fall-wrapper">
          <a href="https://space.bilibili.com/485109441">
            <img src={logo} alt="bibibi" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default FallBanner;
