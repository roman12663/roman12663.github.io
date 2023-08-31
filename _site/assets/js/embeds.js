class YouTube {
  /**
   * Stackoverflow tech to retrieve and embed the latest YouTube video from a channel by its ID.
   * (Includes YouTube Shorts!)
   *
   * https://stackoverflow.com/questions/18267426/html-auto-embedding-recent-uploaded-videos-from-a-youtube-channel
   */
  static embedLatestVideo(channelID = 'UCboCEPLD2xFTN8Dp-_8eQdg') {
    const reqURL = 'https://www.youtube.com/feeds/videos.xml?channel_id=';

    fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=' +
        encodeURIComponent(reqURL) +
        channelID
    )
      .then((response) => response.json())
      .then((data) => {
        const link = data.items[0].link;
        const id = link.substr(link.indexOf('=') + 1);
        document.getElementById('youtube-embed').src =
          'https://youtube.com/embed/' + id + '?controls=0&showinfo=0&rel=0';
      })
      .catch((e) => console.log(e));
  }
}

class Twitch {
  static embedStream(targetId = 'twitch-embed') {
    const target =
      targetId instanceof Element
        ? targetId
        : document.getElementById(targetId);

    !target && console.error(`[Twitch]: Element not found`);

    const dataSrc = target.getAttribute('data-src');

    // Append Site._currentURL to satify Twitch Embed requirement for a parent referrer
    if (dataSrc) target.src = dataSrc + window.location.origin.split('//')[1];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  FlowTheme.Utils.lazyLoad('youtube-embed', 30, YouTube.embedLatestVideo);
  FlowTheme.Utils.lazyLoad('twitch-embed', 30, Twitch.embedStream);
});
