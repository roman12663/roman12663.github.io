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

FlowTheme.Utils.lazyLoad('twitch-embed', 30, Twitch.embedStream);

const EMBED_ID = 'youtube-embed';
const YouTube = new FlowTheme.EmbedHelper.YouTube(
  'UCboCEPLD2xFTN8Dp-_8eQdg',
  EMBED_ID
);
YouTube.fetchVideo().then((video) =>
  FlowTheme.Utils.lazyLoad(EMBED_ID, 30, video.embed)
);
