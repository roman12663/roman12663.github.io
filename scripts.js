class Site {
  constructor() {}

  static lazyLoad(element, delay, callback) {
    element = document.getElementById(element);
    if (!element) return console.error("[LazyLoad]: Element not found");
    let timeoutId;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          timeoutId = setTimeout(() => {
            if (callback) {
              callback();
            } else {
              const dataSrc = target.getAttribute("data-src");
              if (dataSrc) target.src = dataSrc + Site._currentURL;
            }
            observer.unobserve(target);
            console.log("[LazyLoad]: " + target.id);
          }, delay);
        } else {
          clearTimeout(timeoutId);
        }
      });
    });

    observer.observe(element);
    console.log(`[LazyLoad]: Waiting to load ${element.id}`);
  }

  static creatorCredit() {
    alert(
      "This site was designed and developed by Benjammin4dayz\n© 2023 Some Rights Reserved\n\nContact: @benjammin4dayz on Discord"
    );
  }

  static get _currentURL() {
    // https://example.com -> example.com
    return window.location.origin.split("//")[1];
  }
}

class YouTube {
  constructor() {}
  static embedLatestVideo() {
    /**
     * src:
     *    https://stackoverflow.com/questions/18267426/html-auto-embedding-recent-uploaded-videos-from-a-youtube-channel
     * ref:
     *    jQuery => Pure JavaScript
     */
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

class TikTok {
  constructor() {}
  static embedUserProfile(element) {
    element = document.getElementById(element);
    const url = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@roman12663`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        element.innerHTML = data.html;
      })
      .catch((e) => console.error(e));
  }
}
