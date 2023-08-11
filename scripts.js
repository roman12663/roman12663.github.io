/**
 * @benjammin4dayz on Discord & GitHub
 */
class Site {
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

class Presentation {
  constructor(overlayId) {
    this._overlayId = overlayId;
    this._ec = "hunter2";
    this._init();
  }

  _createOverlay() {
    // Create the overlay
    const overlay = document.createElement("div");
    this._overlay = overlay;
    overlay.id = this._overlayId;
    const { style } = overlay;
    style.position = "fixed";
    style.top = "0";
    style.left = "0";
    style.width = "100%";
    style.height = "100%";
    style.background = "var(--gradient-alt)";
    style.zIndex = "9999";
    style.pointerEvents = "auto";

    // Create the text input box
    const inputBox = document.createElement("input");
    this._overlayInput = inputBox;
    inputBox.type = "text";
    inputBox.placeholder = "Enter the access key provided by Jam...";
    const inputBoxStyle = inputBox.style;
    inputBoxStyle.position = "absolute";
    inputBoxStyle.top = "50%";
    inputBoxStyle.left = "50%";
    inputBoxStyle.transform = "translate(-50%, -50%)";
    inputBoxStyle.width = "300px";
    inputBoxStyle.padding = "10px";
    inputBoxStyle.fontSize = "16px";

    // Append the text input box to the overlay
    overlay.appendChild(inputBox);

    // Capture and parse input when the user presses enter
    inputBox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const accessKey = event.target.value;
        accessKey === this._ec ? this._revealEverything() : this._reject();
      }
    });

    // Append the overlay to the body
    document.body.appendChild(overlay);

    return overlay;
  }
  _promptUser() {
    return new Promise((resolve) => {
      resolve(prompt("Enter the access key provided by Jam..."));
    });
  }
  _hideEverything() {
    return new Promise((resolve) => {
      document.body.style.overflow = "hidden";
      this._createOverlay();
      // Resolve the promise
      setTimeout(() => resolve(), 300);
    });
  }
  _revealEverything() {
    document.body.style.overflow = "auto";
    this._overlayInput.style.backgroundColor = "green";
    const element = this._overlay;
    element.style.pointerEvents = "none";
    element.style.transition = "opacity 2s ease";
    element.style.opacity = 0;
  }
  _reject() {
    this._overlayInput.style.backgroundColor = "red";
    this._overlayInput.value = "ACCESS DENIED";
    setTimeout(() => {
      this._overlay.remove();
      this._init();
    }, 1000);
  }
  get _isAuthorized() {
    return this._authorized;
  }
  _init() {
    this._hideEverything();
    setTimeout(() => this._overlayInput.focus(), 100);
  }
}
