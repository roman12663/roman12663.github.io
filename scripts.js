class Site {
  constructor() {}

  static lazyLoad(element, delay, callback) {
    element = document.getElementById(element);
    !element && console.error("Element not found");
    let timeoutId;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => {
            if (callback) {
              observer.unobserve(entry.target);
              return callback();
            }
            const iframe = entry.target;
            const dataSrc = iframe.getAttribute("data-src");
            if (dataSrc) {
              iframe.src = dataSrc + Site._currentURL;
            }
            console.log("Firing observer");
            observer.unobserve(iframe);
          }, delay);
        } else {
          console.log("Observer reset");
          clearTimeout(timeoutId);
        }
      });
    });

    observer.observe(element);
    console.log(`[LazyLoad]: Waiting to load ${element.id}`);
  }

  static creatorCredit() {}

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
  static embedCreatorProfile() {
    const embed = document.getElementById("tiktok-embed");
    embed.innerHTML = `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@roman12663" data-unique-id="roman12663" data-embed-from="embed_page" data-embed-type="creator" style="max-width: 780px; min-width: 288px;" > <section> <a target="_blank" href="https://www.tiktok.com/@roman12663?refer=creator_embed">@roman12663</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`;
  }
}
