/**
 * @benjammin4dayz on Discord & GitHub
 */
class Site {
  static init() {
    Site.trueViewHeight();
    Site.updatePagePosOnScroll();
    Site.lazyLoad("twitch-embed", 100);
    Site.lazyLoad("youtube-embed", 100, () => YouTube.embedLatestVideo());
  }

  /**
   * Lazy load when a given element has been visible for a specified amount of time
   *
   * @param {string} element - The ID of the element that will trigger the event when observed
   * @param {number} delay - The delay (in milliseconds) that the element must be observed before causing the event
   * @param {function} callback - Optional callback function to execute when the element was observed
   */
  static lazyLoad(element, delay, callback) {
    element = document.getElementById(element);
    if (!element) return console.error("[LazyLoad]: Element not found");
    let timeoutId;

    // Use IntersectionObserver API to trigger an event when the element becomes visible
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          // Set a timeout to load the element after the specified delay
          timeoutId = setTimeout(() => {
            if (callback) {
              callback();
            } else {
              // If no callback is provided, fill the 'src' attribute with the data contained in 'data-src'
              const dataSrc = target.getAttribute("data-src");
              // Append Site._currentURL to satify Twitch Embed requirement for a parent referrer
              if (dataSrc) target.src = dataSrc + Site._currentURL;
            }

            // Stop observing the element and log a message
            observer.unobserve(target);
            console.log("[LazyLoad]: " + target.id);
          }, delay);
        } else {
          // Cancel the timeout if the element leaves the viewport
          clearTimeout(timeoutId);
        }
      });
    });

    // Start observing the element and log a message
    observer.observe(element);
    console.log(`[LazyLoad]: Waiting to load ${element.id}`);
  }

  static updatePagePosOnScroll() {
    // Update page hash to reflect the active article as the user scrolls
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const id = target.getAttribute("id");
            if (id) {
              // Use replaceState to update the URL without triggering refresh or navigation
              // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
              window.history.replaceState(null, null, `#${id}`);

              // Highlight the navigational buttons for the current article
              const navButtons = document.querySelectorAll(
                "nav.stickybar > button"
              );
              navButtons.forEach((button) => {
                button.classList.remove("active");
                if (button.getAttribute("data-target") === id)
                  button.classList.add("active");
              });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const pages = document.querySelectorAll(".page");

    pages.forEach((page) => {
      observer.observe(page);
    });
  }

  static trueViewHeight() {
    new TrueViewHeight();
  }

  static creatorCredit() {
    const message = [
      "This site was created with ❤️ for use by Roman12663",
      "© 2023 Benjammin4dayz. Some Rights Reserved.",
      "",
      "Developer Contact:",
      "@benjammin4dayz on GitHub and Discord",
      "Website: https://benjammin4dayz.github.io",
    ].join("\n");
    alert(message);
  }

  static get _currentURL() {
    // https://example.com -> example.com
    return window.location.origin.split("//")[1];
  }
}

class YouTube {
  /**
   * Stackoverflow tech to retrieve and embed the latest YouTube video from a channel by its ID.
   * (Includes YouTube Shorts!)
   *
   * https://stackoverflow.com/questions/18267426/html-auto-embedding-recent-uploaded-videos-from-a-youtube-channel
   */
  static embedLatestVideo() {
    const channelID = "UCboCEPLD2xFTN8Dp-_8eQdg";
    const reqURL = "https://www.youtube.com/feeds/videos.xml?channel_id=";

    fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=" +
        encodeURIComponent(reqURL) +
        channelID
    )
      .then((response) => response.json())
      .then((data) => {
        const link = data.items[0].link;
        const id = link.substr(link.indexOf("=") + 1);
        document.getElementById("youtube-embed").src =
          "https://youtube.com/embed/" + id + "?controls=0&showinfo=0&rel=0";
      })
      .catch((e) => console.log(e));
  }
}

class TrueViewHeight {
  constructor(override) {
    const { _say } = TrueViewHeight;
    this._isMobileDevice
      ? this._init()
      : override
      ? (_say("Enabled"), this._init())
      : _say("Disabled");
  }

  _init() {
    // Set a variable `--vh` which represents the actual height of the viewport
    document.addEventListener("DOMContentLoaded", this._updateViewHeight);
    // Update `--vh` after the window is resized
    this._addResizeListener(this._updateViewHeight);
  }

  _updateViewHeight() {
    const vh = `${window.innerHeight}px`;
    TrueViewHeight._say(`Actual Viewport Height: ${vh}`);
    document.documentElement.style.setProperty("--vh", vh);
  }

  _addResizeListener(handler) {
    TrueViewHeight._say("Waiting for window resize event...");
    window.addEventListener("resize", this._debounce(handler));
  }

  _debounce(handler) {
    const delay = Math.floor(Math.random() * 133, 66);
    let isBeingResized;

    return () => {
      clearTimeout(isBeingResized);
      isBeingResized = setTimeout(handler, delay);
    };
  }

  static _say(msg = "") {
    console.log(`[TrueViewHeight]: ${msg}`);
  }

  get _isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
}
