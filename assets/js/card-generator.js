// Config
const ytcfg = {
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
// Functions
const generateCard = (
  video,
  channelAvatarURL = 'https://yt3.googleusercontent.com/Oa2RUV8hIqHAeT0tGJIgyc62iT1AMB4MPUsfAUTWZ6-RHEQ8S_nXU5bmOBDMFNDWMuvxfQ87=s176-c-k-c0x00ffffff-no-rj'
) =>
  [
    `<div class='layout-card-wrap'>`,
    `<div class='card'>`,
    `<div class='card__body'>`,
    `<div class='card__body--img'>`,
    `<a href='${video.link}' target='_blank'`,
    `title='Watch "${sanitize(video.title)}" by ${video.author} on YouTube!'`,
    `>`,
    `<img`,
    `src='${video.thumbnail}'`,
    `alt='${sanitize(video.title) || 'Untitled'}'`,
    `srcset=''>`,
    `</a>`,
    `</div>`,
    `</div>`,
    `<div class='card__header'>`,
    `<div class='user-info'>`,
    `<div class='avatar'>`,
    `<div class='img-box'>`,
    `<img`,
    `src='${channelAvatarURL}'`,
    `title='${video.author}'`,
    `width='60'`,
    `height='60'`,
    `alt='' />`,
    `</div>`,
    `</div>`,
    `<div class='name'>`,
    `<span>${video.title || 'Untitled'}</span>`,
    `${video.author || 'Null'}`, // description isn't exposed to RSS feed
    `</div>`,
    `<div class='user-dd'>`,
    `<!-- Dropdown code here -->`,
    `</div>`,
    `</div>`,
    `</div>`,
    `</div>`,
    `</div>`
  ].join('\n');

function sanitize(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function collectCards(data, outputContainer) {
  const cardHTML = [];

  data.list.forEach((video) => {
    const card = generateCard(video);
    cardHTML.push(card);
  });

  document.getElementById(outputContainer).innerHTML = cardHTML.join('\n');
}

//
//
//

const mainChannel = new FlowTheme.EmbedHelper.YouTube(
  ytcfg.main.channelID,
  'noEmbed'
);
mainChannel
  .fetchVideoData()
  .then((data) => collectCards(data, 'youtube-card-generator-main'));

const clipsChannel = new FlowTheme.EmbedHelper.YouTube(
  ytcfg.clips.channelID,
  'noEmbed'
);
clipsChannel
  .fetchVideoData()
  .then((data) => collectCards(data, 'youtube-card-generator-clips'));

const vodChannel = new FlowTheme.EmbedHelper.YouTube(
  ytcfg.vod.channelID,
  'noEmbed'
);
vodChannel
  .fetchVideoData()
  .then((data) => collectCards(data, 'youtube-card-generator-vods'));
