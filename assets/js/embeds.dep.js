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

const ytConfig = {
  EMBED_ID: 'youtube-embed',
  main: {
    channelID: 'UCboCEPLD2xFTN8Dp-_8eQdg'
  },
  clips: {
    channelID: 'UCzgs2tfT3kQa4zRt7JQ-I1A'
  },
  vod: {
    channelID: 'UCX2jBlLv0GG-f_rWmO3gOUQ'
  }
};
const YouTube = new FlowTheme.EmbedHelper.YouTube(
  ytConfig.clips.channelID,
  ytConfig.EMBED_ID
);

FlowTheme.lazy('twitch-embed', 30, Twitch.embedStream);

YouTube.fetchVideoData().then((data) => {
  FlowTheme.lazy(ytConfig.EMBED_ID, 30, () => data.mostRecent.embed());
});
