/**
 * @benjammin4dayz on Discord & GitHub
 */
class Site {
  static init() {
    Site.info("site-info");
    Site.trueViewHeight();
    Site.trackPageHash();
    Site.lazyLoad("twitch-embed", 100);
    Site.lazyLoad("youtube-embed", 100, () =>
      Site._util.YouTube.embedLatestVideo()
    );
  }

  static info(buttonId) {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", () => new Site._util.Info());
  }

  static trueViewHeight() {
    new Site._util.TrueViewHeight();
  }

  static trackPageHash() {
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

  static get _currentURL() {
    // https://example.com -> example.com
    return window.location.origin.split("//")[1];
  }
  static get _util() {
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
              "https://youtube.com/embed/" +
              id +
              "?controls=0&showinfo=0&rel=0";
          })
          .catch((e) => console.log(e));
      }
    }

    class Info {
      constructor() {
        this.overlay = this._createOverlay();
        document.body.appendChild(this.overlay);
        this._injectHTML(this.overlay);
      }

      _createOverlay() {
        const overlay = document.createElement("div");
        const { style } = overlay;
        style.position = "fixed";
        style.top = "0";
        style.left = "0";
        style.right = "0";
        style.bottom = "0";
        style.zIndex = "9999";
        style.display = "flex";
        style.justifyContent = "center";
        style.alignItems = "center";
        style.minWidth = "100vw";
        style.minHeight = "100vh";
        return overlay;
      }

      _injectHTML(target) {
        target.innerHTML = this._html;
      }

      get _html() {
        return `<style>.container{backdrop-filter:blur(8px);overflow:auto;width:85%;max-width:800px;max-height:80%;margin:auto;padding:20px;background:#3333337a;border-radius:10px}.header{display:flex;padding:10px;background-color:#24292e;color:#fff}.header h1{flex:1;margin:0;font-size:24px}.content{margin-top:20px;padding:20px;border:1px solid #8e9092}.site-mail{width:50%;height:50%}.footer{padding:10px;background-color:#adaeaf;text-align:center}</style><div class=container><div class=header><h1>Site Information</h1><button onclick=this.parentNode.parentNode.parentNode.remove()><strong>X</strong></button></div><div class=content><h2>Privacy Policy</h2><p>This site does not store or process any user data but embedded content may. Please review the following documents if you have any concerns.<ul><li><a href=https://discord.com/privacy target=_blank>Discord</a><li><a href=https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement target=_blank>GitHub</a><li><a href=https://www.twitch.tv/p/en/legal/privacy-notice/ target=_blank>Twitch</a><li><a href=https://www.tiktok.com/legal/page/us/privacy-policy/en target=_blank>TikTok</a><li><a href=https://policies.google.com/privacy target=_blank>YouTube</a><li><a href=https://widgetbot.io/privacy target=_blank>WidgetBot</a></ul><iframe height=350 src=https://e.widgetbot.io/channels/1140249773132218418/1140249773593600072 width=100%></iframe></div><div class=footer><div>Made with ❤️ for Roman12663</div>© 2023 Benjammin4dayz. Some Rights Reserved.</div></div>`;
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
        const delay = Math.max(Math.random() * 133, 66);
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

    return {
      YouTube,
      Info,
      TrueViewHeight,
    };
  }
}
