import { httpGet, httpPostForm, getBase64Image } from './util';

interface SessionInfo {
    api_token: string;
    version_uid: string;
    version_ts: string;
}

export const getSessionInfo = async(team_name: string): Promise<SessionInfo | undefined> => {
    const emoji_customize_url = 'https://' + team_name + '.slack.com/customize/emoji';
    const ret = await httpGet(emoji_customize_url);

    if (ret.responseURL !== emoji_customize_url) return;

    const api_token_matches = ret.responseText.match(/api_token: "(.+?)"/);
    if (!api_token_matches || !api_token_matches[1]) return;

    const version_uid_matches = ret.responseText.match(/version_uid: "(.+?)"/);
    if (!version_uid_matches || !version_uid_matches[1]) return;

    const version_ts_matches = ret.responseText.match(/version_ts: "(.+?)"/);
    if (!version_ts_matches || !version_ts_matches[1]) return;

    return {
        api_token: api_token_matches[1],
        version_uid: version_uid_matches[1],
        version_ts: version_ts_matches[1],
    };
};

export const openLoginForm = (team_name: string) => {
    alert('Please login to https://' + team_name + '.slack.com');
    chrome.tabs.create({
        url: 'https://' + team_name + '.slack.com'
    });
};

const getXId = (session_info: SessionInfo): string => {
    const version_uid_top = session_info.version_uid.substr(0, 8);
    return `${version_uid_top}-${Date.now() / 1000}`;
};

export const uploadEmoji = async(team_name: string, emoji_name: string, image_url: string, session_info: SessionInfo) => {
    const emoji_customize_url = 'https://' + team_name + '.slack.com/api/emoji.add?_x_id=' + getXId(session_info);
    const form_data = {
        'mode': 'data',
        'name': emoji_name,
        'image': await getBase64Image(image_url),
        'token': session_info.api_token
    };
    const header = { };
    const ret = await httpPostForm(emoji_customize_url, form_data, header);
    if ( JSON.parse(ret.responseText).ok ) return true;
    return false;
};